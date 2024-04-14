import React, {useState, useEffect} from 'react';
import {StyleSheet, Modal, View, Image, Text, FlatList, Button, TouchableHighlight, TouchableOpacity, TextInput} from 'react-native';
import { useFirestore } from '../api/firestore/FirestoreAPI';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Friends({navigation}) {
    const [friendPromptVisible, setFriendPromptVisible] = useState(false);
    const [userData, setUserData] = useState(null);
    const [friends, setFriends] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [updateKey, setUpdateKey] = useState(true);
    const [friendUpdateFlag, setFriendUpdateFlag] = useState(false);

    const {
      currentUser,
      getUserData,
      addFriend,
      isFriendsLoading,
      getNumberWorkoutsOfType,
      getTotalNumOfWorkouts,
      friendsFromDatabase
    } = useFirestore();

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
              <TouchableOpacity onPress={closeFriendPrompt} style={styles.closeFriend}>
                  <Text style={styles.close}>X</Text>
              </TouchableOpacity>
              <Text style={popup.headerText}> Join Your Friends! </Text>
              <Text style={popup.subheaderText}> Enter your friend's email below </Text>
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
            setIsDataLoading(true);
            const userDataFirestore = await getUserData();
            setUserData(userDataFirestore);
            const temp_friends = await friendsFromDatabase();
            setFriends(temp_friends);
            setIsDataLoading(false);
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
    <View style={styles.screenSetup}>         
        {isDataLoading ? 
          ( <View style={styles.userInfo}>
              <Text style={styles.userName}>{`${userData?.username}`}</Text>
              <Text> Loading Data... </Text>
            </View>)
        :
          (   
          <View style={styles.friends}>
            <View style={styles.friendsHeader}>
              <Text style={styles.friendsHeaderText}>{`Friends (${friends? friends.length : 0})`}</Text>
              <TouchableOpacity style={styles.addFriends} onPress={openFriendPrompt}>
                <Text style={styles.buttonText}>{`+`}</Text>
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
            <Modal
            visible={friendPromptVisible}
            transparent={true}
            onRequestClose={closeFriendPrompt}>
                  <FriendPrompt/>
            </Modal>
        </View>)
        }
    </View>
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
  textStyle:{
    color: 'white',
    textTransform: 'uppercase',
    fontFamily: 'Oswald-Regular',
    fontSize: 32,
  },
  closeFriend:{
    backgroundColor: 'white',
    alignContent: 'end', 
    justifyContent: 'flex-end',
    fontSize: 32,
    width: 20,
  },
  join:{
    backgroundColor: 'darkred',
    alignItems: "center",
  },
  close:{
    color: 'black',
    justifyContent: 'flex-start',
    fontSize: 20,
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
  friends: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
  },
    friendsHeader: {
      flex: 0.2,
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: 15,
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'white',
      alignSelf: 'center',
      marginBottom: 20,
    },
    friendsHeaderText: {
      fontSize: 40,
      fontFamily: 'Oswald-Regular',
      margin: 10,
      textAlign: 'center',
      color: 'white',
    },
    addFriends:{
        backgroundColor: 'darkred',
        borderRadius: 15,
        width: 65,
        height: 65,
    },
    buttonText: {
      fontFamily: 'Oswald-Regular',
      color: 'white', // White color for text
      fontSize: 38,
      textAlign: 'center',
      textAlignVertical: 'center'
    },
    friendBadge: {
      display: 'flex',
      flexDirection: 'row',
      width: '95%',
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
      color: 'white',
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
    backgroundColor: 'darkred', // Blue color (adjust as needed)
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // White color for text
    fontWeight: 'bold',
  },
});