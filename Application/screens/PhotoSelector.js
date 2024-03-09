import React, { useEffect, useState } from "react";
import { useFirestore } from "../api/firestore/FirestoreAPI";
import { ScrollView, View, Button, Text, StatusBar, Image } from "react-native";
import ImageView from './ImageView';

const PhotoSelector = ({onClose}) => {
    const{
        getDefaultProfileImages,
        setProfilePicture
    } = useFirestore();
    const [defaultImages, setDefaultImages] = useState([{}]);
    const [imageSelection, setImageSelection] = useState({name:"", url:""});

    const handleImageSelection = (img) => {
        console.log(`Selecting Image ${img.name}`);
       setImageSelection(img);
    };

    useEffect(() => {
        if(imageSelection.name != ""){
            console.log(imageSelection.url);
            setProfilePicture(imageSelection.url);
        }
    }, [imageSelection]);

    useEffect(() => {
        const fetchDefaultImages = async () => {
            const defaults = await getDefaultProfileImages();
            setDefaultImages(defaults);
        };
        console.log('Fetching Default Profile Images...');
        fetchDefaultImages();
    },[]);

    useEffect(() => {
        console.log('Default Images: ', defaultImages);
    }, [defaultImages]);

    return(
        <View style={{backgroundColor: 'white'}}>
            <Button title={`Cancel`} onPress={onClose}>
                <Text>{`Cancel`}</Text>
            </Button>
            <ScrollView 
                contentInsetAdjustmentBehavior="automatic"
                style={{backgroundColor: 'white'}}
            >
                {defaultImages ? (
                    defaultImages.map((img) => {
                        return(
                            <ImageView key={img.name} name={img.name} url={img.url} onPress={() => handleImageSelection(img)}/>
                        );
                    })
                ) : (
                    <View>
                        <Text>{'No Images To Show'}</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default PhotoSelector;