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
import MotivationQuotes from '../data/motivation.js';
import containerStyles from '../styles/container-view-styles';

const MemoizedMotivationQuotes = React.memo(MotivationQuotes);

// ToDo: Add a Modal that appears when Calibration is occurring.

function WeightSelection({navigation}) {
  const {
    bleData,
    isReadingData,
    startReadingData,
    stopReadingData,
    calibrating
  } = useBLE();
  const { 
    isDataLoading,
    saveWorkoutData,  
    getNumberWorkoutsOfType,
  } = useFirestore();


  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [currentWorkoutType, setCurrentWorkoutType] = useState('Squat');
  const [currentWorkoutWeight, setCurrentWorkoutWeight] = useState('100');
  const [offset, setOffset] = useState('0');
  const [maxVelocity, setMaxVelocity] = useState('0');
  const [repCount, setRepCount] = useState('0');
  const [currentVelocity, setCurrentVelocity] = useState('0');
  const [peakVelocity, setPeakVelocity] = useState('0');

  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [workoutData, setWorkoutData] = useState([]);
  const [batteryPercentage, setBatteryPercentage] = useState('--%');

  const cleanUp = () => {

    setOffset(repCount);
    console.log(offset);
    setRepCount(repCount-offset);
    setWorkoutData([]); // Clear workout data for next session
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
    setRepCount(rep - offset);
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
    if(isReadingData && bleData && !calibrating){
      const {maxV, rep, currentV, flag, battery} = handleDataFormat(bleData);
      setMaxVelocity(maxV);
      setRepCount(rep-offset);
      setCurrentVelocity(currentV);
      setBatteryPercentage(battery ? `${battery}%` : '--%');
      // Update peakVelocity only if the new currentV is greater
      setPeakVelocity((prevPeakVelocity) => Math.max(prevPeakVelocity, currentV));
      setWorkoutData([...workoutData, {maxV, rep, currentV}]);
      console.log(workoutData);
    }
  },[isReadingData, bleData, calibrating])
 
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
      let defaultName = `${currentWorkoutType} Workout #${(total || 0) + 1}`;
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
              <View style={styles.notStartedContainer}>
                <Text style={styles.notStartedText}> Workout has not started </Text>
              </View>
            ) 
            : 
            (
              /*<LiveDataGraph 
                maxVelocity={maxVelocity || 0} 
                currentVelocity={currentVelocity || 0}
                />*/
                <MemoizedMotivationQuotes/>
            )
          }  
        </View>
        {/* Start and Reset Buttons */}
        <View style={styles.startAndResetContainer}>
          <View style={styles.startWorkoutButtonContainer}>
            <TouchableOpacity style={styles.startWorkoutButton}
              onPress={handleBeginWorkout}
            >
              <Text style={styles.saveButtonText}> Begin Workout </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.resetButtonContainer}>
            <TouchableOpacity style={styles.resetButton}
              onPress={(cleanUp)}>
              <Text style={styles.saveButtonText}>
                {isDataLoading ? `Loading...` : `Reset / Clear Workout Data`}
              </Text>
            </TouchableOpacity>  
          </View>
        </View>
        {/* Display Active Variables (Workout Parameters & Reps & Velocity)*/}
        <View style={styles.parametersAndSaveButton}>
          <View style={styles.parameterDisplay}>
            <View style={styles.singleParameter}>
              <Text style={styles.textStyleA}> {`Current Exercise: `} </Text>
              <Text style={styles.textStyleB}>{`${currentWorkoutType}`}</Text>
            </View>
            <View style={styles.singleParameter}>
              <Text style={styles.textStyleA}> {`Current Weight: `} </Text>
              <Text style={styles.textStyleB}> {`${currentWorkoutWeight || "- - -"}`} </Text>
            </View>
            <View style={styles.singleParameter}>
              <Text style={styles.textStyleA}> {`Rep Count: `} </Text>
              <Text style={styles.textStyleB}> {`${repCount}`} </Text>
            </View>
            <View style={styles.singleParameter}>
              <Text style={styles.textStyleA}> {`Peak Velocity: `} </Text>
              <Text style={styles.textStyleB}> {`${peakVelocity}`} </Text>
            </View>            
          </View>
          <View style={styles.saveButtonContainer}>
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

export default WeightSelection;

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
    flex: 1,
    flexDirection: 'column'
  },
  // Graphic / Motivation
  graphicContainer: {
    flex: 0.8,
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  notStartedContainer: {
    flex: 1,
    justifyContent: 'space-around'
  },
    notStartedText: {
      fontSize: 20,
      fontStyle: 'normal',
      fontFamily: 'helvetica',
      fontWeight: 'bold',
      textAlign: 'center'
    },
  // Start and Reset Buttons
  startAndResetContainer: {
    flexDirection: 'row',
    flex: 0.2,
    //borderColor: 'black',
    //borderWidth: 5
  },
    // Start Workout Button
    startWorkoutButtonContainer: {
      flex: 0.4,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      //borderColor: 'purple',
      //borderWidth: 3
    },
    startWorkoutButton: {
      justifyContent: 'center',
      backgroundColor: 'lightblue',
      borderRadius: 10,
      padding: 10,
      margin: 10
    },
    // Reset Button
    resetButtonContainer:{
      flex: 0.6,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginRight: 10
      //borderColor: 'green',
      //borderWidth: 3
    },
    resetButton: {
      justifyContent: 'center',
      backgroundColor: 'lightblue',
      borderRadius: 10,
      padding: 10,
    },

// Parameters and Save Button 
parametersAndSaveButton: {
  flexDirection: 'row',
  flex: 0.25,
  justifyContent: 'flex-start',
  //borderColor: 'black',
  //borderWidth: 5
},
  // Parameters
  parameterDisplay: {
    flexDirection: 'column',
    flex: 0.5,
    //borderColor: 'blue',
    borderWidth: 3
  },  
  singleParameter: {
    flexDirection: 'row',
    flex: 0.25,
    alignContent: 'center',
    justifyContent: 'space-between'
  },
    // Parameter Text
    textStyleA: {
      fontSize: 12,
      fontFamily: 'ariel',
      fontWeight: 'bold',
    },  
    textStyleB: {
      fontSize: 12,
      marginRight: 10
    },
  // Save Button
  saveButtonContainer: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    //borderColor: 'red',
    borderWidth: 3
  },  
    saveButton: {
      justifyContent: 'center',
      backgroundColor: 'lightblue',
      borderRadius: 10,
      padding: 10,
      marginHorizontal: 0
    },
    // Save Button Text
    saveButtonText: {
      fontSize: 15,
      textAlign: 'center',
    },
});