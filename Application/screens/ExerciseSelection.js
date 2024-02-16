import React, {useState, useEffect} from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

import { useFirestore } from '../api/firestore/FirestoreAPI';
const ExerciseSelection = ({navigation}) =>{ 
  const {
    setCurrentWorkoutType
  } = useFirestore();
  
  handleWorkoutSelect = (type) => {
    setCurrentWorkoutType(type);
    console.log(`Currently working on ${type}`);
    navigation.navigate('User Stack', {screen: 'Graphing Screen'});
  };
  
  return(
    <View>
        <View style={styles.title}>
          <Text style={styles.titleText}>{`Select exercise below to start lift`} </Text>
        </View>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => handleWorkoutSelect('Squat')} style={styles.button}>
            <Text style={styles.textStyle}> Squat</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleWorkoutSelect('Deadlift')} style={styles.button}>
            <Text style={styles.textStyle}>Deadlift </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleWorkoutSelect('Barbell Curl')} style={styles.button}>
            <Text style={styles.textStyle}> Barbell Curl</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleWorkoutSelect('Bench Press')} style={styles.button}>
            <Text style={styles.textStyle}> Bench Press </Text>
          </TouchableOpacity>
        </View>
    </View>
);
};

const styles = StyleSheet.create({
container:{
  justifyItems: 'center',
  height:'auto',
  flexDirection:'column',
},
  textInput:{
    borderBottomColor:'grey',
    borderBottomWidth: 1,
    fontSize:18,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
},
button:{
  alignItems: 'center',
  backgroundColor: 'lightblue',
  padding:10,
  marginLeft:35,
  marginRight: 35,
  marginTop: 10,
  marginBottom: 10,
  borderRadius: 30,
},
textStyle:{
  fontSize: 18,
  alignItems: 'center',
  justifyContent: 'center',
},
title:{
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 35,
  height:180
},
titleText:{
  textAlign:'center',
  fontSize: 30,
  width:250
}
})
export default ExerciseSelection;