import {StyleSheet, View, Text, TouchableOpacity, TextInput} from 'react-native'
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import SignUp from '../screens/SignUp'
const Login = () => {
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
  return (
    <View>
      <Text>Login</Text>
      <TextInput
      style={styles.textInput}
        placeholder='Email'
        onChangeText={setEmail}
        value={email}/>
      <TextInput
        style={styles.textInput}
        placeholder='Password'
        onChangeText={setPassword}
        value={password}/>
        <TouchableOpacity onPress={() => signIn(email, password)}>
            <View style={styles.button}>
                <Text>Login</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={<SignUp/>}/>
        <View><Text>Click here to create account</Text></View>
    </View>
  )
}
export default Login

const styles = StyleSheet.create({
    textInput:{
        backgroundColor: 'grey',
        color:'black',
        fontSize:18,
    },
    button:{
        alignItems: 'center',
        backgroundColor: 'lightblue',
        padding:10,
        margin:10
    }
})
