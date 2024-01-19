import React from 'react';
import RootNavigator from './RootNavigator';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

const HomeScreen = ({navigation}) =>{
    
    const pressLogOut = () => {
      auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
      })
      navigation.navigate('Guest Stack', { screen: 'Login'});
    };

    return(
        <View style={styles.container}>
            <View style={styles.title}>
            <Text style={styles.title}>Welcome to SwoleGator! </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('User Stack', {screen: 'Pair Device'})} style={styles.button}>
              <Text style={styles.textStyle}> Pair Device</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('User Stack', {screen: 'Graphing Screen'})} style={styles.button}>
              <Text style={styles.textStyle}>Start Lift </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('User Stack', {screen: 'SwoleGator Data'})} style={styles.button}>
              <Text style={styles.textStyle}> SwoleGator Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={pressLogOut}>
              <Text style={styles.textStyle}> Log Out</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
      justifyItems: 'center',
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
      fontSize: 50,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 35,
    }
  })
export default HomeScreen;
