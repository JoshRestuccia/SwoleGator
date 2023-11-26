import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import BleManager from 'react-native-ble-manager';

const RawData = () => {
  const [data, setData] = useState('');

  useEffect(() => {
    // Set up continuous data reception
    const deviceID = "48:E7:29:B4:F9:7E"; // Replace with your device ID
    const serviceUUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b"; // Replace with your service UUID
    const characteristicUUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8"; // Replace with your characteristic UUID

    BleManager.startNotification(deviceID, serviceUUID, characteristicUUID)
      .then(() => {
        console.log('Notification started');
      })
      .catch((error) => console.error('Notification error:', error));

    const intervalId = setInterval(() => {
      BleManager.read(deviceID, serviceUUID, characteristicUUID)
        .then((data) => {
          // Handle the received data here
          console.log('Received data:', data);
          setData(data);
        })
        .catch((error) => console.error('Read error:', error));
    }, 500); // Adjust the interval as needed

    return () => {
      // Cleanup when component unmounts
      clearInterval(intervalId);
      BleManager.stopNotification(deviceID, serviceUUID, characteristicUUID)
        .then(() => console.log('Notification stopped'))
        .catch((error) => console.error('Notification stop error:', error));
    };
  }, []);

  return (
    <View>
      <Text>Continuous Data: {data}</Text>
    </View>
  );
};

export default RawData;
