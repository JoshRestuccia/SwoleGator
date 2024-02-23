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
  const [currentWorkoutWeight, setCurrentWorkoutWeight] = useState('100');
  
  const [maxVelocity, setMaxVelocity] = useState('0');
  const [repCount, setRepCount] = useState('0');
  const [currentVelocity, setCurrentVelocity] = useState('0');
  const [peakVelocity, setPeakVelocity] = useState('0');
  const [isCalibrating, setIsCalibrating] = useState(false);

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
    await saveWorkoutData(workoutName, workoutData, currentWorkoutType, currentWorkoutWeight);
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
      const {maxV, rep, currentV, flag} = handleDataFormat(bleData);
      setMaxVelocity(maxV);
      setRepCount(rep);
      setCurrentVelocity(currentV);
      setIsCalibrating((parseInt(flag) === 0) ? false : true);
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

      {/* Picker for selecting Workout Type */}
      <Picker style={styles.workoutSelector}
        selectedValue={currentWorkoutType}
        onValueChange={(value) => setCurrentWorkoutType(value)}
      >
        <Picker.Item label="Squat" value="Squat" />
        <Picker.Item label="Deadlift" value="Deadlift" />
        <Picker.Item label="Bench Press" value="Bench Press" />
        <Picker.Item label="Barbell Curl" value="Barbell Curl" />
      </Picker>

      {/* Workout Parameter Selections */}
      <View style={styles.workoutParameterContainer}>
        <TextInput
            style={styles.textInputWeight}
            placeholder='Weight'
            onChangeText={(text) => setCurrentWorkoutWeight(text)}
            value={currentWorkoutWeight}
        />
        <TextInput
          style={styles.textInputName}
          placeholder={isLoading ? (`Loading...`) : (`${currentWorkoutType} Workout #${total + 1}`)}
          onChangeText={(text) => setWorkoutName(text)}
          value={workoutName}
        />
      </View>

      {/* Workout Parameter List && Save Button */}
      <View style={styles.restOfScreenContainer}>
        
        {/* Graphic / Motivational Text */}
        <View style={styles.graphicContainer}> 
          {!workoutStarted ? 
            (
              <TouchableOpacity style={styles.saveButton}
                onPress={handleBeginWorkout}
              >
                <Text style={styles.saveButtonText}> Begin Workout </Text>
              </TouchableOpacity>
            ) 
            : 
            (
              /*<LiveDataGraph 
                maxVelocity={maxVelocity || 0} 
                currentVelocity={currentVelocity || 0}
                />*/
                <Text> You Got This! </Text>
            )
          }  
        </View>
        {/* Display Active Variables (Workout Parameters & Reps & Velocity)*/}
        <View style={styles.parametersAndSaveButton}>
          <View style={styles.parameterDisplay}>
            <Text style={styles.textStyle}> {`Current Excercise: ${currentWorkoutType}`} </Text>
            <Text style={styles.textStyle}> {`Current Weight: ${currentWorkoutWeight || "- - -"} `} </Text>
            <Text style={styles.textStyle}> {`Rep Count: ${repCount}`} </Text>
            <Text style={styles.textStyle}> {`Peak Velocity: ${peakVelocity}`} </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton}
              onPress={handleSaveWorkout}>
              <Text style={styles.saveButtonText}>
                {isDataLoading ? `Loading...` : `Save Workout Data`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>      
    </View>
  );
}

export default GraphingScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1
  },
  // Picker for selecting Workout Type
  workoutSelector: {
    backgroundColor: '#a3c1ad',
  },
  // Workout Parameter Selections 
  workoutParameterContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flex: 0.1,
  },
  textInputWeight: {
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
    fontSize: 18,
    width: 225,
    height: 50,
    marginBottom: 10, // Add marginBottom to create space below the TextInput
    flex: 0.15,
  },  
  textInputName: {
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
    fontSize: 18,
    width: 225,
    height: 50,
    marginBottom: 10, // Add marginBottom to create space below the TextInput
    flex: 0.65,
  },

  // Rest of the Screen
  restOfScreenContainer: {
    flex: 0.9
  },
  // Graphic / Motivation
  graphicContainer: {
    flex: 0.8,
    alignContent: 'center',
    justifyContent: 'center',
  },

  // Parameters and Save Button 
  parametersAndSaveButton: {
    flexDirection: 'row',
    flex: 0.2,
    alignSelf: 'flex-end',
    justifyContent: 'space-around',
    borderColor: 'black',
    borderWidth: 5
  },
  // Parameters
  parameterDisplay: {
    flex: 0.5,
    borderColor: 'blue',
    borderWidth: 3
  },  
  // Button Container
  buttonContainer: {
    flex: 0.5,
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderColor: 'red',
    borderWidth: 3
  },
  // Parameter Text
  textStyle: {
    fontSize: 15,
  },
  // Save Button
  saveButton: {
    justifyContent: 'center',
    backgroundColor: 'lightblue',
    borderRadius: 30,
    padding: 20,
    marginHorizontal: 30
  },
  // Save Button Text
  saveButtonText: {
    fontSize: 15,
    textAlign: 'center',
  },
});