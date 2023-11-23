
import 'react-native-gesture-handler';

// Import React and Component
import React, {useState,useContext,}  from 'react';

// Import Navigators from React Navigation

import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Import Screens



import  DrawerNavigationRoutes from '../src/DrawerNavigationRoutes';



//import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
//import TabBar from 'react-native-custom-navigation-tabs';
//import Icon from 'react-native-vector-icons/FontAwesome'
// import NavigationDrawerHeader from './Screen/Components/NavigationDrawerHeader';
// import CustomSidebarMenu from './Screen/Components/CustomSidebarMenu';
// import TotalCaseScreen from './Screen/DrawerScreens/TotalCaseScreen';




const Stack = createNativeStackNavigator();
 
const Root = () => {
 
  
 

  //user login status
  
  return (

  
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
           
          </Stack.Navigator>
          

 


  )
};
 
export default Root;
