import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions, Animated } from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import { DefaultThemeColors, DarkThemeColors,ThemeOne,ThemeTwo } from "../utils/constants/Colors";

const Colors2 = ThemeOne;

const windowWidth = Dimensions.get('window').width;
export default function LeftBarItem(props) {
 const color = props.selectcolor === 'true'? '#fff':Colors2.top7;
  const navigation = useNavigation();
  return (
   
    <TouchableOpacity
    style={[Platform.OS === 'web' && windowWidth >= 600?styles.button:styles.buttonMobile, {borderBottomColor: color}]}
    onPress={() => navigation.navigate(props.stack,{screen:props.screen}) }
    {...props}
  >
    <Text  style={[Platform.OS === 'web' && windowWidth >= 600?styles.buttonText:styles.buttonTextMobile, {color: color}]} > {props.name?props.name:""} </Text>
  </TouchableOpacity>
     
    
  );
};

const styles = StyleSheet.create({
  
  menu: {
   // position: '',
    top: 0,
    left: 0,
    height: '100%',
    width: 200,
    backgroundColor: '#333',
    padding: 20,
  },
  menuItem: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    //position: 'absolute',
    marginTop: 10,
   left: 5,
    padding: 5,
    //paddingHorizontal:20,
    //backgroundColor: '#333',
    borderBottomWidth:1,
    
    //borderRadius: 5,
  },
  buttonText: {
   // color: '#fff',
    fontSize: 16,
    fontWeight:'bold',
    fontFamily:'SolaimanLipi'
  },
  buttonTextMobile: {
    // color: '#fff',
     fontSize: 14,
     fontWeight:'bold',
     fontFamily:'SolaimanLipi'
   },
  buttonMobile: {
   
    paddingHorizontal:3,
    paddingVertical:5,
    //backgroundColor: '#333',
   // borderBottomWidth:1,
   borderRightWidth:1,
   borderRightColor: '#fff',
    
    //borderRadius: 5,
  },
 
 
});

//export default LeftBarItem;
