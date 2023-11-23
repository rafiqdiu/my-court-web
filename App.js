import React,  { useEffect, Component,useState} from 'react';
import { LogBox,Linking, BackHandler,Platform, Animated, Alert, Button, Text, AppState, TouchableOpacity, TextInput, View, StyleSheet,Image,ActivityIndicator  } from 'react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StatusBar} from 'expo-status-bar';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Navigation from './src/Navigation';
import TokenLoadBuffer from './src/components/TokenLoadBuffer';
import {TokenProvider} from './src/data/token';
import useTheme from './src/useTheme';
import VersionCheck from 'react-native-version-check-expo';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export default function App() {
  const theme = useTheme();
  const [isupdate, setupdateNeeded] = useState(null);
  const [playStoreUrl, setupdateurl] = useState(null);
 
  useEffect(() => {
    if(Platform.OS === 'android' ){
    VersionCheck.getLatestVersion({
      provider: 'playStore'  // for Android
    });
   
   checkUpdateNeeded();
  }
  }, []);
  const checkUpdateNeeded= async () => {
    try {
      let updateNeeded = await VersionCheck.needUpdate();
      //console.log('robeen');
      console.log(updateNeeded);
     
     // alert(updateNeeded);
      if (updateNeeded.isNeeded) {
        setupdateNeeded(updateNeeded.isNeeded);
        setupdateurl(updateNeeded.storeUrl);
        Linking.openURL(updateNeeded.storeUrl);
          // Alert.alert(
          //        'Please Update The New Version',
          //        'BD Law Service মোবাইল App টি আপডেট করে নিন।', 
          //        [{
          //            text: 'Update',
          //            onPress: ()=> {
          //             BackHandler.exitApp();
          //             Linking.openURL(updateNeeded.storeUrl);
          //            },
                     
          //        }, 
          //       ], 
          //       {
          //            cancelable: false
          //        }
          //     );
      }
  
    } catch (error) {
      return error;
    }
  };  
  // Token components must be outermost to prevent flash of white screen
  return (
   
    <TokenProvider>
      <TokenLoadBuffer>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={theme}>
            <SafeAreaProvider>
              <StatusBar style="light" />             
              <Navigation />              
            </SafeAreaProvider>
          </PaperProvider>
        </QueryClientProvider>
      </TokenLoadBuffer>
    </TokenProvider>
    
  );
}
