import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";


const LiveWorkoutModal = ({visible, currentWorkoutWeight, currentWorkoutType, repCount, peakVelocity, handleSaveWorkout, isDataLoading}) => {
    return(
        <Modal 
          visible={visible}
          transparent={true}
          onRequestClose={handleSaveWorkout}
        >
            <View style={styles.background}>
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
                        <TouchableOpacity style={styles.saveButton} onPress={handleSaveWorkout}>
                            <Text style={styles.saveButtonText}>
                                {isDataLoading ? `Loading...` : `Save Workout Data`}
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
    justifyContent: 'flex-end'
},
// Parameters and Save Button 
parametersAndSaveButton: {
    backgroundColor: 'white',
    flexDirection: 'column',
    flex: 0.4,
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