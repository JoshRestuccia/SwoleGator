import React, {useState, useEffect} from 'react';
import {StyleSheet, Modal, View, Image, Text, FlatList, TouchableHighlight, TouchableOpacity, TextInput} from 'react-native';
import { useFirestore } from '../api/firestore/FirestoreAPI';
import SettingsScreen from './Settings';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile({navigation}) {
    const [isSettingsVisible, setSettingsVisible] = useState(false);
    const [friendPromptVisible, setFriendPromptVisible] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(true);

    const [squats, setSquats] = useState(0);
    const [presses, setPresses] = useState(0);
    const [curls, setCurls] = useState(0);
    const [deadlifts, setDeadlifts] = useState(0);
    const [total, setTotal] = useState(0);

    const {
      friends,
      currentUser,
      getUserData,
      addFriend,
      isFriendsLoading,
      getNumberWorkoutsOfType,
      getTotalNumOfWorkouts
    } = useFirestore();

    useEffect(() => {
      const updateWorkoutData = async () => { 
        try{
          let n = await getNumberWorkoutsOfType('Squat');
          setSquats(n || 0);
          n = await getNumberWorkoutsOfType('Bench Press');
          setPresses(n || 0);
          n = await getNumberWorkoutsOfType('Barbell Curl');
          setCurls(n || 0);
          n = await getNumberWorkoutsOfType('Deadlift');
          setDeadlifts(n || 0);  
          n = await getTotalNumOfWorkouts();
          setTotal(n || 0);
        }catch(err){
          throw err;
        }
      };
      return(async () => {
        setIsDataLoading(true);
        await updateWorkoutData();
        setIsDataLoading(false);
      });
    }, [userData])

    const FriendPrompt = () => {
      const [friendEmail, setFriendEmail] = useState('');
      
      const handleSubmitFriendEmail = async() => {
        if(friendEmail){
          try{
            console.log('[Profile:FriendPrompt] Adding friend!');
            await addFriend(friendEmail);
            setFriendEmail('');
            closeFriendPrompt();
          }catch(error){
            console.error(error);
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
    
const renderItem = ({ item }) => {
  if (item) {
    console.log('Friend being rendered: ', item.email);
    return (
      <TouchableOpacity onPress={() => navigation.navigate('FriendWorkout', { friend: { uid: item.uid, username: item.username } })}>
        <View style={styles.friendBadge}>
          <Text style={styles.friendText}>{item.username}</Text>
          <Text style={styles.friendText}>{item.friendedDate}</Text>
        </View>
      </TouchableOpacity>
    );
  } else {
    return null;
  }
};

    useEffect(() => {
      const fetchData = async() => {
        try{
          if(currentUser){
            const userDataFirestore = await getUserData();
            setUserData(userDataFirestore);

            console.log('Friends:', friends);
          }
        }catch(err){
          console.error(err);
        }
      };
      fetchData();
    }, [currentUser, friends]);

    return(
    <SafeAreaView style={styles.container}>
        {/* Settings Button */}        
        <TouchableOpacity style={styles.settingsButton} onPress={openSettings}>
          <Text style={styles.buttonText}> Settings </Text>
        </TouchableOpacity>          
        {/* User profile data */}
        {isDataLoading ? 
          ( <View style={styles.userInfo}>
              <Text style={styles.userName}>{`${userData?.username}`}</Text>
              <Text> Loading Data... </Text>
            </View>)
        :
          ( <View  style={styles.userInfo}>
              {/*<Image source={{ uri: userData.imageUrl }} style={styles.profileImage} />*/}
              <Text style={styles.userName}>{`${userData?.username}`}</Text>
              {/*<Text>{`Age: ${userData?.age}`}</Text>*/}
              <Text>{`Workouts Completed: ${total}`}</Text>
              <Text>{`Squats Sessions: ${squats}`}</Text>
              <Text>{`Deadlift Sessions: ${deadlifts}`}</Text>
              <Text>{`Bench Press Sessions: ${presses}`}</Text>
              <Text>{`Barbell Curl Sessions: ${curls}`}</Text>
            </View>)
        }
        {/* Friends Data */}
        <View style={styles.friendsInfo}>
          <Text style={styles.friendsHeader}> Friends </Text>
            {isFriendsLoading ? 
              <Text>Loading friends...</Text> 
              : friends && (friends.length !== 0) ? 
                <FlatList
                  data={friends}
                  keyExtractor={(item) => item.uid}
                  renderItem={renderItem}
                  contentContainerStyle={{rowGap: 12}}
                />
              : <View>
                  <Text style={styles.noFriendsText}>No friends to show</Text>
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
    </SafeAreaView>
    )
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    },
    profileImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginBottom: 20,
    },
    userInfo: {
      flex:2,
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
      alignSelf: 'center'
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
      width:'100%',
      backgroundColor: 'lightblue',
      borderRadius: 12,
      justifyContent: 'flex-start',
    },
    friendsHeader:{
      fontSize: 40,
      fontWeight: 'bold',
      marginBottom: 10,
      alignSelf: 'center'
    },
    friendBadge: {
      width: '75%',
      padding: 20,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      backgroundColor: 'white', // Add a contrasting background color
      alignSelf: 'center'
    },
    friendName:{
      fontSize: 15,
      fontWeight: 'bold',
      color: 'gray'
    },
    row: {
      marginLeft: 10,
      marginRight: 10,
      borderRadius: 20,
    },
    friendText: {
      fontSize: 14,
      fontWeight: '300',
      color: 'black'
    },
    noFriendsText:{
      fontSize: 14,
      fontWeight: '300',
      color: 'black',
      alignSelf: 'center'
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