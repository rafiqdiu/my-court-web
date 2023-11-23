import {Picker} from '@react-native-picker/picker';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import * as Network from 'expo-network';
import {Formik} from 'formik';
import React, {useContext, useEffect, useState} from 'react';
import {
  Platform,
  Dimensions,
  Image,
  TouchableOpacity,
  Keyboard, 
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  Button,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  View,
} from 'react-native';
import * as yup from 'yup';
import {BASE_URL} from '../../components/BaseUrl';
import AppBtn from '../../shared/appBtn';
import Checkbox from '../../shared/checkboxC';
import ContainerFluid from '../../shared/containerFluid';
import ErrorMessage from '../../shared/errorMessage';
import ErrorText from '../../shared/errorText';
import FormGroup from '../../shared/formGroup';

import Input from '../../shared/input';
import InputLevel from '../../shared/inputLevel';
import {globalStyles} from '../../styles/globalStyles';
import {serializeErrors} from '../../utils/Helpers';
import useErrorHandler from '../../utils/custom-hooks/ErrorHandler';

import DateTimePickerModal from "react-native-modal-datetime-picker"; 
import moment from "moment";
import { Popable } from 'react-native-popable';

import {
  DatePickerModal,
  DatePickerModalContent,
  TimePickerModal,
  DatePickerInput,
  // @ts-ignore TODO: try to fix expo to work with local library
} from 'react-native-paper-dates';
//import SignInScreen from '../../SignInScreen';

