import React, { useEffect, useState } from "react";
import { View, Modal, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useFirestore } from "../api/firestore/FirestoreAPI";
import ImageSelectionModal from "../components/ImageSelectionModal";
import DefaultImageSelectionModal from '../components/DefaultImageSelectionModal';

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


const styles = StyleSheet.create({
    main:{
        height: '100%',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: 'gray', // Semi-transparent background
    },
    header:{
        flex: 0.1,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: 30,
    },
    body: {
        flex: 0.3,
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    button: {
        flex: 0.4,
        height: '50%',
        margin: 0,
        padding: 0,
        borderRadius: 20,
        backgroundColor: 'lightblue',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center'
    }
});

