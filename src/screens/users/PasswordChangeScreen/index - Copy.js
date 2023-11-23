import React, { useState } from "react";
import {Text, ScrollView, StyleSheet, Platform,Dimensions, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import ScreenBackground from '../../../components/ScreenBackground';
import LeftBar from '../../../shared/LeftBar';
import LeftBarItem from '../../../shared/LeftBarItem';
import sharedStyles from '../../../sharedStyles';
import {globalStyles} from '../../../styles/globalStyles'

const windowWidth = Dimensions.get('window').width;

export default function PasswordChangeScreen() {
  
 
  return (
    <View   style={Platform.OS === 'web' && windowWidth >= 600?globalStyles.mainContainer:globalStyles.mainContainerMobile}>
    <LeftBar>   
       <LeftBarItem   name = 'Home'  stack = 'Settings'   screen = 'SettingsScreen' />
       <LeftBarItem   name = 'Profile'  stack = 'Settings'   screen = 'ProfileScreen' />
       <LeftBarItem  selectcolor='true'  name = 'PasswordChange'  stack = 'Settings'   screen = 'PasswordChangeScreen' />
   </LeftBar>
    
     <View style={ Platform.OS === 'web' && windowWidth >= 600?globalStyles.bodyContainer:globalStyles.bodyContainerMobile}>
    <ScreenBackground style={sharedStyles.bodyPadding}> 
      <Text>Password Change Screen</Text>
    </ScreenBackground>
    </View>
    </View>
  );


}

const styles = StyleSheet.create({
  mainContainer: {
    flex:1,
    flexDirection: 'row'
  },
  LeftContainer: {
   flex: 1,
   backgroundColor: "#aa88aa" 
  },
  bodyContainer: {
    flex: 6
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
});
