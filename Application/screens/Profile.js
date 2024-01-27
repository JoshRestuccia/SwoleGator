import React, {useState, useEffect} from 'react';
import {StyleSheet, Modal, View, Image, Text, FlatList, TouchableHighlight, TouchableOpacity, TextInput} from 'react-native';
import { useFirestore } from '../api/firestore/FirestoreAPI';
import SettingsScreen from './Settings';

export default function Profile({navigation}) {
    const [isLoading, setIsLoading] = useState(true);
    const [isSettingsVisible, setSettingsVisible] = useState(false);
    const [friendPromptVisible, setFriendPromptVisible] = useState(false);
    const [userData, setUserData] = useState(null);

    const {
      friends,
      setFriends,
      currentUser,
      getUserData,
      friendsFromDatabase,
      addFriend
    } = useFirestore();

    const FriendPrompt = () => {
      const [isLoading, setIsLoading] = useState(false);
      const [friendEmail, setFriendEmail] = useState('');
      
      const handleSubmitFriendEmail = async() => {
        if(friendEmail){
          try{
            setIsLoading(true);
            console.log('[Profile:FriendPrompt] Adding friend!');
            await addFriend(friendEmail);
            setFriendEmail('');
            closeFriendPrompt();
            setIsLoading(false);
          }catch(error){
            console.error(error);
            setIsLoading(false);
          }
        } else { 
          console.warn('Cannot add friend. Email is empty');
        }
      };

      useEffect(() => {
        console.log(`FriendEmail: ${friendEmail}`);
      }, [friendEmail]);
    
      return(
        <View>
          <View style={popup.modelContainer}>
            <View style={popup.modalContent}>
              <Text style={popup.headerText}> Join Your Friends! </Text>
              <Text style={popup.subheaderText}> Enter your friends email below </Text>
              <TextInput
                style={popup.textInput}
                placeholder='Friends Email'
                onChangeText={setFriendEmail}
                secureTextEntry={false}
                value={friendEmail}
              />
              <TouchableOpacity 
                style={popup.joinButton} 
                onPress={handleSubmitFriendEmail}
              >
                <Text style={popup.buttonText}> Make Friends! </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    };

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
    
    const renderItem = async ({item: friend}) => {
      if(!friend) return null;
      return(
        <TouchableHighlight>
          <View>
            {/* <Image src={{uri: friendData.profileImage }} style={styles.profileImage}/> */}
            <Text style={styles.userName}>{friend.username}</Text>
            <Text style={styles.userName}>Friends Since: {friend.friendedDate}</Text>
          </View>
        </TouchableHighlight>
      );
    };

    useEffect(() => {
      const fetchData = async() => {
        try{
          if(currentUser){
            const userDataFirestore = await getUserData();
            setUserData(userDataFirestore);
            const tempFriends = await friendsFromDatabase();
            setFriends(tempFriends);
            setIsLoading(false);
          }
        }catch(err){
          console.error(err);
        }
      };
      fetchData();
    }, [currentUser]);

    return(
    <View style={styles.container}>
        {/* Settings Button */}        
        <TouchableOpacity style={styles.settingsButton} onPress={openSettings}>
          <Text style={styles.buttonText}> Settings </Text>
        </TouchableOpacity>          
        {/* User profile data */}
        <View style={styles.userInfo}>
            {/*<Image source={{ uri: userData.imageUrl }} style={styles.profileImage} />*/}
            <Text style={styles.userName}>{`${userData?.username}`}</Text>
            <Text>{`Age: ${userData?.age}`}</Text>
            <Text>{`Workouts Completed: ${userData?.workoutsCompleted}`}</Text>
        </View>
        {/* Friends Data */}
        <View style={styles.friendsInfo}>
          <Text style={styles.friendsHeader}> Friends </Text>
            {isLoading ? 
              <Text>Loading friends...</Text> 
              : friends && (friends.length !== 0) ? 
                <FlatList
                  data={friends}
                  keyExtractor={(item) => item.id}
                  renderItem={renderItem}
                /> 
              : <View>
                  <Text>No friends to show</Text>
                </View>
            }
          <TouchableOpacity style={styles.addFriends}onPress={openFriendPrompt}>
            <Text style={styles.buttonText}>Add Friends</Text>
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
        >
          <FriendPrompt/>
        </Modal>
    </View>
    )
};


const styles = StyleSheet.create({
    container: {
      flex: 2,
      alignItems: 'center',
    },
    profileImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginBottom: 20,
    },
    userInfo: {
      flex:1,
      flexDirection: 'column',
      alignItems: 'center',
    },
    userName: {
      fontSize: 30,
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
      width: 200,
      height: 50,
    },
    settingsButton: {
      backgroundColor: '#3498db', // Blue color (adjust as needed)
      padding: 10,
      borderRadius: 8,
      marginTop: 15,
      alignSelf:'flex-end',
      marginRight: 15
    },
    buttonText: {
      color: '#fff', // White color for text
      textAlign: 'center',
      fontWeight: 'bold',
    },
    friendsInfo: {
      flex: 2,
      flexDirection: 'column',
      height: '20%',
      width: '100%',
      backgroundColor: 'lightblue',
      borderRadius: 12,
      alignItems: 'center'
    },
    friendsHeader:{
      fontSize: 40,
      fontWeight: 'bold',
      marginBottom: 10,
    }
});


const popup = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    width:'80%',
    height: '40%'
  },
  modalContent: {
    backgroundColor: '#fff', // White background
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheaderText: {
    fontSize: 16,
    marginBottom: 15,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  joinButton: {
    backgroundColor: '#3498db', // Blue color (adjust as needed)
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // White color for text
    fontWeight: 'bold',
  },
});