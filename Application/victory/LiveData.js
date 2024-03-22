import React from 'react'
import {
    StyleSheet,
    View,
  } from 'react-native';
import {
    VictoryChart,
    VictoryBar,
    VictoryLegend,
    VictoryTooltip,
    VictoryVoronoiContainer,
    VictoryTheme,
  } from 'victory-native';


const LiveDataGraph = ({maxVelocity, currentVelocity}) => {
    return(
        <View style={styles.chartContainer}>
            {/* Vertical Bar Chart */}
            <VictoryChart
                theme={VictoryTheme.material}
                height={200}
                domainPadding={{ x: 10 }}
                containerComponent={
                    <VictoryVoronoiContainer
                        voronoiDimension='x'
                        labels={({ datum }) => `y: ${datum.y}`}
                        labelComponent={
                        <VictoryTooltip
                            renderInPortal
                            cornerRadius={0}
                            flyoutStyle={{ fill: 'white' }}
                        />}
                    />}
                fixAxis="x"
                domain={{
                    x: [0, 3],
                    y: [-20, 100],
                }}>
            
                {/* Max Velocity Data */}
                <VictoryBar
                    name="maxVelocity"
                    data={[{ x: 1, y: parseFloat(maxVelocity) }]}
                    style={{
                        data: {
                            fill: 'tomato',
                            width: 30,
                        },
                    }}
                />

                {/* Current Velocity Data */}
                <VictoryBar
                    name="currentVelocity"
                    data={[{ x: 2, y: parseFloat(currentVelocity) }]}
                    style={{
                        data: {
                        fill: 'blue',
                        width: 30,
                        },
                    }}
                />
            </VictoryChart>

            {/* Legend */}
            <VictoryLegend
                x={20}
                y={20}
                title="Workout Stats"
                titleOrientation='top'
                orientation='horizontal'
                data={[
                {
                    name: 'Max Velocity',
                    symbol: {
                        fill: 'tomato',
                        type: 'square',
                    },
                },
                {
                    name: 'Current Velocity',
                    symbol: {
                        fill: 'blue',
                        type: 'square',
                    },
                },
                ]}
            />
        </View>   
    );
};

export default LiveDataGraph;

const styles = StyleSheet.create({
    chartContainer: {
        alignItems: 'center',
        marginTop: 20, // Add marginTop to create space above the chart
    },
});