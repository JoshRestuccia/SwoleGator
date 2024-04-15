import React from "react";

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';


const StatLine = ({header, body, onPress}) => {
    return(
        <TouchableOpacity style={styles.statContainer} onPress={onPress}>
            <Text style={styles.statHeader}>{header}</Text>
            <Text style={styles.statBody}>{body}</Text>
        </TouchableOpacity>
    );
};

export default StatLine;

const styles = StyleSheet.create({
    statContainer: {
        display: 'flex',
        width: '80%',
        height: 45,
        flexDirection: 'row',
        backgroundColor: 'lightgray',
        borderRadius: 5,
        margin: 5,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    statHeader:{
        flex: 0.8,
        fontSize: 18,
        color: 'black',
        textAlign: 'right',
        fontFamily: 'Oswald-Regular',
        textTransform: 'uppercase',
    },
    statBody:{
        flex:0.2,
        color: 'darkred',
        fontSize: 20,
        textAlign: 'left',
        paddingLeft: 50
    }
});