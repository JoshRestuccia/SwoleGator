import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    StatusBar,
    FlatList,
    TouchableHighlight,
    Pressable,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import { useBLE } from '../api/ble/BLEContext';


function PairingScreen(){
    const {
      isScanning,
      isConnecting,
      scannedDevices,
      connectedDevice,
      handleRetrieveConnected,
      handleConnectPeripheral,
      handleDisconnectPeripheral,
      startBLEScan,
      stopBLEScan,
    } = useBLE();

    //console.debug("peripherals map updated", [...peripherals.entries()]);
    const handleStartScan = () => {
      startBLEScan();
    };

    const handleStopScan = () => {
      stopBLEScan();
    };

    const togglePeripheralConnection = async (peripheral) => {
      if(!peripheral) return;
      try{
        if(connectedDevice && (connectedDevice.id === peripheral.id)){
          await handleDisconnectPeripheral();
        }else{
          await handleConnectPeripheral(peripheral);
        }
      }catch(err){
        console.error(err);
      }
    };

    const retrieveConnected = async () => {
        await handleRetrieveConnected();
    };

    const renderItem = (item) => {
        const chkConnect = (connectedDevice && (item.id === connectedDevice.id));
        const backgroundColor = (chkConnect) ? '#069400' : Colors.white;
        return (
        <TouchableHighlight
            underlayColor="#0082FC"
            onPress={async () => {togglePeripheralConnection(item)}}>
            <View style={[styles.row, {backgroundColor}]}>
              <Text style={styles.peripheralName}>
                  {/* completeLocalName (item.name) & shortAdvertisingName (advertising.localName) may not always be the same */}
                  {/*item.name} - {item?.advertising?.localName*/}
                  {item?.advertising?.localName}
                  {isConnecting && ' - Connecting...'}
              </Text>
              <Text style={styles.rssi}>RSSI: {item.rssi}</Text>
              <Text style={styles.peripheralId}>{item.id}</Text>
            </View>
        </TouchableHighlight>
        );
    };

    return(
        <>
            <StatusBar />
            <SafeAreaView style={styles.screenSetup}>
                <Pressable style={styles.scanButton} onPress={isScanning ? handleStopScan : handleStartScan}>
                    <Text style={styles.scanButtonText}>
                        {isScanning ? 'Scanning...' : 'Scan Bluetooth'}
                    </Text>
                </Pressable>

                <Pressable style={styles.scanButton} onPress={retrieveConnected}>
                    <Text style={styles.scanButtonText}>
                        {'Retrieve connected peripherals'}
                    </Text>
                </Pressable>

                {Array.from(scannedDevices.values()).length === 0 && (
                <View style={styles.row}>
                    <Text style={styles.noPeripherals}>
                      {'No Peripherals, press "Scan Bluetooth" above.'}
                    </Text>
                </View>
                )}

                <FlatList
                  data={Array.from(scannedDevices.values())}
                  contentContainerStyle={{rowGap: 12}}
                  renderItem={({item}) => renderItem(item)}
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
  screenSetup:{
    flex: 1,
    backgroundColor: '#323334'
  },
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