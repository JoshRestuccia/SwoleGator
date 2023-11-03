import {useEffect, useState } from 'react';
import {
    View,
    Text,
    Platform,
    TouchableOpacity,
    NativeModules,
    useColorScheme,
    NativeEventEmitter,
    PermissionsAndroid,
    StyleSheet,
} from 'react-native';
import BleManager from 'react-native-ble-manager';

const deviceId = 'YOUR_DEVICE_ID';
const serviceUUID = 'YOUR_SERVICE_UUID';
const characteristicUUID = 'YOUR_CHARACTERISTIC_UUID';


type PermissionCallback = (result: boolean) => void;

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);



function BLE(): JSX.Element {
    const [isScanning, setIsScanning] = useState(false);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        let stopListener = BleManagerEmitter.addListener(
            'BleManagerStopScan',
            () => {
                setIsScanning(false);
                console.log("Scan stopped!");
            },
        );
    requestBluetoothScanPermission();
    }, []);

    useEffect(() => {
        // start bluetooth manager
        BleManager.start({showAlert: false}).then(() => {
          console.log('BleManager initialized');
        });
    }, []);

    const startScan = () => {
        console.log("Beginning Scan...");
        if(!isScanning){
            BleManager.scan([], 30, true)
                .then(results => {
                    if(results != undefined){
                        console.log("Scanning complete.", results);
                        setIsScanning(false);
                    } else {
                        console.log("Scanning complete. No devices found.")
                        setIsScanning(true);
                    }

                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    const stopScan = () => {
        console.log("Stopping Scan...");
        if(isScanning){
            BleManager.stopScan()
            .then(() => {
                console.log("Scanning stopped.");
            })
            .catch(error => {
                console.error(error);
            });
        }
    };

    const peripherals = new Map();
    const [connectedDevices, setConnectedDevices] = useState([]);
     const requestBluetoothScanPermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
              title: 'Bluetooth Scan Permission',
              message: 'This app needs Bluetooth Scan permission to discover nearby devices.',
              buttonPositive: 'OK',
              buttonNegative: 'Cancel',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Bluetooth Scan permission granted.');
            // You can start scanning for devices here.
          } else {
            console.log('Bluetooth Scan permission denied.');
          }
        } catch (err) {
          console.warn(err);
        }
      };

     const handleGetConnectedDevices = () => {
        BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
            if(peripheralsArray.length === 0){
                console.log("No bluetooth devices to connect to.");
            } else {
                for(let i = 0; i < peripheralsArray.length; i++){
                    let peripheral = peripheralsArray[i];
                    peripheral.advertising = {isConnectable: true};
                    setConnected(true);
                }
            }
        });
        return(
            <TouchableOpacity
                activeOpacity={0.5}
                style={styles.buttonStyle}
                onPress={isScanning ? stopScan : startScan}>
                <Text style={styles.buttonTextStyle}>
                    {(isScanning && !connected) ? 'Scanning...' : 'Scan Bluetooth Devices'}
                </Text>
            </TouchableOpacity>
        )
    }; 

    return(
        <TouchableOpacity
            activeOpacity={0.5}
            style={styles.buttonStyle}
            onPress={isScanning ? stopScan : startScan}>
            <Text style={styles.buttonTextStyle}>
              {(isScanning && !connected) ? 'Scanning...' : 'Scan Bluetooth Devices'}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: '#307ecc',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#307ecc',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 300,
      },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
      }
})

export default BLE;