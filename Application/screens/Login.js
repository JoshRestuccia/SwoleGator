import {StyleSheet, View, Button, Text, TouchableOpacity, TextInput} from 'react-native'
import React, {useState, useEffect} from 'react';

import { useFirestore } from '../api/firestore/FirestoreAPI';


const Login = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const {
      signIn,
    } = useFirestore();

    const signInPressed = async() => {
      try{
        if(email !== '' && password != ''){
          const user = await signIn(email, password);
          setEmail("");
          setPassword("");
          if(user){
            navigation.reset({
              index: 0,
              routes: [{name: 'User Stack'}]
            });
          }else{
            console.warn('Did not sign in...');
          }
        }else{
          console.warn('Please enter email and password');
        }
      }catch(err){
        console.error("Error signing user in", err);
      }
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
          <TouchableOpacity onPress={signInPressed}>
            <View style={styles.button}>
                <Text style={styles.textStyle}>Login</Text>
            </View>
        </TouchableOpacity>
        <View style={styles.textStyle}>
          <Text style={styles.textStyle} onPress={()=>navigation.navigate('Guest Stack', {screen: 'Sign Up'})}>
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
