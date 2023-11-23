import React, { useState } from 'react';
import { View, Text, StyleSheet,Platform,Dimensions, TouchableOpacity, Animated } from 'react-native';
import WavyleftBar from './WavyleftBar';
import { DefaultThemeColors, DarkThemeColors,ThemeOne,ThemeTwo } from "../utils/constants/Colors";
const windowWidth = Dimensions.get('window').width;
const Colors2 = ThemeOne;
//const Colors1 = ThemeTwo;
const LeftBar = ({ children }) => {
 

  return (
   
      <View style={Platform.OS === 'web' && windowWidth >= 600?styles.leftBar:styles.leftBarMobiole}>
        
           
        {children}
       
       
          
        </View>
     
    
  );
};

const styles = StyleSheet.create({
  
  leftBar: {
    width: 150,
    flex: 1,
    flexDirection: 'column',
    paddingTop:20,
    //backgroundColor: 'transparent',
   backgroundColor: Colors2.leftbar,

  },
  leftBarMobiole: {
    width: 'auto',
    padding:5,
    flex: 1,
    marginLeft:0,
    flexDirection: 'row',
    backgroundColor: Colors2.leftbar,
    zIndex:9999
//backgroundColor: 'transparent',
  },
  backgroundImage: {
   // flex: 1,
  position: 'relative',
    width: Dimensions.get('window').width,
    bottom: 0,
    top:0,
   // left:0,
    zIndex: -1,
  },
});

export default LeftBar;
