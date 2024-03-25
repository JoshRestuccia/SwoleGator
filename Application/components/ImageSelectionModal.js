import React, { useEffect, useState } from "react";
import { StyleSheet, Modal, View, TouchableOpacity, Text } from "react-native";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { useFirestore } from "../api/firestore/FirestoreAPI";

const ImageSelectionModal = ({isVisible, onClose, setImageSelection}) => {
    const {uploadPhotoToStorage, getImageURL} = useFirestore();
    const [imageSelectionResponse, setImageSelectionResponse] = useState(null);
    const [uploading, setUploading] = useState(false);

    const onImageLibraryPress = () => {
        const options = {
            title: 'Select Photo',
            storageOptions: {
                selectionLimit: 1,
                mediaType: 'photo',
                inclueBase64: false,
            }
        };
        launchImageLibrary(options, setImageSelectionResponse);
    };
    
    const onCameraPress = () => {
        const options = {
            saveToPhotos: true,
            mediaType: 'photo',
            inclueBase64: false,
        };
        launchCamera(options, setImageSelectionResponse);
    };

    useEffect(() => {
        const uploadAndSave = async() => {
            try{
                if(imageSelectionResponse){
                    if(imageSelectionResponse.didCancel === true) return;
                    setUploading(true);
                    // parse image selection response
                    const src = imageSelectionResponse.assets[0].uri;
                    const response = await fetch(src);
                    const blob = await response.blob();
                    const filename = src.substring(src.lastIndexOf('/')+1);
                    // save image to firestore storage
                    await uploadPhotoToStorage(filename, blob);
                    const storage_url = await getImageURL(filename);
                    const img = {name: filename, url: storage_url};
                    console.log(img);
                    setImageSelection(img);
                    setUploading(false);
                    setImageSelectionResponse(null);
                }
            }catch(err){
                console.error(err);
            }
            
        };
        uploadAndSave();
    }, [imageSelectionResponse]);

    return(
        <Modal
            isVisible={isVisible}
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.main}>
                <View style={styles.buttonBox}>
                    <TouchableOpacity style={styles.button} onPress={onImageLibraryPress}>
                        <Text style={styles.buttonText}>Choose from Library</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={onCameraPress}>
                        <Text style={styles.buttonText}>Take a Photo</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

};


export default ImageSelectionModal;

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
    main: {
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    buttonIcon: {
      width: 30,
      height: 30,
      margin: 10,
    },
    buttonBox: {
      flex: 0.6,
      margin: 25,
      padding: 25,
      backgroundColor: '#272727',
      flexDirection: 'column',
      borderRadius: 25,
      justifyContent: 'space-evenly',
      alignItems: 'center'
    },
    button:{
        alignItems: 'center',
        backgroundColor: 'red',
        borderRadius: 15,
        padding: 15,
        width: '60%',
    },
    buttonText: {
        fontFamily: 'Oswald-Regular',
        fontSize: 20,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white',
    },
  });