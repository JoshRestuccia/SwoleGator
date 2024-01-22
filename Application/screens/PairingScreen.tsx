import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    StatusBar,
    NativeModules,
    NativeEventEmitter,
    Platform,
    PermissionsAndroid,
    FlatList,
    TouchableHighlight,
    Pressable,
} from 'react-native';
import BleManager, {
    BleDisconnectPeripheralEvent, 
    BleManagerDidUpdateValueForCharacteristicEvent, 
    Peripheral 
} from 'react-native-ble-manager';
import firstore from '@react-native-firebase/firestore';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const SERVICE_UUIDS: string[] = [];

const SECONDS_TO_SCAN_FOR=5;
const ALLOW_DUPLICATES=true;

const bleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(bleManagerModule);

declare module 'react-native-ble-manager' {
    // enrich local contract with custom state properties needed by App.tsx
    interface Peripheral {
        connected?: boolean;
        connecting?: boolean;
    }
}

function PairingScreen(): JSX.Element {
    const [isScanning, setIsScanning] = useState(false);
    const [peripherals, setPeripherals] = useState(
        new Map<Peripheral['id'], Peripheral>(),
    );

    console.debug("peripherals map updated", [...peripherals.entries()]);

    const addOrUpdatePeripheral = (id: string, updatedPeripheral: Peripheral) => {
        setPeripherals(map => new Map(map.set(id, updatedPeripheral)));
        console.debug(`[addOrUpdatePeripheral] Updated Peripheral (${id}) with (${JSON.stringify(updatedPeripheral)})`);
    };

    const startScan = () => {
        if(!isScanning){
            // Reset peripherals
            setPeripherals(new Map<Peripheral['id'], Peripheral>());
            try{
                //Do the scanning
                console.log("[startScan] starting scan...");
                setIsScanning(true);
                BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES)
                .then(() => {
                    console.debug("[startScan] scan promise returned successfully.");
                })
                .catch(err => {
                    console.error("[startScan] ble scan returned in error", err);
                });
            }
            catch (error){
                console.error("[startScan] ble scan error thrown", error);
            }
        }
    };

    const handleStopScan = () => {
        setIsScanning(false);
        console.log("[handleStopScan] Stopped Scan.");
    };

    const handleDisconnnectedPeripheral = (
        event: BleDisconnectPeripheralEvent,
    ) => {
        let peripheral = peripherals.get(event.peripheral);
        if(peripheral) {
            console.debug(
                `[handleDisconnectedPeripheral][${peripheral.id}] previously connected peripheral is disconnected.`,
                event.peripheral,
            );
            addOrUpdatePeripheral(peripheral.id, {...peripheral, connected:false});
        }
        console.debug(`[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`);
    };

    const handleUpdateValueForCharacteristic = (
        data: BleManagerDidUpdateValueForCharacteristicEvent,
    ) => {
        console.debug(`[handleUpdateValueForCharacteristic] received data from '${data.peripheral}' with characteristic='${data.characteristic}' and value='${data.value}'`,);
    };

    const handleDiscoverPeripheral = (peripheral: Peripheral) => {
        console.debug(`[handleDiscoverPeripheral] new BLE peripheral discovered=`, peripheral);
        //console.debug(`\n[handleDiscoverPeripheral] has found the device with ID = ${peripheral.id} and NAME = ${peripheral.name}\n\n`);
        if(!peripheral.name){
            peripheral.name = 'NO NAME';
        }
        if(peripheral.name && (peripheral.name === "ESP32" || peripheral.name === "SwoleGator")){
          console.log("The SwoleGator Device has been found!");
          console.log(peripheral);
          addOrUpdatePeripheral(peripheral.id, peripheral);
        }
    };

    const togglePeripheralConnection = async (peripheral: Peripheral) => {
        if(peripheral && peripheral.connected) {
            try {
                await BleManager.disconnect(peripheral.id);

            }catch(error){
                console.error(`[togglePeripheralConnection][${peripheral.id}] error when trying to disconnect device.`, error);
            }
        }else if(!peripheral.connected){
            await connectPeripheral(peripheral);
        }
    };

    const retrieveConnected = async () => {
        try {
          const connectedPeripherals = await BleManager.getConnectedPeripherals();
          if (connectedPeripherals.length === 0) {
            console.warn('[retrieveConnected] No connected peripherals found.');
            return;
          }
    
          console.debug(
            '[retrieveConnected] connectedPeripherals',
            connectedPeripherals,
          );
    
          for (var i = 0; i < connectedPeripherals.length; i++) {
            var peripheral = connectedPeripherals[i];
            addOrUpdatePeripheral(peripheral.id, {...peripheral, connected: true});
          }
        } catch (error) {
          console.error(
            '[retrieveConnected] unable to retrieve connected peripherals.',
            error,
          );
        }
    };

    const connectPeripheral = async (peripheral: Peripheral) => {
        try {
          if (peripheral) {
            addOrUpdatePeripheral(peripheral.id, {...peripheral, connecting: true});
    
            await BleManager.connect(peripheral.id);
            console.debug(`[connectPeripheral][${peripheral.name}(${peripheral.id})] connected.`);
    
            addOrUpdatePeripheral(peripheral.id, {
              ...peripheral,
              connecting: false,
              connected: true,
            });
    
            // before retrieving services, it is often a good idea to let bonding & connection finish properly
            await sleep(900);
    
             //Test read current RSSI and Descriptor values, retrieve services first
            const peripheralData = await BleManager.retrieveServices(peripheral.id);

            console.debug(
              `[connectPeripheral][${peripheral.id}] retrieved peripheral services`,
              JSON.stringify(peripheralData),
            );
    
            const rssi = await BleManager.readRSSI(peripheral.id);
            console.debug(
              `[connectPeripheral][${peripheral.id}] retrieved current RSSI value: ${rssi}.`,
            );

    
            if (peripheralData.characteristics) {
              //console.log(`[PERIPHERAL DATA CHARACTERISITCS]: ${JSON.stringify(peripheralData.characteristics)}`);
              for (let characteristic of peripheralData.characteristics) {
                if (characteristic.descriptors) {
                  for (let descriptor of characteristic.descriptors) {
                    // Skip descriptors with UUID "2902"
                    if (descriptor.uuid !== "2902") {
                      try {
                        let data = await BleManager.readDescriptor(
                          peripheral.id,
                          characteristic.service,
                          characteristic.characteristic,
                          descriptor.uuid,
                        );
                        console.debug("dev", peripheral.id, "serv", characteristic.service, "Char", characteristic.service);
                        console.debug(
                          `[connectPeripheral][${peripheral.id}] descriptor read as:`,
                          data,
                        );
                      } catch (error) {
                        console.error(
                          `[connectPeripheral][${peripheral.id}] failed to retrieve descriptor ${descriptor.uuid} for characteristic ${characteristic.characteristic}:`,
                          error,
                        );
                      }
                    }
                  }
                }
              }
            }else{
              console.debug("[connectPeripheral] Could not find an instance of peripheralData.characteristics");
            }

    
            let p = peripherals.get(peripheral.id);
            if (p) {
              addOrUpdatePeripheral(peripheral.id, {...peripheral, rssi});
            }
          }
        } catch (error) {
          console.error(
            `[connectPeripheral][${peripheral.id}] connectPeripheral error`,
            error,
          );
        }
    };

    function sleep(ms: number){
        return new Promise<void>(resolve => setTimeout(resolve, ms));
    };

    const handleAndroidPermissions = () => {
        if (Platform.OS === 'android' && Platform.Version >= 31) {
            PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            ]).then(result => {
                if (result) {
                console.debug(
                    '[handleAndroidPermissions] User accepts runtime permissions android 12+',
                );
                } else {
                console.error(
                    '[handleAndroidPermissions] User refuses runtime permissions android 12+',
                );
                }
            });
            } else if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ).then(checkResult => {
                if (checkResult) {
                console.debug(
                    '[handleAndroidPermissions] runtime permission Android <12 already OK',
                );
                } else {
                PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                ).then(requestResult => {
                    if (requestResult) {
                      console.debug(
                          '[handleAndroidPermissions] User accepts runtime permission android <12',
                      );
                    } else {
                      console.error(
                          '[handleAndroidPermissions] User refuses runtime permission android <12',
                      );
                    }
                });
                }
            });
        }
    };

    const renderItem = ({item} : {item: Peripheral}) => {
        const backgroundColor = item.connected ? '#069400' : Colors.white;
        return (
        <TouchableHighlight
            underlayColor="#0082FC"
            onPress={() => togglePeripheralConnection(item)}>
            <View style={[styles.row, {backgroundColor}]}>
            <Text style={styles.peripheralName}>
                {/* completeLocalName (item.name) & shortAdvertisingName (advertising.localName) may not always be the same */}
                {/*item.name} - {item?.advertising?.localName*/}
                {item?.advertising?.localName}
                {item.connecting && ' - Connecting...'}
            </Text>
            <Text style={styles.rssi}>RSSI: {item.rssi}</Text>
            <Text style={styles.peripheralId}>{item.id}</Text>
            </View>
        </TouchableHighlight>
        );
    };

    useEffect(() => {
        try{
            BleManager.start({showAlert: false, forceLegacy: true})
                .then(() => console.debug('BleManager started...'))
                .catch(error => console.error('Error starting BleManager', error));
        }catch(error) {
            console.error('Unexpected error while starting BleManager.', error);
            return;
        }

        const listeners = [
            bleManagerEmitter.addListener(
                'BleManagerDiscoverPeripheral',
                handleDiscoverPeripheral,
            ),
            bleManagerEmitter.addListener(
                'BleManagerStopScan',
                handleStopScan,
            ),
            bleManagerEmitter.addListener(
                'BleManagerDisconnectPeripheral',
                handleDisconnnectedPeripheral,
            ),
            bleManagerEmitter.addListener(
                'BleManagerDidUpdateValueForCharacteristic',
                handleUpdateValueForCharacteristic,
            ),
        ];

        handleAndroidPermissions();

        return () => {
          console.debug('[app] main component unmounting. Removing listeners...');
          for(const listener of listeners){
            listener.remove();
          }
        };
    }, []);

    return(
        <>
            <StatusBar />
            <SafeAreaView style={styles.body}>
                <Pressable style={styles.scanButton} onPress={isScanning ? handleStopScan : startScan}>
                    <Text style={styles.scanButtonText}>
                        {isScanning ? 'Scanning...' : 'Scan Bluetooth'}
                    </Text>
                </Pressable>

                <Pressable style={styles.scanButton} onPress={retrieveConnected}>
                    <Text style={styles.scanButtonText}>
                        {'Retrieve connected peripherals'}
                    </Text>
                </Pressable>

                {Array.from(peripherals.values()).length === 0 && (
                <View style={styles.row}>
                    <Text style={styles.noPeripherals}>
                      {'No Peripherals, press "Scan Bluetooth" above.'}
                    </Text>
                </View>
                )}

                <FlatList
                  data={Array.from(peripherals.values())}
                  contentContainerStyle={{rowGap: 12}}
                  renderItem={renderItem}
                  keyExtractor={item => item.id}
                />
            </SafeAreaView>
        </>
    );
};

