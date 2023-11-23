// Import React and Component
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {useState, createRef, useEffect, useContext, useRef} from 'react';
import {
  ActivityIndicator,
  Button,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  NativeModules
} from 'react-native';

import {Restart} from 'fiction-expo-restart';
import * as Updates from 'expo-updates';

import SelectDropdown from 'react-native-select-dropdown';
import {BASE_URL} from '../../components/BaseUrl';
import Loader from '../../components/Loader';
import{ ImagesAssets } from '../../utils/constants/Consts';
//import { AuthContext } from "../../contexts/AuthContext";

import {useFocusEffect, useNavigation} from '@react-navigation/native';
//import AnimatedLoader from 'react-native-animated-loader';

import MaterialCheckboxWithLabel from '../../components/MaterialCheckboxWithLabel';

const {width} = Dimensions.get('window');
const windowWidth = Dimensions.get('window').width;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const LoginScreen = () => {
  const [UserTypes, setUserTypes] = useState('');
  const [Username, setUsername] = useState('');
  const [UserPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const navigation = useNavigation();
  // const {setAuthStatus} = useContext(AuthContext);
  const [inputBorder, setInputBorder] = useState('');
  const [DId, setDevice_id] = useState(null);
  const [selected, setSelected] = useState(undefined);
  const [islogin, setislogin] = useState(false);
  const data = [
    {label: 'Paid User', value: '4'},
    {label: 'Free User (3 Days)', value: '5'},
    {label: 'Supreme Court User', value: '1'},
  ];
  const UserType = ['Paid User', 'Free User (3 Days)', 'Supreme Court User'];

  const passwordInputRef = createRef();

  // const onFocus = () => {
  //   setInputBorder("#F00");
  // };

  // const onBlur = () => {
  //   setInputBorder("#F00");
  // };

  //const lastNotificationResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (Platform.OS === 'android') {
      setDevice_id(1);
    }
    if (Platform.OS === 'ios') {
      setDevice_id(2);
    }
    if (Platform.OS === 'web') {
      setDevice_id(3);
    }
    setInterval(() => {
      setVisible(!visible);
    }, 200);
   // 
    const urlParams = new URLSearchParams(window.location.search);
   // console.log(urlParams);
    //urlParams = atob(urlParams);
   
   const token = urlParams.get('token');
    
   let  ss  = atob(token);
   const alld1 = ss.split('&pass=');
   //const alld = ss.split('&pass=')[0].trim();

  // console.log(alld);
  const userId = alld1[0];
  const Passtoken =alld1[1];

   

    //const userId = urlParams.get('userId');
    if(userId!=null){
      setUsername(userId);
     
    }
    if(Passtoken!=null){
      setUserPassword(Passtoken);

    }
    if(Passtoken!=null && userId!=null ){
      handleSubmitPress(Passtoken,userId);
      console.log(Passtoken)
      console.log(userId)
    }else{
      setislogin(true);
    }
    // ipAlert();
    // AsyncStorage.getItem('user_id').then((value) =>
    //       console.log("user_password: "+JSON.parse(value))
    //   );

    // navigation.replace(
    //   'RegisterScreen',
    // );

    // if (
    //   lastNotificationResponse &&
    //   lastNotificationResponse.notification.request.content.data.url &&
    //   lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
    // )
    // {
    //   Linking.openURL('DrawerNavigationRoutes');
    // }

    // if(notification && notification.request.content.data.url)
    // {
    //navigation.replace('CaseResultScreen');
    //navigation.replace('RegisterScreen');
    //props.navigation.replace(notification.request.content.data.url);
    //navigation.replace(notification.request.content.data.url);
    //console.log(notification.request.content.data.url);
    //}

    // getUserType().then(usrType => setUserTypes(usrType));
    getUsername().then(usrName => setUsername(usrName));
    getPassword().then(usrPassword => setUserPassword(usrPassword));

    //console.log(notification && notification.request.content.data.url);

    //console.log('Get async storage data: '+UserTypes+"==="+Username+"==="+UserPassword);
    if (Platform.OS !== 'web') {
      registerForPushNotificationsAsync().then(token =>
        setExpoPushToken(token),
      );

      notificationListener.current =
        Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener(response => {
          //console.log(response);
        });

      return () => {
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
  }, []);

  const handleSubmitPress = (UserPassword,Username) => {
    setErrortext('');
    if (!Username) {
      alert('Please fill Username');
      return;
    }
    if (!UserPassword) {
      alert('Please fill Password'); 
      return;
    }
    setLoading(true);

    //console.log("======="+UserAccountType);

    let dataToSend = {
     // DeviceId: DId,
     apps_user_type: 2,
      username: Username,
      password: UserPassword,
    };
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    try {
      let url = 'https://reactnative.bdlawservice.com/public/api/appsAndWebLogin';

      axios
        .post(url, formBody)
        .then(response => {
          //Hide Loader
          setLoading(false);
          //console.log(response);

          //navigation.replace('homeScreen');

          //NativeModules.DevSettings.reload();

        console.log(response.data)

          if (response.data.code === 200 || response.data.code === 504) {
            //alert('Login Successfuly');
            AsyncStorage.clear();
            AsyncStorage.setItem('user_name', JSON.stringify(Username));
            AsyncStorage.setItem(
              'user_id',
              JSON.stringify(Username),
            );
            AsyncStorage.setItem('user_password', JSON.stringify(UserPassword));
            // setAuthStatus({
            //   userType: UserAccountType,
            //   userName: Username,
            //   chamberId: response.data.chamber_id,
            //   userId: response.data.user_id,
            // });

            // expoTokenUpdate(JSON.stringify(response.data.user_id));
            // navigation.replace('Home');
            if (Platform.OS === 'web') {

              //window.location.reload();
              window.location.replace("https://bdjudgecourt.com/");
             //navigation.addListener('didFocus', () => console.log('x'));
            }
         else{

              Updates.reloadAsync();
              //Restart();

              navigation.addListener('didFocus', () => console.log('x'));
              //navigation.navigate("DashboardScreen");
         }
           // navigation.navigate("Dashboard");
            //navigation.navigate("Dashboard")

              //navigation.navigate("Dashboard")

              

            
          } else {
            setErrortext(response.data.msg);
            //console.log(response.data.msg);
          }
        })
        .catch(error => {
          //Hide Loader
          setLoading(false);
          console.error(error);
        });
    } catch (err) {
      console.error(err);
    }
  };
  const setIframeLoader = () => {
    setLoading(false);
  };



  const expoTokenUpdate = async UserId => {
    try {
      let url = BASE_URL + '/UpdateUserExpoToken';

      const DeviceInformation =
        Device.deviceName.replace(/ /g, '') +
        '-' +
        Device.productName +
        '-' +
        Device.osVersion +
        '-' +
        Device.osBuildId;

      const data = {
        id: UserId,
        api_token: expoPushToken,
        mobDeviceId: Device.osName + '-' + Device.totalMemory,
        deviceInformation: DeviceInformation,
      };

      axios.post(url, data).then(response => {
        if (response.data.code == 200) {
          //console.log("Successfully Updated Expo Token.");
        }
      });
      //  onRefresh;
    } catch (err) {
      console.error(err);
    }
  };

  return (<View style={styles.containerweb}>
   {/* {loading?<View style={{ flex:1, alignItems: 'center', paddingTop:'20%', justifyContent: 'center'}}><Image style={styles.imgBannertop} source={ImagesAssets.logo1} />
          <Text style={styles.customBtnTexttop}>Welcome To New BD Law Service{"\n"}</Text>
          <ActivityIndicator size="large"/> 
        
          </View> : null } */}
    { windowWidth >= 600?(
   <iframe  src="https://new.siddiqueenterprise.com/"  frameBorder="0" height="1200" loading="lazy" style={{flex:1,  width:'100%',height:1200, zIndex:99999 }} ></iframe>):(
    <iframe  src="https://newm.siddiqueenterprise.com/"  loading="lazy" frameBorder="0" style={{flex:1,   width:'100%',height:1200, zIndex:99999 }} ></iframe>)
    }
    </View>
  );
};
export default LoginScreen;

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const {status: existingStatus} = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const {status} = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

