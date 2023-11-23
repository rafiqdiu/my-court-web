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
import MyCaseScreen from './screens/users/MyCaseScreen';
import SettingsScreen from './screens/users/SettingsScreen';
import LogOutScreen from './screens/users/LogOutScreen';
import homeScreen from './screens/home/homeScreen';

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

const stackScreenOptions = {
  header: props => <CustomNavigationBar {...props} />,
};
const Stack = createNativeStackNavigator();
// const SignIn = ({navigation}) => (
//   <Stack.Navigator screenOptions={stackScreenOptions}>
//     <Stack.Screen
//       name="SignInScreen"
//       component={SignInScreen}
//       options={{
//         title: 'Sign in',
//         headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
//       }}
//     />
//   </Stack.Navigator>
// );

// FOR WEB & Mobile MENU

//const HomeStack = createNativeStackNavigator();
const home = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="homeScreen"
      component={homeScreen}
      options={{
        title: 'Home',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
    <Stack.Screen
      name="SignInScreen"
      component={SignInScreen}
      options={{
        title: 'Sign in',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
  </Stack.Navigator>
);

//const DashboardStack = createNativeStackNavigator();
const Dashboard = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="DashboardScreen"
      component={DashboardScreen}
      options={{
        title: 'Dashboard',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
    <Stack.Screen
      name="CaseScreen"
      component={CaseScreen}
      options={{
        title: 'Case',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
    <Stack.Screen
      name="DailyCaseListScreen"
      component={DailyCaseListScreen}
      options={{
        title: 'Daily Case List',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
    <Stack.Screen
      name="MyCaseScreen"
      component={MyCaseScreen}
      options={{
        title: 'My Case',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
    <Stack.Screen
      name="SettingsScreen"
      component={SettingsScreen}
      options={{
        title: 'Settings',
        headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
      }}
    />
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

// //const CaseStack = createNativeStackNavigator();
// const Case = () => (
//   <Stack.Navigator screenOptions={stackScreenOptions}>
//     <Stack.Screen
//       name="CaseScreen"
//       component={CaseScreen}
//       options={{
//         title: 'Case',
//         headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
//       }}
//     />
//   </Stack.Navigator>
// );

// //const DailyCaseListStack = createNativeStackNavigator();
// const DailyCaseList = () => (
//   <Stack.Navigator screenOptions={stackScreenOptions}>
//     <Stack.Screen
//       name="DailyCaseListScreen"
//       component={DailyCaseListScreen}
//       options={{
//         title: 'Daily Case List',
//         headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
//       }}
//     />
//   </Stack.Navigator>
// );

// //const MyCaseScreentStack = createNativeStackNavigator();
// const MyCase = () => (
//   <Stack.Navigator screenOptions={stackScreenOptions}>
//     <Stack.Screen
//       name="MyCaseScreen"
//       component={MyCaseScreen}
//       options={{
//         title: 'My Case',
//         headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
//       }}
//     />
//   </Stack.Navigator>
// );

// //const SettingsScreenStack = createNativeStackNavigator();
// const Settings = () => (
//   <Stack.Navigator screenOptions={stackScreenOptions}>
//     <Stack.Screen
//       name="SettingsScreen"
//       component={SettingsScreen}
//       options={{
//         title: 'Settings',
//         headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
//       }}
//     />
//   </Stack.Navigator>
// );

// //const LogOutScreenStack = createNativeStackNavigator();
// const LogOut = () => (
//   <Stack.Navigator screenOptions={stackScreenOptions}>
//     <Stack.Screen
//       name="LogOutScreen"
//       component={LogOutScreen}
//       options={{
//         title: 'Log Out',
//         headerShown: Platform.OS === 'web' && windowWidth >= 600 ? false : true,
//       }}
//     />
//   </Stack.Navigator>
// );
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
  //alert(windowWidth)

  return Platform.OS === 'web' && windowWidth >= 600 ? (
    <Tab.Navigator
      initialRouteName="home"
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
          <Tab.Screen name="Dashboard" component={DashboardScreen} />
          <Tab.Screen name="Case" component={CaseScreen} />
          <Tab.Screen name="Search My case" component={DailyCaseListScreen} />
          <Tab.Screen name="Daily Case List" component={MyCaseScreen} />
          <Tab.Screen name="Daily Search List" component={MyCaseScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
          <Tab.Screen name="LogOut" component={LogOutScreen} />
        </>
      ) : (
        <>
          <Tab.Screen name="Home" component={home} />
          <Tab.Screen name="Sign in" component={SignInScreen} />
        </>
      )}
    </Tab.Navigator>
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
          <Drawer.Screen name="Dashboard" component={DashboardScreen} />
          <Drawer.Screen name="Case" component={CaseScreen} />
          <Drawer.Screen
            name="Search My case"
            component={DailyCaseListScreen}
          />
          <Drawer.Screen name="Daily Case List" component={MyCaseScreen} />
          <Drawer.Screen name="Daily Search List" component={MyCaseScreen} />
          <Drawer.Screen name="Settings" component={SettingsScreen} />
          {/* <Drawer.Screen name="LogOut" component={LogOut} /> */}
        </>
      ) : (
        <>
          <Drawer.Screen name="home" component={home} />
          <Drawer.Screen name="Sign in" component={SignInScreen} />
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