const boxShadow = {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
};

const styles = StyleSheet.create({
    engine: {
      position: 'absolute',
      right: 10,
      bottom: 0,
      color: Colors.black,
    },
    scanButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      backgroundColor: '#0a398a',
      margin: 10,
      borderRadius: 12,
      ...boxShadow,
    },
    scanButtonText: {
      fontSize: 20,
      letterSpacing: 0.25,
      color: Colors.white,
    },
    body: {
      backgroundColor: '#0082FC',
      flex: 1,
    },
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: Colors.black,
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
      color: Colors.dark,
    },
    highlight: {
      fontWeight: '700',
    },
    footer: {
      color: Colors.dark,
      fontSize: 12,
      fontWeight: '600',
      padding: 4,
      paddingRight: 12,
      textAlign: 'right',
    },
    peripheralName: {
      fontSize: 16,
      textAlign: 'center',
      padding: 10,
    },
    rssi: {
      fontSize: 12,
      textAlign: 'center',
      padding: 2,
    },
    peripheralId: {
      fontSize: 12,
      textAlign: 'center',
      padding: 2,
      paddingBottom: 20,
    },
    row: {
      marginLeft: 10,
      marginRight: 10,
      borderRadius: 20,
      ...boxShadow,
    },
    noPeripherals: {
      margin: 10,
      textAlign: 'center',
      color: Colors.white,
    },
  });

export default PairingScreen;