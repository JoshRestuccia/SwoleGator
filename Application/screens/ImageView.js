import React, { useEffect, useState } from "react";
import {View, Text, Image, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';

const ImageView = ({name, url, onPress}) => {
    return(
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Text style={styles.imageName}>{name}</Text>
            <Image style={styles.image} source={{uri: url}}/>
        </TouchableOpacity>
    )
};

export default ImageView;

const styles = StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: "black",
      borderRadius: 16,
      padding: 10,
      margin: 10,
    },
    imageName: {
      flex: 1,
      justifyContent: 'center',
      padding: 10,
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 20,
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 10,
      alignSelf: 'center'
    },
});