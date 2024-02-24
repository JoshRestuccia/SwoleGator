import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFirestore } from '../api/firestore/FirestoreAPI';
import RecentDataGraph from '../victory/RecentData';
import OverallDataGraph from '../victory/OverallData';

const FriendWorkout = ({ route }) => {
  const { friend } = route.params;
  const { getAllWorkoutData, getMostRecentSession, getFriendData, getUserData, getFriendWorkoutData } = useFirestore();
  const [allWorkoutData, setWorkoutData] = useState({});
  const [workoutDataOfType, setWorkoutDataOfType] = useState([]);
  const [typeSelection, setTypeSelection] = useState(null);
  const [recentData, setRecentData] = useState([]);
  const [recentName, setRecentName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scrolling, setScrolling] = useState(false);
  const [friendData, setUserData] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const friendData = await getFriendData(friend.uid);
     // console.log(friend.username);  // Log friend's username
     // setUserData(friendData);
      console.log(friend.uid);
      console.log(friendData);  // Log friendData's username
      const allWorkoutData = await getFriendWorkoutData(friend.uid);
      console.log(allWorkoutData);
      setWorkoutData(allWorkoutData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching workout data:', error);
    }
  };

  fetchData();
}, [friend.uid]);

    const handleScroll = () => {
        setScrolling(true);
    };
    const handleTouchStart = (event) => {
        if(scrolling){
            event.stopPropagation();
        }
    };


  useEffect(() => {
    if (typeSelection) {
      setWorkoutDataOfType(allWorkoutData[typeSelection] || []);
    }
  }, [typeSelection, allWorkoutData]); // Update when typeSelection or allWorkoutData changes

  useEffect(() => {
    const getNameAndSetData = async () => {
      try {
        const mostRecentName = await getMostRecentSession(typeSelection);
        if (workoutDataOfType.length > 0 && mostRecentName) {
          const session = Object.values(workoutDataOfType).find(session => session.name === mostRecentName);
          if (session) {
            setRecentName(session.name);
            setRecentData(session.data);
          }
        } else {
          console.log('No workout data of the selected type', typeSelection);
        }
      } catch (err) {
        console.error('Error getting the most recent session name from Firestore');
      }
    };

    if (typeSelection) {
      getNameAndSetData();
    }
  }, [typeSelection, workoutDataOfType]); // Update when typeSelection or workoutDataOfType changes


  return (
    <SafeAreaView style={styles.mainContainer} onTouchStart={handleTouchStart}>
      <Picker
        selectedValue={typeSelection}
        onValueChange={(itemValue) => setTypeSelection(itemValue)}
        style={styles.picker}
      >
        {Object.keys(allWorkoutData).map((workoutType) => (
          <Picker.Item key={workoutType} label={workoutType} value={workoutType} />
        ))}
      </Picker>
      <ScrollView style={styles.scrollContainer} onScroll={handleScroll}>
        <Text style={styles.header}>{`${friend.username}'s Workout Data`}</Text>
        <View style={styles.recent}>
          <Text style={styles.sectionHeader}>{recentName && `(${recentName})`}</Text>
          {!isLoading && recentData.length > 0 ? (
            <RecentDataGraph raw_data={recentData} />
          ) : (
            <Text>Loading workout data...</Text>
          )}
        </View>
        <View style={styles.overall}>
          <Text style={styles.sectionHeader}>Overall Trends</Text>
          {!isLoading && typeSelection ? (
            <OverallDataGraph type={typeSelection} />
          ) : (
            <Text>Loading workout data...</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrollContainer: {
    backgroundColor: 'lightgray',
    paddingTop: 25,
  },
  header: {
    fontSize: 30,
    textAlign: 'center',
  },
  recent: {
    flex: 0.5,
  },
  overall: {
    flex: 0.5,
    paddingBottom: 50,
  },
  sectionHeader: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  picker: {
    backgroundColor: 'lightblue',
  },
});

export default FriendWorkout;
