import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import * as Network from 'expo-network';
import {Formik} from 'formik';
import React, {useContext, useEffect, useState} from 'react';
import {
  Platform,
  Dimensions,
  ImageBackground,
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
import {BASE_URL} from '../../../components/BaseUrl';
import AppBtn from '../../../shared/appBtn';
import Checkbox from '../../../shared/checkboxC';
import ContainerFluid from '../../../shared/containerFluid';
import ErrorMessage from '../../../shared/errorMessage';
import ErrorText from '../../../shared/errorText';
import FormGroup from '../../../shared/formGroup';

import Input from '../../../shared/input';
import InputLevel from '../../../shared/inputLevel';
import {globalStyles} from '../../../styles/globalStyles';
import {serializeErrors} from '../../../utils/Helpers';
import useErrorHandler from '../../../utils/custom-hooks/ErrorHandler';
import LeftBar from '../../../shared/LeftBar';
import LeftBarItem from '../../../shared/LeftBarItem';

import WavyHeader from '../../../shared/WavyHeader';
import WavyTopBar from '../../../shared/WavyTopBar';


const windowWidth = Dimensions.get('window').width;
//register validation schema
const registerSchema = yup.object({
  oldPassword: yup
  .string()
  .required('পুরানো পাসওয়ার্ড আবশ্যক')
  .min(6, 'পুরানো পাসওয়ার্ড ন্যূনতম 6 অক্ষরের হতে হবে'),
  newpassword: yup
    .string()
    .required('নতুন পাসওয়ার্ড আবশ্যক')
    .min(6, 'নতুন পাসওয়ার্ড ন্যূনতম 6 অক্ষরের হতে হবে'),
  confirmPassword: yup
    .string()
    .required('নতুন পাসওয়ার্ড আবশ্যক')
    .oneOf([yup.ref('newpassword'), null], "পাসওয়ার্ড দুটি মিলছে না"),
 
});

const otpSchema = yup.object({
  OtpKey: yup
    .string()
    .required('Otp is required')
    .length(4, 'Otp must be  4 charaters'),
});

function PasswordChangeScreen() {
  const {error, showError} = useErrorHandler(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();
  const [user_id, setUserId] = useState([]);
  //handle user register form submit
  useEffect(() => {
    getUserId().then(UserId => { 
      setUserId(UserId);
    });

  }, []);

  async function getUserId() {
    try {
      const jsonValue = await AsyncStorage.getItem('user_id');
      if (jsonValue !== null) {
        return JSON.parse(jsonValue);
      }
    } catch (err) {
      console.error(err);
    }
  }
  
  const handleRegister = (values, actions) => {
    setIsSubmitting(true);
    const {     
     
      newpassword,
      oldPassword,
      confirmPassword,
   
      
    } = values;

    const userRegisterData = {
      id:user_id,
      newpassword,
      oldPassword,
      // password_confirmation: confirmPassword,
    };

    //console.log(userRegisterData);
    _regitserUser(userRegisterData)
      .then(res => {
        //show success message
        console.log(res);
        if (res.code == 200)
          //console.log(res);
          // alert(res.empId);
          {
         // setUser_id(res.user_id);
          alert( res.msg);
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
        actions.resetForm();
      })
      .catch(err => console.log(err))
      .then(() => {
        setIsSubmitting(false);
      });
  };

  //async register user
  const _regitserUser = async data => {
    // console.log(BASE_URL);
    let url = `${BASE_URL}/ChangePassword`;
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
    <View   style={Platform.OS === 'web' && windowWidth >= 600?globalStyles.mainContainer:globalStyles.mainContainerMobile}>
    <LeftBar>   
       {/* <LeftBarItem   name = 'Home'  stack = 'Settings'   screen = 'SettingsScreen' /> */}
       <LeftBarItem   name = 'প্রোফাইল'  stack = 'সেটিংস'   screen = 'ProfileScreen' />
       <LeftBarItem  selectcolor='true'  name = 'পাসওয়ার্ড পরিবর্তন'  stack = 'সেটিংস'   screen = 'PasswordChangeScreen' />
   </LeftBar>
    
     <View style={ [Platform.OS === 'web' && windowWidth >= 600?globalStyles.bodyContainer:globalStyles.bodyContainerMobile,{backgroundColor:'#22BDDE'}]}>
    
    <WavyHeader customStyles={styles.svgCurve} />
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>পাসওয়ার্ড পরিবর্তন</Text>
      </View>
      <WavyTopBar       
       customStyles={[styles.backgroundImage,{ marginTop:150,  zIndex:-1}] }
     //  height={500}
      />
      <ScrollView  style={{flexGrow: 1}} contentContainerStyle={globalStyles.flexGrow}>
      
        <KeyboardAvoidingView enabled>
          <View
            style={{
              marginTop:20,
              ...globalStyles.authForm,
             // backgroundColor: '#22BDDE',
             color:'#000'
            }}
          >
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Formik
              initialValues={{
              
                newpassword: '',
                oldPassword: '',
              
                confirmPassword: '',
                
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
                  
                <View style={styles.FormGroup}>
                    <TextInput
                      value={values.oldPassword}
                      onChangeText={handleChange("oldPassword")}
                      onBlur={handleBlur("oldPassword")}
                      placeholder={"পুরাতন পাসওয়ার্ড দিন"}
                      secureTextEntry={true}
                      style={styles.inputs}
                    />
                    {touched.oldPassword && errors.oldPassword ? (
                      <ErrorText>{errors.oldPassword}</ErrorText>
                    ) : null}
                  </View>
                 
                  <View style={styles.FormGroup}>
                      <TextInput
                        value={values.newpassword}
                        onChangeText={handleChange('newpassword')} 
                        onBlur={handleBlur('newpassword')}
                        placeholder={'নতুন পাসওয়ার্ড দিন'}
                        secureTextEntry={true}
                        style={styles.inputs}
                      />
                      {touched.newpassword && errors.newpassword ? (
                        <ErrorText>{errors.newpassword}</ErrorText>
                      ) : null}
                    </View>
                    <View style={styles.FormGroup}>
                      <TextInput
                        value={values.confirmPassword}
                        onChangeText={handleChange('confirmPassword')}
                        onBlur={handleBlur('confirmPassword')}
                        placeholder={'নতুন পাসওয়ার্ড নিশ্চিত করুন'}
                        secureTextEntry={true}
                        style={styles.inputs}
                      />
                      {touched.confirmPassword && errors.confirmPassword ? (
                        <ErrorText>{errors.confirmPassword}</ErrorText>
                      ) : null}
                    </View>
                  </View>
                  <View style={{ alignItems:'center', marginTop: 0, paddingHorizontal: 10}}>
                    <AppBtn
                      title="Submit"
                      onPress={handleSubmit}
                      disabled={isSubmitting}
                      width = {150}
                    />
                  </View>
              
                </>
              )}
            </Formik>
          </View>
        </KeyboardAvoidingView>
      
      </ScrollView>
     
    </View>
    </View>
  );
}

export default PasswordChangeScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1, 
   // width: '100%',
   height: 'auto',
    //height: 120,
    position: 'absolute',
    width: Dimensions.get('window').width,
   bottom: 0,
    zIndex: -1,
  },
  headerContainer: {
    marginTop: 50,
    marginHorizontal: 10
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
    width: Dimensions.get('window').width
  },
  picker: {
    height: 45,
    color: '#333',
    width: 250,
    fontSize: 14,
  },
  inputs: {
    borderColor: '#aaa',
    borderWidth: 1,
    padding: 12,
    borderRadius: 2,
    fontSize: 13,
    backgroundColor: '#fff',
    color:'#333',
    width: 300,
    marginBottom:10
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
