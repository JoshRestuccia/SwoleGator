import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useFirestore } from '../api/firestore/FirestoreAPI';

const LoadingScreen = () => {
    const {currentUser} = useFirestore();
    const navigation = useNavigation();

    useEffect(() => {
        const checkAuthState = async() => {
            if(currentUser){
                navigation.navigate('User Stack', {screen: 'Home'});
            }else{
                navigation.navigate('Guest Stack', {screen: 'Login'});
            }
        }

        checkAuthState();
        
    }, [navigation, currentUser]);

    return (
        // Your loading screen UI or indicator
        // Optionally, you can show a splash screen or loading indicator here
        // while checking the authentication state.
        <></>
    );
};

export default LoadingScreen;