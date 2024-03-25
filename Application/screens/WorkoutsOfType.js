import React, {useState, useEffect} from "react";
import {ScrollView, View, Text, Image, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import { useFirestore } from "../api/firestore/FirestoreAPI";
import OverallDataGraph from "../victory/OverallData";
import { firebase } from "@react-native-firebase/firestore";
import RecentDataGraph from "../victory/RecentData";


const WorkoutsOfType = ({route}) => {
    const {type} = route.params;
    const {
        getAllWorkoutData
    } = useFirestore();
    const [workoutsOfType, setWorkoutsOfType] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState([]);
    const [selectedName, setSelectedName] = useState("");

    useEffect(() => {
        console.log(workoutsOfType);
    }, [workoutsOfType]);

    useEffect(() => {
        const onMount = async() => {
            try{
                setIsLoading(true);
                const workoutData = await getAllWorkoutData();
                setWorkoutsOfType(workoutData[type]);
                setIsLoading(false);
            }catch(err){
                console.error(err);
            }
        };
        onMount();
    },[]);

    const WorkoutCard = ({name, date, onPress}) => {
        const convertDate = date.toDate();
        let dd, mm, yyyy;
        if(convertDate){
            dd = convertDate.getDate();
            mm = convertDate.getMonth();
            yyyy = convertDate.getFullYear();
        }
        return(
            <TouchableOpacity style={styles.workoutCard} onPress={onPress}>
                <Text style={styles.workoutCardHeader}>
                    {name}
                </Text>
                <Text style={styles.workoutCardBody}>
                    {`${mm}/${dd}/${yyyy}`}
                </Text>
            </TouchableOpacity>
        );
    };

    const handleWorkoutSelect = (workout) => {
        console.log(workout);
        setSelectedData(workout.data);
        setSelectedName(workout.name);
        setShowModal(true);
    }

    useEffect(() => {
        console.log(selectedData);
    }, [selectedData])

    return(
        <View style={styles.main}>
            {isLoading ? 
                <View style={styles.loadingBox}>
                    <Text style={styles.loading}>{`Loading ${type} workouts...`}</Text>
                </View>
            :
            <View style={styles.content}>
                {/* Overall Data Graph */}
                <OverallDataGraph type={type}/>
                {/* Flat List of all Workouts of Given Type*/}
                <ScrollView style={styles.workouts}>
                    <View style={styles.dataHeaderBox}>
                        <Text style={styles.dataHeader}>{`${type} Workouts`}</Text>
                        <Image style={styles.scrollIcon} source={require('../assets/icons/scroll-down.png')}/>
                    </View>
                    {workoutsOfType.length > 0 ? 
                        Array.from(workoutsOfType.values()).map((workout) => {
                            console.log('Workout:', workout);
                            return( 
                                <WorkoutCard key={workout.name} 
                                    name={workout.name} 
                                    date={workout.date}
                                    onPress={() => handleWorkoutSelect(workout)}
                                /> 
                            );
                        })
                    :
                        <Text>{`No ${type} workouts yet.`}</Text>
                    }
                </ScrollView> 
            </View> 
            }
            <Modal
                visible={showModal && !(selectedData===null)}
                transparent
                onRequestClose={() => setShowModal(false)}
            >
                <RecentDataGraph raw_data={selectedData} name={selectedName}/>
            </Modal>
        </View>
    );
};

export default WorkoutsOfType;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "#272727"
    },
    loadingBox: {
        flex: 0.5,
        justifyContent: 'center',
    },
    loading: {
        fontSize: 30,
        fontFamily: 'Oswald-Regular',
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    dataHeaderBox:{
        alignSelf: 'center',
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    dataHeader: {
        textAlign: 'left',
        fontFamily: 'Oswald-Regular',
        fontSize: 25,
        color: 'white',
        padding: 15
    },
    scrollIcon:{
        alignSelf: 'center',
        height: 50,
        width: 50
    },
    content: {
        flex: 1,
    },
    workouts: {
        backgroundColor: 'gray'
    },
    workoutCard: {
        width: '70%',
        borderRadius: 15,
        margin: 15,
        padding: 15,
        backgroundColor: 'red',
        alignSelf: 'center'
    },
    workoutCardHeader:{
        fontFamily: 'Oswald-Regular',
        fontSize: 18,
        color: 'white',
        textAlign: 'center'
    },
    workoutCardBody: {
        fontFamily: 'Arial',
        fontSize: 15,
        fontWeight: '100',
        color: 'white',
        textAlign: 'center'
    }
});