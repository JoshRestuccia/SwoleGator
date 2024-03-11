import React, { useEffect, useState } from "react";
import { StyleSheet, Modal, View, TouchableOpacity, Text } from "react-native";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { useFirestore } from "../api/firestore/FirestoreAPI";
import { firebase } from "@react-native-firebase/firestore";

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
            if(imageSelectionResponse){
                console.log('Image Selection Response: ', imageSelectionResponse);
                setUploading(true);
                // parse image selection response
                const src = imageSelectionResponse.assets[0].uri;
                const response = await fetch(src);
                const blob = await response.blob();
                const filename = src.substring(src.lastIndexOf('/')+1);
                await uploadPhotoToStorage(filename, blob);
                // save image to firestore storage
                const storage_url = await getImageURL(filename);
                const img = {name: filename, url: storage_url};
                console.log(img);
                setImageSelection(img);
                setUploading(false);
                setImageSelectionResponse(null);
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
                    <View style={styles.button}>
                        <TouchableOpacity onPress={onImageLibraryPress}>
                            <Text style={styles.buttonText}>Choose from Library</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity style={styles.button} onPress={onCameraPress}>
                            <Text style={styles.buttonText}>Take a Photo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

};


export default ImageSelectionModal;

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
      flex: 0.5,
      margin: 25,
      padding: 25,
      backgroundColor: 'white',
      flexDirection: 'column',
      borderRadius: 25,
      justifyContent: 'space-evenly'
    },
    button: {
      flex: 0.4,
      margin: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'teal',
      borderRadius: 25
    },
    buttonText: {
      fontSize: 20,
      color: 'white',
      fontWeight: '600',
      textAlign: 'center',
      textAlignVertical: 'center'
    },
  });