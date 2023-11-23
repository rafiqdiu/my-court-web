// Import React and Component
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {useState, createRef, useEffect, useContext, useRef} from 'react';
import {
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
} from 'react-native';

import SelectDropdown from 'react-native-select-dropdown';
import {BASE_URL} from '../components/BaseUrl';
import Loader from '../components/Loader';
//import { AuthContext } from "../../contexts/AuthContext";

import {useFocusEffect, useNavigation} from '@react-navigation/native';

import MaterialCheckboxWithLabel from '../components/MaterialCheckboxWithLabel';

const {width} = Dimensions.get('window');

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
  const [loading, setLoading] = useState(false);
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

    //console.log(111)

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

  const handleSubmitPress = () => {
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
      DeviceId: DId,
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
      let url = BASE_URL + '/Login';

      axios
        .post(url, formBody)
        .then(response => {
          //Hide Loader
          setLoading(false);
          //console.log(response);

          if (response.data.code === 200 || response.data.code === 504) {
            //alert('Login Successfuly');
            AsyncStorage.setItem('user_name', JSON.stringify(Username));
            AsyncStorage.setItem(
              'user_id',
              JSON.stringify(response.data.user_id),
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
              window.location.reload();
            }
         else{
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

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          //justifyContent: 'center',
        }}
      >
        <View style={styles.allview}>
          <KeyboardAvoidingView enabled>
            <View style={styles.container}>
              <View style={styles.rectStack}>
                <View style={styles.rect}>
                  <Text style={styles.loremIpsum3}>Username</Text>
                  <TextInput
                    value={Username}
                    style={styles.inputStyle}
                    onChangeText={Username => setUsername(Username)}
                    placeholder="Enter Your Username" //seluser
                    placeholderTextColor="#8b9cb5"
                    autoCapitalize="none"
                    keyboardType="default"
                    returnKeyType="next"
                    onSubmitEditing={() =>
                      passwordInputRef.current &&
                      passwordInputRef.current.focus()
                    }
                    underlineColorAndroid="#f000"
                    blurOnSubmit={false}
                  />
                  <Text style={styles.loremIpsum3}>Password</Text>
                  <TextInput
                    value={UserPassword}
                    style={styles.inputStyle}
                    onChangeText={UserPassword => setUserPassword(UserPassword)}
                    placeholder="Enter Your Password" //12345
                    placeholderTextColor="#8b9cb5"
                    keyboardType="default"
                    ref={passwordInputRef}
                    onSubmitEditing={Keyboard.dismiss}
                    blurOnSubmit={false}
                    secureTextEntry={true}
                    underlineColorAndroid="#f000"
                    returnKeyType="next"
                  />
                  <MaterialCheckboxWithLabel
                    style={styles.materialCheckboxWithLabel}
                  ></MaterialCheckboxWithLabel>
                  {errortext != '' ? (
                    <Text style={styles.errorTextStyle}>{errortext}</Text>
                  ) : null}
                  <View style={styles.forgotPasswordRow}>
                    <Text style={styles.forgotPassword}>Forgot Password ?</Text>
                    <TouchableOpacity
                      style={styles.materialButtonDanger}
                      activeOpacity={0.5}
                      onPress={handleSubmitPress}
                    >
                      <Text style={styles.buttonTextStyle}>Log in</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.rect2}>
                  <Text style={styles.loremIpsum6}>District Court</Text>
                </View>
                {/* <Image
                  source={require('../../assets/icon.png')}
                  resizeMode="stretch"
                  style={styles.image}
                ></Image>
                <Image
                  source={require('../../assets/lcms-logo.gif')}
                  //{require("../assets/images/lcms-logo.gif")}
                  resizeMode="contain"
                  style={styles.image2}
                ></Image> */}
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
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
  allview: {
    // width: '100%',
    width:400,
    top:50,
    verticalAlign:'middle',
    alignSelf: 'center',
    height:'50%'
  },
  mainBody: {
    flex: 1,
    backgroundColor: '#f6f9ff',
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
    height: 350,
    position: 'absolute',
    //backgroundColor: 'rgba(185,255,255,255)',
    backgroundColor: '#fff',
    // borderWidth: 1,
    // borderColor: '#000000',
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 2,
      height: 5,
    },
    elevation: 90,
    shadowOpacity: 0.42,
    shadowRadius: 30,
  },

  rect2: {
    top: 21,
    width: '100%',
    height: 96,
    position: 'absolute',
    //backgroundColor: 'rgba(185,255,255,255)',
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    // borderWidth: 1,
    // borderColor: '#000000',
    left: 0,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    elevation: 30,
    shadowOpacity: 0.29,
    shadowRadius: 10,
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
    marginLeft: 65,
    alignSelf: 'left',
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
