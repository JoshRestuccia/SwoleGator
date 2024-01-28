import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import { useFirestore } from '../api/firestore/FirestoreAPI';

import {
  VictoryChart,
  VictoryBar,
  VictoryLegend,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory-native';
import containerStyles from '../styles/container-view-styles';

function GraphingScreen() {
  const { saveWorkoutData, numWorkouts, isLoading } = useFirestore();
  const [maxVelocity, setMaxVelocity] = useState('0');
  const [repCount, setRepCount] = useState('0');
  const [currentVelocity, setCurrentVelocity] = useState('0');
  const [peakVelocity, setPeakVelocity] = useState('0');

  const defaultName = `Workout #${numWorkouts + 1}`;
  const [workoutName, setWorkoutName] = useState(defaultName);
  const [workoutData, setWorkoutData] = useState([]);

  const handleSaveWorkout = async () => {
    await saveWorkoutData(workoutName, workoutData);
  };

 const handleDataFormat = (bleData) => {
   const textData = String.fromCharCode.apply(null, new Uint8Array(bleData));
   const [maxV, rep, currentV] = textData.split(',').map(parseFloat);

   // Update peakVelocity only if the new currentV is greater
   setPeakVelocity((prevPeakVelocity) => Math.max(prevPeakVelocity, currentV));

   return { maxV, rep, currentV };
 };


  useEffect(() => {
    const deviceID = "48:E7:29:B4:F9:7E"; // Replace with your device ID
    const serviceUUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b"; // Replace with your service UUID
    const characteristicUUID = "00001800-0000-1000-8000-00805f9b34fb"; // Replace with your characteristic UUID

    const intervalId = setInterval(() => {
      BleManager.read(deviceID, serviceUUID, characteristicUUID)
        .then((data) => {
          const { maxV, rep, currentV } = handleDataFormat(data);
          console.log('Received data:', { maxV, rep, currentV });

          setMaxVelocity(maxV.toString());
          setRepCount(rep.toString());
          setCurrentVelocity(currentV.toString());

          const newData = {
            maxV: parseFloat(maxV),
            rep: parseFloat(rep),
            currentV: parseFloat(currentV),
          };

          setWorkoutData((workoutData) => [...workoutData, newData]);
        })
        .catch((error) => console.error('Read error:', error));
    }, 500);

    return () => {
      clearInterval(intervalId);
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
            value={workoutName}
          />
          <TouchableOpacity
            style={styles.nameSelector}
            onPress={handleSaveWorkout}>
            <Text style={styles.saveButtonText}>
              {isLoading ? `Loading...` : `Save Workout Data`}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.chartContainer}>
          {/* Vertical Bar Chart */}
          <VictoryChart
            height={200}
            domainPadding={{ x: 10 }}
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
            fixAxis="x"
            domain={{
              x: [0, 3],
              y: [-20, 100],
            }}>
            {/* Max Velocity Data */}
            <VictoryBar
              name="maxVelocity"
              data={[{ x: 1, y: parseFloat(maxVelocity) }]}
              style={{
                data: {
                  fill: 'tomato',
                  width: 30,
                },
              }}
            />

            {/* Current Velocity Data */}
            <VictoryBar
              name="currentVelocity"
              data={[{ x: 2, y: parseFloat(currentVelocity) }]}
              style={{
                data: {
                  fill: 'blue',
                  width: 30,
                },
              }}
            />
          </VictoryChart>
        </View>

        {/* Display Rep Count as Text */}
        <Text style={styles.repCountText}>
          Rep Count: {repCount}
        </Text>

        {/* Display Peak Velocity as Text */}
        <Text style={styles.peakVelocityText}>
          Peak Velocity: {peakVelocity}
        </Text>

        {/* Legend */}
        <VictoryLegend
          x={20}
          y={20}
          title="Workout Stats"
          titleOrientation='top'
          orientation='horizontal'
          data={[
            {
              name: 'Max Velocity',
              symbol: {
                fill: 'tomato',
                type: 'square',
              },
            },
            {
              name: 'Current Velocity',
              symbol: {
                fill: 'blue',
                type: 'square',
              },
            },
          ]}
        />
      </SafeAreaView>
    </>
  );
}

export default GraphingScreen;

const styles = StyleSheet.create({
  textInput: {
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
    fontSize: 18,
    width: 225,
    height: 50,
    marginBottom: 10, // Add marginBottom to create space below the TextInput
  },
  textStyle: {
    fontSize: 18,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  container: {
    alignItems: 'center',
  },
  nameSelector: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 100,
    backgroundColor: 'lightblue',
    borderRadius: 10,
  },
  saveButtonText: {
    fontSize: 15,
    textAlign: 'center',
  },
  nameChangeContainer: {
    flexDirection: 'row',
    flex: 0.5,
    justifyContent: 'space-evenly',
    marginTop: 25,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 20, // Add marginTop to create space above the chart
  },
  repCountText: {
    fontSize: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  peakVelocityText: {
    fontSize: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});