import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StatusBar } from 'react-native';
import BleManager from 'react-native-ble-manager';
import {
  VictoryChart,
  VictoryLine,
  VictoryLegend,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory-native';
import containerStyles from '../styles/container-view-styles';

function GraphingScreen(): JSX.Element {
  const [xData, setXData] = useState('0');
  const [yData, setYData] = useState('0');
  const [zData, setZData] = useState('0');

  useEffect(() => {
    // Set up continuous data reception

    //marias
    //const deviceID = "48:E7:29:B3:C8:82"; // Replace with your device ID
    //const serviceUUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b"; // Replace with your service UUID
    //const characteristicUUID = "00001800-0000-1000-8000-00805f9b34fb"; // Replace with your characteristic UUID

    //jennas
        const deviceID = "48:E7:29:B4:F9:7E"; // Replace with your device ID
        const serviceUUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b"; // Replace with your service UUID
        const characteristicUUID = "00001800-0000-1000-8000-00805f9b34fb"; // Replace with your characteristic UUID

    BleManager.startNotification(deviceID, serviceUUID, characteristicUUID)
      .then(() => {c
        console.log('Notification started');
      })
      .catch((error) => console.error('Notification error:', error));

    const intervalId = setInterval(() => {
      BleManager.read(deviceID, serviceUUID, characteristicUUID)
        .then((data) => {
          // Handle the received data here
          const textData = String.fromCharCode.apply(null, new Uint8Array(data));
          const [x, y, z] = textData.split(',').map(parseFloat);
          console.log('Received data:', { x, y, z });
          // Set the data state with the formatted string
          setXData(x.toString());
          setYData(y.toString());
          setZData(z.toString());
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
    <>
      <StatusBar />
      <SafeAreaView style={containerStyles.container}>
        <View>
          <Text>Continuous Data - X: {xData}, Y: {yData}, Z: {zData}</Text>
        </View>
        <VictoryChart
          height={400}
          width={400}
          domainPadding={{ y: 10 }}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension='x'
              labels={({ datum }) => `y: ${datum.y}`}
              labelComponent={
                <VictoryTooltip
                  renderInPortal
                  cornerRadius={0}
                  flyoutStyle={{ fill: 'white' }}
                />
              }
            />
          }
          fixAxis="y"
            domain={{
            x: [0, 4],
              y: [-10, 10], // Set the desired Y-axis domain based on your data range
            }}
        >
          {/* X Data */}
          <VictoryLine
             name="xData"
              data={[{ x: 1, y: 0 },{ x: 1, y: parseFloat(xData) }]}
              style={{
                data: {
                  stroke: 'tomato',
                          strokeWidth: 6,
                },
                labels: { fill: 'tomato' },
              }}
            />

          {/* Y Data */}
          <VictoryLine
            name="yData"
            data={[{ x: 2, y: 0 },{ x: 2, y: parseFloat(yData) }]}
                          style={{
                            data: {
                              stroke: 'green',
                                      strokeWidth: 6,
                            },
                            labels: { fill: 'green' },
                          }}
          />

          {/* Z Data */}
          <VictoryLine
            name="zData"
            data={[{ x: 3, y: 0 },{ x: 3, y: parseFloat(zData) }]}
                          style={{
                            data: {
                              stroke: 'blue',
                                      strokeWidth: 6,
                            },
                            labels: { fill: 'blue' },
                          }}
          />

          {/* Legend */}
          <VictoryLegend
            x={20}
            y={350}
            title="Live Acceleration Data"
            titleOrientation='top'
            orientation='horizontal'
            data={[
              {
                name: 'X_DATA',
                symbol: {
                  fill: 'tomato',
                  type: 'square',
                },
              },
              {
                name: 'Y_DATA',
                symbol: {
                  fill: 'green',
                  type: 'square',
                },
              },
              {
                name: 'Z_DATA',
                symbol: {
                  fill: 'blue',
                  type: 'square',
                },
              },
            ]}
          />
        </VictoryChart>
      </SafeAreaView>
    </>
  );
}

export default GraphingScreen;
