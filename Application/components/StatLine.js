import React from "react";

import { View, Text, StyleSheet } from 'react-native';


const StatLine = ({header, body}) => {
    return(
        <View style={styles.statContainer}>
            <Text style={styles.statHeader}>{header}</Text>
            <Text style={styles.statBody}>{body}</Text>
        </View>
    );
};

export default StatLine;

const styles = StyleSheet.create({
    statContainer: {
        display: 'flex',
        width: '80%',
        flexDirection: 'row',
        backgroundColor: 'lightgray',
        borderRadius: 5,
        margin: 5,
        alignSelf: 'center',
        justifyContent: 'space-evenly'
    },
    statHeader:{
        flex: 0.8,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'blue',
        textAlign: 'right'
    },
    statBody:{
        flex:0.2,
        fontSize: 20,
        textAlign: 'left',
        paddingLeft: 50
    }
});