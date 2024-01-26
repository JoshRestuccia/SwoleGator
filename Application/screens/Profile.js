import React, {useState, useEffect} from 'react';
import {StyleSheet, Modal, View, Image, Text, FlatList, TouchableHighlight, TouchableOpacity, TextInput} from 'react-native';
import { useFirestore } from '../api/firestore/FirestoreAPI';
import SettingsScreen from './Settings';
import FriendPrompt from './FriendPrompt';

export default function Profile({navigation}) {
    const [isSettingsVisible, setSettingsVisible] = useState(false);
    const [friendPromptVisible, setFriendPromptVisible] = useState(false);
    const [userData, setUserData] = useState(null);
    const [friends, setFriends] = useState([]);

    const {
      currentUser,
      getUserData,
      getFriendData,
      getFriends,
    } = useFirestore();

    const openSettings = () => {
      setSettingsVisible(true);
    };

    const closeSettings = () => {
      setSettingsVisible(false);
    };

    const openFriendPrompt = () => {
      setFriendPromptVisible(true);
    };

    const closeFriendPrompt = () => {
      setFriendPromptVisible(false);
    }
    
    const renderItem = ({friend}) => {
      const friendData = getFriendData(friend.uid);
      return(
        <TouchableHighlight>
          <View>
            {/* <Image src={{uri: friendData.profileImage }} style={styles.profileImage}/> */}
            <Text style={styles.username}>{friendData.username}</Text>
          </View>
        </TouchableHighlight>
      );
    };

    useEffect(() => {
      const fetchUserData = async() => {
        try{
          const userDataFirestore = await getUserData();
          setUserData(userDataFirestore);
        }catch(error){
          throw error;
        }
      };
      if(currentUser){
        fetchUserData();
      }
      const fetchFriends = async() => {
        try{
          const fr = await getFriends();
          setFriends(fr);
        }catch(error){
          throw error;
        }
      }
      fetchFriends();
    }, [currentUser, getUserData, getFriends]);

    return(
    <View style={styles.container}>
        {/* Settings Button */}
        <TouchableOpacity style={styles.settingsButton} onPress={openSettings}>
          <Text style={styles.buttonText}> Settings </Text>
        </TouchableOpacity>
        {/* User profile image */}
        {/*<Image source={{ uri: userData.imageUrl }} style={styles.profileImage} />*/}
        {/* User details */}
        <View style={styles.userInfo}>
            <Text style={styles.userName}>{`Username: ${userData?.username}`}</Text>
            <Text>{`Age: ${userData?.age}`}</Text>
            <Text>{`Workouts Completed: ${userData?.workoutsCompleted}`}</Text>
        </View>
        {/* Friends Info */}
        <View style={styles.friendsInfo}>
          {(friends.length !== 0) ? 
            (<FlatList
              data={friends}
              keyExtractor={(friend,index) => index.toString()}
              renderItem={renderItem}
            />) : 
            (
              <View>
                <Text>No friends to show</Text>
              </View>
            )
          }
          <TouchableOpacity style={styles.addFriends}onPress={openFriendPrompt}>
            <Text>Add Friends</Text>
          </TouchableOpacity>
        </View>
        {/* Settings Screen Modal */}
        <Modal
          visible={isSettingsVisible}
          transparent={false}
          onRequestClose={closeSettings}
        >
          <SettingsScreen onClose={closeSettings}/>
        </Modal>
        {/* Friend Prompt Modal */}
        <Modal
          visible={friendPromptVisible}
          transparent={true}
          onRequestClose={closeFriendPrompt}
          style={styles.modal}
        >
          <FriendPrompt/>
        </Modal>
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
    addFriends:{
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      backgroundColor: '#0a398a',
      margin: 10,
      borderRadius: 12,
    },
    settingsButton: {
      backgroundColor: '#3498db', // Blue color (adjust as needed)
      padding: 10,
      borderRadius: 8,
      marginTop: 20,
    },
    buttonText: {
      color: '#fff', // White color for text
      textAlign: 'center',
      fontWeight: 'bold',
    },
});
