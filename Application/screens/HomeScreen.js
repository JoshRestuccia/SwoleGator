import React, {useState, useEffect} from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

import { useFirestore } from '../api/firestore/FirestoreAPI';

const HomeScreen = ({navigation}) =>{
    const {
      currentUser,
      getUserData,
    } = useFirestore();
    
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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
            <View style={styles.title}>
              <Text style={styles.welcome}>{`WELCOME BACK, ${userData?.first}`} </Text>
            </View>
            <View style={styles.container}>
              <TouchableOpacity onPress={() => navigation.navigate('PairDevice')} style={styles.button}>
                <Text style={styles.textStyle}>Connect</Text>
              </TouchableOpacity>
            </View>
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
      backgroundColor: '#272727'
    },
    container:{
      justifyItems: 'center',
      height:'auto',
      flexDirection:'column',
    },
    swoleGator: {
      fontFamily: 'Anta-Regular',
      color: 'white',
      fontSize: 60,
      marginTop: 50,
    },
    welcome :{
      fontFamily: 'Oswald-Regular',
      textTransform: 'uppercase',
      color: 'white',
      fontSize: 30,
    },
      textInput:{
        borderBottomColor:'grey',
        borderBottomWidth: 1,
        fontSize:18,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
    },
    button:{
      alignItems: 'center',
      backgroundColor: 'black',
      borderRadius: 30,
      padding:5,
      marginLeft:100,
      marginRight: 100,
      marginTop: 175,
      marginBottom: 10,
      height: 45,
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
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 35,
      height:180
    },
    titleText:{
      textAlign:'center',
      fontSize: 30,
      width:250
    }
  })
export default HomeScreen;
