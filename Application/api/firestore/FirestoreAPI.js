import React, {useState, useEffect, createContext, useContext} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const FirestoreContext = createContext();

const createDataObj = (data) => {
    const textData = String.fromCharCode.apply(null, new Uint8Array(data));
    const [x, y, z] = textData.split(',').map(parseFloat);
    console.log('Received data:', { x, y, z });
    console.log('Creating Data Object...');
    const dataObj = {
            x: x,
            y: y, 
            z: z
    };
    console.log('Data Object:\n', dataObj, '\n');
    return dataObj;
};

export const FirestoreProvider = ({children}) => {
  
    const [currentUser, setCurrentUser] = useState(null); 

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((authUser) => {
            setCurrentUser(authUser);
        });

        return () => {
            console.debug('[FirestoreContext] Main Firestore Context is unmounting...');
            unsubscribe();
        }
    }, [currentUser]);

    const createFriendObj = (friendUID, friendData) => {
        console.log(`[UID:${friendUID}]FriendData:${friendData}`);
        return({
            uid: friendUID,
            email: friendData.email,
            username: friendData.username,
            friendData: firestore.Timestamp.fromDate(new Date())
        });
    };

    const generateUserObj = (email, first, last, username) => {
        return(
            {
                email: email,
                first: first,
                last: last,
                username: username,
            });
    };

    const signUp = (email, first, last, username, password) => {
        auth().createUserWithEmailAndPassword(email, password)
        .then( (user)=> {
            const userObj = generateUserObj(email, first, last, username);
            // Loading user data into database 
            firestore().collection('users')
                .doc(`${user.uid}`)
                .set(userObj);
            setCurrentUser(user);
            console.log('User account created!');
          })
        .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
        }
    
        if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
        }
    
        console.error(error);
        });
    };

    const getUserData = async() => {
        if(currentUser){
            try{
                const userDoc = await firestore().collection('users')
                .doc(currentUser.uid).get();
                if(userDoc.exists){
                    return userDoc.data();
                }else{
                    return null;
                }
            }catch(error){
                throw error;
            }
        }else{
            return null;
        }
    };

    const signIn = async (email, password) => {
        try{
            await auth().signInWithEmailAndPassword(email, password);
            console.log('User account signed in!');
        }catch(error) {
            if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
            }
            if (error.code === 'auth/invalid-credential') {
                console.log('Invalid credentials. Check email or password');
            }
            if (error.code === 'auth/'){
                console.error(error);
            }
            console.log(error.code);
        }      
    };

    const getNumberOfWorkouts = () => {
        const [numWorkouts, setNumWorkouts] = useState(0);
        firestore().collection('users').doc(userUID)
            .collection('workouts').get()
            .then((snap) => {
                setNumWorkouts(snap.size);
            });
        return numWorkouts;
    };

    const saveWorkoutData = (workoutName, data) => {
        const dataObj = createDataObj(data);
        firestore().collection('users').doc(currentUser.uid)
            .collection('workouts').add(`${workoutName}`)
            .collection('data').add(JSON.parse(dataObj))
            .catch(err => console.error(err));
    };

    const addFriend = async (friendEmail) => {
        try{
            // Check if friends already
            const friendsAlready = await firestore().collection('users')
            .doc(currentUser.uid).collection('friends')
            .where('email', '==', friendEmail).get();
            if(friendsAlready){
                console.warn(`You've already added ${friendEmail}`);
                return;
            }
            // Get friend to add
            const friendSnap = await firestore().collection('users')
            .where('email', '==', friendEmail).get();

            if(friendSnap.empty){
                throw new Error(`Friend ${friendEmail} was not found`);
            };
            const friendData = friendSnap.docs[0].data();
            const friendUID = friendSnap.docs[0].id;
            // add friend to users/<userUID>/friends
            await firestore().collection('users').doc(currentUser.uid)
            .collection('friends').add(createFriendObj(friendUID, friendData));
            console.log(`Added Friend: ${friendData.email}`);
        }catch(error){
            throw error;
        }
    };

    const getFriendData = async(friendUID) => {
        try{
            const friendData = await firestore().collection('users')
            .doc(friendUID).get();
            return friendData;
        }catch(error){
            throw error;
        }
    };

    const getFriends = async () => {
        try{
            const friendsSnap = await firestore().collection('users')
            .doc(currentUser.uid).collection('friends')
            .orderBy('friendedDate','desc').limit(3).get();
        
            const newFriends = [];
            friendsSnap.forEach((friendDoc) => {
                const friendData = friendDoc.data();
                newFriends.push(friendData);
            });
            return newFriends;
        }catch(err){ console.error(err) };
    };

    const signOut = async() => {
        try{
            const email = auth().currentUser.email;
            await auth().signOut();
            console.log(`User ${email} signed out`);
        }catch(error){
            throw error;
        }
    };

    const contextValue = {
        currentUser,
        signUp,
        signIn,
        saveWorkoutData,
        getUserData,
        getNumberOfWorkouts,
        addFriend,
        getFriendData,
        getFriends,
        signOut
    }

    return(
        <FirestoreContext.Provider value={contextValue}>
            {children}
        </FirestoreContext.Provider>
    );
};

export const useFirestore = () => {
    const context = useContext(FirestoreContext);
    if(!context){
        throw new Error('useFirestore must be used within a FirestoreProvider');
    }
    return context;
};