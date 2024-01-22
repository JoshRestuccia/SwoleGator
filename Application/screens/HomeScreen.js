import React from 'react';
import RootNavigator from './RootNavigator';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import { getUserData } from '../api/firestore/FirestoreAPI';

const HomeScreen = ({navigation}) =>{
    const userData = getUserData();

    const pressLogOut = () => {
      auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
      })
      navigation.navigate('Guest Stack', { screen: 'Login'});
    };

    return(
        <View>
            <View style={styles.title}>
              <Text style={styles.titleText}>{`Welcome to SwoleGator, ${userData.first}!`} </Text>
            </View>
            <View style={styles.container}>
              <TouchableOpacity onPress={() => navigation.navigate('User Stack', {screen: 'Pair Device'})} style={styles.button}>
                <Text style={styles.textStyle}> Pair Device</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('User Stack', {screen: 'Graphing Screen'})} style={styles.button}>
                <Text style={styles.textStyle}>Start Lift </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('User Stack', {screen: 'SwoleGator Data'})} style={styles.button}>
                <Text style={styles.textStyle}> SwoleGator Data</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('User Stack', {screen: 'Profile'})} style={styles.button}>
                <Text style={styles.textStyle}> Profile </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={pressLogOut} style={styles.button}>
                <Text style={styles.textStyle}> Log Out</Text>
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
      marginTop: 25,
      marginBottom: 20,
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
export default HomeScreen;
