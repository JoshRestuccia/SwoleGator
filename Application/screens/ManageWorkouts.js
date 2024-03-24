import React, {useState, useEffect} from 'react';
import {TouchableOpacity, StyleSheet, View, FlatList, Text} from 'react-native';
import { useFirestore } from '../api/firestore/FirestoreAPI';

const ManageWorkouts = () => {

    const {
        currentUser, 
        getAllWorkoutData,
        makeWorkoutPublic,
        makeWorkoutPrivate,
    } = useFirestore();

    const [publicWs, setPublicWs] = useState([]);
    const [privateWs, setPrivateWs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [key, setKey] = useState(true);
    const [updateFlag, setUpdateFlag] = useState(false);


    const fetchWorkouts = async () => {
        try{
            setIsLoading(true);
            // fetch all workouts
            const workouts = await getAllWorkoutData();
            // fetch all public workouts
            let pub = [];
            let priv = [];
            Object.entries(workouts).forEach((workoutType) => {
                const type = workoutType[0];
                for(const workout of workoutType[1]){
                    if(workout.public === true){
                        pub.push({...workout, type: type});
                    }else{
                        priv.push({...workout, type: type});
                    }
                }
                setPublicWs(pub);
                setPrivateWs(priv);
            });
            setIsLoading(false);
        }catch(err){
            console.error(err);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setPrivateWs([]);
        setPublicWs([]);
        fetchWorkouts();
    }, [currentUser]);

    useEffect(() => {
/*         console.log('Public/Private workouts updated!');
        console.log('Public: ', publicWs);
        console.log('Private: ', privateWs); */
        //handle notifications here
    },[privateWs, publicWs]);


    useEffect(() => {
        if(updateFlag === true){
            setPrivateWs([]);
            setPublicWs([]);
            fetchWorkouts();
            setUpdateFlag(false);
        }
    }, [updateFlag])

    const renderItem = (workout) => {
        const convertDate = workout.date?.toDate();
        let dd, mm, yyyy;
        if(convertDate){
            dd = convertDate.getDate();
            mm = convertDate.getMonth();
            yyyy = convertDate.getFullYear();
        }
        const handlePress = async () => {
            console.log('Item pressed.');
            try{
                if(workout.public === true){
                    await makeWorkoutPrivate(workout.name, workout.type);
                    // Remove workout from public
                    //setPublicWs(publicWs.filter(item => item !== workout));
                    // Add workout to private
                    //setPrivateWs(prevPrivateWs => [...prevPrivateWs, workout]);
                }else{
                    await makeWorkoutPublic(workout.data, workout.date, workout.name, workout.type);
                    // Remove workout from private
                    //setPrivateWs(privateWs.filter(item => item != workout));
                    // Add workout to public
                    //setPublicWs(prevPublicWs => [...prevPublicWs, workout]);
                }
                setKey(!key);
                setUpdateFlag(true);
            }catch(err){
                console.error(err);
            }
        };
        return(
            <TouchableOpacity style={renderItemStyles.main} onPress={handlePress}>
                <Text style={renderItemStyles.name}>{workout.name}</Text>
                <Text style={renderItemStyles.date}>{convertDate ? `${mm}/${dd}/${yyyy}` : `Date not saved`}</Text>
            </TouchableOpacity>
        );
    };

    return(
        <View key={key} style={styles.main}>
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Public</Text>
                {!isLoading  ?
                    (publicWs.length > 0) ?
                        <WorkoutSection key={key} data={publicWs} renderItem={renderItem}/>
                    :  
                        (
                            <Text style={styles.loadingText}>No Public Workouts</Text>
                        ) 
                :  
                    (
                        <Text style={styles.loadingText}>Loading...</Text>
                    )
                }
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Private</Text>
                {!isLoading ?
                    (privateWs.length > 0) ? 
                        <WorkoutSection key={key} data={privateWs} renderItem={renderItem}/>
                    : 
                        (
                            <Text style={styles.loadingText}>No Private Workouts</Text>
                        )
                : 
                    (
                        <Text style={styles.loadingText}>Loading...</Text>
                    )
                }
            </View>
        </View>
    );
};

const WorkoutSection = ({data, renderItem}) => {
    return(
        <FlatList
            data={data}
            contentContainerStyle={{rowGap: 12}}
            renderItem={({item}) => renderItem(item)}
            keyExtractor={(item) => item.name}
        />
    );
};

export default ManageWorkouts;


const styles = StyleSheet.create({
    main: {
        height: '100%',
        flexDirection: 'column',
        backgroundColor: 'gray',
        justifyContent: 'space-between',
    },
    section: {
        flex: 0.5,
        backgroundColor: 'pink',
        padding: 20,
        backgroundColor: '#272727',
    },
    sectionHeader: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 35,
        fontFamily: 'Oswald-Regular',
        paddingBottom: 20,
        color: 'white',
    },
    loadingText: {
        fontSize: 25,
        fontWeight: 'normal',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Oswald-Regular',
        color: 'white'
    }
});

const renderItemStyles = StyleSheet.create({
    main: {
        flexDirection: 'column',
        padding: 15,
        alignContent: 'center',
        backgroundColor: '#700C0C',
        borderRadius: 25
    },
    name: {
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    date: {
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center'
    }
});