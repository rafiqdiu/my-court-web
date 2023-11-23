// Import React and Component
import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Image,
  Text,
  Modal,
  Button,
  Animated,
  Platform,
} from 'react-native';
 
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
//import VersionCheck from 'react-native-version-check-expo'

import NetInfo from '@react-native-community/netinfo';

import * as Animatable from 'react-native-animatable';
//import { doUpdateIfAvailable  } from 'expo-custom-updater';

// VersionCheck.getLatestVersion({
//   provider: 'playStore'  // for Android
// });

// checkUpdateNeeded= async () => {
//   try {
//     let updateNeeded = await VersionCheck.needUpdate();
//     if (updateNeeded.isNeeded) {
//         Alert.alert(
//                'Please Update The New Version',
//                'LCMS মোবাইল App টি আপডেট করে নিন।', 
//                [{
//                    text: 'Update',
//                    onPress: ()=> {
//                     BackHandler.exitApp();
//                     Linking.openURL(updateNeeded.storeUrl);
//                    },
                   
//                }, 
//               ], 
//               {
//                    cancelable: false
//                }
//             );
//     }

//   } catch (error) {
//     return error;
//   }
// }
// _loadInitiaupdater= async () => {
//   await doUpdateIfAvailable();
// }

  // onButtonPress = () => {
  //   BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  //   // then navigate
  //   navigate('NewScreen');
  // }


const SplashScreen = ({navigation}) => {
  //State for ActivityIndicator animation
  const [animating, setAnimating] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

      NetInfo.fetch().then(networkState => {
       
        if(networkState.isConnected)
        {
          setIsConnected(2);
        }
       
      });


  useEffect(() => {

    //checkUpdateNeeded();
   // _loadInitiaupdater();
   // navigation.replace( 'Auth' );
   // setTimeout(() => {
      setAnimating(false);
      //Check if user_id is set or not
      //If not then send for Authentication
      //else send to Home Screen
      AsyncStorage.getItem('user_id').then((value) =>
      {value === null ?
       // (Platform.OS === 'web'? navigation.replace( 'AuthWeb' ): navigation.replace( 'Auth' )): navigation.replace( 'Root' )}
      ( navigation.replace( 'Auth' )): navigation.replace( 'Root' )}
     
      );
    //}, 1000);

  }, []);
 
  return (
    <View style={styles.container}>

      {/* <Image
        source={require('../assets/lcms_logo.png')}
        style={{width: '60%', resizeMode: 'contain', margin: 30}}
      /> */}
      
      <ActivityIndicator
        animating={animating}
        color="#FFFFFF"
        size="large"
        style={styles.activityIndicator}
      />

        { isConnected ==false && (() => {
            return ( 
            <Animatable.View style={styles.fadingContainer} animation="slideInUp">
              <Animatable.Text animation="bounceInRight" style={styles.fadingText}>TTT {isConnected} Oops! Looks like your device is not connected to the Internet. Please check your internet connection.</Animatable.Text>
            </Animatable.View>              
          )})()
        }
      
    </View>
  );
};
 
export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#307ecc',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },

  fadingContainer: {
    backgroundColor: "#f00",
    borderRadius:4,
    position: 'absolute', 
    bottom:0,
  },

  fadingText: {
    fontSize: 16,
    textAlign: "center",
    color : "#fff",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f00',
    padding: 20,
  }, 

});
