import {StyleSheet, View, Button, Text, TouchableOpacity, TextInput} from 'react-native'
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Login = ({navigation}) => {
  const signIn = (email, password) => {
    return(
      auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }
    
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
        if (error.code === 'auth/')
        console.error(error);
      })
    );
  }
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    
    const onPress = () => {
        signIn(email, password);
        navigation.navigate("Home")
    }
  return (
    <View style={styles.container}>
      <TextInput
      style={styles.textInput}
        placeholder='Email'
        onChangeText={setEmail}
        value={email}/>
      <TextInput
        style={styles.textInput}
        placeholder='Password'
        onChangeText={setPassword}
        secureTextEntry={true}
        value={password}/>
          <TouchableOpacity onPress={onPress}>
            <View style={styles.button}>
                <Text style={styles.textStyle}>Login</Text>
            </View>
        </TouchableOpacity>
        <View style={styles.textStyle}>
          <Text style={styles.textStyle} onPress={()=>navigation.navigate("Sign Up")}>
            Click here to create an account
          </Text>
        </View>
    </View>
  )
}
export default Login

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
    }
})
