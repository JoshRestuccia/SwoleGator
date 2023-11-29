import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import BleManager from 'react-native-ble-manager';

const RawData = () => {
  const [xdata, setXData] = useState('');


  return (
    <View>
      <Text>Continuous Data: {xdata}</Text>
    </View>
  );
};

export default RawData;
