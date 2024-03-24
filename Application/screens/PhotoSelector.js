import React, { useEffect, useState } from "react";
import { View, Modal, TouchableOpacity, Text, StyleSheet, Linking } from "react-native";
import { useFirestore } from "../api/firestore/FirestoreAPI";
import ImageSelectionModal from "../components/ImageSelectionModal";
import DefaultImageSelectionModal from '../components/DefaultImageSelectionModal';

const icon8_url = "https://icons8.com/icons/collections/stwh66efe54iwrth5ljc";

const PhotoSelector = ({isVisible, onClose}) => {
    const {setProfilePicture} = useFirestore();
    const [defaultTrigger, setDefaultTrigger] = useState(false);
    const [personalTrigger, setPersonalTrigger] = useState(false);

    const [imageSelection, setImageSelection] = useState({name: "", url: ""});

    const handleCloseDefault = () => {
        setDefaultTrigger(false);
    };

    const handleClosePersonal = () => {
        setPersonalTrigger(false);
    };

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

    useEffect(() => {
        console.log('Default Trigger value: ', defaultTrigger);
    }, [defaultTrigger]);
    useEffect(() => {
        console.log('Personal Trigger value: ', personalTrigger);
    }, [personalTrigger]);

    useEffect(() => {
        if(imageSelection.name != ""){
            console.log(imageSelection.url);
            setProfilePicture(imageSelection.url);
            // ADD NOTIFICATION HERE TO ALERT USER THEIR PICTURE HAS UPDATED
            onClose();
        }
    }, [imageSelection]);

    return(
        <Modal
            visible={isVisible}
            transparent={false}
            onRequestClose={onClose}   
        >
            <View style={styles.main}>
                <Text style={styles.header}>Change your Profile Photo</Text>
                <View style={styles.body}>
                    <TouchableOpacity style={styles.button} onPress={() => setDefaultTrigger(true)}>
                        <Text style={styles.buttonText}>Select a Default</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleIcon8Navigation}>
                        <Text style={styles.icon8Text}>Powered by Icon8</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => setPersonalTrigger(true)}>
                        <Text style={styles.buttonText}>Select your Own</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {defaultTrigger && <DefaultImageSelectionModal
                isVisible={defaultTrigger} 
                onClose={handleCloseDefault} 
                setImageSelection={setImageSelection}       
            />}
            {personalTrigger && <ImageSelectionModal
                isVisible={personalTrigger} 
                onClose={handleClosePersonal} 
                setImageSelection={setImageSelection}       
            />}
        </Modal>
    );
};

export default PhotoSelector;

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
    main:{
        height: '100%',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: '#272727', // Semi-transparent background
    },
    header:{
        flex: 0.5,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: 30,
        fontFamily: 'Oswald-Regular',
        color: 'white',
    },
    body: {
        flex: 0.5,
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    button:{
        justifyContent: 'center',
        backgroundColor: 'black',
        borderRadius: 30,
        padding:5,
        marginTop: 45,
        marginBottom: 10,
        height: 50,
        width: 250,
        ...boxShadow,
    },
    buttonText: {
        fontFamily: 'Oswald-Regular',
        fontSize: 20,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white',
    },
    icon8Text: {
        color: 'white',
        fontFamily: 'Oswald-Regular',
        fontSize: 18
    }
});

