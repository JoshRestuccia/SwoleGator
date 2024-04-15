import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useBLE } from '../api/ble/BLEContext';
import { useFirestore } from '../api/firestore/FirestoreAPI';

const HomeScreen = ({ navigation, batteryPercentage }) => {
  const {
    isScanning,
    startBLEScan,
    stopBLEScan,
    scannedDevices,
    handleConnectPeripheral,
  } = useBLE();
  const {
    currentUser,
    getUserData,
    getMostRecentOfEachType
  } = useFirestore();

  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [device, setDevice] = useState(null);
  const [connected, setConnected] = useState(false);

  const [recents, setRecents] = useState(null);
  const [recs, setRecs] = useState(null);

  //console.debug("peripherals map updated", [...peripherals.entries()]);
  const handleStartScan = () => {
    startBLEScan();
  };

  const handleStopScan = () => {
    //TODO: add popup 
    stopBLEScan();
  };

  useEffect(() => {
    const getRec = (average, max) => {
      if(average > 0.8*max){
        return "INCREASE"
      }else if(average < 0.2*max){
        return "DECREASE"
      }else{
        return "HOLD"
      }
    };
    if(recents){
      let dataByType = {};
      Object.entries(recents).forEach((type) => {
        if(type[1] == null){
          dataByType[type[0]] = null;
        }else{
          const maxVs = type[1].data.maxVs;
          const avgVs = type[1].data.avgVs;
          const weight = type[1].weight;
          let mx = 0;
          let avg = 0;
          let sum = 0;
          let cnt = 0;
          maxVs.forEach((dp) => {
            if(dp.data > mx) mx = dp.data;
          });
          avgVs.forEach((dp) => {
            sum += dp.data;
            cnt += 1;
          });
          avg = sum/cnt;
          const dataObj = {
            "weight": weight,
            "avg": avg,
            "max": mx,
            "rec": getRec(avg, mx)
          };
          dataByType[type[0]] = dataObj;
        }
      });
      const dataArray = Object.entries(dataByType).map(([name, data]) => ({
        name,
        ...data,
      }));
      setRecs(dataArray);
    }
  }, [recents])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser) {
          const userDataFirestore = await getUserData();
          setUserData(userDataFirestore);
          const recentWorkouts = await getMostRecentOfEachType();
          setRecents(recentWorkouts);
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [currentUser]);

  useEffect(() => {
    const handleDiscoverAndConnect = async () => {
      const devices = Array.from(scannedDevices.values());
      console.log(devices[0]);
      if (devices[0]?.advertising?.localName === "SwoleGator") {
        try{
          await handleConnectPeripheral(devices[0]);
          setConnected(true);
          setDevice(devices[0]);
        }catch(err){
          setConnected(false);
          setDevice(null);
          console.error(err);
        }
        
      }
    };
    handleDiscoverAndConnect();

  }, [scannedDevices]);

  const recListItem = ({item}) => {
    if(item.weight && item.rec){
      return(
        <View style={item.rec === "HOLD" ? styles.weightContainerHold : styles.weightContainer}>
          <Text style={styles.weightText}>{`${item.name}[${item.weight}]`}</Text>
          <Text style={styles.recommendationText}>{`${item.rec}`}</Text>
        </View>
      );
    }else{
      return(
        <View style={item.rec === "HOLD" ? styles.weightContainerHold : styles.weightContainer}>
          <Text style={styles.weightText}>{`${item.name}`}</Text>
          <Text style={styles.recommendationText}>{`No Data`}</Text>
        </View>
      )
    }
  };

  return (
    <View style={styles.screenSetup}>

      <View style={styles.title}>
        <Text style={styles.welcome}>{isLoading ? 'Loading...' : `Welcome Back, ${userData?.first}`}</Text>
      </View>
      <View style={styles.container}>
        {device ?
          <View style={styles.connectedContainer}>
            <Text style={styles.connectedText}>Connected to SwoleGator</Text>
          </View>
          :
          <View style={styles.connectedContainer}> 
           {!connected &&  
              <View>
                <Text style = {styles.warnStyle1}>SWOLEGATOR not connected. </Text>
                <Text style = {styles.warnStyle2}>Please ensure device is turned on and in range.</Text>
                <Text style = {styles.warnStyle2}>You may need to restart the device</Text>
              </View>
            }   
          <TouchableOpacity onPress={isScanning ? handleStopScan : handleStartScan} style={styles.button}>
              <Text style={styles.buttonText}>{isScanning ? 'Finding Device...' : 'Connect Device'}</Text>
           </TouchableOpacity>
           
        
          </View>
        }
      </View>
      <View style={styles.recommendations}>
          <Text style={styles.recommendationHeader}>Based on your last sessions... </Text>
          {!isLoading && recs ? (
            <FlatList
            data={recs}
            renderItem={recListItem}
            keyExtractor={(item) => item.name}
            numColumns={2}
            columnWrapperStyle={styles.columnWrap}
          />)
          :
          (
            <Text> Loading Recommendations... </Text>
          )}
      </View>
    
    </View>
  );
};

