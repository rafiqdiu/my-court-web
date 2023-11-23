import {DrawerContentScrollView} from '@react-navigation/drawer';
import {Drawer, withTheme} from 'react-native-paper';
import {useToken} from '../data/token';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CustomNavigationDrawer({theme, ...navProps}) {
  const {state, navigation} = navProps;
  const {isLoggedIn, clearToken} = useToken();

  const isActive = index => index === state.index; 

  async function signOut() {
   // await clearToken();
   AsyncStorage.clear();
   navigation.replace('Auth');
  // navigation.addListener('didFocus', () => console.log('x'));
  //  navigation.navigate('Sign in');
  }

  const scrollViewStyle = {
    backgroundColor: theme.colors.background,
  };

  return (
    <DrawerContentScrollView style={scrollViewStyle} {...navProps}>
      {state.routes.map((route, index) => (
       
        <Drawer.Item
          key={route.key}
          label={route.name==="MobileWebHomeScreen"?"হোম":route.name}
          accessibilityLabel={route.name}
         
          active={isActive(index)}
          onPress={() => navigation.navigate(route.name)}

        />
      ))}
      <Drawer.Item label="Sign out" onPress={signOut} />
    
    </DrawerContentScrollView>
  );
}

export default withTheme(CustomNavigationDrawer);
