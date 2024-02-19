import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VictoryChart, VictoryLine, VictoryScatter, VictoryTheme} from 'victory-native';
import { Picker } from '@react-native-picker/picker';
import { useFirestore } from '../api/firestore/FirestoreAPI';


const OverallDataGraph = ({type}) => {
  const {generateVictoryDataByTimescale} = useFirestore();
  const [timeScale, setTimeScale] = useState('week');
  const [trendData, setTrendData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [tickValues, setTickValues] = useState(null);

  useEffect(() => {
    const getData = async () => {
        //console.log('RAW_DATA: \n', raw_data);
        const formattedData = await generateVictoryDataByTimescale(timeScale, type);
        setTrendData(formattedData);
    };
    setIsLoadingData(true);
    getData(); 
    },[type, timeScale]);

  useEffect(() => {
    const getTickValuesFromTrendData = () => {
        const ticks = [];
        const sessions = trendData.sessionMaxes;
        for(const session of sessions){
            const formattedTick = `${session.date.getMonth()+1}/${session.date.getDate()}`;
            ticks.push(formattedTick);
        }
        return ticks;
    };
    if(trendData){
        setTickValues(getTickValuesFromTrendData());
        setIsLoadingData(false);
        console.log('Trend data: \n', trendData);
    }
  },[trendData]);

  useEffect(() => {
    console.log(tickValues);
  }, [tickValues])

  const calcDomains = () => {
    // Velocity Domain calculations
    const max = trendData.sessionMaxes.length > 1 ? 
                    Math.max(...trendData.sessionMaxes.map(obj => obj.value))
                :   81;
    const min = trendData.sessionAverages.length > 1 ?
                    Math.min(...trendData.sessionAverages.map(obj => obj.data))
                :   0;
    const threshold = 0.2*min;            
    const vel_domain = [min-threshold, max+threshold];

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
            startDate = new Date(Math.min(...trendData.sessionAverages.map(item => item.date))); // start date based on data
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
        { (!isLoadingData && trendData && tickValues) ?
            (<VictoryChart
                theme={VictoryTheme.material}
                scale={{x: 'time'}}
                domain={calcDomains()}
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
