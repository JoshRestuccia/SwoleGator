import React, {useState} from "react";
import {StyleSheet, View, Text, TextInput, TouchableOpacity} from 'react-native';

import { useFirestore } from "../api/firestore/FirestoreAPI";

export default FriendPrompt = () => {
    const [friendEmail, setFriendEmail] = useState();
    const {addFriend} = useFirestore();
    
    const handleSubmitFriendEmail = async() => {
      if(friendEmail){
        try{
          await addFriend(friendEmail);
          setFriendEmail('');
          return;
        }catch(error){
          console.error(error);
        }
      } else { 
        console.warn('Cannot add friend. Email is empty');
      }
    };
  
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
            <TouchableOpacity style={popup.joinButton} onPress={handleSubmitFriendEmail}>
              <Text style={popup.buttonText}> Make Friends! </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
};

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
  
