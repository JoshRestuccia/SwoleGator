import React, {useState, useEffect} from 'react';
import { useFirestore } from '../api/firestore/FirestoreAPI';
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

const UserSettings = ({navigation}) =>{
    const {
        currentUser,
        getUserData,
        signOut
      } = useFirestore();
      
      const [userData, setUserData] = useState(null);
      const [isLoading, setIsLoading] = useState(true);
  
      const pressLogOut = async() => {
        console.log('Signout button pressed.');
        try{
          await signOut();
          // Reset Navigation Stack
          navigation.reset({
            index: 0,
            routes: [{name: 'Guest Stack', params:{screen: 'Landing'}}]
          });
        }catch(error){
          console.error('Error signing out...');
        }
      };
  
      useEffect(() => {
        const fetchData = async() => {
          try{
            if(currentUser){
              const userDataFirestore = await getUserData();
              setUserData(userDataFirestore);
              setIsLoading(false);
            }
          }catch(err){
            console.error(err);
          }
        };
        fetchData();
      }, [currentUser]);
  
    return(
        <View style={styles.screenSetup}>
          <Text style={styles.titleText}>Settings</Text>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.textStyle}> Change Profile Photo </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={pressLogOut}>
                <Text style={styles.textStyle}> Log Out </Text>
            </TouchableOpacity>
        </View>
    );
};

const boxShadow = {
  shadowColor: 'lightgrey',
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
    textStyle:{
      color: 'white',
      textTransform: 'uppercase',
      fontFamily: 'Oswald-Regular',
      fontSize: 18,
      alignItems: 'center',
      justifyContent: 'center',
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
    }
  })

export default UserSettings;