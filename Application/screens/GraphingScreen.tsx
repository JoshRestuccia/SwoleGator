import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    StatusBar,
    NativeModules,
    NativeEventEmitter,
    Platform,
    PermissionsAndroid,
    FlatList,
    TouchableHighlight,
    Pressable,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import {
    VictoryLine,
    VictoryTheme,
} from 'victory-native';

import {data} from '../data/examples/example1.json';

const LineChart = () => {
    return <VictoryLine/>;
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