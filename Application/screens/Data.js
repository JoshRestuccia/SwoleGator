import {StyleSheet, StatusBar, SafeAreaView, View, Button, Text, TouchableOpacity, TextInput, ScrollView} from 'react-native'
import React, {useState, useEffect} from 'react';
import { Picker } from '@react-native-picker/picker';
import { useFirestore } from '../api/firestore/FirestoreAPI';
import RecentDataGraph from '../victory/RecentData';
import OverallDataGraph from '../victory/OverallData';

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
    const [recentName, setRecentName] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [scrolling, setScrolling] = useState(false);

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
                            setRecentName(session.name);
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


    // Scroll helper functions (preventing clicking while scrolling)
    const handleScroll = () => {
        setScrolling(true);
    };
    const handleTouchStart = (event) => {
        if(scrolling){
            event.stopPropagation();
        }
    };
    // End scroll helpers

    return(
    <SafeAreaView style={styles.mainContainer} onTouchStart={handleTouchStart}>
        <Picker
            selectedValue={typeSelection}
            onValueChange={(itemValue) => setTypeSelection(itemValue)}
            style={styles.picker}
        >
            {Object.keys(allWorkoutData).map((workoutType) => (
                <Picker.Item key={workoutType} label={workoutType} value={workoutType}/>
            ))}
        </Picker>
        <ScrollView style={styles.scrollContainer} onScroll={handleScroll}>
            <Text style={styles.header}> {`${userData?.username}'s Workout Data`} </Text>
            <View style={styles.recent}>
                <Text style={styles.sectionHeader}>
                    {recentName && `(${recentName})`}
                </Text>
                {(!isLoading && recentData.length > 0) ? 
                    (<RecentDataGraph raw_data={recentData}/>)
                :
                    (<Text>Loading workout data...</Text>)
                }
            </View>
            <View style={styles.overall}>
                <Text style={styles.sectionHeader}>
                    {`Overall Trends`}
                </Text>
                {(!isLoading && typeSelection) ? 
                    (<OverallDataGraph type={typeSelection}/>)
                :
                    (<Text>Loading workout data...</Text>)
                }
            </View>
            {/* This may be a good place to add recommendations */}
            <View style={styles.recommendations}>
                <Text style={styles.sectionHeader}> Recommendations </Text>
            </View>
        </ScrollView>
    </SafeAreaView>
    )
}

export default Data;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1.5,
        justifyContent: 'flex-end'
    },
    scrollContainer:{
        backgroundColor: 'lightgray',
        paddingTop: 25,
    },
    header:{
        fontSize: 30, 
        textAlign: 'center'
    },
    recent: {
        flex: 0.5
    },
    overall:{
        flex: 0.5,
    },
    sectionHeader:{
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold'
    },
    picker: {
        backgroundColor: 'lightblue',
    },
    recommendations: {
        flex: 0.5,
        paddingBottom: 50
    },
    recommendationText: {
        fontSize:15,
        fontFamily:'ariel',
        fontStyle:'italic'
    }
})