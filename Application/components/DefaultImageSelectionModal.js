import React, { useEffect, useState } from "react";
import { ScrollView, View, Button, Text, Modal, StyleSheet, Pressable } from "react-native";
import { useFirestore } from "../api/firestore/FirestoreAPI";
import ImageView from '../components/ImageView';

const DefaultImageSelectionModal = ({isVisible, onClose, setImageSelection}) => {
    const{
        getDefaultProfileImages,
    } = useFirestore();
    const [defaultImages, setDefaultImages] = useState([]);

    const handleImageSelection = (img) => {
        setImageSelection({name: img.name, url: img.url})
    }

    const shortenName = (name) => {
        var short = name.replace('default-profile-pics/icons8-', '');
        short = short.replace('.png', '');
        return short;
    }

    useEffect(() => {
        const fetchDefaultImages = async () => {
            const defaults = await getDefaultProfileImages();
            setDefaultImages(defaults);
        };
        if(isVisible){
            console.log('Fetching Default Profile Images...');
            fetchDefaultImages();
        }
    }, [isVisible]);


    return(
        <Modal
            isVisible={isVisible}
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.main}>
                <ScrollView 
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollStyle}
                >
                    <Text style={styles.header}>{`Defaults (${defaultImages.length})`}</Text>
                    {defaultImages ? (
                        defaultImages.map((img) => {
                            const shortName = shortenName(img.name);
                            return(
                                <ImageView key={shortName} name={shortName} url={img.url} onPress={() => handleImageSelection(img)}/>
                            );
                        })
                    ) : (
                        <View>
                            <Text>{'No Images To Show'}</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </Modal>
        
    );
};

export default DefaultImageSelectionModal;

const styles = StyleSheet.create({
    main: {
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 10,
        paddingVertical: 100
    },
    header: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        textAlignVertical: 'center',
        padding: 15,
        paddingBottom: 30
    },
    scrollStyle: {
        flex: 0.3,
        backgroundColor: 'white', 
        margin: 40, 
        padding: 10,
        borderRadius: 25
    }
});