import {StyleSheet, View, Text, TouchableOpacity, TextInput} from 'react-native'
import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth, { firebase } from '@react-native-firebase/auth';

const SignUp = ({navigation}) => {

  // Listener for User Registration
  auth().onAuthStateChanged((user) => {
    if(user){
      const userObj = generateUserObj(email, first, last, username);
      // Loading user data into database 
      firestore().collection('users')
        .doc(`${user.uid}`)
        .set(userObj);
    }
  });
  
  const generateUserObj = (email, first, last, username) => {
    return(
      {
        email: email,
        first: first,
        last: last,
        username: username,
      }
    )
  };
  
  const signUpPress = () => {
    signUpValidation();
    // Reset Navigation Stack
    navigation.reset({
      index: 0,
      routes: [{name: 'User Stack', params:{screen: 'Login'}}]
    });
  }

  const signUpValidation = () => {
    if(!username || !email || !password || !first || !last){
      alert('Not enough data to create account!')
    }
    else{
        return (
          auth().createUserWithEmailAndPassword(email, password)
            .then( ()=> {
              console.log('User account created and signed in!');
            })
            .catch(error => {
              if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
              }
          
              if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
              }
          
              console.error(error);
            })
        );
    }
  }
    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [username, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
      style={styles.textInput}
        placeholder='Firstname'
        onChangeText={setFirst}
        value={first}/>
      <TextInput
      style={styles.textInput}
        placeholder='Lastname'
        onChangeText={setLast}
        value={last}/>
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
        <TouchableOpacity onPress={signUpPress}>
            <View style={styles.button}>
                <Text style={styles.textStyle}>Sign Up</Text>
            </View>
        </TouchableOpacity>
        <View style={styles.textStyle}>
          <Text style={styles.textStyle} onPress={() => navigation.navigate('Guest Stack', {screen: 'Login'})}>Already have an account? Login here.</Text>
        </View>
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
