import React, { useState } from "react";
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
        <View style={styles.container}>
            <TouchableOpacity style={styles.setting} onPress={openPhotoSelect}>
                <Text style={styles.settingText}> Change Profile Photo </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.setting} onPress={onClose}>
                <Text style={styles.settingText}> Close Settings </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleIcon8Navigation}>
                <Text>SwoleGator-Defaults icons by Icon8</Text>
            </TouchableOpacity>
            <Modal
                visible={photoSelectorVisibility}
                transparent={false}
                onRequestClose={closePhotoSelect}   
            >
                <PhotoSelector onClose={closePhotoSelect}/>
            </Modal>
        </View>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    setting: {
        backgroundColor: 'lightblue', // Blue color (adjust as needed)
        padding: 10,
        borderRadius: 15,
        marginTop: 20,
    },
    settingText:{
        color: 'black',
        fontSize: 24
    }
});