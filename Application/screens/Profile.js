import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';
import { getUserData } from '../api/firestore/FirestoreAPI';

export default function Profile() {

    const userData = getUserData();    
    
    return(
    <View style={styles.container}>
        {/* User profile image */}
        <Image source={{ uri: userData.imageUrl }} style={styles.profileImage} />

        {/* User details */}
        <View style={styles.userInfo}>
            <Text style={styles.userName}>{userData?.first}{userData?.last}</Text>
            <Text>{`Age: ${userData?.age}`}</Text>
            <Text>{`Workouts Completed: ${userData?.workoutsCompleted}`}</Text>
        </View>
    </View>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginBottom: 20,
    },
    userInfo: {
      alignItems: 'center',
    },
    userName: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
});
