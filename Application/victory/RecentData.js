import React, {useState, useEffect}from "react";
import { StyleSheet } from "react-native";
import { 
    VictoryContainer,
    VictoryLine,
    VictoryAnimation,
    VictoryVoronoiContainer,
    VictoryTheme,
    VictoryChart,
    Background,
    VictoryAxis,
    VictoryScatter
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
    const [victoryDomain, setVictoryDomain] = useState({x: [], y: []});
    const [strainPoints, setStrainPoints] = useState([]);

    useEffect(() => {
        if(raw_data){
            //console.log('RAW_DATA: \n', raw_data);
            const victDataObj = generateVictoryDataObject(raw_data);
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
                            Math.min(...victoryData.avgVs.map((obj) => obj.data))
                        :   0;
            const threshold = 0.2*min;            
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
        }
    }, [victoryData]);
    
    const getLineColor = (rep, avg) => {
        const max = victoryData.maxVs[rep];
        if(avg >= (max*0.9) && avg <= max){
            return 'purple';
        }else if(avg > max){
            return 'red';
        }else{
            return 'blue';
        }
    };


    return(
        <VictoryChart 
            style={styles.chart}
            theme={VictoryTheme.material}
            domain={victoryDomain}  
            containerComponent={
                <VictoryVoronoiContainer
                    labels={({datum}) => `REP: ${Math.round(datum.rep, 2)}, VELO: ${Math.round(datum.data, 2)}`}
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
                victoryData.avgVs.length > 0 &&
                    (<VictoryScatter data={strainPoints} x='rep' y='data'
                        style={styles.strainPoints}
                    />)
            }
        </VictoryChart>
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