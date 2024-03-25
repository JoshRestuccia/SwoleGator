import React, {useState, useEffect} from 'react';
import {StyleSheet, Modal, View, Image, Text, FlatList, TouchableHighlight, TouchableOpacity, TextInput} from 'react-native';
import { useFirestore } from '../api/firestore/FirestoreAPI';
import UserSettings from './UserSettings';
import SettingsScreen from './Settings';
import StatLine from '../components/StatLine';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile({navigation}) {
    const [isSettingsVisible, setSettingsVisible] = useState(false);
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
    return (
      <TouchableOpacity onPress={() => navigation.navigate('Friend Workout', {friend: {uid: item.uid, username: item.username}})}>
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
    <SafeAreaView style={styles.screenSetup}>         
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
                      <Text style={styles.textStyle}>{`${userData?.username}`}</Text>
                    </View>
                   
                    </View>
                  {/*<Text>{`Age: ${userData?.age}`}</Text>*/}
                  <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('Workouts')}>
                          <Text style={styles.total}>{`Manage Visibility`}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.settings} onPress={openSettings}>
                    <Text style={styles.settingsText}> Settings </Text>
                  </TouchableOpacity>
                  <StatLine header={`Squat Sessions`} body={squats}/>
                  <StatLine header={`Deadlift Sessions`} body={deadlifts}/>
                  <StatLine header={`Bench Press Sessions`} body={presses}/>
                  <StatLine header={`Barbell Curl Sessions`} body={curls}/> 
                  <View style={styles.totalContainer}>
                      <Text style={styles.total}>Total Lifts</Text>
                      <Text style={styles.textStyle2}>{`${total}`}</Text>
                  </View>
                  <View style={styles.friendsContainer}>
                      <Text style={styles.total}>Friends</Text>
                      <Text style={styles.textStyle2}>{`${friends? friends.length : 0}`}</Text>
                    </View>
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

const boxShadow = {
  shadowColor: 'black',
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0.25,
  shadowRadius: 1.84,
  elevation: 4,
};
const styles = StyleSheet.create({
  screenSetup:{
    flex: 1,
    backgroundColor: '#272727',
    alignItems: 'center',
  },
  button:{
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 30,
    padding:5,
    marginTop: 45,
    marginBottom: 10,
    height: 45,
    width: 250,
    ...boxShadow,
  },
  settings:{
    position: 'absolute',
    left: 320,
    top: 5,
  },
  settingsText:{
    fontSize: 15,
    color:'white',
    textTransform: 'uppercase',
    fontFamily: 'Oswald-Regular',
  },
  textStyle:{
    color: 'white',
    textTransform: 'uppercase',
    fontFamily: 'Oswald-Regular',
    fontSize: 32,
  },
  textStyle2:{
    color: 'red',
    alignSelf: 'center',
    textTransform: 'uppercase',
    fontFamily: 'Oswald-Regular',
    fontSize: 32,
  },
  title:{
    marginTop: 25,
    height:180
  },
  titleText:{
    textAlign:'center',
    fontSize: 30,
    textTransform: 'uppercase',
    fontFamily: 'Oswald-Regular',
    color: 'white',
    margin: 50,
  },
    container: {
      display: 'flex',
      height: '100%',
      width: '100%',
      flexDirection: 'column',
      alignContent: 'center',
      backgroundColor: 'gray'
    },
    totalContainer:{
      position: 'absolute',
      top: 100, // Adjust as needed
      left: 130, // Adjust as needed
      width: 120,
      height: 90,
      backgroundColor: '#272727', // Background color of the top view
      ...boxShadow,
    },
    friendsContainer:{
      position: 'absolute',
      top: 100, // Adjust as needed
      left: 260, // Adjust as needed
      width: 120,
      height: 90,
      backgroundColor: '#272727', // Background color of the top view
      ...boxShadow,
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
    },
    userInfoHeader: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: 150,
      backgroundColor: 'black',
      justifyContent: 'space-evenly'
    },
    profileImage: {
      position: 'absolute',
      top: 20, // Adjust as needed
      left: 10, // Adjust as needed
      width: 120,
      width: 100,
      height: 100,
      backgroundColor: '#272727',
      borderColor: 'black',
      borderWidth: 5,
      borderRadius: 100,
      marginTop: 10,

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
      position: 'absolute',
      left: 175,
      top: 30,
      width: '100%',
      flex: 0.7,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
    },
    userName: {
      fontSize: 30,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    total: {
      alignSelf: 'center',
      fontSize: 20,
      textTransform: 'uppercase',
      color: 'white',
      fontFamily: 'Oswald-Regular',
      textAlign: 'center',
    },
    smallButton: {
      width: 250,
      height: 50,
      marginTop: 50,
      marginBottom: 25,
      backgroundColor: 'black',
      borderRadius: 25,
      padding: 10,
      ...boxShadow,
    },
    smallButtonText: {
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: 15,
    },
    friendInfoContainer:{
      flex: 0.6,
      marginTop: 280,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'black',
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      padding: 20
    },
    friendsHeader: {
      display: 'flex',
      color: 'white',
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
      color: 'white',
    },
    addFriends:{
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'darkred',
      borderRadius: 100,
      width: 50,
      height: 50,
      alignSelf: 'center'
    },
    buttonText: {
      color: '#fff', // White color for text
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 30,
      margin: 0
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