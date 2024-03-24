import React, {useState} from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import PhotoSelector from "./PhotoSelector";

const UserSettings = ({navigation}) =>{
      const [photoSelectorVisibility, setPhotoSelectorVisibility] = useState(false);

      const closePhotoSelect = () => {
          setPhotoSelectorVisibility(false);
      }
      const openPhotoSelect = () => {
          setPhotoSelectorVisibility(true);
      }
  

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
  
    return(
        <View style={styles.screenSetup}>
          <Text style={styles.titleText}>Settings</Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={openPhotoSelect}>
                <Text style={styles.textStyle}> Change Profile Photo </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={pressLogOut}>
                <Text style={styles.textStyle}> Log Out </Text>
            </TouchableOpacity>
          </View>
          <PhotoSelector isVisible={photoSelectorVisibility} onClose={closePhotoSelect}/>
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
    },
    buttons: {
      flex: 0.4,
      justifyContent: 'center',
      alignItems: 'center'      
    },
    button:{
      justifyContent: 'center',
      backgroundColor: 'black',
      borderRadius: 30,
      padding:5,
      marginTop: 45,
      marginBottom: 10,
      height: 70,
      width: 250,
      ...boxShadow,
    },
    textStyle:{
      color: 'white',
      fontFamily: 'Oswald-Regular',
      fontSize: 18,
      textAlign: 'center',
      textAlignVertical: 'center',
    },
    titleText:{
      flex: 0.3,
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: 30,
      textTransform: 'uppercase',
      fontFamily: 'Oswald-Regular',
      color: 'white',
      margin: 50,
    },

  })

export default UserSettings;