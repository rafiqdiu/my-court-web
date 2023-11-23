import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from "react";
import {  Button,   TextInput, Text, ImageBackground,ScrollView, StyleSheet, Platform, Dimensions, View, Image, TouchableOpacity,  Pressable,  KeyboardAvoidingView,   } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ScreenBackground from '../../../components/ScreenBackground';
import LeftBar from '../../../shared/LeftBar';
import LeftBarItem from '../../../shared/LeftBarItem';
import sharedStyles from '../../../sharedStyles';
import { globalStyles } from '../../../styles/globalStyles';
import WavyHeader from '../../../shared/WavyHeader';
import axios from 'axios';
import { BASE_URL } from '../../../components/BaseUrl';
import ContainerFluid from '../../../shared/containerFluid';
import useErrorHandler from '../../../utils/custom-hooks/ErrorHandler';
import {Formik} from 'formik';
import * as yup from 'yup';
import FormGroup from '../../../shared/formGroup';
import {Picker} from '@react-native-picker/picker';
//import InputLevel from '../../shared/inputLevel';
import Input from '../../../shared/input';
import AppBtn from '../../../shared/appBtn';
import WavyTopBar from '../../../shared/WavyTopBar';
import {responsiveWidth} from 'react-native-responsive-dimensions';

import {
  DatePickerModal,
  DatePickerModalContent,
  TimePickerModal,
  DatePickerInput,
  // @ts-ignore TODO: try to fix expo to work with local library
} from 'react-native-paper-dates';

import DateTimePickerModal from "react-native-modal-datetime-picker"; 
import moment from "moment";
import { Popable } from 'react-native-popable';
import { DefaultThemeColors, DarkThemeColors,ThemeOne,ThemeTwo } from "../../../utils/constants/Colors";

const Colors2 = ThemeOne;

const windowWidth = Dimensions.get('window').width;

const registerSchema = yup.object({
  UserName: yup.string().required('User Name is required'),
  name: yup.string(),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter valid email'),
  mobile: yup
    .string()
    .matches(/(01)(\d){9}\b/, 'Enter a valid phone number')
    .required('Mobile number is required'),
    member_id: yup
    .string()
    .required('Member Id is required'),
});

const otpSchema = yup.object({
  OtpKey: yup
    .string()
    .required('Otp is required')
    .length(4, 'Otp must be  4 charaters'),
});

export default function ProfileScreen() {
  // const {error, showError} = useErrorHandler(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();
  const {error, showError} = useErrorHandler(null);
  const [user_info, setUserIfo] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUser_id] = useState(false);
  const [DId, setDevice_id] = useState(null);
  const [DInfo, setDevice_info] = useState(null);

  const [division, setdivision] = useState([]);
  const [district, setDistrict] = useState([]);
  const [select_date, setselectdate] = useState(null);

  const filterdistrictResults = division_id =>
  setDistrict(_district =>
    alldistrict.filter(dist => dist.division_id === division_id),
  );
const filtercourtResults = district_id =>
  setCourt(_court =>
    allCourt.filter(dist => dist.geo_district_id === district_id),
  );
const [division_id, setdivisionId] = useState(null);
const [district_id, setDistrictId] = useState(null);
const [isEdit, setIsEdit] = useState(null);
const [user_id, setUserId] = useState([]);
const [name, setName] = useState(null);
const [Mobile_no, setMobile_no] = useState(null);
const [isLoading, setIsLoading] = useState(false);


const showDatePicker = () => {
  setDatePickerVisibility(true);
};

const hideDatePicker = () => {
  setDatePickerVisibility(false);
};

const handleConfirm = (val) => {
// console.warn("A date has been picked: ", date);
//console.log(val);
  setselectdate(  val );
 // setDate(val)
  //console.log(select_date);
  hideDatePicker();
};
const [visible, setVisible] = React.useState(false)
const onDismiss = React.useCallback(() => {
  setVisible(false)
}, [setVisible])
const [date, setDate] = React.useState();
const onChangeSingle = React.useCallback(
  (params) => {
    setVisible(false) 
    setDate(params.date)
  },
  [setVisible, setDate]
)
const pastDate = new Date(new Date().setDate(new Date().getDate() - 500000));
const futureDate = new Date(new Date().setDate(new Date().getDate() + 500000));

