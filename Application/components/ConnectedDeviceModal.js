import React from "react";
import {Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const ConnectedDeviceModal = ({visible, onConnect}) => {
    return(
        <Modal
            visible={visible}
            transparent
        >
            <View style={styles.background}>
                <View style={styles.main}>
                    <Text style={styles.text}>Please connect device before proceeding</Text>
                    <TouchableOpacity style={styles.connectButton} onPress={onConnect}>
                        <Text style={styles.text}>{`Connect Device`}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};


export default ConnectedDeviceModal;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        marginTop: 75,
        marginBottom: 65,
        backgroundColor: 'rgba(0,0,0,0.25)',
        alignContent: 'center',
        justifyContent: 'center'
    },
    main: {
        flex: 0.5,
        alignContent: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: '#272727',
        margin: 25,
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 25
    },
    text: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white',
        fontSize: 30,
        fontFamily: 'Oswald-Regular',
    },
    connectButton: {
        flex: 0.3,
        backgroundColor: 'black',
        borderRadius: 25,
        justifyContent: 'center',
    }
});