const boxShadow = {
  shadowColor: 'black',
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0.25,
  shadowRadius: 1.84,
  elevation: 4,
};
const styles = StyleSheet.create({
  screenSetup: {
    flex: 1,
    justifyContent: 'space-evenly',
    backgroundColor: '#272727'
  },
  buttonText:{
    textAlign:'center',
    fontSize: 20,
    textTransform: 'uppercase',
    fontFamily: 'Oswald-Regular',
    color: 'white',
  },
  container: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendations: {
    flex: 0.35,
    flexDirection: 'column',
    alignItems: 'center',
  },
  welcome: {
    fontFamily: 'Anta-Regular',
    textTransform: 'uppercase',
    color: 'white',
    fontSize: 45,
    textAlign: 'center'
  },
  button: {
    width: 250,
    height: 50,
    marginTop: 20,
    marginBottom: 25,
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 10,
    ...boxShadow,
  },
  textStyle: {
    color: 'white',
    fontFamily: 'Oswald-Regular',
    fontSize: 30,
    textAlign: 'center',
  },
  warnStyle1: {
    color: 'red',
    fontFamily: 'Oswald-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  warnStyle2: {
    color: 'white',
    fontFamily: 'Oswald-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  connectedContainer: {
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  connectedText: {
    color: 'green',
    fontFamily: 'Oswald-Regular',
    fontSize: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  warnContainer: {
    flex: 0.4,
    padding: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#615F5F',
    borderRadius: 15,
  },
  recommendationText: {
    textAlign: 'center',
    color: 'darkred',
    fontFamily: 'Oswald-Regular',
    textTransform: 'uppercase',
    fontSize: 15,
    marginRight: 10,
    marginLeft: 10,
  },
  recommendationHeader: {
    fontSize: 28,
    fontFamily: 'Oswald-Regular',
    textTransform: 'uppercase',
    color: 'white',
    marginBottom: 10,
  },
  weightContainer: {
    flex: 0.45,
    flexDirection: 'row',
    backgroundColor: 'lightgrey',
    justifyContent: 'space-between',
    padding: 2,
    borderRadius: 5,
    height: 45,
    alignSelf: 'center',
    alignItems: 'center',
  },
  weightContainerHold: {
    alignSelf: 'center',
    flex: 0.45,
    flexDirection: 'row',
    backgroundColor: 'lightgrey',
    justifyContent: 'space-between',
    padding: 2,
    borderRadius: 5,
    height: 45,
    alignSelf: 'center',
    alignItems: 'center',
  },
  batteryPercentage: {
      color: 'white',
      fontSize: 20,
      fontFamily: 'Oswald-Regular',
      testAlign : 'right'
    },
  weightText: {
    color: 'black',
    textTransform: 'uppercase',
    fontFamily: 'Oswald-Regular',
    fontSize: 15,
  },
  columnWrap: {
    marginBottom: 5,
    marginRight: 40,
    marginTop: 5,
    marginLeft: 0,
    width: 415,
    justifyContent: 'space-evenly'
  }
});

export default HomeScreen;
