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

    useEffect(() => {
        const fetchWorkouts = async () => {
            // fetch all workouts
            const workouts = await getAllWorkoutData();
            // fetch all public workouts
            let publicWorkouts = [];
            let privateWorkouts = [];
            Object.entries(workouts).forEach((workoutType) => {
                const type = workoutType[0];
                for(const workout of workoutType[1]){
                    if(workout.public === true){
                        publicWorkouts.push({...workout, type: type});
                    }else{
                        privateWorkouts.push({...workout, type: type});
                    }
                }
            });
            console.log('Private: ', privateWorkouts);
            setPrivateWs(privateWorkouts);
            console.log('Public: ', publicWorkouts);
            setPublicWs(publicWorkouts);
        };
        fetchWorkouts();
    }, [currentUser])

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
            if(workout.public === true){
                await makeWorkoutPrivate(workout.name);
            }else{
                await makeWorkoutPublic(workout.data, workout.date, workout.name, workout.type);
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
        <View style={styles.main}>
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>{`Public`}</Text>
                {publicWs.length > 0 ? 
                    <FlatList
                        data={publicWs}
                        contentContainerStyle={{rowGap: 12}}
                        renderItem={({item}) => renderItem(item)}
                        keyExtractor={item => item.name}
                    />
                :   (
                        <Text style={styles.loadingText}>Loading... </Text>
                    )
                }
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>{`Private`}</Text>
                {privateWs.length > 0 ? 
                    <FlatList
                        data={privateWs}
                        contentContainerStyle={{rowGap: 12}}
                        renderItem={({item}) => renderItem(item)}
                        keyExtractor={item => item.name}
                    />
                : (
                    <Text style={styles.loadingText}>Loading...</Text>
                )}
            </View>
        </View>
    );
};

export default ManageWorkouts;


const styles = StyleSheet.create({
    main: {
        height: '100%',
        flexDirection: 'column',
        padding: 25,
        backgroundColor: 'gray',
        justifyContent: 'space-evenly'
    },
    section: {
        flex: 0.4,
        backgroundColor: 'pink',
        padding: 20,
        backgroundColor: 'lightblue',
        borderRadius: 25
    },
    sectionHeader: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 35,
        fontWeight: 'bold',
        paddingBottom: 20
    },
    sectionBody:{
        flex: 0.7,
        backgroundColor: 'white',
        borderRadius: 25
    },
    loadingText: {
        fontSize: 25,
        fontWeight: 'normal',
        textAlign: 'center',
        textAlignVertical: 'center'
    }
});

const renderItemStyles = StyleSheet.create({
    main: {
        flexDirection: 'column',
        padding: 15,
        alignContent: 'center',
        backgroundColor: 'white',
        borderRadius: 25
    },
    name: {
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    date: {
        textAlign: 'center',
        textAlignVertical: 'center'
    }
});