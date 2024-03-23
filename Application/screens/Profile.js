import React, {useState, useEffect} from 'react';
import {StyleSheet, Modal, View, Image, Text, FlatList, TouchableHighlight, TouchableOpacity, TextInput} from 'react-native';
import { useFirestore } from '../api/firestore/FirestoreAPI';
import SettingsScreen from './Settings';
import StatLine from '../components/StatLine';
import SettingsScreen from './UserSettings';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile({navigation}) {
    const [isLoading, setIsLoading] = useState(true);
    const [friendPromptVisible, setFriendPromptVisible] = useState(false);
    const [userData, setUserData] = useState(null);
    const [friends, setFriends] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [updateKey, setUpdateKey] = useState(true);
    const [friendUpdateFlag, setFriendUpdateFlag] = useState(false);

    const [squats, setSquats] = useState(0);
    const [presses, setPresses] = useState(0);
    const [curls, setCurls] = useState(0);
    const [deadlifts, setDeadlifts] = useState(0);
    const [total, setTotal] = useState(0);

    const {
      currentUser,
      getUserData,
      addFriend,
      isFriendsLoading,
      getNumberWorkoutsOfType,
      getTotalNumOfWorkouts,
      friendsFromDatabase
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
            setFriendUpdateFlag(true);
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
        <View style={popup.modalContainer}>
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
      );
    };
    const openFriendPrompt = () => {
      setFriendPromptVisible(true);
    };

    const closeFriendPrompt = () => {
      setFriendPromptVisible(false);
    }
    
