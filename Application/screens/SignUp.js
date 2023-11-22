import {StyleSheet, View, Text, TouchableOpacity, TextInput} from 'react-native'
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const SignUp = ({navigation}) => {
  const onPress = () => {
    signUp(username, email, password)
    navigation.navigate("Home")
  }
  const signUp = (username, email, password) => {
    if(!username || !email || !password){
      alert('Not enough data to create account!')
    }
    else{
    return auth().createUserWithEmailAndPassword(email, password)
    .then( cred => {
        const {uid} = cred.user;
        auth().currentUser.updateProfile({
            displayName: username
        })
        return uid
    })
    .catch(
        err => addWhitelistedNativeProps(err.code, err.message)
    )
    }
  }
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [username, setName] = useState();
  return (
    <View style={styles.container}>
      <TextInput
      style={styles.textInput}
        placeholder='Username'
        onChangeText={setName}
        value={username}/>
      <TextInput
      style={styles.textInput}
        placeholder='Email'
        onChangeText={setEmail}
        value={email}/>
      <TextInput
        style={styles.textInput}
        placeholder='Password'
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}/>
        <TouchableOpacity onPress={onPress}>
            <View style={styles.button}>
                <Text style={styles.textStyle}>Sign Up</Text>
            </View>
        </TouchableOpacity>
        <View style={styles.textStyle}><Text style={styles.textStyle} onPress={() => navigation.navigate("Login")}>Already have an account? Login here.</Text></View>
    </View>
  )
}

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

export default SignUp;
