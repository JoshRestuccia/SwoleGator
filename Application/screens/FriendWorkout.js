import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFirestore } from '../api/firestore/FirestoreAPI';
import RecentDataGraph from '../victory/RecentData';

const FriendWorkout = ({ route }) => {
  const { friend } = route.params;
  const { currentUser, getPublicWorkoutsOfUser } = useFirestore();

  const [scrolling, setScrolling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [publicWorkouts, setPublicWorkouts] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
     // console.log(friend.username);  // Log friend's username
     // setUserData(friendData);
      console.log(friend);
      const allPublicWorkouts = await getPublicWorkoutsOfUser(friend.uid);
      console.log(allPublicWorkouts);
      setPublicWorkouts(allPublicWorkouts);
      if (Object.keys(allPublicWorkouts).length > 0) {
        setSelectedWorkout(Object.keys(allPublicWorkouts)[0]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching workout data:', error);
    }
  };
  if(currentUser){
    setIsLoading(true);
    fetchData();
  }
  else {
  setPublicWorkouts(null);
  }
}, [currentUser]);

  useEffect(() => {
    console.log('Public Workouts: ', publicWorkouts);
    console.log('Selected Workout: ', selectedWorkout);
  }, [publicWorkouts, selectedWorkout]);

    const handleScroll = () => {
        setScrolling(true);
    };
    const handleTouchStart = (event) => {
        if(scrolling){
            event.stopPropagation();
        }
    };


return (
  <SafeAreaView style={styles.mainContainer} onTouchStart={handleTouchStart}>
    { publicWorkouts !== null && Object.keys(publicWorkouts).length > 0  ? (
      <View style={styles.workoutContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>{`${friend.username}'s Workout Data`}</Text>
        </View>

        {  Object.keys(publicWorkouts).length > 0 && (
          <Picker
            selectedValue={selectedWorkout}
            onValueChange={(itemValue) => setSelectedWorkout(itemValue)}
            style={styles.picker}
          >
            {Object.keys(publicWorkouts).map((workoutName) => (
              <Picker.Item key={workoutName} label={workoutName} value={workoutName} />
            ))}
          </Picker>
        )}
        <ScrollView style={styles.scrollContainer} onScroll={handleScroll}>
          <View style={styles.recent}>
            {selectedWorkout && ( // Check if selectedWorkout is truthy
              <>
                <Text style={styles.sectionHeader}>{selectedWorkout && `(${selectedWorkout})`}</Text>
                {!isLoading ? (
                  <RecentDataGraph raw_data={publicWorkouts[selectedWorkout]} />
                ) : (
                  <Text>Loading workout data...</Text>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </View>
    ) : (
      <View style={styles.noWorkouts}>
        <Text style={styles.header}>{`${friend.username}'s Workout Data Empty`}</Text>
        <Text style={styles.noWorkoutText}>{`${friend.username} has not shared any workouts.`}</Text>
      </View>
    )}
  </SafeAreaView>
);


};



const styles = StyleSheet.create({
  workoutContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  headerContainer:{
    flex: 0.5,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'teal',
    borderBottomColor: 'white',
    borderBottomWidth: 2
  },
  noWorkouts: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  noWorkoutText: {
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'helvetica',
    color: 'gray',
    padding: 20
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrollContainer: {
    backgroundColor: 'lightgray',
    paddingTop: 25,
    borderTopColor: 'white',
    borderTopWidth: 2
  },
  header: {
    fontSize: 30,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    padding: 20
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
    backgroundColor: 'teal',
    color: 'white',
  },
});

export default FriendWorkout;
