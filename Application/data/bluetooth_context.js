// BluetoothContext.js
import React, { createContext, useContext, useState } from 'react';

const BluetoothContext = createContext();

export const BluetoothProvider = ({ children }) => {
  const [bluetoothData, setBluetoothData] = useState('');

  const updateBluetoothData = (data) => {
    setBluetoothData(data);
  };

  return (
    <BluetoothContext.Provider value={{ bluetoothData, updateBluetoothData }}>
      {children}
    </BluetoothContext.Provider>
  );
};

export const useBluetoothContext = () => {
  return useContext(BluetoothContext);
};