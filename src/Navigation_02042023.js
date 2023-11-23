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
import {NavigationContainer} from '@react-navigation/native';
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
import CaseScreen from './screens/users/CaseScreen';
import DailyCaseListScreen from './screens/users/DailyCaseListScreen';
import MySearchListScreen from './screens/users/MySearchListScreen';
import MyCaseScreen from './screens/users/MyCaseScreen';
import CaseEntryScreen from './screens/users/CaseEntryScreen';
import SettingsScreen from './screens/users/SettingsScreen';
import LogOutScreen from './screens/users/LogOutScreen';
import homeScreen from './screens/home/homeScreen';
import registrationScreen from './screens/RegistrationScreen';

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
      // Unread: {
      //   path: '/links/unread',
      //   initialRouteName: 'UnreadScreen',
      //   screens: {
      //     UnreadScreen: '',
      //     BookmarkDetailScreen: ':id',
      //   },
      // },
      // Read: {
      //   path: '/links/read',
      //   initialRouteName: 'ReadScreen',
      //   screens: {
      //     ReadScreen: '',
      //     BookmarkDetailScreen: ':id',
      //   },
      // },
      // Tags: {
      //   path: '/tags',
      //   initialRouteName: 'TagListScreen',
      //   screens: {
      //     TagListScreen: '',
      //     TaggedLinksScreen: ':tag',
      //     BookmarkDetailScreen: ':tag/:id',
      //   },
      // },
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
      Case: {
        path: '/users/Case',
        initialRouteName: 'CaseScreen',
        screens: {
          CaseScreen: '/Case',
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
      'Case Entry': {
        path: '/users/CaseEntryScreen',
        initialRouteName: 'CaseEntryScreen',
        screens: {
          CaseEntryScreen: '/CaseEntry',
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

const stackScreenOptions = {
  header: props => <CustomNavigationBar {...props} />,
};
const SignInStack = createNativeStackNavigator();
const SignIn = () => (
  <SignInStack.Navigator screenOptions={stackScreenOptions}>
    <SignInStack.Screen
      name="SignInScreen"
      component={SignInScreen}
      options={{
        title: 'Sign in',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </SignInStack.Navigator>
);

// FOR WEB & Mobile MENU

const HomeStack = createNativeStackNavigator();
const Home = () => (
  <HomeStack.Navigator screenOptions={stackScreenOptions}>
    <HomeStack.Screen
      name="homeScreen"
      component={homeScreen}
      options={{
        title: 'Home',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </HomeStack.Navigator>
);
const RegistrationStak = createNativeStackNavigator();
const Registration = () => (
  <RegistrationStak.Navigator screenOptions={stackScreenOptions}>
    <RegistrationStak.Screen
      name="registrationScreen"
      component={registrationScreen}
      options={{
        title: 'Registration',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </RegistrationStak.Navigator>
);

const DashboardStack = createNativeStackNavigator();
const Dashboard = () => (
  <DashboardStack.Navigator screenOptions={stackScreenOptions}>
    <DashboardStack.Screen
      name="DashboardScreen"
      component={DashboardScreen}
      options={{
        title: 'Dashboard',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </DashboardStack.Navigator>
);

const MySearchListStack = createNativeStackNavigator();
const MySearchList = () => (
  <MySearchListStack.Navigator screenOptions={stackScreenOptions}>
    <MySearchListStack.Screen
      name="MySearchListScreen"
      component={MySearchListScreen}
      options={{
        title: 'My Search List',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </MySearchListStack.Navigator>
);

const CaseStack = createNativeStackNavigator();
const Case = () => (
  <CaseStack.Navigator initialRouteName={CaseScreen} screenOptions={stackScreenOptions}>
    <CaseStack.Screen
      name="CaseScreen"
      component={CaseScreen}
      options={{
        title: 'Case',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
     <CaseStack.Screen 
      name="CaseEntry"
      component={CaseEntryScreen}
      options={{
        title: 'Case Entry',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </CaseStack.Navigator>
);

const DailyCaseListStack = createNativeStackNavigator();
const DailyCaseList = () => (
  <DailyCaseListStack.Navigator screenOptions={stackScreenOptions}>
    <DailyCaseListStack.Screen
      name="DailyCaseListScreen"
      component={DailyCaseListScreen}
      options={{
        title: 'Daily Case List',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </DailyCaseListStack.Navigator>
);

const MyCaseScreentStack = createNativeStackNavigator();
const MyCase = () => (
  <MyCaseScreentStack.Navigator screenOptions={stackScreenOptions}>
    <MyCaseScreentStack.Screen
      name="MyCaseScreen"
      component={MyCaseScreen}
      options={{
        title: 'My Case',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
    
  </MyCaseScreentStack.Navigator>
);

const CaseEntryScreentStack = createNativeStackNavigator();
const CaseEntry = () => (
  <CaseEntryScreentStack.Navigator screenOptions={stackScreenOptions}>
    <CaseEntryScreentStack.Screen
      name="CaseEntryScreen"
      component={CaseEntryScreen}
      options={{
        title: 'Case Entry',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </CaseEntryScreentStack.Navigator>
);

const SettingsScreenStack = createNativeStackNavigator();
const Settings = () => (
  <SettingsScreenStack.Navigator screenOptions={stackScreenOptions}>
    <SettingsScreenStack.Screen
      name="SettingsScreen"
      component={SettingsScreen}
      options={{
        title: 'Settings',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </SettingsScreenStack.Navigator>
);

const LogOutScreenStack = createNativeStackNavigator();
const LogOut = () => (
  <LogOutScreenStack.Navigator   screenOptions={stackScreenOptions}>
    <LogOutScreenStack.Screen
      name="LogOutScreen"
      component={LogOutScreen}
      options={{
        title: 'Log Out',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </LogOutScreenStack.Navigator>
);
// const AppDrawerContent = props => {
//   return (
//     <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1}}>
//       {/*all of the drawer items*/}
//       <DrawerItemList {...props} style={{borderWidth: 1}} />
//       <View style={{flex: 1, marginVertical: 20, borderWidth: 1}}>
//         {/* here's where you put your logout drawer item*/}
//         <DrawerItem
//           label="Log out"
//           onPress={() => {
//             //  AsyncStorage.clear();
//             props.navigation.replace('loginScreen');
//           }}
//           style={{flex: 1, justifyContent: 'flex-end'}}
//         />
//       </View>
//     </DrawerContentScrollView>
//   );
// };

// FOR WEB & Mobile MENU



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


const Drawer = createDrawerNavigator();
const Tab = createMaterialTopTabNavigator();

const getDrawerTypeForBreakpoint = breakpoint =>
  breakpoint === large ? 'permanent' : 'back';

function NavigationContents() {
  //const {isLoggedIn} = useToken();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //const {isLoggedIn} = useState(true);
  const breakpoint = useBreakpoint();
  const drawerTypeForBreakpoint = getDrawerTypeForBreakpoint(breakpoint);

  const getPlatForm = Platform.OS === 'web' ? 'web' : '';
  const [isPlatForm, setIsPlatForm] = useState(getPlatForm);

  //const windowHeight = Dimensions.get('window').height;
  //const {theme, changeThemeType} = useThemeContext();
  //console.log(windowWidth)


    getUsername().then(getUser => { 
        getPassword().then(getPass => { 
        if(getUser !=undefined && getPass !=undefined)
          setIsLoggedIn(true)
        });
    });

  return Platform.OS === 'web' && windowWidth >= 600 ? (
    <> <Tab.Navigator
      initialRouteName="Home"
      // sceneContainerStyle={{
      //   backgroundColor: '',
      // }}
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarIndicatorStyle: {
          backgrounColor: '#fff',
          width: 120,
          left: 20,
        },
        tabBarStyle: {
          width: '100%',
          borderWidth: 0,
          elevation: 0,
          backgroundColor: '#fff',
          alignItems: 'flex-start',
          //marginBottom: 10,
          height: 50,
          // left: 100,
          marginLeft: 100,
        },
        tabBarItemStyle: {
          width: 150,
          //backgroundColor: '#00ff00',
          //margin: 5,
          borderRadius: 10,
        },
        tabBarActiveTintColor: '#000',
        tabBarLabelStyle: {
          // width: 'auto',
          // backgroundColor: '#f00',
          padding: 5,
          //borderBottomEndRadius: 13,
          left: 0,
          right: 0,
          bottom: 10,
        },
      }}
    >
      {isLoggedIn ? (
        <>           
          <Tab.Screen name="Dashboard" component={Dashboard} />
          <Tab.Screen name="Case"  component={Case} />
          <Tab.Screen name="Daily Case List" component={DailyCaseList} /> 
          {/* <Tab.Screen name="Case Entry" component={CaseEntry} /> */}
          <Tab.Screen name="My Search List" component={MySearchList} />
          <Tab.Screen name="Case Search" component={MyCase} />
          <Tab.Screen name="Settings" component={Settings} />
          <Tab.Screen name="LogOut" component={LogOut} />
       
        </>
      ) : (
        <>
          <Tab.Screen name="Home" component={Home} /> 
          <Tab.Screen name="Registration" component={Registration} />
          <Tab.Screen name="Sign in" component={SignIn} />
          {/* <Tab.Screen name="Dashboard" component={Dashboard} /> */}
        </>
         
      )}
    </Tab.Navigator>
    </>
  ) : (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: drawerTypeForBreakpoint,
        drawerStyle: {
          width: isPlatForm === 'web' && windowWidth >= 600 ? 0 : 250,
        },
      }}
      drawerContent={props => <CustomNavigationDrawer {...props} />}
    >
      {isLoggedIn ? (
        <>
          <Drawer.Screen name="Dashboard" component={Dashboard} />
          <Drawer.Screen name="Case" component={Case} />
          <Drawer.Screen name="Daily Case List" component={DailyCaseList} />
          {/* <Drawer.Screen name="Case Entry" component={CaseEntry} /> */}
          <Drawer.Screen name="My Search List" component={MySearchList} />
          <Drawer.Screen name="Case Search" component={MyCase} />
          <Drawer.Screen name="Settings" component={Settings} />
          {/* <Drawer.Screen name="LogOut" component={LogOut} /> */}

        </>
      ) : (
        <>
          <Drawer.Screen name="home" component={Home} />
          <Drawer.Screen name="Sign in" component={SignIn} />
        </>
      )}
    </Drawer.Navigator>
  );
}

export default function Navigation() {
  // IMPORTANT: NavigationContainer needs to not rerender too often or
  // else Safari and Firefox error on too many history API calls. Put
  // any hooks in NavigationContents so this parent doesn't rerender.
  return (
    <NavigationContainer afterLogin={afterLogin}>
      <NavigationContents />
    </NavigationContainer>
  );
}
