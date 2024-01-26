import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";


export default function SettingsScreen({onClose}){
    return(
        <View style={styles.container}>
            <TouchableOpacity style={styles.setting}>
                <Text style={styles.settingText}> Change Profile Photo </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.setting} onPress={onClose}>
                <Text style={styles.settingText}> Close Settings </Text>
            </TouchableOpacity>
        </View>
    );
};

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