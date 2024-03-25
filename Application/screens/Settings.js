
import React, {useState, useEffect} from 'react';
import { useFirestore } from '../api/firestore/FirestoreAPI';
import { StyleSheet, View, TouchableOpacity, Text, Linking, Modal} from "react-native";
import PhotoSelector from "./PhotoSelector";

const icon8_url = "https://icons8.com/icons/collections/stwh66efe54iwrth5ljc";

const SettingsScreen = ({onClose}) => {
    const [photoSelectorVisibility, setPhotoSelectorVisibility] = useState(false);

    const closePhotoSelect = () => {
        setPhotoSelectorVisibility(false);
    }
    const openPhotoSelect = () => {
        setPhotoSelectorVisibility(true);
    }
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

    const handleIcon8Navigation = () => {
        Linking.canOpenURL(icon8_url).then(supported => {
            console.log(supported);
            if(supported){
                Linking.openURL(icon8_url);
            }else{
                console.warn(`Cannot reach ${icon8_url}`);
            }
        }).catch(err => console.error(err));
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
