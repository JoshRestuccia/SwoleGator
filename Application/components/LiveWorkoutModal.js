import React, {useEffect} from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MotivationQuotes from '../data/motivation.js';

const MemoizedMotivationQuotes = React.memo(MotivationQuotes);

const LiveWorkoutModal = ({visible, currentWorkoutWeight, currentWorkoutType, repCount, peakVelocity, handleSaveWorkout, 
                            isDataLoading, handleCloseWorkout, cleanUp, calibrating, batteryPercentage}) => {

    useEffect(() => {
        console.log("Battery perc: ", batteryPercentage);
    }, [batteryPercentage])

    return(
        <Modal 
          visible={visible}
          transparent={true}
          onRequestClose={handleCloseWorkout}
        >
            <View style={styles.background}>
                { calibrating ? 
                    <View style={styles.repCountBox}>
                        <Text style={styles.calibrating}>Calibrating...</Text>
                        <Text style={styles.calibrationSteps}>Please perform a few normal reps with no weight and then press RESET</Text>
                    </View>
                :

                    <View style={styles.repCountBox}>
                    <Text style={styles.batteryPercentage}>Device Battery: {batteryPercentage}</Text>
                        <Text style={styles.repCount}>{`${repCount}`}</Text>
                        <MemoizedMotivationQuotes/>
                    </View>
                }
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
                            <Text style={styles.textStyleA}> {`Peak Velocity: `} </Text>
                            <Text style={styles.textStyleB}> {`${peakVelocity}`} </Text>
                        </View>            
                    </View>
                    <View style={styles.saveButtonContainer}>
                        <TouchableOpacity style={styles.saveButton}
                            onPress={cleanUp}>
                            <Text style={styles.saveButtonText}>
                                {isDataLoading ? `Loading...` : `Reset`}
                            </Text>
                        </TouchableOpacity> 
                        <TouchableOpacity style={styles.saveButton} 
                            onPress={handleSaveWorkout}>
                            <Text style={styles.saveButtonText}>
                                {isDataLoading ? `Loading...` : `Save`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default LiveWorkoutModal;

const styles = StyleSheet.create({
background: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'space-evenly',
    padding: 25
},
repCountBox: {
    flex: 1,
    backgroundColor: '#272727',
    justifyContent: 'center',
    margin: 20,
    padding: 25,
    borderRadius: 15
},
    repCount: {
        fontFamily: 'Oswald-Regular',
        fontSize: 70,
        textAlign: 'center',
        color: 'white',
        alignSelf: 'stretch',
        paddingBottom: 25
    },
    calibrating:{
        fontFamily: 'Oswald-Regular',
        fontSize: 50,
        textAlign: 'center',
        color: 'white',
        alignSelf: 'stretch',
        paddingBottom: 25
    },
    calibrationSteps:{
        fontFamily: 'Arial',
        fontSize: 25,
        textAlign: 'center',
        color: 'white',
        alignSelf: 'stretch',
        paddingBottom: 25
    },
// Parameters and Save Button 
parametersAndSaveButton: {
    backgroundColor: '#272727',
    flexDirection: 'row',
    flex: 0.3,
    justifyContent: 'center',
    borderRadius: 15,
    padding: 15,
  },
    // Parameters
    parameterDisplay: {
      flexDirection: 'column',
      flex: 0.65,
      justifyContent: 'space-evenly',
    },  
    singleParameter: {
      flexDirection: 'row',
      backgroundColor: 'lightgrey',
      justifyContent: 'space-between',
      margin: 5,
      borderRadius: 5
    },
      // Parameter Text
      textStyleA: {
        fontSize: 20,
        marginLeft: 10,
        fontFamily: 'ariel',
        color: 'red',
        fontFamily: 'Oswald-Regular',
        textAlignVertical: 'center'
      },  
      textStyleB: {
        fontSize: 20,
        marginRight: 10,
        color: 'black',
        fontFamily: 'Oswald-Regular',
        textAlignVertical: 'center'
      },
    // Save Button
    saveButtonContainer: {
      flex: 0.35,
      flexDirection: 'column',
      alignSelf: 'center',
      justifyContent: 'space-between',
    },  
      saveButton: {
        flex: 0.4,
        justifyContent: 'center',
        backgroundColor: 'red',
        borderRadius: 10,
        margin: 5
      },
      // Save Button Text
      saveButtonText: {
        fontSize: 20,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white',
        fontFamily: 'Oswald-Regular',
      },
      batteryPercentage: {
                  color: 'white',
                  fontSize: 20,
                  fontFamily: 'Oswald-Regular',
                  //textAlign : 'right'
                },
});