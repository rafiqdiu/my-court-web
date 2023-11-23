import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import {Formik} from 'formik';
import { DataTable } from 'react-native-paper';
import {globalStyles} from '../../../styles/globalStyles';
import { confirmAlert } from 'react-confirm-alert'; 
// Import
//import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
//import '../../../../node_modules/react-confirm-alert/src/react-confirm-alert.css';
import { FancyAlert } from 'react-native-expo-fancy-alerts';
// eslint-disable-next-line no-unused-vars
import React, {useEffect,useCallback , useState, useContext, createRef, useRef} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button,
  Image,
  Keyboard,
  Linking,
  SafeAreaView,
  Animated,
  LogBox,
  Pressable   
} from 'react-native';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import {BASE_URL} from '../../../components/BaseUrl';
//import ScreenBackground from '../../../components/ScreenBackground';
import AppBtn from '../../../shared/appBtn';
import WavyTopBar from '../../../shared/WavyTopBar';

import InputLevel from '../../../shared/inputLevel';
import LeftBar from '../../../shared/LeftBar';
import LeftBarItem from '../../../shared/LeftBarItem';

import DateTimePickerModal from "react-native-modal-datetime-picker"; 
import moment from "moment";
//import { format } from 'date-fns';
import ErrorText from '../../../shared/errorText';

import {
  DatePickerModal,
  DatePickerModalContent,
  TimePickerModal,
  DatePickerInput,
  // @ts-ignore TODO: try to fix expo to work with local library
} from 'react-native-paper-dates';
import { Popable } from 'react-native-popable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import * as yup from 'yup';

const registerSchema = yup.object({
  division_name: yup.string().required('Division is required'),
  district_name: yup.string().required('District is required'),
  lower_court_name: yup.string().required('Lower Court is required'),

 
});

