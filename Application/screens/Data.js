import {StyleSheet, View, Button, Text, TouchableOpacity, TextInput} from 'react-native'
import React, {useState, useEffect} from 'react';
import { Picker } from '@react-native-picker/picker';
import { useFirestore } from '../api/firestore/FirestoreAPI';
import { SafeAreaView } from 'react-native-safe-area-context';

const Data = () => {
    const {
        currentUser,
        getUserData,
        getAllWorkoutData,
    } = useFirestore();
    const [userData, setUserData] = useState(null);
    const [allWorkoutData, setAllWorkoutData] = useState({});
    const [workoutDataOfType, setWorkoutDataOfType] = useState([]);
    const [typeSelection, setTypeSelection] = useState(null);

    useEffect(() => {
        const fetchData = async() => {
          try{
            const userDataFirestore = await getUserData();
            setUserData(userDataFirestore);  
            const workoutData = await getAllWorkoutData();
            setAllWorkoutData(workoutData);
            // Set the initial workout type selection
            if (Object.keys(workoutData).length > 0) {
                setTypeSelection(Object.keys(workoutData)[0]);
            }
          }catch(err){
            console.error(err);
          }
        };
        
        if(currentUser){
            fetchData();
        }
         
      }, [currentUser]);

    useEffect(() => {
        if(typeSelection){
            console.log(`======================================\n`);
            console.log(`All workout data: \n\t\t`, allWorkoutData);
            console.log(`Workout Data of Type [${typeSelection}]: \n`);
            for(const session of allWorkoutData[typeSelection]){
                console.log(`Session Name: ${session?.name}`);
                console.log(`Session Data: ${session?.data}`);
            }
            setWorkoutDataOfType(allWorkoutData[typeSelection] || []);
            console.log(`======================================\n`);
        }
    }, [allWorkoutData, typeSelection]);

    return(
    <SafeAreaView>
        
        <Picker
            selectedValue={typeSelection}
            onValueChange={(itemValue) => setTypeSelection(itemValue)}
        >
            {Object.keys(allWorkoutData).map((workoutType) => (
                <Picker.Item key={workoutType} label={workoutType} value={workoutType}/>
            ))}
        </Picker>
        {Object.keys(workoutDataOfType).length > 0 ? (
            <View>
                {/* Display information for selected workout type */}
                <Text>Workout Data for {typeSelection}:</Text>
                {/* Render workout data here */}
            </View>
        ) : (
            <Text>Loading workout data...</Text>
        )}
        <View>
            <Text> Overall Trends </Text>
        </View>
        <View>
            <Text> Last Set </Text>
        </View>
        <View>
            <Text>{`Hello, ${userData?.username}`}</Text>
            <Text>This will eventually show data in firestore</Text>
        </View>
    </SafeAreaView>
    )
}

export default Data