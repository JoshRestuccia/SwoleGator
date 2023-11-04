import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

function PairingScreen(): JSX.Element {
    const [isScanning, setIsScanning] = useState(false);

    const startScan = () => {
        console.log("Starting Scan...");
        if(!isScanning){
            //Do the scanning
            console.log("I am scanning!");
            setIsScanning(true);
        }
    };

    const stopScan = () => {
        if(isScanning){
            console.log("Stopping Scan...");
            setIsScanning(false);
        }
    };

    return(
        <TouchableOpacity 
        activeOpacity={0.5}
        style={styles.buttonStyle}
        onPress={isScanning ? stopScan : startScan}>
            <Text style={styles.buttonTextStyle}>
                {(isScanning) ? "Scanning..." : "Scan for Bluetooth Device"}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: '#307ecc',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#307ecc',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 300,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
    },
});

export default PairingScreen;