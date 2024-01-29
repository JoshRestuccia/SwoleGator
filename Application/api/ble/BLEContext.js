import React, {createContext, useContext, useState, useEffect} from 'react';
import {NativeModules, NativeEventEmitter, PermissionsAndroid, Platform} from 'react-native';
import BleManager from 'react-native-ble-manager';

const BLEContext = createContext();
const SERVICE_UUIDS = [];
const SECONDS_TO_SCAN_FOR = 5;
const ALLOW_DUPLICATES = true;
const READING_INTERVAL = 25;

const serviceUUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b"; // Replace with your service UUID
const characteristicUUID = "00001800-0000-1000-8000-00805f9b34fb"; // Replace with your characteristic UUID

const bleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(bleManagerModule);

export const BLEProvider = ({children}) => {
    const [isScanning, setIsScanning] = useState(false);
    const [scannedDevices, setScannedDevices] = useState([]);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [isReadingData, setIsReadingData] = useState(false);
    const [readInterval, setReadInterval] = useState(null);
    const [bleData, setBleData] = useState(null);


    const startBLEScan = async () => {
        if(!isScanning){
            setIsScanning(true);
            //Reset Peripheral Map
            setScannedDevices([]);
            console.log('[BLEContext::startBLEScan] starting scan');
            BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES)
            .then(() => console.log('[BLEContext] Scanning has started...'))
            .catch(err => console.error('[BLEContext::startBLEScan]',err));
        }
    };

    const stopBLEScan = async () => {
        if(isScanning){
            await BleManager.stopScan();
        };
    };

    const handleBLEScanStopped = () => {
        setIsScanning(false);
        console.log('[BLEContext::handleBLEScanStopped] stopped scanning');
    };

    const handleConnectPeripheral = async (peripheral) => {
        try{
            if(peripheral.id){
                setIsConnecting(true);
                //console.debug('Peripheral ID = ', peripheral.id);
                await BleManager.connect(peripheral.id);
                console.debug(`[BLEContext::handleConnectPeripheral] Connected Peripheral ${peripheral.name}::${peripheral.id}`);
                setConnectedDevice(peripheral);
                setIsConnecting(false);
            }
        }catch(err){
            console.error(`[BLEContext::handleConnectPeripheral] An error occurred while connecting`, err); 
        }       
    };

    const handleDisconnectPeripheral = async () => {
        if(connectedDevice){
            try{
                await BleManager.disconnect(connectedDevice.id);
                console.log(`[BLEContext::handleDisconnectedPeripheral] disconnected ${connectedDevice.id}`);
                setConnectedDevice(null);
            }catch(err){
                console.error(err);
            }
        }
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

    useEffect(() => {
        try{
            BleManager.start({showAlert: false, forceLegacy: true});
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
                'BleManagerConnectPeripheral',
                handleConnectPeripheral,
            ),
            bleManagerEmitter.addListener(
                'BleManagerDisconnectPeripheral',
                handleDisconnectPeripheral,
            ),
            bleManagerEmitter.addListener(
                'BleManagerDidUpdateValueForCharacteristic',
                handleUpdateValue,
            ),
            bleManagerEmitter.addListener(
                'BleManagerStopScan',
                handleBLEScanStopped
            )
        ];

        handleAndroidPermissions();

        return () => {
            console.debug('[BLEContext] Main BLE Context is unmounting...');
            for(const listener of listeners){
                listener.remove();
            }
            BleManager.stopScan();
            clearInterval(readInterval);
        }
    }, [readInterval]);

    const handleDiscoverPeripheral = (peripheral) => {
        if(!peripheral.name){
            peripheral.name = 'NO NAME';
        }
        if(peripheral.name && (peripheral.name === 'ESP32' || peripheral.name === 'SwoleGator')){
            console.log(`[BLEContext::handleDiscoverPeripheral] Discovered new peripheral (${peripheral.name})`);
            setScannedDevices([...scannedDevices, peripheral]);
        }
    };

    const handleUpdateValue = (data) => {
        setBleData(data.value);
    };
    
    const startReadingData = () => {
        if(!isReadingData){
            setIsReadingData(true);
            const intervalId = setInterval(() => {
                BleManager.read(connectedDevice.id, serviceUUID, characteristicUUID)
                .then((data) => {
                    //console.log(`$$$Received Data: `, data);
                    setBleData(data);
                })
                .catch((err) => {
                    console.error(err);
                    setIsReadingData(false);
                    clearInterval(intervalId);
                });
            }, 500);
            setReadInterval(intervalId);
        }
    };

    const stopReadingData = () => {
        setIsReadingData(false);
        clearInterval(readInterval);
    };

    const handleRetrieveConnected = async () => {
        try{
            const connectedPeripherals = await BleManager.getConnectedPeripherals();
            if(connectedPeripherals.length === 0){
                console.warn(`[BLEContext::retrieveConnected] No connected peripherals`);
            }else{
                connectedPeripherals.forEach((peripheral) => console.log(peripheral));
            }
        }catch(err){
            console.error(`[BLEContext::retrieveConnected] Error retrieving connected peripherals`, err);
        }
    };

    return(
        <BLEContext.Provider value={{
            bleData,
            isScanning,
            isConnecting,
            isReadingData,
            scannedDevices,
            connectedDevice,
            handleConnectPeripheral,
            handleDisconnectPeripheral,
            startBLEScan,
            stopBLEScan,
            startReadingData,
            stopReadingData,
            handleRetrieveConnected
            }}>
            {children}
        </BLEContext.Provider>
    );
};

export const useBLE = () => {
    const context = useContext(BLEContext);
    if(!context) {
        throw new Error('useBLE must be used within a BLEProvider');
    }
    return context;
}