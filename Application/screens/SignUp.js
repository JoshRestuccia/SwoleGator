import {StyleSheet, View, Text, TouchableOpacity, TextInput} from 'react-native'
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';

const SignUp = ({navigation}) => {
  const onPress = () => {
    signUp(username, email, password)
    setEmail("")
    setPassword("")
    setName("")
  }
  const signUp = (username, email, password) => {
    if(!username || !email || !password){
      alert('Not enough data to create account!')
    }
    else{
    return auth().createUserWithEmailAndPassword(email, password)
    .then( ()=> {
      console.log('User account created and signed in!');
      navigation.navigate("Home");
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
        setInUse(true);
      }
  
      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }
  
      console.error(error);
    });
    }
  }
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [username, setName] = useState();
    const [inUse, setInUse] = useState(false);
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
