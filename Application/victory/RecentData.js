import React, {useState, useEffect}from "react";
import { StyleSheet, View, Text } from "react-native";
import { 
    VictoryLine,
    VictoryVoronoiContainer,
    VictoryTheme,
    VictoryChart,
    VictoryScatter,
    VictoryTooltip,
    Background,
    VictoryLabel,
    VictoryAxis
} from "victory-native";
import { useFirestore } from "../api/firestore/FirestoreAPI";

// raw_data is an array of datapoints for a given session. 
/* Datapoint: {
    maxV: <number>
    currV: <number>
    rep: <number>
}*/

const RecentDataGraph = ({raw_data, name}) => {
    const {generateVictoryDataObject} = useFirestore();
    const [victoryData, setVictoryData] = useState({maxVs: [], avgVs: []});
    const [victoryDomain, setVictoryDomain] = useState(null);
    const [strainPoints, setStrainPoints] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(raw_data){
            //console.log('RAW_DATA: \n', raw_data);
            setIsLoading(true);
            const victDataObj = generateVictoryDataObject(raw_data);
            console.log(victDataObj);
            setVictoryData(victDataObj);
        }   
    },[raw_data]);

    useEffect(() => {
        const calcDomains = () => {
            // Velocity Domain calculations
            const max = victoryData.maxVs.length > 0 ? 
                            Math.max(...victoryData.maxVs.map(obj => obj.data))
                        :   81;
            const min = victoryData.avgVs.length > 0 ?
                            Math.min(...victoryData.avgVs.map(obj => obj.data))
                        :   -20;
            const threshold = 0.2*Math.abs(min);            
            const vel_domain = [min-threshold, max+threshold];
 
            // Rep Domain calculations
            const maxRep = victoryData.maxVs.length > 0 ?
                                Math.max(...victoryData.maxVs.map(obj => obj.rep))
                            : 15;
            const rep_domain = [0, maxRep+1];

            const domains = {
                x: rep_domain,
                y: vel_domain
            };
            console.log('DOMAIN:', domains);
            return domains;
        };

        const getStrainPoints = () => {
            const strainPoints = [];
            const max = Math.max(...victoryData.maxVs.map(obj => obj.value));
            const thresh = 0.9*max;
            for(const dp of victoryData.avgVs){
                if(dp.data >= thresh){
                    strainPoints.push(dp);
                }
            }
            setStrainPoints(strainPoints);
        };

        console.log('Victory Data: ', victoryData);
        console.log(victoryData.maxVs);
        if(victoryData){
            const vicDomain = calcDomains(victoryData);
            setVictoryDomain(vicDomain);
            getStrainPoints();
            setIsLoading(false);
        }
    }, [victoryData]);

    useEffect(() => {
        console.log('Victory Domain: ', victoryDomain);
    }, [victoryDomain])
    
    return(
        <View style={styles.main}>
        {!isLoading && victoryData && victoryDomain ? (
            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>{name}</Text>
                <VictoryChart 
                    width={325}
                    height={350}
                    padding={50}
                    style={styles.chart}
                    theme={VictoryTheme.grayscale}
                    domain={victoryDomain}
                    containerComponent={
                        <VictoryVoronoiContainer
                            labels={({datum}) => `REP: ${datum.rep}, VELO: ${Math.round(datum.data*100)/100}`}
                            labelComponent={
                                <VictoryTooltip
                                    constrainToVisibleArea
                                    center={{y: 20}}
                                    style={{color: 'red'}}
                                />
                            }
                        />
                    }
                >
                    <VictoryAxis crossAxis
                        label={'REPS'}
                        width={300}
                        height={350}
                        style={styles.axisStyleX}
                    />
                    <VictoryAxis dependentAxis crossAxis
                        label={'VELOS'}
                        width={300}
                        height={350}
                        style={styles.axisStyleY}
                    />
                    {
                        victoryData.maxVs.length > 0 &&
                            (<VictoryLine data={victoryData.maxVs} x='rep' y='data' 
                                style={styles.maxLine}
                            />)
                    }
                    {
                        victoryData.avgVs.length > 0 && 
                            (<VictoryLine data={victoryData.avgVs} x='rep' y='data'
                                interpolation={'linear'}
                                style={{
                                    data:{
                                        stroke: 'darkblue',
                                        strokeWidth: 4
                                    }
                                }}
                            />)
                    }
                    {
                        strainPoints.length > 0 &&
                            (<VictoryScatter data={strainPoints} x='rep' y='data'
                                style={styles.strainPoints}
                            />)
                    }
                </VictoryChart>
            </View>
        )
        : (
            <View style={{flex: 1, alignContent: 'space-around', justifyContent: 'space-around'}}>
                <Text style={{textAlign: 'center', fontSize: 18, fontFamily: 'Helvetica', padding: 20, color: 'teal'}}>
                    {`Calculating Victory Data and Domain...`}
                </Text>
            </View>
        )}
        </View>
    );
};


const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignContent: 'center',
        justifyContent: 'center'
    },
    chartContainer: {
        flex: 0.6,
        alignSelf: 'center',
        alignItems: 'center',
        borderWidth: 3,
        paddingLeft: 15,
        borderColor: 'white',
        borderRadius: 15,
        backgroundColor: 'red',
        width: '80%'
    },
    chart:{
        background: {
            fill: 'lightgray',
        },
        parent: {
            display: 'flex',
            flex: 0.8,
            margin: 20,
            marginTop: 0,
            alignSelf: 'center',
            justifyContent: 'center',
        },
    },
    axisStyleX: {
        axis: {stroke: 'white', strokeWidth: 3},
        axisLabel: {fontFamily: 'Oswald-Regular', fontSize: 20, fill: 'white', padding: 30},
        grid: {stroke: 'white'},
        ticks: {stroke: 'white', size: 2},
        tickLabels: {fontFamily: 'Oswald-Regular', fill: 'white', dx: -10}
    },
    axisStyleY: {
        axis: {stroke: 'white', strokeWidth: 3},
        axisLabel: {fontFamily: 'Oswald-Regular', fontSize: 20, fill: 'white', padding: 30},
        grid: {stroke: 'white'},
        ticks: {stroke: 'white', size: 2},
        tickLabels: {fontFamily: 'Oswald-Regular', fill: 'white', padding: 3}
    },
    maxLine: {
        data: {
            stroke: 'red',
            strokeDasharray: '5,5'
        }
    },
    strainPoints:{
        data:{
            fill: 'red'
        }
    },
    chartTitle: {
        paddingBottom: 0,
        marginBottom: 0,
        width: '80%',
        alignSelf: 'center',
        flex: 0.2,
        fontSize: 30,
        fontFamily: 'Oswald-Regular',
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center'
    }
});

export default RecentDataGraph;