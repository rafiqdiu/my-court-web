import React, { useState , useEffect  } from "react";
import {Text, ScrollView, StyleSheet, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import ScreenBackground from '../../../components/ScreenBackground';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sharedStyles from '../../../sharedStyles';
import {globalStyles} from '../../../styles/globalStyles';


export default function LogOutScreen() {

  const navigation = useNavigation();
useFocusEffect(
  React.useCallback(() => {
    // Your code here
    AsyncStorage.clear();
   // window.location.reload();
  // window.location.href = window.location.href.replace(/#.*$/, '');
  //  window.location.replace(window.location.href);
  navigation.replace( 'AuthWeb' )
   // window.location.reload();
   // navigation.addListener('didFocus', () => console.log('x'));
  }, [ ])
);

 
  
  return (
    <ScreenBackground style={sharedStyles.bodyPadding}>
      <Text>Log Out</Text>
    </ScreenBackground>
  );


}

const styles = StyleSheet.create({
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
});
