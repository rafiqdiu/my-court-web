
import 'react-native-gesture-handler';

// Import React and Component
import React, {useState,useContext}  from 'react';
import {
 
  Platform ,
  View, 
  StyleSheet,
  Image,
  Dimensions
} from 'react-native';
// Import Navigators from React Navigation

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AppHomeScreen from '../src/screens/users/AppHomeScreen';
import BdlawScreen from '../src/screens/users/BdlawScreen';
// Import Screens
import  DrawerNavigationRoutes from '../src/DrawerNavigationRoutes';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
const windowWidth = Dimensions.get('window').width;

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();


const HomeScreenStack = ({navigation}) => {

 

  return (
    <Stack.Navigator initialRouteName="AppHomeScreen">
      <Stack.Screen
        name="AppHomeScreen"
        component={AppHomeScreen}
        options={{
          title: 'Home', //Set Header Title
          headerTitleAlign: 'center',
         
        }}
      />
     
    </Stack.Navigator>
  );
};




 
const Root = () => {
 
  
 

  //user login status
  
  return Platform.OS === 'web' && windowWidth >= 600 ? (

    
    <Stack.Navigator  initialRouteName="Home"   
    activeColor="#f0edf6"
    inactiveColor="#3e2465"
    barStyle={{ backgroundColor: '#694fad' }}
    shifting={true}
    tabPress={true}
  >    
        <Stack.Screen
          name="Home"
          component={DrawerNavigationRoutes}
          // Hiding header for Navigation Drawer
         // options={{headerShown: false}}
         options={{
          headerShown: false,
          // tabBarLabel: 'Home',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="home" color={color} size={26} />
          // ),
        }}
        />           
          </Stack.Navigator>):(<Tab.Navigator  initialRouteName="HomeDashboard"   
          activeColor="#f0edf6"
          inactiveColor="#3e2465"
          barStyle={{ backgroundColor: '#694fad' }}
          shifting={true}
          tabPress={true}
        >
             <Tab.Screen      
                name="AppHome"
                component={HomeScreenStack}
                options={{
                  headerShown: true,
                  tabBarLabel: 'Home',
                  tabBarIcon: ({ focused }) => (
                    <View >{focused ? <Image style={styles.image_show} source={require('../assets/home-icon-red.png')}                               
                            />:<Image style={styles.image_show} source={require('../assets/home-icon-black.png')} />}</View>
                ),
                }}
              />  
              <Tab.Screen
                name="HomeDashboard"
                component={DrawerNavigationRoutes}
                // Hiding header for Navigation Drawer
               // options={{headerShown: false}}
               options={{
                headerShown: false,
                tabBarLabel: 'Dashboard',
                // tabBarIcon: ({ color, size }) => (
                //   <Icon name="globe" color={color} size={26} />
                // ),
                tabBarIcon: ({ focused }) => (
                  <View >{focused ? <Image style={styles.image_show} source={require('../assets/jc.png')}                               
                          />:<Image style={styles.image_show} source={require('../assets/jc.png')} />}</View>
              ),
              }}
              /></Tab.Navigator>
 


  )
};
const styles = StyleSheet.create({
  image_show: {
height:25, width:25,
borderRadius:8
  },
});
 
export default Root;
