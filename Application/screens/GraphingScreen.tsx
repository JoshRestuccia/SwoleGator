import React, { useState, useEffect } from 'react';
import {
    View,
    Pressable,
    Text,
    SafeAreaView,
    StatusBar,
    Dimensions
} from 'react-native';

import {
    VictoryChart, 
    VictoryLegend, 
    VictoryLine, 
    VictoryTheme, 
    VictoryTooltip, 
    VictoryVoronoiContainer,
} from 'victory-native';

import styles from '../styles/container-view-styles'
import {Datapoint, VictoryData, getData } from '../data/LoadData';

const legendData = [
    {
        name: "X_DATA", 
        symbol:{
            fill:"tomato", 
            type:"square",
        },
    },
    {
        name:"Y_DATA",
        symbol:{
            fill:"green",
            type:"square"
        }
    },
    {
        name:"Z_DATA",
        symbol:{
            fill:"blue",
            type:"square"
        }
    }
];

function LineChart(): JSX.Element {
    var xdata = getData('x');
    var ydata = getData('y');
    var zdata = getData('z');
    
    return (
        <VictoryChart
            theme={VictoryTheme.material}
            height={480} 
            width={400}
            domainPadding={{x: 10, y: 5}}
            padding={50}
            containerComponent={
                <VictoryVoronoiContainer
                    voronoiDimension='x'
                    labels={ ({datum}) => `y: ${datum.y}`}
                    labelComponent={
                        <VictoryTooltip
                            renderInPortal
                            cornerRadius={0}
                            flyoutStyle={{fill: "white"}}
                        />
                    }
                />
            }     
        >
            <VictoryLine name="xData"
                data={xdata}
                style={{
                    data: {
                        stroke: "tomato",
                        strokeWidth: 1
                    },
                    labels: { fill: "tomato"},
                }}
            />

            <VictoryLine name="yData"
                data={ydata}
                style={{
                    data: {
                        stroke: "green",
                        strokeWidth: 1
                    },
                    labels: { fill: "green"}
                }}
            />

            <VictoryLine name="zData"
                data={zdata}
                style={{
                    data: {
                        stroke: "blue",
                        strokeWidth: 1
                    },
                    labels: { fill: "blue"}
                }}
            />
            <VictoryLegend x={35} y={2}
                orientation='horizontal'
                gutter={30}
                style={{
                    border: {
                        stroke: 'navy',
                        strokeWidth: 3,
                        fill: 'skyblue'
                    },
                    labels: {
                        fontSize: 15,
                        fontWeight: 'bold',
                        fill: 'navy'
                    },
                }}
                data={legendData}
            />

        </VictoryChart>
    );
};

function GraphingScreen(): JSX.Element {

    var [dataState, setDataState] = useState(0);

    const handlePress = () => {
        console.log(`Updating Data... `);
        setDataState(dataState+1);
        console.log(dataState);
    };
    
    return(
        <>
        <View style={styles.container}>
            <StatusBar/>
            <View style={styles.graphContainer}>
                <LineChart/>
            </View>
            <View style={styles.buttonContainer}>
                <Pressable style={styles.refreshButton} onPress={handlePress}>
                    <Text style={styles.refreshButtonText}>
                        {'Start Recording Data'}
                    </Text>
                </Pressable>
            </View>
        </View>
        </>
    );
};

export default GraphingScreen;