const renderItem = ({ item }) => {
  if (item) {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('User Stack', { screen:'FriendWorkout', params: { friend: { uid: item.uid, username: item.username } }})}>
        <View style={styles.friendBadge}>
          <View style={styles.friendImage}>
            <Image style={styles.smallProfileImage} source={{uri: item.profile_pic}} />
          </View>
          <View style={styles.friendBadgeBody}>
            <Text style={styles.friendName}>{item.username}</Text>
            <Text style={styles.friendText}>{`Friends Since: ${item.friendsSince}`}</Text>
          </View>
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
            const temp_friends = await friendsFromDatabase();
            setFriends(temp_friends);
          }
        }catch(err){
          console.error(err);
        }
      };
      fetchData();
    }, [currentUser]);

    useEffect(() => {
      const fetchFriends = async() => {
        const tempFriends = await friendsFromDatabase();
        setFriends(tempFriends);
        setUpdateKey(!updateKey);
      }
      if(friendUpdateFlag === true){
        fetchFriends();
        setFriendUpdateFlag(false);
      }
    },[friendUpdateFlag]);

    return(
    <SafeAreaView style={styles.container}>
        {/* Settings Button */}        
        <TouchableOpacity style={styles.settingsButton} onPress={openSettings}>
          <Text style={{fontSize: 15}}> Settings </Text>
        </TouchableOpacity>          
        {/* User profile data */}
        <View style={styles.userInfoContainer}>
            {isDataLoading ? 
              ( <View style={styles.userInfo}>
                  <Text style={styles.userName}>{`${userData?.username}`}</Text>
                  <Text> Loading Data... </Text>
                </View>)
            :
              ( <View  style={styles.userInfo}>
                  <View style={styles.userInfoHeader}>
                    <Image source={{ uri: userData.profile_pic }} style={styles.profileImage} />
                    <View style={styles.userInfoHeaderRight} >
                      <Text style={styles.userName}>{`${userData?.username}`}</Text>
                      <Text style={styles.total}>{`Total: ${total}`}</Text>
                      <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('User Stack', {screen: 'ManageWorkouts'})}>
                          <Text style={styles.smallButtonText}>{`Manage Workouts`}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {/*<Text>{`Age: ${userData?.age}`}</Text>*/}
                  <StatLine header={`Squat Sessions`} body={squats}/>
                  <StatLine header={`Deadlift Sessions`} body={deadlifts}/>
                  <StatLine header={`Bench Press Sessions`} body={presses}/>
                  <StatLine header={`Barbell Curl Sessions`} body={curls}/>
                </View>)
            }
        </View>
        {/* Friends Data */}
        <View style={styles.friendInfoContainer}>
            <View style={styles.friendsHeader}>
              <Text style={styles.friendsHeaderText}>{`Friends (${friends? friends.length : 0})`}</Text>
              <TouchableOpacity style={styles.addFriends} onPress={openFriendPrompt}>
                <Text style={styles.buttonText}>{` + `}</Text>
              </TouchableOpacity>
            </View>
          {isFriendsLoading ? 
            <Text>Loading friends...</Text> 
            : friends && (friends.length !== 0) ? 
              <FlatList
                key={updateKey}
                data={friends}
                keyExtractor={(item) => item.uid}
                renderItem={renderItem}
                contentContainerStyle={{rowGap: 12}}
              />
            : <View>
                <Text style={styles.noFriendsText}>No friends to show</Text>
              </View>
          }
        </View>
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
      display: 'flex',
      height: '100%',
      width: '100%',
      flexDirection: 'column',
      alignContent: 'center',
      backgroundColor: 'gray'
    },
    userInfoContainer:{
      flex: 0.7,
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
    },
    userInfo: {
      width: '100%',
      alignItems: 'center',
      backgroundColor: 'black',
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
      justifyContent: 'space-evenly',
    },
    userInfoHeader: {
      display: 'flex',
      flexDirection: 'row',
      width: '90%',
      backgroundColor: 'gray',
      justifyContent: 'space-evenly'
    },
    profileImage: {
      alignContent: 'center',
      alignSelf: 'flex-start',
      width: 120,
      height: 120,
      backgroundColor: 'gray',
      borderColor: 'black',
      borderWidth: 5,
      borderRadius: 25,
      margin: 20,
    },
    smallProfileImage: {
      alignContent: 'center',
      alignSelf: 'flex-start',
      width: 50,
      height: 50,
      backgroundColor: 'gray',
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: 10,
      margin: 5,
    },
    userInfoHeaderRight: {
      width: '100%',
      flex: 0.7,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
    },
    userName: {
      alignSelf: 'center',
      fontSize: 30,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    total: {
      alignSelf: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    smallButton: {
      width: '100%',
      flex: 0.3,
      backgroundColor: 'lightblue',
      borderRadius: 25,
      padding: 10
    },
    smallButtonText: {
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: 15,
    },
    friendInfoContainer:{
      flex: 0.6,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'lightblue',
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      padding: 20
    },
    settingsButton: {
      backgroundColor: '#272727',
      padding: 10,
      borderRadius: 8,
      marginTop: 15,
      alignSelf:'flex-end',
      marginRight: 15
    },
    friendsHeader: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      alignSelf: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
      borderRadius: 25
    },
    friendsHeaderText: {
      flex: 0.6,
      fontSize: 30,
      fontWeight: 'bold',
      margin: 10,
      textAlign: 'left',
    },
    addFriends:{
      flex: 0.2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0a398a',
      borderRadius: 25,
      width: 200,
      height: 50,
      alignSelf: 'center'
    },
    buttonText: {
      color: 'white', 
      textAlign: 'center',
      fontSize: 20,
      textTransform: 'uppercase',
      fontFamily: 'Oswald-Regular',
    },
    friendsInfo: {
      flex: 2,
      width:'100%',
      backgroundColor: '#272727',
      borderRadius: 12,
      justifyContent: 'flex-start',
    },
    friendsHeader:{
      fontSize: 40,
      fontFamily: 'Oswald-Regular',
      textTransform: 'uppercase',
      color: 'white',
      marginBottom: 10,
      alignSelf: 'center',
      marginTop: 30,
    },
    friendBadge: {
      display: 'flex',
      flexDirection: 'row',
      width: '80%',
      padding: 10,
      borderRadius: 25,
      backgroundColor: 'white', // Add a contrasting background color
      alignSelf: 'center',
      justifyContent: 'space-evenly'
    },
    friendImage:{
      flex: 0.2
    },
    friendBadgeBody:{
      flex: 0.8,
      paddingLeft: 20
    },
    friendName:{
      textAlign: 'left',
      fontSize: 25,
      fontWeight: 'bold',
      color: 'white'
    },
    row: {
      marginLeft: 10,
      marginRight: 10,
      borderRadius: 20,
    },
    friendText: {
      fontSize: 14,
      fontWeight: '300',
      color: 'white'
    },
    noFriendsText:{
      fontSize: 14,
      fontWeight: '300',
      color: 'white',
      marginBottom: 20,
      alignSelf: 'center'
    }
});


const popup = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#fff', // White background
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  headerText: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheaderText: {
    textAlign: 'center',
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