async function getUserType() {
  try {
    const jsonValue = await AsyncStorage.getItem('user_type');
    if (jsonValue !== null) {
      //console.log("user_type: "+JSON.parse(jsonValue));
      return JSON.parse(jsonValue);
    }
  } catch (err) {
    console.error(err);
  }
}

async function getUserId() {
  try {
    const jsonValue = await AsyncStorage.getItem('user_id');
    if (jsonValue !== null) {
      //console.log("user_id: "+JSON.parse(jsonValue));
      return JSON.parse(jsonValue);
    }
  } catch (err) {
    console.error(err);
  }
}

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

const styles = StyleSheet.create({
  lottie: {
    width: 200,
    height: 200,
  },
  customBtnTexttop: {
    justifyContent:'center',
    marginTop:20,
    color:'#05753d',
    fontWeight:'bold',
    fontSize:22
  },
  imgBannertop:{
    width:80,
    height:80,
    justifyContent:'center',
    alignSelf:'center',
    borderRadius:15,
      },
  containerweb: {
    flex: 1,
marginTop:0,
padding:0,
width:'100%',height:600
   // alignItems: 'center',
  //  justifyContent: 'center',
   // backgroundColor: '#f0f0f0',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  allview: {
    width: '100%',
  },
  mainBody: {
    flex: 1,

    backgroundColor: '#307ecc',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 38,
    marginTop: 10,
    marginLeft: 35,
    marginRight: 35,
    margin: 5,
  },
  buttonStyle: {
    backgroundColor: '#22BDDE',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#22BDDE',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    // left: 20,
    paddingVertical: 5,
    fontSize: 16,
    textAlign: 'center',
  },
  inputStyle: {
    width: 271,
    height: 42,
    // backgroundColor: '#307ecc',
    top: 5,
    //left: 37,
    paddingLeft: 13,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    alignSelf: 'center',
  },
  registerTextStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  titleText: {
    fontSize: 30,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },

  //DropDownButton

  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    width,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
  },
  headerTitle: {color: '#000', fontWeight: 'bold', fontSize: 16},
  saveAreaViewContainer: {flex: 1, backgroundColor: '#FFF'},
  viewContainer: {flex: 1, width, backgroundColor: '#FFF'},
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '10%',
    paddingBottom: '20%',
  },

  dropdown1BtnStyle: {
    width: '100%',
    height: 30,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},

  dropdown2BtnStyle: {
    width: '100%',
    height: 30,
    backgroundColor: '#444',
    borderRadius: 16,
  },
  dropdown2BtnTxtStyle: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dropdown2DropdownStyle: {
    backgroundColor: '#444',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  dropdown2RowStyle: {backgroundColor: '#444', borderBottomColor: '#C5C5C5'},
  dropdown2RowTxtStyle: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  dropdown3BtnStyle: {
    width: '100%',
    height: 30,
    backgroundColor: '#FFF',
    paddingHorizontal: 0,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: '#444',
  },
  dropdown3BtnChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  dropdown3BtnImage: {width: 45, height: 45, resizeMode: 'cover'},
  dropdown3BtnTxt: {
    color: '#444',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginHorizontal: 12,
  },
  dropdown3DropdownStyle: {backgroundColor: 'slategray'},
  dropdown3RowStyle: {
    backgroundColor: 'slategray',
    borderBottomColor: '#444',
    height: 30,
  },
  dropdown3RowChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  dropdownRowImage: {width: 45, height: 45, resizeMode: 'cover'},
  dropdown3RowTxt: {
    color: '#F1F1F1',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginHorizontal: 12,
  },

  // Use
  dropdown4BtnStyle: {
    width: 271,
    height: 42,
    // backgroundColor: '#307ecc',
    top: 5,
    left: 37,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
  },

  dropdown4BtnTxtStyle: {color: '#000', textAlign: 'left'},
  dropdown4DropdownStyle: {backgroundColor: '#307ecc'},
  dropdown4RowStyle: {backgroundColor: '#307ecc', borderBottomColor: '#dadae8'},
  dropdown4RowTxtStyle: {color: '#white', textAlign: 'left'},
  container: {
    width: '100%',
    height: 530,
    //marginLeft: 5,
    //marginTop: 40,
    alignItems: 'center',
  },
  rect: {
    alignContent: 'center',
    top: 125,
    width: '100%',
    height: 431,
    position: 'absolute',
    backgroundColor: 'rgba(185,255,255,255)',
    borderWidth: 1,
    borderColor: '#000000',
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 2,
      height: 5,
    },
    elevation: 90,
    shadowOpacity: 0.42,
    shadowRadius: 30,
  },
  loremIpsum: {
    color: '#121212',
    marginTop: 17,
    marginLeft: 37,
  },
  materialDisabledTextbox: {
    height: 43,
    width: 271,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    marginTop: 5,
    marginLeft: 37,
  },
  loremIpsum3: {
    color: '#121212',
    marginTop: 16,
    // marginLeft: 37,
    alignSelf: 'center',
  },
  materialFixedLabelTextbox: {
    height: 43,
    width: 271,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 4,
    marginTop: 17,
    marginLeft: 37,
  },
  loremIpsum5: {
    color: '#121212',
    marginTop: 22,
    // marginLeft: 40,
    alignSelf: 'center',
  },
  materialFixedLabelTextbox1: {
    height: 43,
    width: 271,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 4,
    marginTop: 18,
    marginLeft: 38,
  },
  materialCheckboxWithLabel: {
    height: 61,
    width: 183,
    // marginLeft: 14,
    alignSelf: 'center',
  },
  forgotPassword: {
    color: '#34D518',
    fontSize: 18,
    marginTop: 13,
  },
  materialButtonDanger: {
    height: 36,
    width: 97,
    borderRadius: 6,
    backgroundColor: 'rgba(22,222,19,1)',
    marginLeft: 26,
  },
  forgotPasswordRow: {
    height: 36,
    flexDirection: 'row',
    // marginTop: 2,
    //marginLeft: 37,
    // marginRight: 27,
    alignSelf: 'center',
  },
  rect2: {
    top: 21,
    width: '100%',
    height: 96,
    position: 'absolute',
    backgroundColor: 'rgba(185,255,255,255)',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderWidth: 1,
    borderColor: '#000000',
    left: 0,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 0,
    },
    elevation: 30,
    shadowOpacity: 0.29,
    shadowRadius: 10,
  },
  loremIpsum6: {
    color: '#121212',
    fontSize: 26,
    marginTop: 24,
    textAlign: 'center',
  },
  image: {
    top: 533,
    left: '35%',
    width: 95,
    height: 93,
    position: 'absolute',
    borderRadius: 40,
  },
  image2: {
    top: -50,
    left: 66,
    width: 195,
    height: 200,
    position: 'absolute',
  },
  rectStack: {
    width: '99%',
    height: 530,
  },
});
