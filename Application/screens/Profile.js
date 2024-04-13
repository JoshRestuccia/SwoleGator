import React, {useState, useEffect} from 'react';
import {StyleSheet, Modal, View, Image, Text, TouchableOpacity, FlatList} from 'react-native';
import { useFirestore } from '../api/firestore/FirestoreAPI';
import SettingsScreen from './Settings';
import StatLine from '../components/StatLine';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile({navigation}) {
    const {
      currentUser,
      getUserData,
      getNumberWorkoutsOfType,
      getTotalNumOfWorkouts,
      friendsFromDatabase,
      getMostRecentOfEachType
    } = useFirestore();
    const [isSettingsVisible, setSettingsVisible] = useState(false);
    const [userData, setUserData] = useState(null);
    const [friends, setFriends] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    const [squats, setSquats] = useState(0);
    const [presses, setPresses] = useState(0);
    const [curls, setCurls] = useState(0);
    const [deadlifts, setDeadlifts] = useState(0);
    const [total, setTotal] = useState(0);


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

    const openSettings = () => {
      setSettingsVisible(true);
    };
    const closeSettings = () => {
      setSettingsVisible(false);
    };
    const handleWorkoutTypePress = (type) => {
      navigation.navigate('Workouts Of Type', {
        type: type
      })
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
                  <StatLine header={`Squat Sessions`} body={squats} onPress={() => handleWorkoutTypePress('Squat')}/>
                  <StatLine header={`Deadlift Sessions`} body={deadlifts} onPress={() => handleWorkoutTypePress('Deadlift')}/>
                  <StatLine header={`Bench Press Sessions`} body={presses} onPress={() => handleWorkoutTypePress('Bench Press')}/>
                  <StatLine header={`Barbell Curl Sessions`} body={curls} onPress={() => handleWorkoutTypePress('Barbell Curl')}/> 

                  <View style={styles.totalContainer}>
                      <Text style={styles.total}>Total Lifts</Text>
                      <Text style={styles.textStyle2}>{`${total}`}</Text>
                  </View>
                  <TouchableOpacity style={styles.friendsContainer} onPress={() =>navigation.navigate('Friends')}>
                      <Text style={styles.total}>Friends</Text>
                      <Text style={styles.textStyle2}>{`${friends? friends.length : 0}`}</Text>
                  </TouchableOpacity>
                </View>)
            }
        </View>

        {/* Settings Screen Modal */}
        <Modal
          visible={isSettingsVisible}
          transparent={false}
          onRequestClose={closeSettings}
        >
          <SettingsScreen onClose={closeSettings} navigation={navigation}/>
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
    justifyContent: 'space-between'
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
      borderRadius: 10,
      ...boxShadow,
    },
    friendsContainer:{
      position: 'absolute',
      top: 100, // Adjust as needed
      left: 260, // Adjust as needed
      width: 120,
      height: 90,
      backgroundColor: '#272727', // Background color of the top view
      borderRadius: 10,
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
      flexDirection: 'column'
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
      borderRadius: 15,
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
      left: 150,
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
      textAlign: 'left',
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
      borderRadius: 10,
      padding: 10,
      ...boxShadow,
    },
    smallButtonText: {
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: 15,
    },
    friendInfoContainer:{
      flex: 0.25,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      backgroundColor: 'black',
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      paddingHorizontal: 20
    },
    friendsHeader: {
      flex: 0.5,
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      alignSelf: 'center',
      justifyContent: 'space-between',
      alignContent: 'center',
      borderRadius: 25
    },
    friends: {
      flex: 0.3,
      margin: 0,
      padding: 0
    },
    friendsHeaderText: {
      fontFamily: 'Oswald-Regular',
      flex: 0.6,
      fontSize: 30,
      margin: 10,
      textAlign: 'left',
      color: 'white',
    },
    addFriends:{
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'darkred',
      borderRadius: 15,
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
      backgroundColor: 'lightgray', // Add a contrasting background color
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
      fontFamily: 'Oswald-Regular',
      textAlign: 'left',
      fontSize: 25,
      color: '#272727'
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