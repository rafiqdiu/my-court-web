import * as SplashScreen from 'expo-splash-screen';
import {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useToken} from '../data/token';
import {useFonts} from 'expo-font';

export default function TokenLoadBuffer({children}) {
  const {isTokenLoaded} = useToken();
  const [fontsLoaded] = useFonts({
    //'open-sans-light': require('../../assets/fonts/SolaimanLipi.ttf'),
    //'open-sans-light-italic': require('../../assets/fonts/SolaimanLipi.ttf'),
   // 'open-sans-regular': require('../../assets/fonts/SolaimanLipi.ttf'),
   // 'open-sans-semi-bold': require('../../assets/fonts/SolaimanLipi-Bold.ttf'),
  //  'open-sans-semi-bold-italic': require('../../assets/fonts/SolaimanLipi-Bold.ttf'),
   // 'open-sans-bold': require('../../assets/fonts/SolaimanLipi-Bold.ttf'),
   // 'open-sans-bold-italic': require('../../assets/fonts/SolaimanLipi-Bold.ttf'),
   // 'open-sans-bold-italic': require('../../assets/fonts/SolaimanLipi-Bold.ttf'),
    'SolaimanLipi': require('../../assets/fonts/SolaimanLipi.ttf'),
  });
  // see https://docs.expo.dev/versions/latest/sdk/splash-screen/
  const onLayoutRootView = useCallback(() => {
    if (fontsLoaded) {
      return SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    SplashScreen.preventAutoHideAsync();
    return null; // because children will error
  } else {
    return (
      <View style={styles.fill} onLayout={onLayoutRootView}>
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    fontFamily:'SolaimanLipi'
  },
});
