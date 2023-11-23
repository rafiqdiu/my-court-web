import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useState} from 'react';
import {
  Platform,
  Dimensions,
  Text,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {NavigationContainer,getFocusedRouteNameFromRoute, createNavigationContainerRef ,useNavigationState,useRoute } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {large, useBreakpoint} from './breakpoints';
import CustomNavigationBar from './components/CustomNavigationBar';
import CustomNavigationDrawer from './components/CustomNavigationDrawer';
import {useToken} from './data/token';
import SignInScreen from './screens/SignInScreen';
import BookmarkDetailScreen from './screens/links/BookmarkDetailScreen';
import ReadScreen from './screens/links/ReadScreen';
import UnreadScreen from './screens/links/UnreadScreen';
import TagListScreen from './screens/tags/TagListScreen';
import TaggedLinksScreen from './screens/tags/TaggedLinksScreen';

import DashboardScreen from './screens/users/DashboardScreen';
import DashboardForMobileScreen from './screens/users/DashboardForMobileScreen';
import CaseScreen from './screens/users/CaseScreen';
import CaseDiaryScreen from './screens/users/CaseDiaryScreen';
import TotalCaseScreen from './screens/users/TotalCaseScreen';
import CaseViewScreen from './screens/users/CaseViewScreen';
import DiaryHistoryScreen from './screens/users/DiaryHistoryScreen';

import DailyCaseListScreen from './screens/users/DailyCaseListScreen';
import MySearchListScreen from './screens/users/MySearchListScreen';
import MyCaseScreen from './screens/users/MyCaseScreen';
import CaseEntryScreen from './screens/users/CaseEntryScreen';
import CaseEditScreen from './screens/users/CaseEditScreen';
import SettingsScreen from './screens/users/SettingsScreen';
import ProfileScreen from './screens/users/ProfileScreen';
import PasswordChangeScreen from './screens/users/PasswordChangeScreen';
import CaseHistoryScreen from './screens/users/CaseHistoryScreen';
import AdminScreen from './screens/users/AdminScreen';

import LogOutScreen from './screens/users/LogOutScreen';
import homeScreen from './screens/home/homeScreen';
import webHomeScreen from './screens/webHomeScreen';
import registrationScreen from './screens/RegistrationScreen';
import { DefaultThemeColors, DarkThemeColors,ThemeOne,ThemeTwo } from "./utils/constants/Colors";
const Colors2 = ThemeOne;
const windowWidth = Dimensions.get('window').width;
const linking = {
  config: {
    screens: {
      'Sign in': {
        initialRouteName: 'SignInScreen',
        screens: {
          SignInScreen: '/sign-in',
        },
      },
     
    },
  },
};


const afterLogin = {
  config: {
    screens: {
      Dashboard: {
        initialRouteName: 'DashboardScreen',
        screens: {
          DashboardScreen: '/Dashboard',
        },
      },
      DashboardForMobile: {
        initialRouteName: 'DashboardForMobileScreen',
        screens: {
          DashboardForMobileScreen: '/DashboardForMobile',
        },
      },
      Case: {
        path: '/users/Case',
        initialRouteName: 'CaseDiaryScreen',
        screens: {
          CaseDiaryScreen: '/CaseDiaryScreen',
        },
      },
      'My Search List': {
        path: '/users/MySearchList',
        initialRouteName: 'MySearchListScreen',
        screens: {
          MySearchListScreen: '/MySearchList',
        },
      },
      'My Case': {
        path: '/users/Mycase',
        initialRouteName: 'MyCaseScreen',
        screens: {
          MycaseScreen: '/MyCase',
        },
      },
    
      'Daily Case List': {
        path: '/users/DailyCaseList',
        initialRouteName: 'DailyCaseListScreen',
        screens: {
          DailyCaseListScreen: '/DailyCaseList',
        },
      },
      Settings: {
        path: '/users/Settings',
        initialRouteName: 'SettingsScreen', 
        screens: {
          SettingsScreen: '/Settings',
        },
      },
      'Log Out': {
        path: '/users/LogOutList',
        initialRouteName: 'LogOutScreen',
        screens: {
          LogOutScreen: '/LogOut',
        },
      },
    },
  },
};


const Stack = createNativeStackNavigator();
const stackScreenOptions = {
  header: props => <CustomNavigationBar {...props} />
};

const SignIn = () => (
  <Stack.Navigator  initialRouteName="SignInScreen"  screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="SignInScreen"
      component={SignInScreen}
      options={{
        title: 'লগ ইন',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </Stack.Navigator>
);

const Admin = () => (
  <Stack.Navigator  initialRouteName="AdminScreen"  screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="AdminScreen"
      component={AdminScreen}
      options={{
        title: 'অ্যাডমিন',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </Stack.Navigator>
);

// FOR WEB & Mobile MENU

const HomeStack = createNativeStackNavigator();
const Home = () => (
  <Stack.Navigator   initialRouteName="homeScreen" screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="homeScreen"
      component={homeScreen}
      options={{
        title: 'হোম',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </Stack.Navigator>
);
const WebHome = () => (
  <Stack.Navigator initialRouteName="webHomeScreen" screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="webHomeScreen"
      component={webHomeScreen}
      options={{
        title: 'হোম',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </Stack.Navigator>
);

const Registration = () => (
  <Stack.Navigator  initialRouteName="registrationScreen"  screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="registrationScreen"
      component={registrationScreen}
      options={{
        title: 'রেজিস্ট্রেশন',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </Stack.Navigator>
);


const Dashboard = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="DashboardScreen"
      component={DashboardScreen}
      options={{
        title: 'ড্যাসবোর্ড',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </Stack.Navigator>
);


const DashboardForMobile = () => (
  <Stack.Navigator initialRouteName="DashboardForMobileScreen" screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="DashboardForMobileScreen"
      component={DashboardForMobileScreen}
      options={{
        title: 'ড্যাসবোর্ড',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </Stack.Navigator>
);


const MySearchList = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="MySearchListScreen"
      component={MySearchListScreen}
      options={{
        title: 'আমার ডায়েরী',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </Stack.Navigator>
);


const Case = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
  
     <Stack.Screen 
      name="CaseEntry"
      component={CaseEntryScreen}
      options={{
        title: 'নতুন মামলা যোগ',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
    <Stack.Screen 
      name="CaseEditScreen"
      component={CaseEditScreen}
      options={{
        title: 'Case Edit',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
     <Stack.Screen 
      name="CaseDiaryScreen"
      component={CaseDiaryScreen}
      options={{
        title: 'Case Diary',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
    <Stack.Screen 
      name="TotalCaseScreen"
      component={TotalCaseScreen}
      options={{
        title: 'সকল মামলা ও রেজিস্ট্রার',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
    
    <Stack.Screen 
      name="DiaryHistoryScreen"
      component={DiaryHistoryScreen}
      options={{
        title: 'Case Diary History',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />

<Stack.Screen 
      name="CaseViewScreen"
      component={CaseViewScreen}
      options={{
        title: 'Case Information',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </Stack.Navigator>
);


const DailyCaseList = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="DailyCaseListScreen"
      component={DailyCaseListScreen}
      options={{
        title: 'দৈনিক কার্যতালিকা',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </Stack.Navigator>
);


const MyCase = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="MyCaseScreen"
      component={MyCaseScreen}
      options={{
        title: 'মামলা খুজুন',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
        
      }}
    />
    <Stack.Screen
      name="CaseHistoryScreen"
      component={CaseHistoryScreen}
      options={{
        title: 'Case History',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </Stack.Navigator>
);


const CaseEntry = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="CaseEntryScreen"
      component={CaseEntryScreen}
      options={{
        title: 'Case Entry',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </Stack.Navigator>
);


const Settings = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
  
     <Stack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={{
        title: 'প্রোফাইল',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
     <Stack.Screen
      name="PasswordChangeScreen"
      component={PasswordChangeScreen}
      options={{
        title: 'পাসওয়ার্ড পরিবর্তন',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </Stack.Navigator>
);


const LogOut = () => (
  <Stack.Navigator   screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="LogOutScreen"
      component={LogOutScreen}
      options={{
        title: 'Log Out',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </Stack.Navigator>
);


async function getUsername() {
  try {
    const jsonValue = await AsyncStorage.getItem('user_name');
    if (jsonValue !== null) {
      //console.log("user_name: "+JSON.parse(jsonValue));
      return JSON.parse(jsonValue);
    }
  } catch (err) {
    console.error(err);
  }
}

async function getPassword() {
  try {
    const jsonValue = await AsyncStorage.getItem('user_password');
    if (jsonValue !== null) {
      //console.log("user_password: "+JSON.parse(jsonValue));
      return JSON.parse(jsonValue);
    }
  } catch (err) {
    console.error(err);
  }
}

async function signOut() {
 alert('ff');
  //navigation.navigate('Sign in');
}
 


const Drawer = createDrawerNavigator();
const Tab = createMaterialTopTabNavigator();

const getDrawerTypeForBreakpoint = breakpoint =>
  breakpoint === large ? 'permanent' : 'back';

function NavigationContents(props) {
  //const {isLoggedIn} = useToken();
  const [swipeEnabled, setSwipeEnabled] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  //const {isLoggedIn} = useState(true);
  const breakpoint = useBreakpoint();
  const drawerTypeForBreakpoint = getDrawerTypeForBreakpoint(breakpoint);

  const getPlatForm = Platform.OS === 'web' ? 'web' : '';
  const [isPlatForm, setIsPlatForm] = useState(getPlatForm);

  //const windowHeight = Dimensions.get('window').height;
  //const {theme, changeThemeType} = useThemeContext();
  //console.log(windowWidth)
  // const tabHiddenRoutes = ['SettingDetails'];
  // React.useLayoutEffect(() => {
  //   if (tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))) {
  //     navigation.setOptions({ tabBarStyle: { display: 'none' } });
  //   } else {
  //     navigation.setOptions({ tabBarStyle: { display: 'flex' } });
  //   }
  // }, [navigation, route]);

    getUsername().then(getUser => { 
        getPassword().then(getPass => { 
        if(getUser !=undefined && getPass !=undefined)
          setIsLoggedIn(true)
          getUser === 'sadminjudge' ? setIsAdmin(true): setIsAdmin(false)
         

        });
    });
    //const route = useRoute();
    //const route = useRoute();
   // const routeName = getFocusedRouteNameFromRoute(route);
  // const route = navigation.current?.getCurrentRoute()
   const route = props.routeName

  return Platform.OS === 'web' && windowWidth >= 600 ? (
     <Tab.Navigator 
    // swipeEnabled={swipeEnabled}
    // swipeEnabled={false}
      initialRouteName="হোম"
    
      screenOptions={() => { 
        //console.log(route);
       
        return {
        
        tabBarScrollEnabled: false,
        swipeEnabled: false,
        tabBarIndicatorStyle: {
          backgrounColor: '#fff',
          width: 120,
          left: 195,
          flexWrap:'nowrap'
        },
        tabBarStyle: {
        display:route==="webHomeScreen"?"none":"flex",
          width:'100%',
          borderWidth: 0,
          elevation: 0,
          backgroundColor: '#fff',
          alignItems: 'flex-start',
          //marginBottom: 10,
          height: 50,
          // left: 100,
          paddingLeft:180,
          // marginLeft: 235,
          flexWrap:'nowrap'
        },
        tabBarItemStyle: {
          width: 150,
          //backgroundColor: '#00ff00',
          //margin: 5,
          borderRadius: 10,
        },
      
        tabBarActiveTintColor: '#000',
        tabBarLabelStyle: {
           width: 'auto', 
          // backgroundColor: '#f00',
          padding: 2,
          //borderBottomEndRadius: 13,
          left: 0,
          right: 0,
          bottom: 10,
          flexWrap:'nowrap'
        },
      }}}
    >
      {isLoggedIn ? (
        <>           
          <Tab.Screen name="ড্যাসবোর্ড" component={Dashboard} 
            options={{
              tabBarLabel: ({focused, color, size}) => (
                <Text style={{textAlign:'center', color: focused ? Colors2.top5 : color, fontWeight:'bold', textDecorationLine: focused ?'underline': 'none'}}>ড্যাসবোর্ড</Text>
              ),}}
          />
           <Tab.Screen name="মামলা"  component={Case}
           options={{
            tabBarLabel: ({focused, color, size}) => (
              <Text style={{textAlign:'center', color: focused ? Colors2.top5 : color, fontWeight:'bold', textDecorationLine: focused ?'underline': 'none'  }}>মামলা</Text>
            ),}}
          />
          <Tab.Screen name="দৈনিক কার্যতালিকা" component={DailyCaseList} 
           options={{
            tabBarLabel: ({focused, color, size}) => (
              <Text style={{textAlign:'center', color: focused ? Colors2.top5 : color, fontWeight:'bold', textDecorationLine: focused ?'underline': 'none'  }}>দৈনিক কার্যতালিকা</Text>
            ),}}
          /> 
          
        <Tab.Screen name="আমার ডায়েরী" component={MySearchList} 
           options={{
            tabBarLabel: ({focused, color, size}) => (
              <Text style={{textAlign:'center', color: focused ? Colors2.top5 : color, fontWeight:'bold', textDecorationLine: focused ?'underline': 'none'  }}>আমার ডায়েরী</Text>
            ),}}
          />
          <Tab.Screen name="মামলা খুজুন" component={MyCase} 
           options={{
           
            tabBarLabel: ({focused, color, size}) => (
              <Text style={{  textAlign:'center', color: focused ? Colors2.top5 : color,fontWeight:'bold', textDecorationLine: focused ?'underline': 'none'  }}>মামলা খুজুন</Text>
            ),}}
          />
      <Tab.Screen name="সেটিংস" component={Settings}
           options={{
            tabBarLabel: ({focused, color, size}) => (
              <Text style={{textAlign:'center', color: focused ? Colors2.top5 : color, fontWeight:'bold', textDecorationLine: focused ?'underline': 'none' }}>প্রোফাইল</Text>
            ),}}
          />
        {  isAdmin?     <Tab.Screen name="অ্যাডমিন" component={Admin} 
           options={{
            tabBarLabel: ({focused, color, size}) => (
              <Text style={{textAlign:'center', color: focused ? Colors2.top5 : color, fontWeight:'bold', textDecorationLine: focused ?'underline': 'none'  }}>অ্যাডমিন</Text>
            ),}}
          />:null}
          <Tab.Screen name="লগ আউট" component={LogOut}  
           options={{
            tabBarLabel: ({focused, color, size}) => (
              <Text style={{textAlign:'center', color: 'red', fontWeight:'bold', textDecorationLine: focused ?'underline': 'none'  }}>লগ আউট</Text>
            ),}}
          /> 

       
        </>
      ) : (
        <>
         
          <Tab.Screen  name="রেজিস্ট্রেশন" component={Registration} 
           options={{
            tabBarLabel: ({focused, color, size}) => (
              <Text style={{textAlign:'center', color: focused ? Colors2.top5 : color, fontWeight:'bold', textDecorationLine: focused ?'underline': 'none'  }}>রেজিস্ট্রেশন</Text>
            ),}}
          />
          
          <Tab.Screen name="লগ ইন" component={SignIn} 
           options={{
            tabBarLabel: ({focused, color, size}) => (
              <Text style={{textAlign:'center', color: focused ? Colors2.top5 : color, fontWeight:'bold', textDecorationLine: focused ?'underline': 'none'  }}>লগ ইন</Text>
            ),}}
          />
           <Tab.Screen name="হোম" component={WebHome} 
           options={{
            tabBarLabel: ({focused, color, size}) => (
              <Text style={{textAlign:'center', color: focused ? Colors2.top5 : color, fontWeight:'bold', textDecorationLine: focused ?'underline': 'none'  }}>হোম</Text>
            ),}}
          /> 
        
        </>
         
      )}
    </Tab.Navigator>
   
  ) : (
    <Drawer.Navigator 
    initialRouteName="ড্যাসবোর্ড"
      screenOptions={{
        headerShown: false,
        drawerType: drawerTypeForBreakpoint,
        drawerStyle: {
          width: isPlatForm === 'web' && windowWidth >= 600 ? 0 : 250,
        },
        
      }}
      // screenOptions={{
      //   headerShown: false,
      //   drawerActiveBackgroundColor : '#419641',
      // drawerActiveTintColor: "#fffccc",
      // drawerInactiveTintColor: "white",
      //   color: '#fff',
      //   itemStyle: {marginVertical: 5, color: '#ffff'},
      //   labelStyle: {
      //     color: '#fff',
      //   },
      //   drawerStyle: {
      //     backgroundColor: '#c6cbef',
      //     width: 240,
      //   },
      //  // overlayColor: 'transparent',
      // }}
      drawerContent={props => <CustomNavigationDrawer {...props} />}
    >
      {isLoggedIn ? (
        <>
          <Drawer.Screen name="ড্যাসবোর্ড" component={DashboardForMobile} /> 
          <Drawer.Screen name="মামলা" component={Case} />
          <Drawer.Screen name="দৈনিক কার্যতালিকা" component={DailyCaseList} />      
          <Drawer.Screen name="আমার ডায়েরী" component={MySearchList} />
          <Drawer.Screen name="মামলা খুজুন"  options={{
            drawerLabel: 'Hidden Page Two option',
            title: 'Hidden Page 2',
            drawerItemStyle: {
              display: 'none',
            },
          }}  component={MyCase}   
  />
          <Drawer.Screen name="সেটিংস" component={Settings}  />   

        </>
      ) : (
        <>
          {/* <Drawer.Screen name="হোম" component={Home} /> */}
          <Drawer.Screen name="লগ ইন" component={SignIn} />
        </>
      )}
    </Drawer.Navigator>
  );
}

const navigationRef = createNavigationContainerRef();
export default function Navigation() { 
  // IMPORTANT: NavigationContainer needs to not rerender too often or
  // else Safari and Firefox error on too many history API calls. Put
  // any hooks in NavigationContents so this parent doesn't rerender.
  const [routeName, setRouteName] = useState(null);
  return (
    <NavigationContainer   ref={navigationRef}
    onReady={() => {
      setRouteName(navigationRef.getCurrentRoute().name)
    }}
    onStateChange={async () => {
      const previousRouteName = routeName;
      const currentRouteName = navigationRef.getCurrentRoute().name;
     // console.log("route", currentRouteName)
      setRouteName(currentRouteName);
    }} afterLogin={afterLogin}>
      <NavigationContents routeName={routeName} />
    </NavigationContainer>
  );
  
}