const windowWidth = Dimensions.get('window').width;
//register validation schema
const registerSchema = yup.object({
  UserName: yup.string().required('User Name is required'),
  name: yup.string(),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be minimum of 6 charaters'),
  confirmPassword: yup
    .string()
    .required('Confimation Password is required')
    .oneOf([yup.ref('password'), null], "Passwords don't match"),
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

function Register() {
  const {error, showError} = useErrorHandler(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();
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
  const updateUType = (handleChange, value) => {
    handleChange(value);
  };
  //handle user register form submit
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
    //ipAlert();


    _fetchdivisionData()
      // eslint-disable-next-line no-shadow
      .then(division => {
        //console.log(division);
        setdivision(division);
      })
      .catch(err => console.log(err));




  }, []);


  const getDstrictsdata = (data) => { _fetchDistrictData(data)
    // eslint-disable-next-line no-shadow
    .then(district => {
      // console.log(district);
      setDistrict(district);
      //setalldistrict(district);
    })
    .catch(err => console.log(err));
  
    
  }

  const handleRegister = (values, actions) => {
    setIsSubmitting(true);
    const {     
      UserName,
      name,
      email,
      phone,
      address,
      user_type,
      password,
      confirmPassword,
      mobile,
      device_id,
      member_id,
      Dob,
    //  payment_type,
      DeviceInformation,
    } = values;

    const userRegisterData = {
      division_id:division_id,
      district_id:district_id,
      mobile,
      username: UserName,
      password,
      name,
      email,
      phone,
      address,
      user_type: user_type?user_type:1,
      device_id: DId,
      member_id,
      Dob: Platform.OS === 'web' ?(date !==null ? moment(date).format("DD-MM-YYYY") : ""):(select_date !==null ? moment(select_date).format("DD-MM-YYYY") : ""),
     // payment_type,
      DeviceInformation: DInfo,
      // password_confirmation: confirmPassword,
    };

    //console.log(userRegisterData);
    _regitserUser(userRegisterData)
      .then(res => {
        //show success message
        // console.log(res);
        if (res.code == 200)
          //console.log(res);
          // alert(res.empId);
          {
          setUser_id(res.user_id);
          alert( res.msg);
         // actions.resetForm();
          }        
         else
          {         
          alert(res.msg);
          }
        
        // navigation.navigate('SignInScreen');

        //navigation.navigate('SignIn', {screen: 'SignInScreen'});
        
        // setModalVisible(true);
        // navigation.navigate('4', {
        //   screen: 'Otp',
        //   params: {
        //     emp_Id: res.userId,
        //     mobile,
        //     UserName,
        //     password,
        //   },
        // });
        //reset form
        //actions.resetForm();
      })
      .catch(err => console.log(err))
      .then(() => {
        setIsSubmitting(false);
      });
  };

  //async register user
  const _regitserUser = async data => {
    // console.log(BASE_URL);
    let url = `${BASE_URL}/CreateUser`;
    let formBody = [];
    for (let key in data) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(data[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    //console.log(formBody);
    try {
      const result = await axios.post(url, formBody).then(res => res.data);
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
  const ipAlert = async () => {
    const ip = await Network.getIpAddressAsync();
    alert(ip);
  };
  return (
    <ContainerFluid style={{marginBottom: 80}}>
      <ScrollView contentContainerStyle={globalStyles.flexGrow}>
        <KeyboardAvoidingView enabled>
          <View
            style={{
              ...globalStyles.authForm,
              backgroundColor: '#22BDDE',
            }}
          >
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Formik
             enableReinitialize
              initialValues={{
                UserName: '',
                name: '',
                password: '',
                email: '',
                confirmPassword: '',
                mobile: '',
                phone: '',
                address: '',
                user_type: '',
                member_id: '',

                
               // payment_type: '',
              }}
              validationSchema={registerSchema}
              onSubmit={(values, actions) => {
                handleRegister(values, actions);
              }}
            >
              {({
                values,
                errors,
                touched,
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
                        selectedValue={division_id ? division_id : 0}
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
                        selectedValue={district_id ? district_id : 0}
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
                    <Popable style={{ opacity: 0.8, width:'auto', marginLeft:-50, }} action="hover" content="Username (Short Name)">
                      <Input
                        value={values.UserName}
                        onChangeText={handleChange('UserName')}
                        onBlur={handleBlur('UserName')}
                        placeholder={'Username (Short Name)'}
                      />
                      </Popable>
                      {touched.UserName && errors.UserName ? (
                        <ErrorText>{errors.UserName}</ErrorText>
                      ) : null}
                    </FormGroup>
                    <FormGroup>
                    <Popable   style={{ opacity: 0.8, width:'auto', marginLeft:-100,}} action="hover" content="Full Name">
                      <Input
                        value={values.name}
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                        placeholder={'Full Name'}
                      />
                       </Popable>
                      {touched.name && errors.name ? (
                        <ErrorText>{errors.name}</ErrorText>
                      ) : null}
                    </FormGroup>
                  </View>
                  <View style={styles.webMobile}>
                    {/* <FormGroup>
                      <View style={styles.webMobile}>
                        <Text style={styles.checkBoxLebel}>User Type</Text>
                        <Checkbox
                          radio_props={UType}
                          initial={
                            values.user_type
                              ? values.user_type.toString() - 1
                              : 0
                          }
                          onPress={value => {
                            updateUType(handleChange('user_type'), value);
                          }}
                        />
                      </View>
                    </FormGroup> */} 
          <FormGroup>
                   
                   <>
                   <Popable style={{ opacity: 0.8, width:'auto', marginLeft:-65,  }} action="hover" content="Date of birth: DD-MM-YYYY ">
                   <TouchableOpacity  onPress={() =>Platform.OS === 'web' ?setVisible(true):null}  style={styles.sectionStyle} >
                   <TextInput
                   style={styles.inputs1} 
                   value={ Platform.OS === 'web' ?(date !==null ? moment(date).format("DD-MM-YYYY") : ""):(select_date !==null ? moment(select_date).format("DD-MM-YYYY") : "")}
                   onChangeText={handleChange("Dob")}
                   onBlur={handleBlur("Dob")}
                   placeholder={"Date of birth: DD-MM-YYYY"}
                  // isEditing={isEditing}
                   onTouchStart={showDatePicker}
                 />
                  <Image
            source={{
              uri:
                'https://causelist.judiciary.gov.bd/img/calendar.png',
            }}
            style={styles.imageStyle}
          />
                 </TouchableOpacity>
                  </Popable>
                { Platform.OS === 'web' ? (
                  <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
        
                   

                      <DatePickerModal
                      
                        locale={locale}
                        mode="single"
                        visible={visible}
                        onDismiss={onDismiss}
                        date={date}
                        onConfirm={onChangeSingle}
                        validRange={{
                          startDate: pastDate,
                          disabledDates: [futureDate],
                          // startDate: new Date(2021, 1, 2), // optional
                          // endDate: new Date(), // optional
                        }}
                        // saveLabel="Save" // optional
                        // uppercase={false} // optional, default is true
                        label="Date of birth" // optional
                        // animationType="slide" // optional, default is 'slide' on ios/android and 'none' on web
                        // startYear={2000} // optional, default is 1800
                        // endYear={2100} // optional, default is 2200
                         //allowEditing={true} // optional, default is true
                        //inputEnabled={true} // optional, default is true

                      />
                      
                </View>
              ):(
                  <DateTimePickerModal
                       isVisible={isDatePickerVisible}
                       mode="date"
                      // date={ values?.application_deadline? moment(values?.application_deadline).format("DD-MM-YYYY") : ""}
                       onConfirm={handleConfirm}
                       onCancel={hideDatePicker}
                       minimumDate={new Date()}
                      // minimumDate={("YYYY, MM, DD")}
                      // maximumDate={moment('08-06-2022').add(30, 'days').format("DD-MM-YYYY")}
                     /> )}
                   </>
                    {touched.Dob && errors.Dob ? (
                      <ErrorText>{errors.Dob}</ErrorText>
                    ) : null}
                  </FormGroup> 
                  
                    <FormGroup>
                    <Popable style={{ opacity: 0.8, width:'auto', marginLeft:-50 }} action="hover" content="Advocate Member Id No.">
                      <Input
                        value={values.member_id}
                        keyboardType="phone-pad"
                        onChangeText={handleChange('member_id')}
                        onBlur={handleBlur('member_id')}
                        placeholder={'Advocate Member Id No.'}
                      /></Popable>
                      {touched.member_id && errors.member_id ? (
                        <ErrorText>{errors.member_id}</ErrorText>
                      ) : null}
                    </FormGroup>

                  </View>
                  <View style={styles.webMobile}>
                    <FormGroup>
                    <Popable style={{ opacity: 0.8, width:'auto', marginLeft:-100 }} action="hover" content="Mobile No.">
                      <Input
                        value={values.mobile} 
                        keyboardType="phone-pad"
                        onChangeText={handleChange('mobile')}
                        onBlur={handleBlur('mobile')}
                        placeholder={'Mobile No.'}
                      /></Popable>
                      {touched.mobile && errors.mobile ? (
                        <ErrorText>{errors.mobile}</ErrorText>
                      ) : null}
                    </FormGroup>

                    <FormGroup>
                    <Popable style={{ opacity: 0.8, width:'auto', marginLeft:-100 }} action="hover" content="Email Address">
                      <Input
                        value={values.email}
                        keyboardType="email-address"
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        placeholder={'Email Address'}
                      /></Popable>
                      {touched.email && errors.email ? (
                        <ErrorText>{errors.email}</ErrorText>
                      ) : null}
                    </FormGroup>
                  </View>
                  <View style={styles.webMobile}>
                    <FormGroup>
                    <Popable style={{ opacity: 0.8, width:'auto', marginLeft:-80 }} action="hover" content="Another Mobile No.">
                      <Input
                        value={values.phone}
                        keyboardType="phone-pad"
                        onChangeText={handleChange('phone')}
                        onBlur={handleBlur('phone')}
                        placeholder={'Another Mobile No.'}
                      /></Popable>
                      {touched.phone && errors.phone ? (
                        <ErrorText>{errors.phone}</ErrorText>
                      ) : null}
                    </FormGroup>

                    <FormGroup>
                    <Popable style={{ opacity: 0.8, width:'auto', marginLeft:-100 }} action="hover" content="Address">
                      <Input
                        value={values.address}
                        // keyboardType="email-address"
                        onChangeText={handleChange('address')}
                        onBlur={handleBlur('address')}
                        placeholder={'Address'}
                      /></Popable>
                      {touched.address && errors.address ? (
                        <ErrorText>{errors.address}</ErrorText>
                      ) : null}
                    </FormGroup>
                  </View>
                  <View style={styles.webMobile}>
                    <FormGroup>
                    <Popable style={{ opacity: 0.8, width:'auto', marginLeft:-100 }} action="hover" content="Password">
                      <Input
                        value={values.password}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        placeholder={'Password'}
                        secureTextEntry={true}
                      />
                      </Popable>
                      {touched.password && errors.password ? (
                        <ErrorText>{errors.password}</ErrorText>
                      ) : null}
                    </FormGroup>
                    <FormGroup>
                    <Popable style={{ opacity: 0.8, width:'auto', marginLeft:-90 }} action="hover" content="Confirm Password">
                      <Input
                        value={values.confirmPassword}
                        onChangeText={handleChange('confirmPassword')}
                        onBlur={handleBlur('confirmPassword')}
                        placeholder={'Confirm Password'}
                        secureTextEntry={true}
                      />
                      </Popable> 
                      {touched.confirmPassword && errors.confirmPassword ? (
                        <ErrorText>{errors.confirmPassword}</ErrorText>
                      ) : null}
                    </FormGroup>
                  </View>
                  <View style={{marginLeft:300, marginTop: 0, paddingHorizontal: 10}}>
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
      </ScrollView>
    </ContainerFluid>
  );
}

export default Register;

const styles = StyleSheet.create({
  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#22BDDE',
    borderWidth: 1,
    borderColor: '#fff',
    height: 43,
    borderRadius: 2,
   // margin: 10,
  },
  imageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  inputs1: {
    borderColor: '#fff',
    borderWidth: 1,
    padding: 12,
    borderRadius: 2,
    fontSize: 13,
    backgroundColor: '#22BDDE',
    width: 265,
  },
  picker: {
    height: 45,
    color: '#333',
    width: 250,
    fontSize: 14,
  },
  inputs: {
    borderColor: '#fff',
    borderWidth: 1,
    padding: 12,
    borderRadius: 2,
    fontSize: 13,
    backgroundColor: '#22BDDE',
    width: 300,
  },
  webMobile: {
    flexDirection:
      Platform.OS === 'web' && windowWidth >= 600 ? 'row' : 'column',
  },
  checkBoxLebel: {
    marginTop: Platform.OS === 'web' && windowWidth >= 600 ? 19 : 0,
    color: '#fff',
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'skyblue',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  pickerWrapper: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
});
