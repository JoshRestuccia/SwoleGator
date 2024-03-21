import React, {useState, useEffect}from "react";
import { StyleSheet, View, Text } from "react-native";
import { 
    VictoryLine,
    VictoryVoronoiContainer,
    VictoryTheme,
    VictoryChart,
    VictoryScatter,
    VictoryTooltip
} from "victory-native";
import { useFirestore } from "../api/firestore/FirestoreAPI";

// raw_data is an array of datapoints for a given session. 
/* Datapoint: {
    maxV: <number>
    currV: <number>
    rep: <number>
}*/

const RecentDataGraph = ({raw_data}) => {
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
            const max = Math.max(...victoryData.avgVs.map(obj => obj.data));
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
        <View>
        {!isLoading && victoryData && victoryDomain ? (
            <VictoryChart 
                style={styles.chart}
                theme={VictoryTheme.material}
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
    chart:{
        background: {fill: 'pink'},
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
    }
});

export default RecentDataGraph;