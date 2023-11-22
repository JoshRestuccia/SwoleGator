import {StyleSheet, View, Text, TouchableOpacity, TextInput} from 'react-native'
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';

const SignUp = () => {
  const signUp = (name, email, password) => {
    if(!name || !email || !password){
      alert('Not enough data to create account!')
    }
    else{
    return auth().createUserWithEmailAndPassword(email, password)
    .then( cred => {
        const {uid} = cred.user;
        auth().currentUser.updateProfile({
            displayName: name
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
    const [name, setName] = useState();
  return (
    <View>
      <Text>Sign Up</Text>
      <TextInput
      style={styles.textInput}
        placeholder='Full Name'
        onChangeText={setName}
        value={name}/>
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
        <TouchableOpacity onPress={() => signUp(name, email, password)}>
            <View style={styles.button}>
                <Text>Sign Up</Text>
            </View>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    textInput:{
        backgroundColor: 'grey',
        color:'black',
        fontSize:18,
    },
    button:{
        alignItems: 'center',
        backgroundColor: 'green',
        padding:10,
        margin:10
    }
})

export default SignUp;
