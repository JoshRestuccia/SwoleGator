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
import LiveWorkoutModal from '../components/LiveWorkoutModal';
import ConnectedDeviceModal from '../components/ConnectedDeviceModal';
import { CommonActions } from '@react-navigation/native';

const MemoizedMotivationQuotes = React.memo(MotivationQuotes);

// ToDo: Add a Modal that appears when Calibration is occurring.

function GraphingScreen({navigation}) {
  const {
    bleData,
    isReadingData,
    startReadingData,
    stopReadingData,
    calibrating,
    connectedDevice
  } = useBLE();
  const { 
    isDataLoading,
    saveWorkoutData,  
    getNumberWorkoutsOfType,
  } = useFirestore();

  const [deviceConnected, setDeviceConnected] = useState(false);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [currentWorkoutType, setCurrentWorkoutType] = useState('Squat');
  const [currentWorkoutWeight, setCurrentWorkoutWeight] = useState('100');
  
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

  useEffect(() => {
    console.log(connectedDevice);
    if(connectedDevice){
      setDeviceConnected(true);
    }else{
      setDeviceConnected(false);
    }
    console.log(deviceConnected);
  }, [connectedDevice]);

  // When bleData is updated
  useEffect(() => {
    // format and move data to workoutData[]
    if(isReadingData && bleData && !calibrating){
      const {maxV, rep, currentV, flag} = handleDataFormat(bleData);
      setMaxVelocity(maxV);
      setRepCount(rep);
      setCurrentVelocity(currentV);
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

  const handleConnect = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Home', params: {screen: 'Main'}}]
      })
    )
  }

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
              onPress={cleanUp}>
              <Text style={styles.saveButtonText}>
                {isDataLoading ? `Loading...` : `Reset / Clear Workout Data`}
              </Text>
            </TouchableOpacity>  
          </View>
        </View>
      </View>
      <LiveWorkoutModal
        visible={workoutStarted}
        currentWorkoutType={currentWorkoutType}
        currentWorkoutWeight={currentWorkoutWeight}
        repCount={repCount}
        peakVelocity={peakVelocity}
        handleSaveWorkout={handleSaveWorkout}
        isDataLoading={isDataLoading}  
      />
      <ConnectedDeviceModal
        visible={!deviceConnected}
        onConnect={handleConnect}
      />   
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


});