import React, {createContext, useContext, useState, useEffect} from 'react';
import {NativeModules, NativeEventEmitter, PermissionsAndroid, Platform} from 'react-native';
import BleManager from 'react-native-ble-manager';

const BLEContext = createContext();
const SERVICE_UUIDS = [];
const SECONDS_TO_SCAN_FOR = 5;
const ALLOW_DUPLICATES = true;

const bleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(bleManagerModule);

export const BLEProvider = ({children}) => {
    const [isScanning, setIsScanning] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [scannedDevices, setScannedDevices] = useState([]);
    const [connectedDevice, setConnectedDevice] = useState(null);

    const addOrUpdatePeripheral = (peripheral) => {
        setScannedDevices((prevScans) => {
            console.log(prevScans);
            // If it doesnt exists, we are adding it
            if(!prevScans.find((prevDev) => prevDev.id === peripheral.id)){
                return [...prevScans, peripheral];
            }
            return prevScans;
        });
        console.debug(`[BLEContext::addOrUpdatePeripheral] Updated Peripheral (${peripheral.id})`);
    }

    const startBLEScan = () => {
        if(!isScanning){
            //Reset Peripheral Map
            setScannedDevices([]);
            console.log('[BLEContext::startBLEScan] starting scan');
            setIsScanning(true);
            BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES)
            .then(() => console.log('[BLEContext] Scanning has started...'))
            .catch(err => console.error('[BLEContext::startBLEScan]',err));
            
        }
    };

    const stopBLEScan = () => {
        setIsScanning(false);
        console.log('[BLEContext::stopBLEScan] stopped scanning');
    };

    const discoverPeripheral = (peripheral) => {
        console.debug('[BLEContext::discoverPeripheral] discovered a new peripheral');
        if(!peripheral.name){
            peripheral.name = 'NO NAME';
        }
        if(peripheral.name && (peripheral.name === "ESP32" || peripheral.name === "SwoleGator")){
            console.log("The SwoleGator Device has been found!");
            addOrUpdatePeripheral(peripheral);
        }
    };

    const connectPeripheral = (peripheral) => {
        setIsConnecting(true);
        console.log('Peripheral ID = ', peripheral?.id);
        BleManager.connect(peripheral?.id)
        .then(() => {
            console.debug(`[BLEContext::connectPeripheral] Connected Peripheral ${peripheral.name}::${peripheral.id}`);
            setConnectedDevice(peripheral);
            setIsConnecting(false);
        })
        .catch(err => {
            console.error(`[BLEContext::connectPeripheral] An error occurred while connecting`, err)
            setIsConnecting(false);   
        });        
    };

    const disconnnectPeripheral = () => {
        if(connectedDevice){
            BleManager.disconnect(connectedDevice.id)
            .then(() => {
                console.log(`[BLEContext::handleDisconnectedPeripheral] disconnected ${connectedDevice.id}`);
                setConnectedDevice(null);
            })
            .catch((err) => {
                console.error(`[BLEContext::handleDisconnectedPeripheral] failed with error`, err);
            })
            setConnectedDevice(null);
        }
    };

    const updateValueForCharacteristic = (data) => {
        console.debug(`[BLEContext::handleUpdateValueForCharacteristic] received data from ${data?.peripheral}`)
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
                discoverPeripheral,
            ),
            bleManagerEmitter.addListener(
                'BleManagerDisconnectPeripheral',
                disconnnectPeripheral,
            ),
            bleManagerEmitter.addListener(
                'BleManagerDidUpdateValueForCharacteristic',
                updateValueForCharacteristic,
            ),
            bleManagerEmitter.addListener(
                'BleManagerStopScan',
                stopBLEScan
            )
        ];

        handleAndroidPermissions();

        return () => {
            console.debug('[BLEContext] Main BLE Context is unmounting...');
            for(const listener of listeners){
                listener.remove();
            }
        }
    }, [connectedDevice])

    return(
        <BLEContext.Provider value={{
            isScanning,
            isConnecting,
            scannedDevices,
            connectedDevice,
            connectPeripheral,
            disconnnectPeripheral,
            startBLEScan,
            stopBLEScan,
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