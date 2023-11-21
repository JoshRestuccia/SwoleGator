import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
} from 'react-native';

import {
    VictoryChart, 
    VictoryLabel, 
    VictoryLegend, 
    VictoryLine, 
    VictoryTooltip, 
    VictoryVoronoi, 
    VictoryVoronoiContainer,
} from 'victory-native';

import {VictoryData, getData } from '../data/LoadData';
import conatinerStyles from '../styles/container-view-styles';


const LineChart = () => {
    let xdata: VictoryData[] | undefined = getData('x');
    let ydata: VictoryData[] | undefined = getData('y');
    let zdata: VictoryData[] | undefined = getData('z');
    return (
        <VictoryChart 
            height={400} 
            width={400}
            domainPadding={{y: 10}}
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
                        strokeWidth: 2
                    },
                    labels: { fill: "tomato"},
                }}
            />
            <VictoryLine name="yData"
                data={ydata}
                style={{
                    data: {
                        stroke: "green",
                        strokeWidth: 2
                    },
                    labels: { fill: "green"}
                }}
            />
            <VictoryLine name="zData"
                data={zdata}
                style={{
                    data: {
                        stroke: "blue",
                        strokeWidth: 2
                    },
                    labels: { fill: "blue"}
                }}
            />
            <VictoryLegend 
                x={20} y={350}
                title="Live Acceleration Data"
                titleOrientation='top'
                orientation='horizontal'
                data={[
                    {
                        name: "X_DATA", 
                        symbol:{
                            fill:"tomato", 
                            type:"square"
                        }
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
                ]}

            />
        </VictoryChart>
    );
}

function GraphingScreen(): JSX.Element {
    return(
        <>
            <StatusBar/>
            <SafeAreaView style={conatinerStyles.container}>
                <LineChart/>
            </SafeAreaView>
        </>
    );
};

export default GraphingScreen;