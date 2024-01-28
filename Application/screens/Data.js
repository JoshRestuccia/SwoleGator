import {StyleSheet, View, Button, Text, TouchableOpacity, TextInput} from 'react-native'
import React, {useState, useEffect} from 'react';
import { getUserData } from '../api/firestore/FirestoreAPI';

const Data = () => {
    const userData = getUserData();
    return(
    <View>
        <Text>{`Hello, ${userData.username}`}</Text>
        <Text>This will eventually show data in firestore</Text>
    </View>
    )
}

export default Data