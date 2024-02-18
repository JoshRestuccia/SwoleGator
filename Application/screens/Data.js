import {StyleSheet, SafeAreaView, View, Button, Text, TouchableOpacity, TextInput} from 'react-native'
import React, {useState, useEffect} from 'react';
import { Picker } from '@react-native-picker/picker';
import { useFirestore } from '../api/firestore/FirestoreAPI';
import RecentDataGraph from '../victory/RecentData';

const Data = () => {
    const {
        currentUser,
        getUserData,
        getAllWorkoutData,
        getMostRecentSession
    } = useFirestore();
    const [userData, setUserData] = useState(null);
    const [allWorkoutData, setAllWorkoutData] = useState({});
    const [workoutDataOfType, setWorkoutDataOfType] = useState([]);
    const [typeSelection, setTypeSelection] = useState(null);
    const [recentData, setRecentData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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
            setIsLoading(true);
            fetchData();
        }
         
      }, [currentUser]);

    useEffect(() => {
        if(typeSelection){
            /*console.log(`======================================\n`);
            console.log(`All workout data: \n\t\t`, allWorkoutData);
            console.log(`Workout Data of Type [${typeSelection}]: \n`);
            for(const session of allWorkoutData[typeSelection]){
                console.log(`Session Name: ${session?.name}`);
                console.log(`Session Data: ${session?.data}`);
            }*/
            setWorkoutDataOfType(allWorkoutData[typeSelection] || []);   
            //console.log(`======================================\n`);
        }
    }, [typeSelection, allWorkoutData]);

    useEffect(() => {
        const getNameAndSetData = async () => {
            try{
                const mostRecentName = await getMostRecentSession(typeSelection);
                console.log(mostRecentName);
                if(workoutDataOfType.length > 0 && mostRecentName){
                    for(const session of Object.values(allWorkoutData[typeSelection])){
                        if(session.name === mostRecentName){
                            //console.log('Session Data: ', session.data);
                            setRecentData(session.data);
                        }
                    }
                }else{
                    console.log('No workout data of the selected type', typeSelection);
                }
            }catch(err){
                console.error(`There was an error getting the most recent session name from Firestore`);
            }
        };
        
        if(workoutDataOfType.length > 0 && typeSelection){
            getNameAndSetData();
        }

    }, [typeSelection, workoutDataOfType]);

    useEffect(() => {
        //console.log('Recent Data: ', recentData);
        setIsLoading(false);
    }, [recentData]);

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
        <View>
            <Text> Overall Trends </Text>
        </View>
        <View>
            <Text> Last Set </Text>
            {(!isLoading && recentData.length > 0) ? 
                (<RecentDataGraph raw_data={recentData}/>)
            :
                (<Text>Loading workout data...</Text>)
            }
        </View>
        <View>
            <Text>{`Hello, ${userData?.username}`}</Text>
            <Text>This will eventually show data in firestore</Text>
        </View>
    </SafeAreaView>
    )
}

export default Data