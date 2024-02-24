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
      {publicWorkouts ? 
        (<View style={styles.workoutContainer}>
          <Picker
            selectedValue={selectedWorkout}
            onValueChange={(itemValue) => setSelectedWorkout(itemValue)}
            style={styles.picker}
          >
            {Object.keys(publicWorkouts).map((workoutName) => (
              <Picker.Item key={workoutName} label={workoutName} value={workoutName} />
            ))}
          </Picker>
          <Text style={styles.header}>{`${friend.username}'s Workout Data`}</Text>
          <ScrollView style={styles.scrollContainer} onScroll={handleScroll}>
            <View style={styles.recent}>
              <Text style={styles.sectionHeader}>{selectedWorkout && `(${selectedWorkout})`}</Text>
              {!isLoading ? (
                <RecentDataGraph raw_data={publicWorkouts[selectedWorkout]} />
              ) : (
                <Text>Loading workout data...</Text>
              )}
            </View>
          </ScrollView>
        </View>
        )
      :
        (
          <View style={styles.noWorkouts}>
            <Text style={styles.header}>{`${friend.username}'s Workout Data`}</Text>
            <Text style={styles.noWorkoutText}>{`${friend.username} has not shared any workouts.`}</Text>
          </View>
        )
      }
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  workoutContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start'
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
  },
  header: {
    fontSize: 30,
    textAlign: 'center',
    color: 'teal',
    fontWeight: 'bold',
    padding: 40
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
