import {StyleSheet, View, Text, TouchableOpacity, TextInput} from 'react-native'
import React, {useState, useEffect} from 'react';
import {useFirestore} from '../api/firestore/FirestoreAPI';

const SignUp = ({navigation}) => {
  
  const {
    signUp,
  } = useFirestore();

  const signUpPress = async() => {
    if(signUpValidation()){
      await signUp(email, first, last, username, password);
      // Reset Navigation Stack
      navigation.navigate({name: 'User Stack', params:{screen: 'Home'}});
    }
  }

  const signUpValidation = () => {
    if(!username || !email || !password || !first || !last){
      alert('Not enough data to create account!')
      return false;
    }
    return true;
  }
    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [username, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
     <View style={styles.textBoxes}>
     <Text style={styles.swoleGator}>swolegator</Text>
      <TextInput
        style={styles.textInput}
        placeholder='FIRST NAME'
        placeholderTextColor= '#323334'
        onChangeText={setFirst}
        value={first}/>
      <TextInput
        style={styles.textInput}
        placeholder='LAST NAME'
        placeholderTextColor= '#323334'
        onChangeText={setLast}
        value={last}/>
      <TextInput
        style={styles.textInput}
        placeholderTextColor= '#323334'
        placeholder='USERNAME'
        onChangeText={setName}
        value={username}/>
      <TextInput
       style={styles.textInput}
       placeholder='EMAIL'
        placeholderTextColor= '#323334'
        onChangeText={setEmail}
        value={email}/>
      <TextInput
        style={styles.textInput}
        placeholder='PASSWORD'
        placeholderTextColor= '#323334'
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}/>
      
        <TouchableOpacity onPress={signUpPress}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </View>
        </TouchableOpacity>
        <View style={styles.textStyle}>
          <Text style={styles.textStyle} onPress={() => navigation.navigate('Guest Stack', {screen: 'Login'})}>Already have an account? Login here.</Text>
        </View>
        </View>
    </View>
  )
}

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
  marginTop: 15,
  marginBottom: 15,
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
  marginBottom: 10,
  marginTop: 30,
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
  marginTop: 20,
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
export default SignUp;
