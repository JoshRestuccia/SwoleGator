import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFirestore } from '../api/firestore/FirestoreAPI';
import RecentDataGraph from '../victory/RecentData';

const Feed = () => {
  const { currentUser, friendsFromDatabase, getPublicWorkoutsOfUser } = useFirestore();

  const [isLoading, setIsLoading] = useState(false);
  const [friendWorkouts, setFriendWorkouts] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser) {
          setIsLoading(true);
          const friends = await friendsFromDatabase();
          const friendWorkoutsPromises = friends.map(async friend => {
            const publicWorkouts = await getPublicWorkoutsOfUser(friend.uid);
            return { friend, publicWorkouts };
          });
          const friendWorkoutsData = await Promise.all(friendWorkoutsPromises);
          console.log('Friend Workouts Data:', friendWorkoutsData);
          setFriendWorkouts(friendWorkoutsData.map(({ friend, publicWorkouts }) => ({ friend, publicWorkouts })));

          if (friendWorkoutsData.length > 0) {
            setSelectedFriend(friendWorkoutsData[0].friend);
          }
          else {
            setSelectedFriend(null); // Reset selected friend if no data
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching friend workout data:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  const handleFriendChange = (friend) => {
    setSelectedFriend(friend);
  };

  console.log('Selected Friend:', selectedFriend);
  console.log('Friend Workouts:', friendWorkouts);

  if (!selectedFriend || !friendWorkouts) {
    return <Text>No friend workouts found.</Text>; // Handle empty or undefined cases
  }

return (
  <SafeAreaView style={styles.mainContainer}>
    {isLoading ? (
      <Text>Loading...</Text>
    ) : (
      <View style={styles.workoutContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Friends' Workout Data</Text>
        </View>
        <ScrollView style={styles.scrollContainer}>
          {friendWorkouts.map(({ friend, publicWorkouts }) => (
            <View key={friend.uid} style={styles.friendContainer}>
              <Text style={styles.friendHeader}>{`${friend.username}'s Workouts`}</Text>
              {publicWorkouts && Object.keys(publicWorkouts).length > 0  ? (
                Object.keys(publicWorkouts).map((workoutKey, index) => (
                  <View key={index} style={styles.recent}>
                    <Text style={styles.sectionHeader}>{`Workout ${index + 1}`}</Text>
                    <RecentDataGraph raw_data={publicWorkouts[workoutKey]} />
                  </View>
                ))
              ) : (
                <Text>No recent workouts found for this friend.</Text>
              )}
            </View>
          ))}
        </ScrollView>
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
  headerContainer: {
    flex: 0.5,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'teal',
    borderBottomColor: 'white',
    borderBottomWidth: 2
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

export default Feed;
