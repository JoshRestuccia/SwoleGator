import React, {useState, useEffect} from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

import { useFirestore } from '../api/firestore/FirestoreAPI';

const ButtonItem = ({ title, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.textStyle}>{title}</Text>
    </TouchableOpacity>
  );
const Landing = ({navigation}) =>{
    const data = [
        { id: '1', title: 'Login' },
        { id: '2', title: 'Sign Up' },
    ];
      const renderItem = ({ item }) => (
        <ButtonItem
          title={item.title}
          onPress={() => navigation.navigate(item.title)}
        />
      );
      return (
        <View style={styles.container}>
          <View style={styles.title}>
            <Text style={styles.swoleGator}>swolegator</Text>
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
export default Landing
const boxShadow = {
  shadowColor: 'white',
  shadowOffset: {
    width: 4,
    height: 4,
  },
  shadowOpacity: 0.5,
  shadowRadius: 3.84,
  elevation: 5,
};
const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
},
swoleGator: {
    fontFamily: 'Anta-Regular',
    color: 'white',
    fontSize: 70,
    ...boxShadow,
  },
button: {
  backgroundColor: '#323334',
  width: 170, 
  height: 100, 
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 50,
  margin: 10,
  ...boxShadow,
},
textStyle:{
  color: 'white',
  textTransform: 'uppercase',
  fontFamily: 'Oswald-Regular',
  fontSize: 28,
  alignItems: 'center',
  justifyContent: 'center',
  margin:10,
},
title:{
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 350,
  marginBottom: 20,
  height:180
},
titleText:{
  textAlign:'center',
  fontSize: 30,
  textTransform: 'uppercase',
  fontFamily: 'Oswald-Medium',
  color: 'white',
}
})
