import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VictoryChart, VictoryLine, VictoryScatter, VictoryTheme, VictoryTooltip, VictoryVoronoiContainer} from 'victory-native';
import { Picker } from '@react-native-picker/picker';
import { useFirestore } from '../api/firestore/FirestoreAPI';


const OverallDataGraph = ({type}) => {
  const {generateVictoryDataByTimescale} = useFirestore();
  const [timeScale, setTimeScale] = useState('week');
  const [trendData, setTrendData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [victoryDomains, setVictoryDomains] = useState({x: [], y: []});

  const calcDomains = (dta) => {
    console.log('dta == ', dta);
    // Velocity Domain calculations
    const max = dta.sessionMaxes.length > 0 ? 
                    Math.max(...dta.sessionMaxes.map(obj => obj.data))
                :   50;
    const min = dta.sessionAverages.length > 0 ?
                    Math.min(...dta.sessionAverages.map(obj => obj.value))
                :   -50;
    const threshold = 0.2*Math.abs(min);            
    const vel_domain = [min-threshold, max+threshold];

    console.log(`VEL DOMAIN = [${min}, ${max}]`);
    // Time Domain calculations
    let startDate = new Date();
    const endDate = new Date();
    switch(timeScale){
        case 'week':
            startDate.setDate(endDate.getDate() - 7); // 1 week period
            break;
        case 'month':
            startDate.setMonth(endDate.getMonth() - 1); // 1 month period
            break;
        case 'year':
            startDate.setFullYear(endDate.getFullYear() - 1); // 1 year period
            break;
        default:
            startDate = new Date(Math.min(...dta.sessionAverages.map(item => item.date))); // start date based on data
            break;
    }
    const time_domain = [startDate, endDate]; 
    console.log(`[${time_domain[0].toLocaleDateString()}, ${time_domain[1].toLocaleDateString()}]`);
    const domains = {
        x: time_domain,
        y: vel_domain
    };
    console.log('X Domain: ', domains.x, ' :: Y Domain: ', domains.y);
    return domains;
  };

  useEffect(() => {
    const getData = async () => {
        //console.log('RAW_DATA: \n', raw_data);
        const formattedData = await generateVictoryDataByTimescale(timeScale, type);
        console.log('Got formatted data for timescale',timeScale);
        setTrendData(formattedData);
    };
    setIsLoadingData(true);
    getData(); 
    },[type, timeScale]);

  useEffect(() => {
    if(trendData){
        const domains = calcDomains(trendData);
        setVictoryDomains(domains);
        setIsLoadingData(false);
        console.log('Trend data: \n', trendData);
    }
  },[trendData]);

  return (
    <View>
      <Picker
        selectedValue={timeScale}
        onValueChange={(value) => setTimeScale(value)}
      >
        <Picker.Item label="Week" value="week" />
        <Picker.Item label="Month" value="month" />
        <Picker.Item label="Year" value="year" />
      </Picker>
      <View>
        { (!isLoadingData && trendData && victoryDomains) ?
            (<VictoryChart
                theme={VictoryTheme.material}
                domain={victoryDomains}
                scale={{x: 'time', y: 'linear'}}
                containerComponent={
                    <VictoryVoronoiContainer
                        labels={({datum}) => {
                            const hrs = datum.date.getHours();
                            const mins = datum.date.getMinutes();
                            const secs = datum.date.getSeconds();
                            const fmt_secs = (secs < 10) ? `0${secs}` : `${secs}`;
                            const am_pm = (hrs > 12) ? true: false;
                            let ret_str = `${datum.date.getMonth()+1}/${datum.date.getDate()} @ ${am_pm ? (hrs-12) : hrs}:${mins}:${fmt_secs} ${!am_pm ? 'AM' : 'PM'} \n`
                            if(datum.data){ // Maxes
                                ret_str += `MAX: ${datum.data}`;
                            }else if(datum.value){ // Avgs
                                ret_str += `AVG: ${Math.round(datum.value * 100) / 100}`;
                            }
                            return ret_str;
                        }}
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
                <VictoryScatter
                    data={trendData.sessionAverages}
                    x='date'
                    y='value'
                    style={styles.averages}    
                    /> 
                <VictoryScatter
                    data={trendData.sessionMaxes}
                    x='date'
                    y='data'
                    style={styles.maxes}
                />
            </VictoryChart>)
        :
            (<Text> Data Loading... </Text>)
        }
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    averages: {
        data: {
            stroke: 'blue',
            fill: 'blue'
        }
    },
    maxes: {
        data: {
            stroke: 'red',
            fill: 'red'
        }
    }
});

export default OverallDataGraph;
