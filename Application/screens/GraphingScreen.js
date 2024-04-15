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
import containerStyles from '../styles/container-view-styles';
import LiveWorkoutModal from '../components/LiveWorkoutModal';
import ConnectedDeviceModal from '../components/ConnectedDeviceModal';
import { CommonActions } from '@react-navigation/native';


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
  const [batteryPercentage, setBatteryPercentage] = useState('0');

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
    
    return { maxV, rep, currentV, batteryPercentage };
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
      const {maxV, rep, currentV, flag, batteryPercentage} = handleDataFormat(bleData);
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
      try{
        setIsLoading(true);
        let n = await getNumberWorkoutsOfType(currentWorkoutType); //getAllWorkoutsOfType ==> length
        setTotal(n);
        setIsLoading(false); 
      }catch(err){
        console.error(err);
      }
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

  const handleCloseWorkout = () => {
    setWorkoutStarted(false);
    stopReadingData();
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

    <View style={styles.container}>

      {/* Picker for selecting Workout Type */}
      <View style={styles.workoutType}>
        <Text style={styles.selectWorkoutHeader}>Select the workout type:</Text>
        <View style={styles.workoutSelector}>
          <Picker
            style={styles.picker}
            selectedValue={currentWorkoutType}
            onValueChange={(value) => setCurrentWorkoutType(value)}
          >
            <Picker.Item label="Squat" value="Squat" />
            <Picker.Item label="Deadlift" value="Deadlift" />
            <Picker.Item label="Bench Press" value="Bench Press" />
            <Picker.Item label="Barbell Curl" value="Barbell Curl" />
          </Picker>
        </View>
      </View>

      {/* Workout Parameter Selections */}
      <View style={styles.workoutParams}> 
        <Text style={styles.selectWorkoutHeader}>Set your parameters:</Text>
        <View style={styles.workoutParameterContainer}>
          <View style={styles.leftBox}>
            <Text style={styles.parameterLabel}>Weight</Text>
            <TextInput
                style={styles.textInputWeight}
                placeholder='Weight'
                onChangeText={(text) => setCurrentWorkoutWeight(text)}
                value={currentWorkoutWeight}
            />
          </View>
          <View style={styles.rightBox}>
            <Text style={styles.parameterLabel}>Name</Text>
            <TextInput
              style={styles.textInputName}
              placeholder={isLoading ? (`Loading...`) : (`${currentWorkoutType} Workout #${total + 1}`)}
              onChangeText={(text) => setWorkoutName(text)}
              value={workoutName}
            />
          </View>
        </View>
      </View>

      {/* Start and Reset Buttons */}
      <View style={styles.startContainer}>
        <TouchableOpacity style={styles.startWorkoutButton}
          onPress={handleBeginWorkout}
        >

          <Text style={styles.saveButtonText}> Begin Workout </Text>
        </TouchableOpacity>


      </View>



      {/* Modals */}
      <LiveWorkoutModal
        visible={workoutStarted}
        currentWorkoutType={currentWorkoutType}
        currentWorkoutWeight={currentWorkoutWeight}
        repCount={repCount}
        peakVelocity={peakVelocity}
        handleSaveWorkout={handleSaveWorkout}
        handleCloseWorkout={handleCloseWorkout}
        isDataLoading={isDataLoading}  
        cleanUp={cleanUp}
        calibrating={calibrating}
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
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#272727'
  },
  selectWorkoutHeader: {
    textAlign: 'left',
    textAlignVertical: 'bottom',
    fontFamily: 'Oswald-Regular',
    fontSize: 30,
    padding: 20,
    color: 'white'
  },
  workoutType:{
    flex: 0.25,
    flexDirection: 'column'
  },
  workoutParams: {
    flex: 0.5,
    paddingBottom: 0 
  },
   batteryPercentage: {
            color: 'white',
            fontSize: 20,
            fontFamily: 'Oswald-Regular',
            //textAlign : 'right'
          },
  // Picker for selecting Workout Type
  workoutSelector: {
    flex: 0.8,
    alignSelf: 'center',
    justifyContent: 'center',
    width: '70%',
    backgroundColor: 'red',
    borderRadius: 15
  },
  picker: {
    color: 'white',
    alignSelf: 'center',
    width: '90%',
  },  
  // Workout Parameter Selections 
  workoutParameterContainer: {
    padding: 10,
    paddingHorizontal: 20,
    flexDirection: 'column',
    flex: 0.75,
    width: '80%',
    alignSelf: 'center',
    backgroundColor: 'red',
    paddingTop: 15,
    borderRadius: 15,
},
  leftBox: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  parameterLabel: {
    fontFamily: 'Oswald-Regular',
    fontSize: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'white',
    height: '80%'
  },
  rightBox: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInputWeight: {
    fontSize: 18,
    width: '30%',
    height: '80%',
    alignSelf: 'center',
    fontFamily: 'Arial',
    color: 'black',
    backgroundColor: 'lightgray',
    borderRadius: 15,
    textAlign: 'center',
  },  
  textInputName: {
    fontSize: 18,
    width: '70%',
    height: '80%',
    fontFamily: 'Arial',
    color: 'black',
    backgroundColor: 'lightgray',
    borderRadius: 15,
    textAlign: 'center',
  },
  // Start and Reset Buttons
  startContainer: {
    flexDirection: 'column',
    flex: 0.25,
    justifyContent: 'center',
  },
  // Start Workout Button
  startWorkoutButton: {
    height: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 10,
    marginBottom: 50
  },
  saveButtonText: {
    fontFamily: 'Oswald-Regular',
    fontSize: 30,
    color: 'white'
  }
});