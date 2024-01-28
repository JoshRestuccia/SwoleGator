import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StatusBar, StyleSheet, 
  TextInput, TouchableOpacity } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { useFirestore } from '../api/firestore/FirestoreAPI';

import {
  VictoryChart,
  VictoryLine,
  VictoryLegend,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory-native';
import containerStyles from '../styles/container-view-styles';


function GraphingScreen() {
  const {saveWorkoutData, numWorkouts, isLoading} = useFirestore();
  const [xData, setXData] = useState('0');
  const [yData, setYData] = useState('0');
  const [zData, setZData] = useState('0');

  const defaultName = `Workout #${numWorkouts+1}`;
  const [workoutName, setWorkoutName] = useState(defaultName);
  const [workoutData, setWorkoutData] = useState([]);

  const handleSaveWorkout = async() => {
    await saveWorkoutData(workoutName, workoutData);
  }  

  const handleDataFormat = (bleData) => {
    const textData = String.fromCharCode.apply(null, new Uint8Array(bleData));
    const [x, y, z] = textData.split(',').map(parseFloat);
    return {x: x, y: y, z: z};
  };

  useEffect(() => {
    // Set up continuous data reception

    //marias
        //const deviceID = "48:E7:29:B3:C8:82"; // Replace with your device ID
    //jennas
        //const deviceID = "48:E7:29:B4:F9:7E"; // Replace with your device ID
    //james'
        const deviceID = "D8:BC:38:E5:C3:EE"; // Replace with your device ID

        const serviceUUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b"; // Replace with your service UUID
        const characteristicUUID = "00001800-0000-1000-8000-00805f9b34fb"; // Replace with your characteristic UUID
    
    
     /*BleManager.startNotification(deviceID, serviceUUID, characteristicUUID)
      .then(() => {
        console.log('Notification started');
      })
      .catch((error) => console.error('Notification error:', error));  */

    const intervalId = setInterval(() => {
      BleManager.read(deviceID, serviceUUID, characteristicUUID)
        .then((data) => {
          // Handle the received data here
          const textData = handleDataFormat(data);
          console.log('Received data:', textData);
          // Set the data state with the formatted string
          setXData(textData.x.toString());
          setYData(textData.y.toString());
          setZData(textData.z.toString());
          const newData = {
            x: textData.x, 
            y: textData.y, 
            z: textData.z
          };
          console.log('NEW DATA\n', newData);
          setWorkoutData((workoutData) => [...workoutData, newData]);
          console.log('\n :::WORKOUT_DATA::::: \n',workoutData,'\n\n');
          // Perform Calculations

          // Save Data to the current workout
          //saveWorkoutData(workoutName, createDataObj(workoutData));
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
        <View style={styles.nameChangeContainer}>
          <TextInput
            style={styles.textInput}
              placeholder={defaultName}
              onChangeText={(text) => setWorkoutName(text)}
              value={workoutName}/>
          <TouchableOpacity
            style={styles.nameSelector}
            onPress={handleSaveWorkout}>
              <Text style={styles.saveButtonText}>{isLoading ? (`Loading...`) : (`Save Workout Data`)}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Text style={styles.textStyle}>Continuous Data - X: {xData}, Y: {yData}, Z: {zData}</Text>
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

const styles = StyleSheet.create({
  textInput: {
    borderBottomColor:'grey',
    borderBottomWidth: 2,
    fontSize:18,
    width: 225,
    height: 50
  },
  textStyle:{
    fontSize: 18,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  container:{
    alignItems: 'center'
  },
  nameSelector: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 100,
    backgroundColor: 'lightblue',
    borderRadius: 10,
    
  },
  saveButtonText:{
    fontSize: 15,
    textAlign: 'center'
  },
  nameChangeContainer: {
    flexDirection: 'row',
    flex: 0.5,
    justifyContent: 'space-evenly',
    marginTop: 25,
  }
})