//import sharedStyles from '../../../sharedStyles';
const windowWidth = Dimensions.get('window').width;
const tableWidth = windowWidth-220;
export default function DailyCaseListScreen() {
  const navigation = useNavigation();
  const [refreshing] = useState(true);
  const [endLoader, setEndLoader] = useState(1);
  const onEndReached = () => {
    //console.log('end reached');
    setEndLoader(0);
  };
  const [tableData] = useState([]);
  const [court, setCourt] = useState([]);
  const [lower_court, setLowerCourt] = useState([]);
  const [caseInfo, setCaseInfo] = useState([]);
  const [court_id, setCourtId] = useState(null);
  const [lower_court_id, setLowerCourtId] = useState(null);
  const [lower_court_name, setLowerCourtName] = useState("");
  const [district_name, setDistrictName] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [select_date, setselectdate] = useState(null);
  const [user_id, setUserId] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

 // const inputRef = React.useRef(null); 
  const [division, setdivision] = useState([]);
  const [division_id, setdivisionId] = useState(null);
  const [district_id, setDistrictId] = useState(null);
  const [district, setDistrict] = useState([]);

 
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


  const ListFooterComponent = (
    <View style={styles.listFooter}>
      <ActivityIndicator animating={true} size="large" color="#00ff00" />
    </View>
  );

  const _fetchCourtData = async (user_id) => {
    try {
      let url = `${BASE_URL}/GetCourtName?user_id=`+user_id;
      let response = await axios.get(url).then(res => res.data);

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  };

  // const _fetchLowerCourtData = async (data) => {
  //   try {let dataToSend = {
  //     id:data,
  //     user_id: user_id,
  //   //  court_name_id:data
  //     };
  //   let formBody = [];
  //   for (let key in dataToSend) {
  //     let encodedKey = encodeURIComponent(key);
  //     let encodedValue = encodeURIComponent(dataToSend[key]);
  //     formBody.push(encodedKey + '=' + encodedValue);
  //   }
  //   formBody = formBody.join('&');
  //     //let url = `${BASE_URL}/CourtNameToLowerCourt`;  //Custom Old
  //     let url = `${BASE_URL}/GetCourtNameToCourtNameNumber`;
  //     let response = await axios.post(url, formBody).then(res => res.data);

  //     return response;
  //   } catch (err) {
  //     console.log('Error', err);
  //   }
  // };


  const _fetchCaseInfoData = async (values, actions) => {
    setCaseInfo([]);
    try {let dataToSend = {
      //user_id: 22,
      user_id: user_id,
      //court_id: court_id,
      //our_lower_court_id: lower_court_id,

      division_id: division_id,
      geo_district_id: district_id,
      lower_court_id:lower_court_id,

      //search_date: "2023-03-29",
      search_date: Platform.OS === 'web' ? date !==null ? moment(date).format("YYYY-MM-DD") : "" : select_date !==null ? moment(select_date).format("YYYY-MM-DD") : "",
      };
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }

    //console.log(formBody);

    formBody = formBody.join('&');

      let url = `${BASE_URL}/GetCaseInfoWithPaging`;
      let response = await axios.post(url, formBody).then(res => res.data);
      console.log(response); 
      return response;
      //if (response.country) return response.country;
    } catch (err) {
      console.log('Error', err);
    }
  };


  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(false);
      setIsSearch(false);
      setCaseInfo([]);
    }, [])
   );

  useEffect(() => {
    //async fetch user data
      getUserId().then(UserId => { 
        setUserId(UserId)
        _fetchCourtData(UserId)
        .then(court => {
          setCourt(court);
        })
        .catch(err => console.log(err));
      });

      _fetchdivisionData()
      // eslint-disable-next-line no-shadow
      .then(division => {
        //console.log(division);
        setdivision(division);
      })
      .catch(err => console.log(err));


      // if (inputRef?.current) {
      //   inputRef?.current?.setNativeProps({
      //     type: 'date',
      //     min: '1920-01-01',
      //     max: '2120-01-01',
      //     pattern: 'd{4}-d{2}-d{2}',
      //   })
      // }

  }, []);


  const _fetchLowerCourtData = async (data) => {
    try {let dataToSend = {
      
      geo_district_id:data,
      //geo_district_id:district_id,
      geo_division_id:division_id,

     // user_id: user_id,
    //  court_name_id:data
      };
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
      //let url = `${BASE_URL}/CourtNameToLowerCourt`;  //Custom Old
      // let url = `${BASE_URL}/GetCourtNameAlldistrictToCourtNameNumber`;
      let url = `${BASE_URL}/DivisionAndDistrictToCourtName`;
      let response = await axios.post(url, formBody).then(res => res.data);

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  };
  const getLowerCourtdata = (data) => { _fetchLowerCourtData(data)
    // eslint-disable-next-line no-shadow
    .then(lower_court => {
       //console.log(lower_court);
       setLowerCourt(lower_court);
      //setalldistrict(district);
    })
    .catch(err => console.log(err)); 
  }  

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

  const getDstrictsdata = (data) => { _fetchDistrictData(data)
    // eslint-disable-next-line no-shadow
    .then(district => {
      // console.log(district);
      setDistrict(district);
      //setalldistrict(district);
    })
    .catch(err => console.log(err));
  
    
  }


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

  /*
const getLowerCourtdata = (data) => { _fetchLowerCourtData(data)
  // eslint-disable-next-line no-shadow
  .then(lower_court => {
     //console.log(lower_court);
     setLowerCourt(lower_court);
    //setalldistrict(district);
  })
  .catch(err => console.log(err)); 
}  
*/

const _saveBasicInfo =  (data) => {
  console.log(data);
//  return data;
  try {
    let url = `${BASE_URL}/CaseEntryFromCaseInfo`;
   // let response = await axios.post(url, data).then((res) => res.data);
   let formBody = [];
  for (let key in data) {
    let encodedKey = encodeURIComponent(key);
    let encodedValue = encodeURIComponent(data[key]);
    formBody.push(encodedKey + '=' + encodedValue);
  }
  formBody = formBody.join('&');

   let response =   axios.post(url, formBody)
 
  .then((res) => res.data);
  // console.log(response);
   return response;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  }
};


const handleCaseCreate = (values) => {
 
setIsLoading(true);

  const caseData = {
  
    case_info_id:values.case_info_id,
    user_id: user_id,
    
    
  };
 console.log(caseData);
  //perform api call to update password
  _saveBasicInfo(caseData)
    .then((user) => {
     //console.log(user);
      if (!user) return;
      else{
      
       if (user.code == 200)
      
       {
        setIsLoading(false);
       alert( user.msg);
       navigation.navigate("মামলা",{screen:'TotalCaseScreen'})
       }        
      else
       {  
        setIsLoading(false);       
       alert(user.msg);
       }
       // alert("Successfully updated");
       // fetchData();
      }
     
    })
    .catch((err) => console.log(err));
  
};

const updateDivision = (handleChange, value) => {
  handleChange(value);
};
const updateDistrict = (handleChange, value) => {
  handleChange(value);
};

const updateLowerCourt = (handleChange, value) => {
  handleChange(value);
};
const [alertVisible, setAlertVisible] = useState(false);
const handlePress = useCallback(() => {
  setAlertVisible(true);
}, []);

const handleClose = useCallback(() => {
  setAlertVisible(false);
}, []);



  const handleCaselistUpdate = (values, actions) => {

    //Show Loader
    setIsLoading(true);
    setIsSearch(false);

    _fetchCaseInfoData()
    // eslint-disable-next-line no-shadow
    .then(getCaseInfo => {
      setCaseInfo(getCaseInfo);
      //Hide Loader
      console.log(getCaseInfo);
      setIsLoading(false);
      setIsSearch(true);
    })
    .catch(err => console.log(err));
  };
  
  return (
    <View    style={Platform.OS === 'web' && windowWidth >= 600?globalStyles.mainContainer:globalStyles.mainContainerMobile}>
    <LeftBar>   
       <LeftBarItem  selectcolor='true' name = 'দৈনিক কার্যতালিকা'  stack = 'দৈনিক কার্যতালিকা'   screen = 'DailyCaseListScreen' />
      
   </LeftBar>
    
     <View style={ Platform.OS === 'web' && windowWidth >= 600?globalStyles.bodyContainer:globalStyles.bodyContainerMobile}>
   
    
   
   
   <ScrollView style={{flexGrow: 1}} nestedScrollEnabled={true}>
   
        <KeyboardAvoidingView
          style={styles.containerSearch}
          behavior="padding"
          enabled
        >
           <WavyTopBar customStyles={[styles.backgroundImage,{zIndex:-1}] } />
          <Formik
            enableReinitialize
             initialValues={{
                 search_date: '',
                 division_name:'',
                 district_name: '',
                 lower_court_name:''           
            }}
            validationSchema={registerSchema}
            onSubmit={(values, actions) => {
              handleCaselistUpdate(values, actions);
            }}
            // eslint-disable-next-line no-undef
            // innerRef={formikElement}
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
                
                <View style={styles.FormGroup}>
                  {/* <InputLevel>Division Name</InputLevel> */}

                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={division_id ? division_id : 0}
                      style={{
                        ...styles.picker2,
                      }}
                      // onValueChange={(itemValue, itemIndex) => setdivision_id(itemValue)}
                      onValueChange={(itemValue, itemIndex) => {
                       // filterdistrictResults(itemValue);
                       setdivisionId(itemValue);
                      
                        getDstrictsdata(itemValue);
                        updateDivision(handleChange("division_name"), itemValue);
                      }}
                      mode="dropdown"
                    >
                      <Picker.Item label="বিভাগ নির্বাচন করুনঃ–" value="0" color='red' />

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
                    {touched.division_name && errors.division_name ? (
                        <ErrorText>{errors.division_name}</ErrorText>
                      ) : null}
                  </View>
                </View>
                <View style={styles.FormGroup}>
                  {/* <InputLevel>District Name</InputLevel> */}
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={district_id ? district_id : 0}
                      style={{
                        ...styles.picker2,
                      }}
                      onValueChange={(itemValue, itemIndex) => {
                        setDistrictId(itemValue);                       
                        getLowerCourtdata(itemValue);
                        setDistrictName(district[itemIndex-1].district_name_bng)
                        updateDistrict(handleChange("district_name"), itemValue);
                       //getCourtData(itemValue);
                      }}
                      mode="dropdown"
                    >

                      <Picker.Item label="জেলা নির্বাচন করুনঃ–" value="0" color='red' />

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
                    {touched.district_name && errors.district_name ? (
                        <ErrorText>{errors.district_name}</ErrorText>
                      ) : null}
                  </View>
                </View>

                
                {/* <View style={styles.FormGroup}>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={court_id ? court_id : 0}
                      style={{
                        ...styles.picker,
                      }}
                      onValueChange={(itemValue, itemIndex) => {
                        setCourtId(itemValue);
                        getLowerCourtdata(itemValue);
                      }}
                      mode="dropdown"
                    >
                      <Picker.Item label="আদালত এর নাম নির্বাচন করুন" value="0" />
                      {court.map((item, index) => {
                        return (
                          <Picker.Item
                            label={item.court_name_bng}
                            value={item.id}
                            key={index}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                </View> */}

                <View style={styles.FormGroup}>
                  {/* <InputLevel>অধস্তন আদালত :</InputLevel> */}
                  <View style={styles.pickerWrapper}>
                  {/* <Popable style={{ opacity: 0.8, width:'auto', height:32,  marginLeft:0, }} action="hover" content="অধস্তন আদালত নির্বাচন করুন"> */}
                    <Picker
                      selectedValue={lower_court_id ? lower_court_id : 0}
                      style={{
                        ...styles.picker,
                      }}
                      onValueChange={(itemValue, itemIndex) => {
                        setLowerCourtId(itemValue);
                        setLowerCourtName(lower_court[itemIndex-1].office_name_bng)
                        updateLowerCourt(handleChange("lower_court_name"), itemValue);
                      }}
                      mode="dropdown"
                    >
                      
                  <Picker.Item label="অধস্তন আদালত নির্বাচন করুনঃ–" value="0" color='red' /> 

                      {lower_court.map((item, index) => {
                        return (
                          <Picker.Item
                            label={item.office_name_bng}
                            value={item.id}
                            key={index}
                          />
                        );
                      })}
                    </Picker>
                    {touched.lower_court_name && errors.lower_court_name ? (
                        <ErrorText>{errors.lower_court_name}</ErrorText>
                      ) : null}
                    {/* </Popable> */}
                  </View>
                </View>

                <View style={styles.FormGroup}>
                    {/* <InputLevel>তারিখ :</InputLevel> */}
                   <>
                   <View style={{flexDirection:'row'}}>
      
    { Platform.OS === 'web'?     
                    <TouchableOpacity  onPress={() =>setVisible(true)}  style={styles.sectionStyle} >
                   <TextInput
                   style={styles.inputs1} 
                   value={ Platform.OS === 'web' ?(date !==null ? moment(date).format("DD-MM-YYYY") : ""):(select_date !==null ? moment(select_date).format("DD-MM-YYYY") : "")}
                   onChangeText={handleChange("search_date")}
                   onBlur={handleBlur("search_date")}
                   placeholder={"DD-MM-YYYY"}
                   underlineColorAndroid="transparent"
                  // isEditing={isEditing}
                   onTouchStart={showDatePicker}
                 /><Image
            source={{
              uri:
                'https://bdjudgecourt.com/assets/calendar.png',
            }}
            style={styles.imageStyle}
          /></TouchableOpacity> : <TextInput
                   style={styles.inputs1} 
                   value={ Platform.OS === 'web' ?(date !==null ? moment(date).format("DD-MM-YYYY") : ""):(select_date !==null ? moment(select_date).format("DD-MM-YYYY") : "")}
                   onChangeText={handleChange("search_date")}
                   onBlur={handleBlur("search_date")}
                   placeholder={"DD-MM-YYYY"}
                   underlineColorAndroid="transparent"
                  // isEditing={isEditing}
                   onTouchStart={showDatePicker}
                 />   } 
                   {/* { Platform.OS === 'web' ? (  <FontAwesome.Button     name='calendar'   color='#f00'  style={{ width:30, zIndex:999999, height:25, marginLeft:,marginTop:3 }}  onPress={() =>setVisible(true)}></FontAwesome.Button> ):null } */}
               </View>
                { Platform.OS === 'web' ? (
                  <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
        
                    {/* <Button onPress={() => setVisible(true)} uppercase={false} mode="outlined">  Pick time </Button> */}

                      <DatePickerModal
                      
                        locale={locale}
                        mode="single"
                        visible={visible}
                        onDismiss={onDismiss}
                        date={date}
                        onConfirm={onChangeSingle}
                        onChange={onChangeSingle}
                        validRange={{
                          startDate: pastDate,
                          disabledDates: [futureDate],
                          // startDate: new Date(2021, 1, 2), // optional
                          // endDate: new Date(), // optional
                        }}
                       
                        // saveLabel="Save" // optional
                        // uppercase={false} // optional, default is true
                        // label="Select date" // optional
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
                    {touched.search_date && errors.search_date ? (
                      <ErrorText>{errors.search_date}</ErrorText>
                    ) : null}
                  </View> 
              

                {/* <TouchableOpacity
                  onPress={() => {
                    handleSubmit;
                    // eslint-disable-next-line no-undef
                    Keyboard.dismiss();
                  }}
                > */}
                  <View style={styles.Topview}>
                    <AppBtn
                      title="অনুসন্ধান"
                      onPress={handleSubmit}
                      //disabled={isSubmitting ? true : false}
                    />
                  </View>
                {/* </TouchableOpacity> */}
              </>
            )}
          </Formik>
        </KeyboardAvoidingView>
      


     
          
            <TouchableOpacity>
              <Text style={styles.Topheader}>
              {caseInfo.length > 0?caseInfo[0].office_name_bng+",":""} {caseInfo.length > 0?caseInfo[0].district_name_bng:""}
              {/* { isSearch ? lower_court_name+",":""} {isSearch ? district_name:""} */}
              </Text>
              <Text style={styles.Topheader}>দৈনিক কার্যতালিকা</Text>
              {  !isLoading ? (<> <Text style={styles.TopheaderDate}>Date: { Platform.OS === 'web' ?(date !==null ? moment(date).format("DD-MM-YYYY") : ""):(select_date !==null ? moment(select_date).format("DD-MM-YYYY") : "")}</Text>
              <Text style={styles.Topheader}>Total Case Found: {caseInfo.length}</Text>
              </> ) 
          : 
          null }
            </TouchableOpacity>
           
          {  Platform.OS === 'web'
            ? <View style={styles.webView}>


              <table>
                <thead style={styles.head}>
                <tr>
                    <th style={styles.headTextsl}>ক্রমিক নং</th>
                    <th style={styles.headText}>মামলার নম্বর</th>
                    <th style={styles.headText}>কার্যক্রম</th>
                    <th style={styles.headText}>পরবর্তী তারিখ</th>
                    <th style={styles.headText}>সংক্ষিপ্ত আদেশ</th>
                    <th style={styles.headText}>Action</th>
                </tr>
                </thead>
                <tbody  style={styles.body}>
                    {
                      caseInfo.map((item, index) => (
                      
                            <tr key={item.serial_no}>
                                <td style={index % 2 == 0?styles.bodyTextsl:styles.bodyTextsl1}>{item.serial_no}</td>
                                <td style={index % 2 == 0?styles.bodyText:styles.bodyText1}>{item.type_name + ' - ' + item.case_number + '/' + item.case_year+' '+ item.upazila_name_bng }</td>
                                <td style={index % 2 == 0?styles.bodyText:styles.bodyText1}>{item.activities}</td>
                                <td style={index % 2 == 0?styles.bodyText:styles.bodyText1}>{item.next_date=="01-01-1970"?"":item.next_date}</td>
                                <td style={index % 2 == 0?styles.bodyText:styles.bodyText1}>{item.result}</td>
                                <td style={index % 2 == 0?styles.bodyText:styles.bodyText1}>
                                    <View style={styles.buttonStyleContainer}>
                                        <Pressable style={styles.buttons} 
                                        
                                        onPress={() => {
                                          confirmAlert({
                                            title: 'মামলা যোগ করার জন্য নিশ্চিত করুন',
                                            message: 'আপনি এই কাজ করতে নিশ্চিত "এটা কি আপনার মামলা ??".',
                                            buttons: [
                                              {
                                                label: 'হ্যাঁ',
                                                onClick: () =>   handleCaseCreate(item)
                                              },
                                              {
                                                label: 'না',
                                                //onClick: () => alert('Click No')
                                              }
                                            ]
                                          });
                                          //handleCaseCreate(item);
                                              // navigation.navigate('CaseHistoryScreen', {
                                              //   caseType: case_type_id,
                                              //   case_number: item.case_number,
                                              //   case_year: item.case_year,
                                              // });
                                            }}
                                            
                                            >
                                          <Text style={styles.texts}>মামলা যোগকরি</Text>
                                        </Pressable>
                                    </View>
                                  </td>
                            </tr>
                           
                        ))
                    }
                </tbody>
            </table>



            {/* 
              <DataTable>
                <DataTable.Header style={styles.head}>
                    <DataTable.Title numeric style={styles.headTextsl}>ক্রমিক নং</DataTable.Title>
                    <DataTable.Title style={styles.headText}>মামলার নম্বর</DataTable.Title>
                    <DataTable.Title style={styles.headText}>কার্যক্রম</DataTable.Title>
                    <DataTable.Title style={styles.headText}>পরবর্তী তারিখ</DataTable.Title>
                    <DataTable.Title style={styles.headText}>সংক্ষিপ্ত আদেশ</DataTable.Title>
                </DataTable.Header>
                { caseInfo.length > 0 && isSearch &&
                <FlatList
                data={caseInfo}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                bounces={false}
                numColumns={1}
                renderItem={({item, i}) => (
                  <View key={item.key}>
                    <TouchableOpacity>
                      
                            <DataTable.Row style={styles.rowSection}>
                                <DataTable.Cell numeric style={styles.rowTextsl}>{item.serial_no}</DataTable.Cell>
                                <DataTable.Cell style={styles.rowText}>{item.type_name + ' - ' + item.case_number + '/' + item.case_year}</DataTable.Cell>
                                <DataTable.Cell style={styles.rowText}>{item.activities} </DataTable.Cell>
                                <DataTable.Cell style={styles.rowText}>{item.next_date=="01-01-1970"?"":item.next_date}</DataTable.Cell>
                                <DataTable.Cell style={styles.rowText}>{item.result} </DataTable.Cell>
                            </DataTable.Row>

                    </TouchableOpacity>
                  </View>
                )}
                removeClippedSubviews={true}
                initialNumToRender={30}
                maxToRenderPerBatch={20}
                onEndReachedThreshold={0.1}
                onEndReached={onEndReached}
                refreshing={refreshing}
                updateCellsBatchingPeriod={20}
                ListFooterComponent={() =>
                  endLoader && caseInfo.length > 0 ? ListFooterComponent : null
                }
                windowSize={10}
              />
             }   
            </DataTable> */}




            </View>
          : null 
        }
           { 
          caseInfo.length == 0 && isSearch ? (
            <Text style={styles.Topheader}>
              No Case Found
            </Text>
            ) 
          : 
          null
       }

      { isLoading ? <ActivityIndicator size="large"/> : null }

        { caseInfo.length > 0 && isSearch &&
              Platform.OS === 'android'
              ?
            <View style={{...styles.mobileView, width: windowWidth - 16}}>
                <FlatList
                    data={caseInfo}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    numColumns={1}
                    renderItem={({item, i}) => (
                      <View key={item.key}>
                        <TouchableOpacity>
                          <View style={styles.hddata}>
                            <View style={styles.MCart}>
                              <Text style={styles.textTile}>ক্রমিক নং</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>
                                {item.serial_no}
                              </Text>
                            </View>

                            <View style={styles.MCart}>
                              <Text style={styles.textTile}>মামলার নম্বর</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>
                              {item.type_name + ' - ' + item.case_number + '/' + item.case_year+' '+item.upazila_name_bng}
                              </Text>
                            </View>

                            <View style={styles.MCart}>
                              <Text style={styles.textTile}>কার্যক্রম</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>
                                {item.activities}
                              </Text>
                            </View>

                            <View style={styles.MCart}>
                              <Text style={styles.textTile}>পরবর্তী তারিখ</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>
                                {item.next_date=="01-01-1970"?"":item.next_date} 
                              </Text>
                            </View>

                            <View style={styles.MCart}>
                              <Text style={styles.textTile}>সংক্ষিপ্ত আদেশ</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>
                                {item.result}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}
                    removeClippedSubviews={true}
                    initialNumToRender={30}
                    maxToRenderPerBatch={20}
                    onEndReachedThreshold={0.1}
                    onEndReached={onEndReached}
                    refreshing={refreshing}
                    updateCellsBatchingPeriod={20}
                    ListFooterComponent={() =>
                      endLoader && caseInfo.length > 0 ? ListFooterComponent : null
                    }
                    windowSize={10}
                  />
            </View>
        : null }
      
   </ScrollView> 
  </View>
</View>
  );
}

const styles = StyleSheet.create({
  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    height: 28,
    borderRadius: 5,
    margin: 10,
  },
  imageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  webView: {
    flex: 1,
    marginRight: 'auto',
    marginLeft: 'auto',
    width: tableWidth,
    paddingTop: 10,
    paddingBottom:10, 
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom:10,
},

head: { 
  height: 40, 
  backgroundColor: 'khaki', 
  borderTopLeftRadius:5,
  borderTopRightRadius:5,
  
},
body: { 
  height:'200', overflow:'scroll'
},

headTextsl: { 
  fontSize: 13, 
  // fontWeight: 'bold', 
  textAlign: 'center', 
  color: '#000', 
  justifyContent:'center',
  width: 62,
},
headText: { 
  fontSize: 13, 
  // fontWeight: 'bold', 
  textAlign: 'center', 
  color: '#000', 
  justifyContent:'center',
},


buttons: {
  flex: 1,
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
},
texts: {
  fontSize: 12,
  lineHeight: 14,
  fontWeight: 'bold',
  letterSpacing: 0.25,
  color: 'white',
},

buttonStyleContainer: {
 flex: 1,
 flexDirection: 'row',
 marginHorizontal: 20,
  marginTop: 5,
  marginRight:5,
},

rowSection: { 
  height: 40, 
  backgroundColor: '#f7f7f7',
},

rowText: { 
  margin: 6, 
  fontSize: 16, 
  fontWeight: 'bold', 
  textAlign: 'center',
  justifyContent:'center', 
  borderRightWidth:1,
  borderRightColor:'#ccc'  
},
rowTextsl: { 
  margin: 6, 
  fontSize: 16, 
  fontWeight: 'bold', 
  textAlign: 'center',
  justifyContent:'center', 
  borderRightWidth:1,
  borderRightColor:'#ccc',
  width: 50,  
},

mobileView: {
  flex: 1,
  marginRight: 'auto',
  marginLeft: 'auto',
},



bodyTextsl: { 
  fontSize: 12, 
  // fontWeight: 'bold', 
  textAlign: 'center', 
  color: '#000', 
  justifyContent:'center',
  width: 62,
  backgroundColor:'#ccc'
  
},
bodyTextsl1: { 
  fontSize: 12, 
  // fontWeight: 'bold', 
  textAlign: 'center', 
  color: '#000', 
  justifyContent:'center',
  width: 62,
  backgroundColor:'#fffffc'
  
},
bodyText: { 
  fontSize: 12, 
  // fontWeight: 'bold', 
  textAlign: 'center', 
  color: '#000', 
  justifyContent:'center',
  backgroundColor:'#ccc'

},
bodyText1: { 
  fontSize: 12, 
  // fontWeight: 'bold', 
  textAlign: 'center', 
  color: '#000', 
  justifyContent:'center',
  backgroundColor:'#fffffc'

},




  HeadStyle: { 
    height: 50,
    alignContent: "center",
    backgroundColor: '#ffe0f0'
  },
  TableText: { 
    margin: 10
  },
  mainContainer: {
    flex:1,
    flexDirection: 'row'
  },
  LeftContainer: {
   flex: 1,
   backgroundColor: "#aa88aa" 
  },
  bodyContainer: {
    flex: 6
  },
  viewContent: {
    flex: 1,
    padding: 8,
  },
  picker2: {
    height: 25,
    color: '#333',
    width: 150,
  },
  inputs: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 2,
    fontSize: 13,
    backgroundColor: '#fff',
  },
  inputs1: {
    //borderColor: '#ccc',
   // borderWidth: 1,
    padding: 5,
    borderRadius: 2,
    fontSize: 13,
    width:90,
    backgroundColor: '#fff',
  },
  inputs11: {
    //borderColor: '#ccc',
   // borderWidth: 1,
    padding: 5,
    borderRadius: 2,
    fontSize: 13,
    width:110,
    backgroundColor: '#fff',
  },
  FormGroup: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  MCart: {flexDirection: 'row', padding: 0},
  borderStyles: {
    borderWidth: 1,
    borderColor: '#C1C0B9',
    // width: '100%',
  },
  Topview: {
    marginTop: -7,
    // marginBottom: 80,
    paddingHorizontal: 10,
  },
  pickerWrapper: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  picker: {
    height: 25,
    color: '#333',
    width: 200,
  },
  containerSearch: {
    //flex: 1,
    flexDirection:
      Platform.OS === 'web' && windowWidth >= 600 ? 'row' : 'column',
    justifyContent: 'center',
    //paddingTop: .stConstantsatusBarHeight,
   // backgroundColor: '#fff',
    backgroundColor: 'transparent',
    alignItems: 'center',
    //padding: 8 ,
    //paddingTop:30,
    paddingVertical: 0,
  },
  Buttons: {
    width: 200,
    padding: 5,
    marginLeft: 10,
  },
  input: {
    width: 200,
    fontSize: 20,
    padding: 5,
    paddingLeft: 20,
    marginBottom: 10,
    marginRight: 10,
    color: 'white',
    borderWidth: 0.5,
    borderColor: 'green',
    borderRadius: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
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
  Topcontainer: {
    flex: 1,
    padding: 16,
    //paddingTop: 30,
    width: '99%',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  TotalCaseFound: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    width: responsiveWidth(100),
  },
  asperSupremeCourt: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    width: responsiveWidth(100),
  },
  hddata: {
    padding: 5,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 6,
    marginTop: 5,
    marginBottom: 0,
    backgroundColor: '#C1EfFf',
  },
  textDescription: {
    paddingTop: 3,
    fontSize: 13,
    width: responsiveWidth(60),
  },
  textTile: {
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: responsiveWidth(28),
  },
  textTilecln: {
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 8,
  },
  main_body: {
    padding: 5,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 6,
    marginBottom: 0,
    backgroundColor: '#FFF',
    width: responsiveWidth(97),
  },
  container: {
    flex: 1,
    padding: 2,
    paddingTop: 30,
    width: '99%',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  Topheader: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 23,
    color: '#000',
  },
  TopheaderDate: {
    textAlign: 'center',
    //fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },

  // header: {height: 50, backgroundColor: '#537791'},
  // texts: {textAlign: 'center', fontWeight: '100'},
  // dataWrapper: {marginTop: -1, width: '99%'},
  // row: {height: 40, backgroundColor: '#E7E6E1'},









  tabStyle: {},
  scrollStyle: {
    backgroundColor: 'white',
    paddingLeft: 65,
    paddingRight: 65,
    // justifyContent: 'center',
  },
  tabBarTextStyle: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  underlineStyle: {
    height: 3,
    backgroundColor: 'red',
    borderRadius: 3,
    width: 15,
  },
  hddata: {
    padding: 5,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 6,
    marginTop:5,
    marginBottom:0,
    backgroundColor: "#C1EfFf",
  },
  textTile:{
    fontSize: 14,
    alignItems: "center",
    justifyContent: "center",
    width:responsiveWidth(29),
  },
  textTilecln:{
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
    width:8,
  },

  textDescription:{
    paddingTop:3,
    fontSize: 13,
    width:responsiveWidth(60),
  },




});