const locale = 'en-GB';
  const UType = [
    {label: 'Advocate', value: '1'},
    {label: 'Organisation', value: '2'},
  ];
  const [users, setUsers] = useState({

        id: '',
        division_id: '',
        district_id:'',
        name: '',
        member_id: '',
        mobile: '',
        email: '',
        address: '',

  });


  useFocusEffect(
    React.useCallback(() => {
      //setUserIfo([]);
      setIsEdit(false);
    }, [])
   );

  useEffect(() => {
   // getUserId().then(user_id => getUserdata(user_id))

    getUserId().then(UserId => { 
      setUserId(UserId);
      getUserdata(UserId);
    });

    if (Platform.OS === 'android') {
      setDevice_id(1);
    }
    if (Platform.OS === 'ios') {
      setDevice_id(2);
    }
    if (Platform.OS === 'web') {
      setDevice_id(3);
    }
    //ipAlert();

    const _fetchdivisionData = async () => {
      try {
        let url = `${BASE_URL}/GetDivission`;
        let response = await axios.get(url).then(res => res.data);
    
        return response;
        //if (response.country) return response.country;
      } catch (err) {
        console.log('Error', err);
      }
    };

    _fetchdivisionData()
      // eslint-disable-next-line no-shadow
      .then(division => {
        //console.log(division);
        setdivision(division);
      })
      .catch(err => console.log(err));

  }, []);

  async function getUserId() {
    try {
      const jsonValue = await AsyncStorage.getItem('user_id');
      const name = await AsyncStorage.getItem('name');
      const mobile_no = await AsyncStorage.getItem('mobile_no');
      setMobile_no(mobile_no);
       setName(name);

      if (jsonValue !== null) {
        return JSON.parse(jsonValue);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const _fetchDistrictData = async (data) => {
    try {let dataToSend = {
      division_id: data,
      };
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
      let url = `${BASE_URL}/DivisionToDistrict`;
      let response = await axios.post(url, formBody).then(res => res.data);
  
      return response;
      //if (response.country) return response.country;
    } catch (err) {
      console.log('Error', err);
    }
  };

  const getDstrictsdata = (data) => { _fetchDistrictData(data)
    // eslint-disable-next-line no-shadow
    .then(district => {
      // console.log(district);
      setDistrict(district);
      //setalldistrict(district);
    })
    .catch(err => console.log(err));
  }
  

  const getUserdata = (data) => {
    setIsLoading(true);
    _fetchUserData(data)
    // eslint-disable-next-line no-shadow
    .then(user_info => {
      //console.log(user_info);
      setUserIfo(user_info);
      setUsers({
        id:user_id ,
       // division_id: '',
       // district_id:'',
       name: user_info.name,
       member_id: user_info.member_id,
       mobile: user_info.mobile,
       email: user_info.email,
       address: user_info.address,
      });
      setdivisionId(user_info.division_id);
      setDistrictId(user_info.district_id);
      setIsLoading(false);
      //setalldistrict(district);
    })
    .catch(err => console.log(err));
  }
  const _fetchUserData = async (data) => {
    try {
      let dataToSend = {
        id: data,
      };
      let formBody = [];
      for (let key in dataToSend) {
        let encodedKey = encodeURIComponent(key);
        let encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      let url = `${BASE_URL}/UserInfo`;
      let response = await axios.post(url, formBody).then(res => res.data);

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  };

  const handleEditProfile = (showHide, userId) => {

    try {
     // setIsEdit(showHide);
      let dataToSend = {
        id: userId,
      };
      let formBody = [];
      for (let key in dataToSend) {
        let encodedKey = encodeURIComponent(key);
        let encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      let url = `${BASE_URL}/UserInfo`;
       axios.post(url, formBody)

       .then(res => {
        console.log(res.data);
        //console.log(res.data.username);
        setUserIfo(res.data);
      })

      //return response;
    } catch (err) {
      console.log('Error', err);
    }

  }

  const handleUpdateUser = (values, actions) => {
   

    const data = {
        id: user_id,
        division_id: division_id,
        district_id: district_id,
        name: values.name,
        member_id: values.member_id,
        mobile: values.mobile,
        email: values.email,
        address: values.address,
      };

    //console.log(data)
    //console.log(division_id)

    let url = `${BASE_URL}/updateUser`;
    let formBody = [];
    for (let key in data) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(data[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    //console.log(formBody);
    try {
      const result = axios.post(url, formBody).then(res => res.data);
      setIsEdit(false);
      getUserdata(user_id);
      return result;
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request cancelled');
      } else if (err.response) {
        if (err.response.code === 422)
          showError(serializeErrors(err.response.data));
        else if (err.response.data.code === 401)
          showError(serializeErrors({error: err.response.data.msg}));
        else showError(serializeErrors({error: 'Failed to register'}));
      } else {
        console.log(err);
      }
    }
      
  };
  const banglaNumber = {
    0: "০",
    1: "১",
    2: "২",
    3: "৩",
    4: "৪",
    5: "৫",
    6: "৬",
    7: "৭",
    8: "৮",
    9: "৯",
  };
  const engToBdNum = (str) => {
    for (var x in banglaNumber) {
      str = str.replace(new RegExp(x, "g"), banglaNumber[x]);
    }
    return str;
  };

  

  const onChangeName = (value) => {
    setUserIfo({ ...user_info, name: value });
  };

  const onChangeMemberId = (value) => {
    setUserIfo({ ...user_info, member_id: value });
  };

  const onChangeMobile = (value) => {
    setUserIfo({ ...user_info, mobile: value });
  };

  const onChangeEmail = (value) => {
    setUserIfo({ ...user_info, email: value });
  };

  const onChangeAddress = (value) => {
    setUserIfo({ ...user_info, address: value });
  };


  return (
    <View style={Platform.OS === 'web' && windowWidth >= 600 ? globalStyles.mainContainer : globalStyles.mainContainerMobile}>
      <LeftBar>       
        <LeftBarItem selectcolor='true' name='প্রোফাইল' stack='প্রোফাইল' screen='ProfileScreen' />
        {/* <LeftBarItem name='পাসওয়ার্ড পরিবর্তন' stack='সেটিংস' screen='PasswordChangeScreen' /> */}
      </LeftBar>

      <View style={[Platform.OS === 'web' && windowWidth >= 600 ? globalStyles.bodyContainer : globalStyles.bodyContainerMobile, { backgroundColor: '#fff' }]}>
        <WavyHeader customStyles={styles.svgCurve} />
        
        <WavyTopBar customStyles={[styles.backgroundImage,{  zIndex:-1}] } />
        
      <View style={styles.header}><Text>প্রোফাইল</Text></View>
     
          <Image
            style={styles.avatar}
            source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }}
          />
 <ScrollView contentContainerStyle={globalStyles.flexGrow}>
 
        <View style={{marginTop:160}}>
      
      
          <View style={styles.body}>
            <View style={styles.bodyContent}>
            
              {/* <View style={styles.buttonStyleContainer}>
                      <Pressable style={styles.buttons} 
                      
                      onPress={() => {
                         setIsEdit(!isEdit);

                        handleEditProfile(true, user_info.user_id);
                        getDstrictsdata(division_id ? division_id : user_info.division_id);
                          
                          }}
                          
                          ><Text style={styles.texts}>এডিট প্রোফাইল</Text></Pressable>
                  </View> */}
           
            
              {!isEdit ? (   
             
          <View style={styles.hddata1}>
            
                            <View style={{flexDirection:'row'}}>
                              <Text style={styles.textTile}>নাম</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>{name}</Text>
                            </View>              

                          
                            <View style={{flexDirection:'row'}}>
                              <Text style={styles.textTile}>মোবাইল নম্বর</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>{Mobile_no?engToBdNum(Mobile_no):null}                            
                              </Text>
                            </View>
                       
                       
                            <View style={{flexDirection:'row'}}>
                              <Text style={styles.textTile}>জন্মতারিখ</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>  {user_info.Dob=="01-01-1970"?"":(user_info.Dob?engToBdNum(user_info.Dob.toString()):null)}                         
                              </Text>
                            </View>
                           
                            <View style={{flexDirection:'row'}}>
                              <Text style={styles.textTile}>ইমেইল</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>{user_info.email}                              
                              </Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                              <Text style={styles.textTile}>বিভাগ</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>{user_info.division_name_bng}                              
                              </Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                              <Text style={styles.textTile}>জেলা</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>{user_info.district_name_bng}                              
                              </Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                              <Text style={styles.textTile}>ঠিকানা</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>{user_info.address}                               
                              </Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                              <Text style={styles.textTile}>ব্যবহারকারীর নাম</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>{user_info.username}                               
                              </Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                              <Text style={styles.textTile}>অবস্থা</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>{user_info.status==1?"সক্রিয়":"নিষ্ক্রিয়"}                              
                              </Text>
                            </View>
                           </View>
                 
              ) :  <KeyboardAvoidingView enabled>
                      <View
                        style={{
                          ...globalStyles.authForm,
                          backgroundColor: '#22BDDE',
                        }}
                      >
                        {error && <ErrorMessage>{error}</ErrorMessage>}

                        <Formik
                        enableReinitialize
                           initialValues={{ ...users }}
                          //validationSchema={registerSchema}
                          onSubmit={(values, actions) => {
                            handleUpdateUser(values, actions);
                          }}
                        >
                          {({
                            values,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                          }) => (
                            <>

                            <View style={{alignItems: 'center'}}>
                              
                             <View style={styles.webMobile}>
                                <FormGroup>
                                <View style={styles.pickerWrapper}>
                                  <Picker
                                    selectedValue={division_id ? division_id : user_info.division_id}
                                    style={{
                                      ...styles.picker,
                                    }}
                                    onValueChange={(itemValue, itemIndex) => {
                                      setdivisionId(itemValue);
                                      getDstrictsdata(itemValue);
                                    }}
                                    mode="dropdown"
                                  >
                                    <Picker.Item label="Select Your Court Division" value="0" />

                                    {division.map((item, index) => {
                                      return (
                                        <Picker.Item
                                          label={item.division_name_bng}
                                          value={item.geo_division_id}
                                          key={index}
                                        />
                                      );
                                    })}
                                  </Picker>
                                  </View>
                                </FormGroup>
                                <FormGroup>
                                <View style={styles.pickerWrapper}>
                                  <Picker
                                    selectedValue={district_id ? district_id : user_info.district_id}
                                    style={{
                                      ...styles.picker,
                                    }}
                                    onValueChange={(itemValue, itemIndex) => {
                                      setDistrictId(itemValue);
                                    }}
                                    mode="dropdown"
                                  >
                                    <Picker.Item label="Select Your Court District" value="0" />

                                    {district.map((item, index) => {
                                      return (
                                        <Picker.Item
                                          label={item.district_name_bng}
                                          value={item.geo_district_id}
                                          key={index}
                                        />
                                      );
                                    })}
                                  </Picker>
                                  </View>
                                </FormGroup>
                              </View>
                              <View style={styles.webMobile}>
                                <FormGroup>
                                <Popable   style={{ opacity: 0.8, width:'auto', marginLeft:-100,}} action="hover" content="Full Name">
                                  <Input style={styles.inputHight}
                                    value={values.name}
                                   // onChangeText={(value) => onChangeName(value)}
                                    onChangeText={handleChange("name")}
                                    onBlur={handleBlur('name')}
                                    placeholder={'Full Name'}
                                  /></Popable>
                             
                                </FormGroup>
                              </View>
                              <View style={styles.webMobile}>
                           
                                <FormGroup>
                                <Popable style={{ opacity: 0.8, width:'auto', marginLeft:-50 }} action="hover" content="Advocate Member Id No.">
                                  <Input style={styles.inputHight}
                                    value={values.member_id}
                                    keyboardType="phone-pad"
                                   // onChangeText={(value) => onChangeMemberId(value)}
                                    onChangeText={handleChange("member_id")}
                                    onBlur={handleBlur('member_id')}
                                    placeholder={'Advocate Member Id No.'}
                                  /></Popable>
                                 
                                </FormGroup>

                              </View>
                              <View style={styles.webMobile}>
                                <FormGroup>
                                <Popable style={{ opacity: 0.8, width:'auto', marginLeft:-100 }} action="hover" content="Mobile No.">
                                  <Input style={styles.inputHight}
                                    value={values?.mobile?values.mobile:user_info.mobile} 
                                    keyboardType="phone-pad"
                                    //onChangeText={(value) => onChangeMobile(value)}
                                    onChangeText={handleChange("mobile")}
                                    onBlur={handleBlur('mobile')}
                                    placeholder={'Mobile No.'}
                                  /></Popable>
                                 
                                </FormGroup>

                                <FormGroup>
                                <Popable style={{ opacity: 0.8, width:'auto', marginLeft:-100 }} action="hover" content="Email Address">
                                  <Input style={styles.inputHight}
                                    value={values.email}
                                    keyboardType="email-address"
                                    //onChangeText={(value) => onChangeEmail(value)}
                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur('email')}
                                    placeholder={'Email Address'}
                                  /></Popable>
                               
                                </FormGroup>
                              </View>
                              <View style={styles.webMobile}>
                                <FormGroup>
                                <Popable style={{ opacity: 0.8, width:'auto', marginLeft:-100 }} action="hover" content="Address"><Input style={styles.inputHight}
                                    value={values.address}
                                    // keyboardType="email-address"
                                    //onChangeText={(value) => onChangeAddress(value)}
                                    onChangeText={handleChange("address")}
                                    onBlur={handleBlur('address')}
                                    placeholder={'Address'}
                                  /></Popable>
                                 
                                </FormGroup>
                              </View>
                              <View style={{marginLeft:10, marginTop: 0, paddingHorizontal: 10}}>
                                <AppBtn
                                  title="Submit"
                                  onPress={handleSubmit}
                                  disabled={isSubmitting}
                                />
                              </View>
                            </View>
                            </>
                          )}
                        </Formik>
                      </View>
                    </KeyboardAvoidingView>               
               
              
              }
            </View>
          </View>
         
        </View>
       
        </ScrollView>
      </View>
    </View>
  );


}

const styles = StyleSheet.create({
  textTile: {
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width:  Platform.OS === 'web' && windowWidth >= 600?120: responsiveWidth(28),
  },
  textTilecln: {
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 8,
  },

  textDescription: {
    
    paddingTop: 3,
    fontSize: 13,
    width: Platform.OS === 'web' && windowWidth >= 600?400: responsiveWidth(60) ,
  },
  hddata1: {
    padding: 5,
   // borderWidth: 1,
    //borderColor: 'black',
    
    justifyContent: 'center',
    alignItems:'center',
    alignContent:'center',
    borderRadius: 6,
   marginTop: 30,
    marginBottom: 0,
    //backgroundColor: '#C1EfFf',
   marginLeft: Platform.OS === 'web' && windowWidth >= 600?250: 0 ,
    width:  responsiveWidth(99) ,
  },
  headerContainer: {
    marginTop: 50,
    marginHorizontal: 10
  },  
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
  },
  pickerWrapper: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  inputHight: {
    height: 30,
    color: '#333',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fff',
    width: 200,
    padding:5,
  },
  picker: {
    height: 30,
    color: '#333',
    width: 200,
  },
  buttons: {
    //flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'green',
    marginBottom:4,
    marginRight:5,
    height:30
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00c',
    textAlign: 'center',
    marginTop: 40
  },
  svgCurve: {
    position: 'absolute',
    width: Dimensions.get('window').width,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  LeftContainer: {
    flex: 1,
    backgroundColor: "#aa88aa"
  },
  bodyContainer: {
    flex: 6
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
  header: {
    //backgroundColor: '#00BFFF',
   margin:10,
   fontSize:24,
   fontWeight:'bold',
   color:Colors2.top8,
   textAlign:'center'
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 0,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 70,
  },
  name: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  body: {
    marginTop: 0,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 40,
  },
  name: {
    fontSize: 28,
    color: '#696969',
    fontWeight: '600',
  },
  info: {
    fontSize: 16,
    color: '#00BFFF',
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: '#696969',
    marginTop: 10,
    textAlign: 'center',
  },
  backgroundImage: {
    flex: 1, 
   // width: '100%',
   //height: 'auto',
    //height: 120,
    position: 'absolute',
    width: Dimensions.get('window').width,
   bottom: 0,
    zIndex: -1,
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    // backgroundColor: '#00BFFF',
  },
});
