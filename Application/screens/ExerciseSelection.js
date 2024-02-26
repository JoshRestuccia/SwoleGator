import React, {useState, useEffect} from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

import { useFirestore } from '../api/firestore/FirestoreAPI';

const ButtonItem = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <Text style={styles.textStyle}>{title}</Text>
  </TouchableOpacity>
);
const ExerciseSelection = ({navigation}) =>{
  const data = [
    { id: '1', title: 'Squat' },
    { id: '2', title: 'Deadlift' },
    { id: '3', title: 'Barbell Curl' },
    { id: '4', title: 'Bench Press' },
  ];
  const renderItem = ({ item }) => (
    <ButtonItem
      title={item.title}
      onPress={() => navigation.navigate('Graphing Screen')}
    />
  );
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Select Exercise</Text>
      </View>
      <FlatList
        data={data}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};
const boxShadow = {
  shadowColor: 'lightgrey',
  shadowOffset: {
    width: 2,
    height: 0,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 4,
};
const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#272727',
    alignItems: 'center',
    justifyContent: 'center',
},
button: {
  backgroundColor: 'black',
  width: 170, 
  height: 150, 
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 30,
  margin: 10,
  ...boxShadow,
},
textStyle:{
  color: 'lightgrey',
  textTransform: 'uppercase',
  fontFamily: 'Oswald-Regular',
  fontSize: 24,
  alignItems: 'center',
  justifyContent: 'center',
  margin:10,
},
title:{
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 25,
  height:180
},
titleText:{
  textAlign:'center',
  fontSize: 30,
  textTransform: 'uppercase',
  fontFamily: 'Oswald-Regular',
  color: 'white',
}
})
export default ExerciseSelection;