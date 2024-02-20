import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFirestore } from '../api/firestore/FirestoreAPI';
import { useBLE } from '../api/ble/BLEContext';
import LiveDataGraph from '../victory/LiveData';
import containerStyles from '../styles/container-view-styles';

function GraphingScreen() {
  const {
    bleData,
    isReadingData,
    startReadingData,
    stopReadingData
  } = useBLE();
  const { 
    isDataLoading,
    saveWorkoutData,  
    getNumberWorkoutsOfType,
  } = useFirestore();

  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [currentWorkoutType, setCurrentWorkoutType] = useState('Squat');
  
  const [maxVelocity, setMaxVelocity] = useState('0');
  const [repCount, setRepCount] = useState('0');
  const [currentVelocity, setCurrentVelocity] = useState('0');
  const [peakVelocity, setPeakVelocity] = useState('0');

  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [workoutData, setWorkoutData] = useState([]);

  const cleanUp = () => {
    setWorkoutData([]); // Clear workout data for next session
    setRepCount(0);
    setMaxVelocity(0);
    setCurrentVelocity(0);
    setPeakVelocity(0);
  };

  const handleSaveWorkout = async () => {
    stopReadingData();
    setWorkoutStarted(false);
    setIsLoading(true);
    await saveWorkoutData(workoutName, workoutData, currentWorkoutType);
    cleanUp();
    setIsLoading(false);
  };

 const handleDataFormat = (data) => {
   const textData = String.fromCharCode.apply(null, new Uint8Array(data));
   const [maxV, rep, currentV] = textData.split(',').map(parseFloat);
   console.log([maxV.toString(), rep.toString(), currentV.toString()]);
   
   return { maxV, rep, currentV };
 };

  useEffect(() => {
    if(workoutStarted){
      console.log('Starting to read data...');
      startReadingData();
    }else{
      console.log('Workout not yet started.');
    }
  }, [workoutStarted]);

  // When bleData is updated
  useEffect(() => {
    // format and move data to workoutData[]
    if(isReadingData && bleData){
      const {maxV, rep, currentV} = handleDataFormat(bleData);
      setMaxVelocity(maxV);
      setRepCount(rep);
      setCurrentVelocity(currentV);
      // Update peakVelocity only if the new currentV is greater
      setPeakVelocity((prevPeakVelocity) => Math.max(prevPeakVelocity, currentV));
      setWorkoutData([...workoutData, {maxV, rep, currentV}]);
      console.log(workoutData);
    }
  },[isReadingData, bleData])
 
  useEffect(() => {
    const onMount = async () => {
      setIsLoading(true);
      let n = await getNumberWorkoutsOfType(currentWorkoutType); //getAllWorkoutsOfType ==> length
      setTotal(n);
      setIsLoading(false);
    };
    onMount();
  }, [currentWorkoutType]);

  useEffect(() => {
    if(!isLoading){
      let defaultName = `${currentWorkoutType} Workout #${total + 1}`;
      setWorkoutName(defaultName);
    }
  }, [isLoading, total]);

  const handleBeginWorkout = () => {
    console.log(`Starting workout ${workoutName}`);
    setWorkoutStarted(true);
  };

  return (
    <View style={containerStyles.container}>
      <Picker
        selectedValue={currentWorkoutType}
        onValueChange={(value) => setCurrentWorkoutType(value)}
      >
        <Picker.Item label="Squat" value="Squat" />
        <Picker.Item label="Deadlift" value="Deadlift" />
        <Picker.Item label="Bench Press" value="Bench Press" />
        <Picker.Item label="Barbell Curl" value="Barbell Curl" />
      </Picker>
      <Text style={styles.textStyle}> Current Excercise: {currentWorkoutType}</Text>
      <View style={styles.nameChangeContainer}>
        <TextInput
          style={styles.textInput}
          placeholder={isLoading ? (`Loading...`) : (`${currentWorkoutType} Workout #${total + 1}`)}
          onChangeText={(text) => setWorkoutName(text)}
          value={workoutName}
        />
        <TouchableOpacity
          style={styles.nameSelector}
          onPress={handleSaveWorkout}>
          <Text style={styles.saveButtonText}>
            {isDataLoading ? `Loading...` : `Save Workout Data`}
          </Text>
        </TouchableOpacity>
      </View>
      <View> 
        {!workoutStarted ? 
          (
            <TouchableOpacity
              onPress={handleBeginWorkout}
            >
              <Text> Begin Workout </Text>
            </TouchableOpacity>
          ) 
          : 
          (
            <LiveDataGraph 
              maxVelocity={maxVelocity || 0} 
              currentVelocity={currentVelocity || 0}
              />
          )
        }  
      </View>
      <View>
        {/* Display Rep Count as Text*/} 
        <Text style={styles.repCountText}>
            Rep Count: {repCount}
        </Text>
        
        {/* Display Peak Velocity as Text*/} 
        <Text style={styles.peakVelocityText}>
          Peak Velocity: {peakVelocity}
        </Text>
      </View> 
      
    </View>
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