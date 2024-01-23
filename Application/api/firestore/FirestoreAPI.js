import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

//export const userCollectionRef = firestore().collection('users').get();
export const userUID = auth().currentUser.uid;
export const userRef = firestore().collection('users').doc(userUID);

export function getUserData() {
    const [userData, setUserData] = useState({});

    firestore().collection('users').doc(userUID).get()
    .then((user) => {
        setUserData(user.data());
        //console.log(userData.username);
    });

    return userData;
}

export function getNumberOfWorkouts(){
    const [numWorkouts, setNumWorkouts] = useState(0);

    firestore().collection('users').doc(userUID).collection('workouts').get()
    .then((snap) => {
        setNumWorkouts(snap.size);
    });

    return numWorkouts;
}

export function saveWorkoutData(workoutName, data){
    const dataObj = createDataObj(data);
    try{
        firestore().collection('users').doc(userUID)
        .collection('workouts').add(`${workoutName}`)
        .collection('data').add(JSON.parse(dataObj));
    }catch(error){
        console.error(error);
    }
}

const createDataObj = (data) => {
    const textData = String.fromCharCode.apply(null, new Uint8Array(data));
    const [x, y, z] = textData.split(',').map(parseFloat);
    console.log('Received data:', { x, y, z });
    console.log('Creating Data Object...');
    const dataObj = {
            x: x,
            y: y, 
            z: z
    };
    console.log('Data Object:\n', dataObj, '\n');
    return dataObj;
}