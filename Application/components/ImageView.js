import React from "react";
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

const ImageView = ({name, url, onPress}) => {
    return(
        <TouchableOpacity style={styles.container} onPress={onPress}>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{uri: url}}/>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.imageName}>{name}</Text>
          </View>
        </TouchableOpacity>
    )
};

export default ImageView;

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: "white",
      borderRadius: 16,
      padding: 10,
      margin: 5,
      justifyContent: 'space-evenly'
    },
    nameContainer: {
      flex: 0.5,
    },
    imageName: {
      flex: 1,
      justifyContent: 'center',
      padding: 10,
      fontWeight: 'bold',
      textAlign: 'left',
      fontSize: 15,
      color: 'white',
      textAlignVertical: 'center'
    },
    imageContainer: {
      flex: 0.3,
      alignContent: 'center',
      justifyContent: 'center',
    },
    image: {
      width: 75,
      height: 75,
      borderRadius: 10,
      alignSelf: 'center'
    },
});