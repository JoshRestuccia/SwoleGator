import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

//export const userCollectionRef = firestore().collection('users').get();
export const userUID = auth().currentUser.uid;
export const userRef = firestore().collection('users').doc(userUID);

export function getUserData() {
    const [userData, setUserData] = useState({});

    userRef.get()
    .then((user) => {
        setUserData(user.data());
        //console.log(userData.username);
    });

    return userData;
}

export function getNumberOfWorkouts(){
    const [numWorkouts, setNumWorkouts] = useState(0);

    userRef.collection('workouts').get()
    .then((snap) => {
        setNumWorkouts(snap.size);
    });

    return numWorkouts;
}

export function saveWorkoutData(workoutName, data){
    try{
        userRef.collection('workouts').add({
                    name: workoutName
            }).collection('data').add({
                    x: data.x,
                    y: data.y,
                    z: data.z
                })
    }catch(error){
        console.error(error);
    }
}