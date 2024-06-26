import React, {useState, useEffect, createContext, useContext} from 'react';
import firestore, { firebase } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

const FirestoreContext = createContext();

export const FirestoreProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentEmail, setCurrentEmail] = useState(''); 
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [isFriendsLoading, setIsFriendsLoading] = useState(false);

    // FORMATTING FUNCTIONS    
    const formattedFriend = (initialFormat, friendUID, friendData) => {
        if(initialFormat){
            return({
                uid: friendUID,
                username: friendData.username || 'No Username',
                email: friendData.email,
                profile_pic: 'https://firebasestorage.googleapis.com/v0/b/swolegator-9539f.appspot.com/o/default-profile-pics%2Ficons8-dumbell-100-4.png?alt=media&token=332db3c3-4d6c-40ee-aa42-855afa689608',
                friendsSince: firestore.FieldValue.serverTimestamp()
            });
        }
        const date = friendData.friendsSince.toDate();
        const mm = date.getMonth();
        const dd = date.getDate();
        const yyyy = date.getFullYear();
        return({
            uid: friendUID,
            username: friendData.username || 'No Username',
            email: friendData.email,
            profile_pic: friendData.profile_pic || 'https://firebasestorage.googleapis.com/v0/b/swolegator-9539f.appspot.com/o/default-profile-pics%2Ficons8-dumbell-100-4.png?alt=media&token=332db3c3-4d6c-40ee-aa42-855afa689608',
            friendsSince: `${mm}/${dd}/${yyyy}`
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
                profile_pic: "https://firebasestorage.googleapis.com/v0/b/swolegator-9539f.appspot.com/o/default-profile-pics%2Ficons8-dumbell-100-4.png?alt=media&token=332db3c3-4d6c-40ee-aa42-855afa689608"
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
                sum += Math.abs(parseFloat(rep.currV));
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
        //console.log(victoryDataObject);
        return victoryDataObject;
    };

    const checkCalculationsSaved = async (workoutType, sessionName) => {
        try{
            const sessionRef = firestore().collection('users').doc(currentUser.uid)
                                    .collection('workouts').doc(workoutType)
                                    .collection('sessions').doc(sessionName);
            const querySnap = await sessionRef.collection('calc').get();
            return !querySnap.empty;
        }catch(err){
            console.error('Error checking if calc has been created');
            return false;
        }
    };

    const addWorkoutCalculationsToFirestore = async (victDataObj, workoutType, sessionName) => {
        if(currentUser){
            try{
                const calcExists = await checkCalculationsSaved(workoutType, sessionName);
                if(!calcExists){
                    await firestore().collection('users').doc(currentUser.uid)
                            .collection('workouts').doc(workoutType)
                            .collection('sessions').doc(sessionName)
                            .collection('calc').add(victDataObj);
                    console.log('Calculations saved to Firestore');
                }else{
                    console.log('Calculations are already present! No need to add again.');
                }
            }catch(err){
                console.error('Error adding victory data to Firestore:', err);
            }
        }
    };

    const generateVictoryDataByTimescale = async (timescale, workoutType) => {
        const calcDataRange = (timescale) => {
            const endDate = new Date(); // today
            let startDate = new Date();
            switch(timescale){
                case 'week':
                    startDate.setDate(endDate.getDate() - 7); // subtract a week
                    break;
                case 'month':
                    startDate.setMonth(endDate.getMonth() - 1); // subtract a month
                    break;
                case 'year':
                    startDate.setFullYear(endDate.getFullYear()-1); // subtract a year
                    console.log(startDate);
                    break;
                default:
                    console.warn('Invalid timescale selected. Defaulting to today.');
                    startDate = endDate;
                    break;
            };
            return [startDate, endDate];
        };

        const fetchSessionsWithinDateRange = async (startDate, endDate) => {
            try{
                const sessionRef = firestore().collection('users').doc(currentUser.uid)
                                    .collection('workouts').doc(workoutType)
                                    .collection('sessions');
                const querySnap = await sessionRef.where('date', '>=', firestore.Timestamp.fromDate(startDate))
                                                    .where('date', '<=', firestore.Timestamp.fromDate(endDate)).get();

                const sessions = querySnap.docs.map((session) => ({
                    name: session.id,
                    date: session.get('date'),
                    data: session.data()
                }));

                return sessions;
            }catch(err){
                console.error(`Error fetching sessions within range (${startDate},${endDate})`);
            }
        };

        const aggregateSessionData = async (sessions) => {
            const allSessions = {};
            
            for(const session of sessions){
                const sessionRef = firestore().collection('users').doc(currentUser.uid)
                                                .collection('workouts').doc(workoutType)
                                                .collection('sessions').doc(session.name);
                const calcRef = sessionRef.collection('calc');
                const calcSnap = await calcRef.get();
                const data = calcSnap.docs[0].data();
                console.log('calcSnapData: \n', data);                
                allSessions[session.date]= data;
            }
            console.log(allSessions);
            return allSessions;
        };

        const cleanData = (dirtyData) => {
            const calcAverage = (data) => {
                let sum = 0;
                let cnt = 0;
                for(const dp of data){
                    sum += dp.data;
                    cnt++;
                }
                return (sum/cnt);
            };
            const max = (data) => {
                let maxV = 0;
                for(const dp of data){
                    if(dp.data > maxV){
                        maxV = dp.data;
                    }
                }
                return maxV;
            };
            const fixDateFormat = (dateString) => {
                if(!dateString){
                    console.error('Invalid timestamp format: Date String undefined.');
                    return null;
                }
                //console.log('Date String:: ', dateString);
                const matches = dateString.match(/(\d+)/g);

                if(matches){
                    //console.log(`Seconds: ${matches[0]} :: Nanoseconds: ${matches[1]}`);
                    const seconds = parseInt(matches[0]);
                    const nanoseconds = parseInt(matches[1]);
                    const milliseconds = seconds*1000 + nanoseconds/1e6;
                    const date = new Date(milliseconds);
                    return date;
                }else{
                    console.error('Invalid timestamp format');
                }
            };

            const sessionMaxes = {};
            const sessionAvgs = {};

            for(const session of Object.entries(dirtyData)){
                // Get sessionAvg from avg of rep avgs
                const sessionAvg = calcAverage(session[1].avgVs);
                // Get sessionMax from max of rep maxes
                const sessionMax = max(session[1].maxVs);
                // Save the data to be shown in victory
                sessionAvgs[session[0]] = sessionAvg;
                sessionMaxes[session[0]] = sessionMax;
            }
            //console.log(Object.entries(sessionAvgs)[0]);
            const sessionAvgVs = Object.keys(sessionAvgs).map(timestamp => ({
                date: fixDateFormat(timestamp),
                value: parseFloat(sessionAvgs[timestamp])
            }));
            const sessionMaxVs = Object.keys(sessionMaxes).map(timestamp => ({
                date: fixDateFormat(timestamp),
                data: parseFloat(sessionMaxes[timestamp])
            }));
            const cleanData = {
                sessionMaxes: sessionMaxVs,
                sessionAverages: sessionAvgVs
            };
            //console.log('Dirty Data:\n', dirtyData);
            //console.log('Clean Data:\n', cleanData);
            return cleanData;
        };

        if(currentUser){
            try{
                const dataRange = calcDataRange(timescale);
                const sessionsWithinRange = await fetchSessionsWithinDateRange(dataRange[0], dataRange[1]);
                if(sessionsWithinRange.length > 0){
                    const dataFromSessions = await aggregateSessionData(sessionsWithinRange);
                    const clean = cleanData(dataFromSessions) || null;
                    return clean;
                }
            }catch(err){
                console.error(err);
            }
        }
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
                    // Check for profile picture updates and update
                    const friendProfilePic = await getFriendProfilePicture(friendDoc.id);
                    console.log(`Friend's profile Image URL: ${friendProfilePic}`);
                    if(formatted.profile_pic != friendProfilePic){
                        formatted['profile_pic'] = friendProfilePic;
                    }
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
                        //console.log('Getting session data for: ', session.id);
                        const sessionName = session.id;
                        const sessionDate = session.get('date');
                        const isPublic = session.get('isPublic');
                        await session.ref.collection('data').get().then((sessionDataDoc) => {
                            const sessionData = sessionDataDoc.docs.map((datapoint) => datapoint.data());
                            //console.log("Pushing workoutTypeData for", workoutType, ":", workoutTypeData);
                            //console.log(Array.from(Object.values(sessionData)));
                            const victoryData = generateVictoryDataObject(sessionData);
                            addWorkoutCalculationsToFirestore(victoryData, workoutType, sessionName); // Ideally, this should probably be in a better spot but as of now its gotta go here
                            workoutTypeData.push({name: sessionName, date: sessionDate, data: Array.from(Object.values(sessionData)), public: isPublic});
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

    const getFriendWorkoutData = async (friendUID) => {
        try{
            const userRef = firestore().collection('users').doc(friendUID);
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
                        const sessionDate = session.get('date');
                        await session.ref.collection('data').get().then((sessionDataDoc) => {
                            const sessionData = sessionDataDoc.docs.map((datapoint) => datapoint.data());
                            console.log("Pushing workoutTypeData for", workoutType, ":", workoutTypeData);
                            console.log(Array.from(Object.values(sessionData)));
                            const victoryData = generateVictoryDataObject(sessionData);
                            addWorkoutCalculationsToFirestore(victoryData, workoutType, sessionName); // Ideally, this should probably be in a better spot but as of now its gotta go here
                            workoutTypeData.push({name: sessionName, date: sessionDate, data: Array.from(Object.values(sessionData))});
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

    const getPublicWorkoutsOfUser = async (userUID) => {
        try{
            const publicWorkouts = {};
            const userPublicWorkoutsSnap = await firestore().collection('users').doc(userUID).collection('public').orderBy('shared_on').get();
            console.log(`Found ${userPublicWorkoutsSnap.docs.length} public workouts`);
            if(userPublicWorkoutsSnap.docs.length === 0){ return {}; }
            userPublicWorkoutsSnap.forEach((workout)=>{
                if(!publicWorkouts[workout.id]){
                    console.log(`publicWorkouts[${workout.id}] = ${workout.data()['data']}`);
                    publicWorkouts[workout.id] = workout.data()['data'];
                }
            });        
            console.log('Public Workouts: ', publicWorkouts);
            return publicWorkouts;
        }catch(err){
            throw err;
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

    const getMostRecentOfEachType = async () => {
        try{
            const userRef = firestore().collection('users').doc(currentUser.uid);
            const types = ["Squat", "Deadlift", "Bench Press", "Barbell Curl"];
            const mostRecentSessions = {};

            for(const type of types){
                const workoutsRef = userRef.collection('workouts').doc(type);
                const sessionSnap = await workoutsRef.collection('sessions')
                    .orderBy('date', 'desc').limit(1).get();
                if(!sessionSnap.empty){
                    const wt = sessionSnap.docs[0].get('weight');
                    const mostRecentSessionDataRef = sessionSnap.docs[0].ref;
                    const bool = checkCalculationsSaved(type, mostRecentSessionDataRef.id);
                    if(bool){
                        console.log(mostRecentSessionDataRef.id);
                        const mostRecentSessionData = (await mostRecentSessionDataRef.collection('calc').get()).docs[0].data();
                        mostRecentSessions[type] = {weight: wt, data: mostRecentSessionData};
                    }
                }else{
                    mostRecentSessions[type] = null;
                }
            }
            return mostRecentSessions;
        }catch(err){
            console.error(`There was an error fetching the most recent session.`, err);
            throw err;
        }
    }

    const authStateChanged = async(authUser) => {
        if(authUser){
            setCurrentUser(authUser);
            setCurrentEmail(authUser.email);
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

    const saveWorkoutData = async (workoutName, data, type, wgt) => {
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
            .set({date: timestamp, weight: wgt, isPublic: false}); // must set a field value in order for the collection to be referencable

            await updateTotalWorkoutsOfType(type);
            await updateTotalWorkouts();
            await getAllWorkoutData();
            setIsDataLoading(false);
        }catch(err){
            throw err;
        }
    };

    const makeWorkoutPublic = async (recentVictoryData, workoutDate, workoutName, type) => {
        try{
            // add a public flag on document
            await firestore().collection('users').doc(currentUser.uid)
                    .collection('workouts').doc(type)
                    .collection('sessions').doc(workoutName)
                    .set({ isPublic: true}, {merge: true});
            //console.log('DATA: ', recentVictoryData);
            await firestore().collection('users').doc(currentUser.uid)
                .collection('public').doc(workoutName).set({data: recentVictoryData, date: workoutDate, shared_on: firestore.Timestamp.now(), name: workoutName, type: type});
            console.log(`Made Workout ${workoutName} public!`);
        }catch(err){
            throw err;
        }
    };

    const makeWorkoutPrivate = async (workoutName, type) => {
        try{
            // falsify public flag
            await firestore().collection('users').doc(currentUser.uid)
                    .collection('workouts').doc(type)
                    .collection('sessions').doc(workoutName)
                    .set({isPublic: false}, {merge: true});
            await firestore().collection('users').doc(currentUser.uid)
            .collection('public').doc(workoutName).delete();
        }catch(err){
            throw err;
        }
    };

    const updateTotalWorkouts = async() => {
        if(currentUser){
            try{
                let totalWorkouts = 0;
                const userRef = firestore().collection('users').doc(currentUser.uid);
                const workoutTypesQuerySnap = await userRef.collection('workouts').get();
                workoutTypesQuerySnap.forEach( async (workoutTypeDoc) => {
                    const typeTotal = workoutTypeDoc.get('total');
                    totalWorkouts += typeTotal;
                });
                await userRef.update({'totalWorkouts': totalWorkouts});
                console.log('Updated total workouts successfully!');
                alert('Workout saved successfully! \nNavigate to Profile to view past workouts');
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
                const workoutTypeSessionDocs = await workoutTypeRef.collection('sessions').get();
                let total = 0;
                workoutTypeSessionDocs.forEach(() => {
                    total++;
                });
                await workoutTypeRef.update({'total': total});
                console.log(`Total Workouts of type ${type} updated successfully to ${total}!`);
            }catch(err){
                console.error(`Error updating totalWorkoutsOfType(${type}) for user ${currentUser.email}`, err);
            }
        }
    };

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
            .collection('friends').doc(friendUID).set(formattedFriend(true, friendUID, friendData));
            console.log(`Added Friend: ${friendData.email}`);
        }catch(error){
            throw error;
        }
    };

    const getFriendProfilePicture = async (friendUID) => {
        try{
            const friendDoc = await firestore().collection('users')
                .doc(friendUID).get();
            if(friendDoc.exists){
                return friendDoc.get('profile_pic');
            }
        }catch(err){
            console.error(err);
        }
    };

    const getFriendData = async (friendUID) => {
        try{
            console.log('Friend UID:', friendUID);
            const friendDoc = await firestore().collection('users')
            .doc(friendUID).get();
            console.log('Retrieved UID from Firestore:', friendDoc.uid);
            //console.log(firestore().collection.('users'));
            if(friendDoc.exists){
                console.log('found');
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

    // Profile Photo Functions
    const getDefaultProfileImages = async () => {
        try{
            const list = await storage().ref('default-profile-pics').listAll();
            const default_pics = [];
            await Promise.all(list.items.map(async (item) => {
                    const path = item.fullPath;
                    const ref = storage().ref(path);
                    const url = await ref.getDownloadURL();
                    default_pics.push({name: path, url: url});
                })
            );
            return default_pics;
        }catch(err){
            console.error(err);
        }
    };

    const setProfilePicture = (picture_uri) => {
        if(currentUser){
            firestore().collection('users').doc(currentUser.uid).update({
                profile_pic: picture_uri
            });
        }
    };

    const uploadPhotoToStorage = async (filename, blob) => {
        try{
            const profile_pics_ref = storage().ref('profile-pics');
            // delete previous photos
            const users_pics = profile_pics_ref.child(`${currentUser.uid}`);
            const images = await users_pics.listAll();
            images.items.forEach((item) => item.delete());
            // store new photo            
            await profile_pics_ref.child(`${currentUser.uid}/${filename}`).put(blob); 
        }catch(err){
            throw err;
        }
    };

    const getImageURL = async (filename) => {
        try{
            console.log('Filename: ', filename);
            const profile_pics_ref = storage().ref('profile-pics');
            const img = profile_pics_ref.child(`${currentUser.uid}/${filename}`);
            const url = await img.getDownloadURL();
            return url;
        }catch(err){
            throw err;
        }
    };

    // CONTEXT VALUE (WHICH FUNCTIONS TO EXPORT)
    const contextValue = {
        currentUser,
        isDataLoading,
        isFriendsLoading,
        friendsFromDatabase,
        setIsDataLoading,
        getPublicWorkoutsOfUser,
        getNumberWorkoutsOfType,
        getTotalNumOfWorkouts,
        getAllWorkoutData,
        getMostRecentSession,
        getMostRecentOfEachType,
        friendsFromDatabase,
        signUp,
        signIn,
        saveWorkoutData,
        makeWorkoutPublic,
        makeWorkoutPrivate,
        getUserData,
        addFriend,
        getFriendData,
        getFriendWorkoutData,
        signOut,
        generateVictoryDataObject,
        generateVictoryDataByTimescale,
        setProfilePicture,
        getDefaultProfileImages,
        uploadPhotoToStorage,
        getImageURL
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