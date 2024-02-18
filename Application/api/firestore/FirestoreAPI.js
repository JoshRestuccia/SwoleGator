import React, {useState, useEffect, createContext, useContext} from 'react';
import firestore, { firebase } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const FirestoreContext = createContext();

export const FirestoreProvider = ({children}) => {
  
    const [currentUser, setCurrentUser] = useState(null);
    const [currentEmail, setCurrentEmail] = useState(''); 
    const [friends, setFriends] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [isFriendsLoading, setIsFriendsLoading] = useState(false);
    const [currentWorkoutType, setCurrentWorkoutType] = useState('');

    // FORMATTING FUNCTIONS    
    const formattedFriend = (initialFormat, friendUID, friendData) => {
        if(initialFormat){
            return({
                uid: friendUID,
                username: friendData.username || 'No Username',
                email: friendData.email,
                profileImage: friendData.profileImage || 'default-profile-image-url',
                friendsSince: firestore.FieldValue.serverTimestamp()
            });
        } 
        return({
            uid: friendUID,
            username: friendData.username || 'No Username',
            email: friendData.email,
            profileImage: friendData.profileImage || 'default-profile-image-url',
            friendsSince: friendData.friendedDate
        });
    };
    
    const generateUserObj = (email, first, last, username) => {
        return(
            {
                email: email,
                first: first,
                last: last,
                username: username,
                totalWorkouts: 0,
            });
    };

    const generateVictoryDataObject = (data) => {

        const max = (repData) => {
            let maxV = 0;
            repData.forEach((rep) => {
                if(rep.maxV > maxV){
                    maxV = rep.maxV;
                }
            });
            return maxV;
        };
        
        const calculateAverageVeloForRep = (repData) => {
            let sum = 0.0;
            let cnt = 0.0;
            //console.log(`Starting Avg Calculation for rep data`);
            repData.forEach((rep) => {
                //console.log('REP: ',rep);
                sum += parseFloat(rep.currV);
                cnt += 1;
                //console.log(`SUM: ${sum} :: CNT: ${cnt}`); 
            });
            const avg = sum/cnt;
            //console.log(`AVG(${avg}) = SUM(${sum}) / CNT(${cnt})`);
            return avg;
        };

        const repData = {};
        data.forEach(({currentV, maxV, rep}) => {
            if(!repData[rep]){
                repData[rep] = [];
            }
            repData[rep].push({maxV: maxV, currV: currentV, rep: rep});
        });
        
        //Get all average Velocities
        const avgVelos = {};
        Object.keys(repData).forEach((rep) => {
            if(!avgVelos[rep]){
                const repAvg = calculateAverageVeloForRep(repData[rep]);
                //console.log(`\nRep #${rep} Avg: `, parseFloat(repAvg));
                avgVelos[rep] = repAvg;
            }
        });
        
        // Get all max Velocities
        const maxVelos = {};
        Object.keys(repData).forEach((rep) => {
            if(!maxVelos[rep]){
                const repMax = max(repData[rep]);
                maxVelos[rep] = repMax;
            }
        });

        const avgVs = Object.keys(avgVelos).map(rep => ({
            rep: parseInt(rep),
            data: parseFloat(avgVelos[rep])
        }));
        const maxVs = Object.keys(repData).map(rep => ({
            rep: parseInt(rep),
            data: parseFloat(maxVelos[rep])
        }));
        const victoryDataObject = {
            maxVs: maxVs,
            avgVs: avgVs
        };
        console.log(victoryDataObject);
        return victoryDataObject;
    };


    const friendsFromDatabase = async() => {
        if(currentUser){
            try{
                setIsFriendsLoading(true);
                console.log(`Trying to reach ${currentUser.email}'s friends`);
                const friendsCollection = firestore().collection('users')
                .doc(currentUser.uid).collection('friends');
                //.orderBy('friendedDate', 'desc');
                
                const friendsSnapshot = await friendsCollection.get();
                const updatedFriendsList = [];
                console.log('Number of Friends: ', friendsSnapshot.docs.length);
                for(const friendDoc of friendsSnapshot.docs){
                    const formatted = formattedFriend(false, friendDoc.id, friendDoc.data());
                    console.log('Formatted Friend:', formatted);
                    updatedFriendsList.push(formatted);
                }
                setIsFriendsLoading(false);
                const friendsList = Array.from(updatedFriendsList);
                return friendsList;
            }catch(err){
                console.error(err);
                throw err;
            }
        }
    };

    const getTotalNumOfWorkouts = async() => {
        try{
            if(currentUser){
                const snap = await firestore().collection('users')
                .doc(currentUser.uid).get();
                const data = snap.data();
                return data.totalWorkouts;
            }
        }catch(err){
            throw err;
        }
    };

    const getNumberWorkoutsOfType = async (type) => {
        try{
            if(currentUser){
                const snap = await firestore().collection('users')
                .doc(currentUser.uid).collection('workouts')
                .doc(type).get();
                if(snap.exists){
                    const data = snap.data();
                    return data.total;
                }
            }
        }catch(err){
            throw err;
        }
    };

    const getAllWorkoutData = async () => {
        try{
            const userRef = firestore().collection('users').doc(currentUser.uid);
            const workoutsSnap = await userRef.collection('workouts').get();
            const workoutDataObj = {};
            //console.log("Fetching workoutsSnap:", workoutsSnap);
            await Promise.all(workoutsSnap.docs.map(async (workoutDoc) => {     
                const workoutType = workoutDoc.id;
                const workoutRef = workoutDoc.ref;
                const sessionsSnap = await workoutRef.collection('sessions').get();
                const workoutTypeData = [];
                //console.log("Fetching sessionsSnap for", workoutType, ":", sessionsSnap, '\n Total of ', sessions.length, 'sessions.');
                await Promise.all(sessionsSnap.docs.map(async (session) => {
                    try{
                        console.log('Getting session data for: ', session.id);
                        const sessionName = session.id;
                        await session.ref.collection('data').get().then((sessionDataDoc) => {
                            const sessionData = sessionDataDoc.docs.map((datapoint) => datapoint.data());
                            console.log("Pushing workoutTypeData for", workoutType, ":", workoutTypeData);
                            console.log(Array.from(Object.values(sessionData)));
                            workoutTypeData.push({name: sessionName, data: Array.from(Object.values(sessionData))});
                        });
                    }catch(err){
                        console.error(err);
                    }
                }));
                workoutDataObj[workoutType] = workoutTypeData;
            }));
            //Example of how to get data out of the array
            //console.log(workoutDataObj['Bench Press'][0].data);
            return workoutDataObj;
        }catch(err){
            console.error(err);
        }
    };

    const getMostRecentSession = async (type) => {
        try{
            const userRef = firestore().collection('users').doc(currentUser.uid);
            const workoutsRef = userRef.collection('workouts').doc(type);
            const sessionSnap = await workoutsRef.collection('sessions')
                .orderBy('date', 'desc').limit(1).get();
            if(!sessionSnap.empty){
                const mostRecentName = sessionSnap.docs[0].id;
                return mostRecentName;
            }else{
                return null;
            }
        }catch(err){
            console.error(`There was an error fetching the most receent session.`, err);
            throw err;
        }
    };

    const authStateChanged = async(authUser) => {
        if(authUser){
            setCurrentUser(authUser);
            setCurrentEmail(authUser.email);
            console.log('About to fetch friends...');
            const tempFriends = await friendsFromDatabase();
            //console.log('TempFriends:',tempFriends);
            setFriends(tempFriends);  
            await getTotalNumOfWorkouts();
        }
    };

    // useEffect BLOCK
    useEffect(() => {

        const unsubscribe = auth().onAuthStateChanged(authStateChanged);

        return () => {
            console.debug('[FirestoreContext] Main Firestore Context is unmounting...');
            unsubscribe();
        }
    }, [currentUser]);

    useEffect(() => {
        const fetchWorkoutData = async () => {
            try{
                if(currentWorkoutType){
                    await getNumberWorkoutsOfType(currentWorkoutType);
                }
            }catch(err){
                throw err;
            }
        };
        return async() => {
            await fetchWorkoutData();
        }
    }, [currentWorkoutType])

    // MAIN EXPORTED FUNCTIONS
    const signUp = async (email, first, last, username, password) => {
        try{
            const authUID = await auth().createUserWithEmailAndPassword(email, password)
            .then( cred => {
                const {uid} = cred.user;
                auth().currentUser.updateProfile({
                    displayName: username
                })
                return uid
            })
            console.log(authUID);
            if(!authUID){
                console.log("User not created");
            }
            const authUserObj = generateUserObj(email, first, last, username);
            
            // Loading user data into database 
            await firestore().collection('users')
                .doc(authUID)
                .set(authUserObj);
            const currUser = await firestore().collection('users').doc(authUID).get();
            setCurrentUser(currUser);
            console.log('User account created!', currentUser);
        }catch(err){
            if (err.code === 'auth/email-already-in-use') {
                alert('That email address is already in use!');
            }
        
            if (err.code === 'auth/invalid-email') {
                alert('That email address is invalid!');
            }
            console.error(err);
            throw err;
        }
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
            const authUser = await auth().signInWithEmailAndPassword(email, password);
            console.log('User account signed in!');
            return authUser;
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

    const saveWorkoutData = async (workoutName, data, type) => {
        try{
            setIsDataLoading(true);
            await firestore().collection('users').doc(currentUser.uid)
            .collection('workouts').doc(type).set({total: 0});
            const dataArray = Array.from(data);
            dataArray.forEach(async (dataPoint) => {
                await firestore().collection('users').doc(currentUser.uid)
                .collection('workouts').doc(type)
                .collection('sessions').doc(workoutName)
                .collection('data').add(dataPoint);
            });
            const timestamp = firebase.firestore.Timestamp.now();
            await firestore().collection('users').doc(currentUser.uid)
            .collection('workouts').doc(type)
            .collection('sessions').doc(workoutName)
            .set({date: timestamp}); // must set a field value in order for the collection to be referencable

            await updateTotalWorkoutsOfType(type);
            await updateTotalWorkouts();
            setIsDataLoading(false);
        }catch(err){
            throw err;
        }
    };

    const updateTotalWorkouts = async() => {
        if(currentUser){
            const userRef = firestore().collection('users').doc(currentUser.uid);
            try{
                await firestore().runTransaction(async(transaction) => {
                    const userDoc = await transaction.get(userRef);
                    if(!userDoc.exists){
                        throw 'User document does not exist';
                    }

                    const total = userDoc.data().totalWorkouts || 0;
                    transaction.update(userRef, {totalWorkouts: total+1});
                });
                console.log('Total workouts updated successfully!');
            }catch(err){
                console.error(`Error updating totalWorkouts for user ${currentUser.email}`, err);
            }
        }
    };

    const updateTotalWorkoutsOfType = async(type) => {
        if(currentUser){
            try{
                const workoutTypeRef = firestore().collection('users').doc(currentUser.uid)
                .collection('workouts').doc(type);  

                await firestore().runTransaction(async(transaction) => {
                    const workoutTypeDoc = await transaction.get(workoutTypeRef);
                    if(!workoutTypeDoc.exists){
                        transaction.set(workoutTypeRef, {total: 0});
                    }
                    const total = workoutTypeDoc.data().total || 0;
                    transaction.update(workoutTypeRef, {total: total+1});
                });
                console.log(`Total Workouts of type ${type} updated successfully!`);
            }catch(err){
                console.error(`Error updating totalWorkoutsOfType(${type}) for user ${currentUser.email}`, err);
            }
        }
    }

    const addFriend = async (friendEmail) => {
        try{
            // Check if friends already
            console.log(`[FirestoreAPI::addFriend] Function hit.`);
            const friendsAlready = await firestore().collection('users')
            .doc(currentUser.uid).collection('friends')
            .where('email', '==', friendEmail).get();
            //Check if trying to add own email
            if(friendEmail === currentEmail){
                console.warn('You can\'t be friends with yourself!!');
                return;
            }else if(!friendsAlready.empty){
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
            .collection('friends').add(formattedFriend(true, friendUID, friendData));
            console.log(`Added Friend: ${friendData.email}`);
        }catch(error){
            throw error;
        }
    };

    const getFriendData = async(friendUID) => {
        try{
            const friendDoc = await firestore().collection('users')
            .doc(friendUID).get();
            if(friendDoc.exists){
                const friendData = friendDoc.data();
                const formattedFriendData = formattedFriend(false, friendUID, friendData);
                return formattedFriendData;
            }else{
                return null;
            }
        }catch(err){
            console.error(err);
            throw err;
        }
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

    // CONTEXT VALUE (WHICH FUNCTIONS TO EXPORT)
    const contextValue = {
        currentUser,
        friends,
        isDataLoading,
        isFriendsLoading,
        currentWorkoutType,
        setIsDataLoading,
        setCurrentWorkoutType,
        getNumberWorkoutsOfType,
        getTotalNumOfWorkouts,
        getAllWorkoutData,
        getMostRecentSession,
        setFriends,
        friendsFromDatabase,
        signUp,
        signIn,
        saveWorkoutData,
        getUserData,
        addFriend,
        getFriendData,
        signOut,
        generateVictoryDataObject
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