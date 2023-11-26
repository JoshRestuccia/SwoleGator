import React, {useEffect} from 'react';
import { Text , View} from 'react-native';
import { useBluetoothContext } from '../data/bluetooth_context';

const RawData = () => {
  const { updateBluetoothData } = useBluetoothContext();

  useEffect(() => {
    // Replace with your actual peripheral ID, service UUID, and characteristic UUID
    const peripheralId = 'yourPeripheralId';
    const serviceUUID = 'yourServiceUUID';
    const characteristicUUID = 'yourCharacteristicUUID';

    // Start notifications
    BleManager.startNotification(peripheralId, serviceUUID, characteristicUUID)
      .then(() => {
        console.debug('Notifications started successfully');
      })
      .catch((error) => {
        console.error('Error starting notifications:', error);
      });

    // Handle received data
    const handleUpdateValueForCharacteristic = (data) => {
      console.debug(`Received data from ESP32: ${data.value}`);
      updateBluetoothData(data.value);
    };

    // Add listener for value updates
    const updateValueListener = BleManager.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      handleUpdateValueForCharacteristic
    );

    // Clean up when the component unmounts
    return () => {
      // Stop notifications
      BleManager.stopNotification(peripheralId, serviceUUID, characteristicUUID)
        .then(() => {
          console.debug('Notifications stopped successfully');
        })
        .catch((error) => {
          console.error('Error stopping notifications:', error);
        });

      // Remove the listener
      updateValueListener.remove();
    };
  }, []);

  return (
    <View>
      <Text>{`Received Bluetooth Data: ${bluetoothData}`}</Text>
    </View>
  );
};

export default RawData;