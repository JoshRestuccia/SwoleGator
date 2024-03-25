
import React, {useState, useEffect} from 'react';
import { useFirestore } from '../api/firestore/FirestoreAPI';
import { StyleSheet, View, TouchableOpacity, Text} from "react-native";
import { CommonActions } from '@react-navigation/native';
import PhotoSelector from "./PhotoSelector";

const SettingsScreen = ({navigation, onClose}) => {
    const { signOut } = useFirestore();
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
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Guest Stack', params: {screen: 'Landing'}}]
            })
          )
        }catch(error){
          console.error('Error signing out...', error);
        }
    };

    return(
        <View style={styles.main}>
            <View style={styles.exitButton}>
              <TouchableOpacity onPress={onClose}>
                  <Text style={styles.exitText}>X</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.optionButtons}>
              <TouchableOpacity style={styles.button} onPress={openPhotoSelect}>
                  <Text style={styles.textStyle}> Change Profile Photo </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={pressLogOut}>
                  <Text style={styles.textStyle}> Log Out </Text>
              </TouchableOpacity>
              <PhotoSelector isVisible={photoSelectorVisibility} onClose={closePhotoSelect}/>
            </View>
        </View>
    );
};

export default SettingsScreen;

  const styles = StyleSheet.create({
      main:{
        flex: 1,
        backgroundColor: '#272727',
      },
      optionButtons: {
        flex: 0.8,
        justifyContent: 'space-evenly',
        alignItems: 'center',
      },
      exitButton:{
        flex: 0.1,
        justifyContent: 'flex-start',
        color: 'white',
        alignItems: 'flex-end',
      },
      exitText:{
        color: 'white',
        textAlign: 'right',
        textAlignVertical: 'center',
        fontSize: 25,
        marginEnd: 25,
        marginTop: 25,
    },
      button:{
        alignItems: 'center',
        backgroundColor: 'red',
        borderRadius: 15,
        padding: 15,
        width: '60%',
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
      },
      icon8Text: {
        fontSize: 18,
        color: 'white'
      }
    })
