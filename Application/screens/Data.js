import {StyleSheet, View, Button, Text, TouchableOpacity, TextInput} from 'react-native'
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Data = () => {
    const [userData, setUserData] = useState({});

    firestore().collection('users').doc(auth().currentUser.uid).get()
    .then((user) => {
        setUserData(user.data());
        console.log(userData.username);
    });
    
    return(
    <View>
        <Text>{`Hello, ${userData.username}`}</Text>
        <Text>This will eventually show data in firestore</Text>
    </View>
    )
}

export default Data