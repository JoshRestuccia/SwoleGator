import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
} from 'react-native';

import {
    VictoryChart, VictoryLine, VictoryTooltip, VictoryVoronoi, VictoryVoronoiContainer,
} from 'victory-native';

import { getData } from '../data/LoadData';



const LineChart = () => {
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
                            cornerRadius={0}
                            flyoutStyle={{fill: "white"}}
                        />
                    }
                />
            }       
        >
            <VictoryLine name="xData"
                data={Array.from(getData())}
                style={{
                    data: {
                        stroke: "tomato",
                        strokeWidth: 2
                    },
                    labels: { fill: "tomato"}
                }}
            />
            <VictoryLine name="yData"
                data={Array.from(getData())}
            />
            <VictoryLine name="zData"
                data={Array.from(getData())}
            />
        </VictoryChart>
    );
}

function GraphingScreen(): JSX.Element {
    return(
        <>
            <StatusBar/>
            <SafeAreaView>
                <LineChart/>
            </SafeAreaView>
        </>
    );
};

export default GraphingScreen;