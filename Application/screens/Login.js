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
            alert("Incorrect login credentials. Please try again.");
          }
        }else{
          alert("Login field left empty. Please enter all relevant credentials.")
        }
      }catch(err){
        console.error("Error signing user in", err);
      }
    }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.swoleGator}>swolegator</Text>
      </View>
      <View style={styles.textBoxes}>
        <TextInput
          style={styles.textInput}
          placeholder='EMAIL'
          placeholderTextColor= '#323334'
          onChangeText={setEmail}
          value={email}/>
      </View>
      <View styles={styles.textBoxes}>
        <TextInput
          style={styles.pwStyle}
          placeholder='PASSWORD'
          placeholderTextColor= '#323334'
          onChangeText={setPassword}
          secureTextEntry={true}
          value={password}/>
      </View>
      <TouchableOpacity onPress={signInPressed}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
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

const boxShadow = {
  shadowColor: '#B50000',
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
textInput:{
  borderBottomColor:'white',
  borderBottomWidth: 1,
  fontSize:20,
  alignItems: 'flex-end',
  fontFamily: 'Oswald-Regular',
  color:'white',
  textTransform: 'uppercase',
  width: 340,
  height: 50,
},
swoleGator: {
    fontFamily: 'Anta-Regular',
    color: 'white',
    fontSize: 70,
    marginTop: 40,
    ...boxShadow,
  },
button: {
  backgroundColor: '#323334',
  width: 340, 
  height: 50, 
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 50,
  marginBottom: 120,
  marginTop: 70,
  ...boxShadow,
},
buttonText:{
  color: 'white',
  textTransform: 'uppercase',
  fontFamily: 'Oswald-Regular',
  fontSize: 24,
  alignItems: 'center',
  justifyContent: 'center',
},
textStyle:{
  color: '#AD0000',
  textTransform: 'uppercase',
  fontFamily: 'Oswald-Regular',
  fontSize: 15,
  alignItems: 'center',
  justifyContent: 'center',
  margin:10,
},
pwStyle:{
  borderBottomColor:'white',
  borderBottomWidth: 1,
  fontSize:20,
  alignItems: 'flex-end',
  fontFamily: 'Oswald-Regular',
  color:'white',
  width: 340,
  height: 50,
},
title:{
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 350,
  marginBottom: 20,
  height:180
},
textBoxes:{
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 10,
  marginBottom: 10,
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
