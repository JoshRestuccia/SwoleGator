import React, {useState, useEffect} from 'react';
import { Modal, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useBLE } from '../api/ble/BLEContext';
import { useFirestore } from '../api/firestore/FirestoreAPI';

const HomeScreen = ({navigation}) =>{
  const {
    isScanning,
    isConnecting,
    startBLEScan,
    stopBLEScan,
    scannedDevices,
    handleConnectPeripheral,
  } = useBLE();
  const {
    currentUser,
    getUserData,
  } = useFirestore();
    
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [device, setDevice] = useState(null);

  //console.debug("peripherals map updated", [...peripherals.entries()]);
  const handleStartScan = () => {
    startBLEScan();
  };

  const handleStopScan = () => {
    stopBLEScan();

  };

  useEffect(() => {
    const fetchData = async() => {
      try{
        if(currentUser){
          const userDataFirestore = await getUserData();
          setUserData(userDataFirestore);
          setIsLoading(false);
        }
      }catch(err){
        console.error(err);
      }
    };
    fetchData();
  }, [currentUser]);

  useEffect(() => {
    const handleDiscoverAndConnect = async () => {
      const devices = Array.from(scannedDevices.values());
      console.log(devices[0]);
      if(devices[0]?.advertising?.localName === "SwoleGator"){
        await handleConnectPeripheral(devices[0]);
        setDevice(devices[0]);
      }
    };
    handleDiscoverAndConnect();

  }, [scannedDevices]);

  return(
      <View style={styles.screenSetup}>
          <View style={styles.title}>
            <Text style={styles.welcome}>{isLoading? `Loading...` : `Welcome, ${userData?.first}`} </Text>
          </View>
          <View style={styles.container}>
              {device ?
                <View style={styles.connectedContainer}>
                  <Text style={styles.connectedText}>Connected to SwoleGator</Text>

                </View>
              :
              <>
                <TouchableOpacity onPress={isScanning ? handleStopScan : handleStartScan} style={styles.button}>
                  <Text style={styles.textStyle}>{isScanning ? 'Finding Device...' :'Connect Device'}</Text>
                </TouchableOpacity>

                <Text style = {styles.warnStyle}>SWOLEGATOR not connected. </Text>
                <Text style = {styles.warnStyle}>Please ensure device is turned on and in range.</Text>
                <Text style = {styles.warnStyle}>You may need to restart the device</Text>
 </>
              }
          </View>
      </View>
  );
};


const styles = StyleSheet.create({
    screenSetup:{
      flex: 1,
      backgroundColor: '#272727'
    },
    container:{
      flex: 0.5,
      justifyContent: 'center',
      justifyItems: 'center',
      height:'auto',
      flexDirection:'column',
    },
    swoleGator: {
      fontFamily: 'Anta-Regular',
      color: 'white',
      fontSize: 60,
      marginTop: 50,
    },
    welcome :{
      fontFamily: 'Anta-Regular',
      color: 'white',
      fontSize: 50,
      marginHorizontal: 50,
      textAlign: 'center'
    },
      textInput:{
        borderBottomColor:'grey',
        borderBottomWidth: 1,
        fontSize:18,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
    },
    button:{
      alignSelf: 'center',
      width: '60%',
      height: '40%',
      backgroundColor: '#615F5F',
      borderColor: '#700C0C',
      borderWidth: 5,
      borderRadius: 15,
      justifyContent: 'center'
    },
    textStyle:{
      color: 'white',
      fontFamily: 'Oswald-Regular',
      fontSize: 30,
      textAlign: 'center',
      justifyContent: 'center',
    },
    warnStyle:{
          color: 'red',
          fontFamily: 'Oswald-Regular',
          fontSize: 16,
          textAlign: 'center',
          justifyContent: 'left',
        },
    title:{
      flex: 0.4,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 35,
      height:180
    },
    titleText:{
      textAlign:'center',
      width:250
    },
    connectedContainer: {
      flex: 0.5,
      justifyContent: 'center',
      alignSelf: 'center',
      paddingHorizontal: 50
    },
    connectedText: {
      color: 'green',
      fontFamily: 'Oswald-Regular',
      fontSize: 40,
      textAlign: 'center',
      textAlignVertical: 'center',
    }
});

export default HomeScreen;
