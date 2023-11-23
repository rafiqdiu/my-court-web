import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import {Formik} from 'formik';
import { DataTable } from 'react-native-paper';
import {globalStyles} from '../../../styles/globalStyles';
import moment from "moment";
import { confirmAlert } from 'react-confirm-alert'; // Import
//import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import ErrorText from '../../../shared/errorText';
import WavyTopBar from '../../../shared/WavyTopBar';
// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState, useContext,useCallback, createRef, useRef} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ImageBackground,
  TouchableWithoutFeedback,
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
import DropDownFormik from "../../../shared/DropDownFormik";
import InputLevel from '../../../shared/inputLevel';
import LeftBar from '../../../shared/LeftBar';
import LeftBarItem from '../../../shared/LeftBarItem';
import * as yup from 'yup';
//import sharedStyles from '../../../sharedStyles';

const registerSchema = yup.object({
  division_name: yup.string().required('Division is required'),
  district_name: yup.string().required('District is required'),
  lower_court_name: yup.string().required('Lower Court is required'), 
  case_type_name: yup.string().required('Case type is required'),
  Year: yup
  .string()
  .required('Year is required')
  .max(4, 'Year must be maximum of 4 digit'),
  caseNo: yup
  .string()
  .required('Case no. is required'),
 
 
});

const windowWidth = Dimensions.get('window').width;
const tableWidth = windowWidth-220;
export default function MyCaseScreen({navigation}) {
  const [refreshing] = useState(true);
  const [endLoader, setEndLoader] = useState(1);
  const onEndReached = () => {
    //console.log('end reached');
    setEndLoader(0);
  };
  
  const [caseInfo, setCaseInfo] = useState([]);
  const [user_id, setUserId] = useState([]);
  const [case_type, setcaseType] = useState([]);
  const [case_type_id, setcaseTypetId] = useState(null);
  const [caseNo, setcaseNo] = useState(null);
  const [Year, setYear] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  const [court, setCourt] = useState([]);
  const [court_id, setCourtId] = useState(0);
  
  const [lower_court, setLowerCourt] = useState([]);
  const [lower_court_id, setLowerCourtId] = useState(0);
  const [lower_court_name, setCourtName] = useState(null); 


  const [division, setdivision] = useState([]);
  const [division_id, setdivisionId] = useState(null);
  const [district_id, setDistrictId] = useState(null);
  const [district, setDistrict] = useState([]);
  const [caseTypes, setcaseTypes] = useState([]);
  const [lower_courts, setLowerCourts] = useState([]);
    
  const ListFooterComponent = (
    <View style={styles.listFooter}>
      <ActivityIndicator animating={true} size="large" color="#00ff00" />
    </View>
  );

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(false);
      setIsSearch(false);
      setCaseInfo([]);
    }, [])
   );


  useEffect(() => {
    _fetchCaseTypeData()
    .then(caseType => {
      setcaseType(caseType);
      setcaseTypes( caseType.map(marker =>{ 
        marker.value = marker.id
         marker.label = marker.type_name 
          return marker
      }));
    })
    .catch(err => console.log(err));
    //async fetch user data
      getUserId().then(UserId => { 
        setUserId(UserId)
      })
      .catch(err => console.log(err));

      _fetchdivisionData()
      // eslint-disable-next-line no-shadow
      .then(division => {
        //console.log(division);
        setdivision(division);
      })
      .catch(err => console.log(err));

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
       setLowerCourts( lower_court.map(marker =>{ 
        marker.value = marker.id
         marker.label = marker.office_name_bng 
          return marker
      }));
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

  const _fetchCaseTypeData = async () => {
    try {
      let url = `${BASE_URL}/GetCaseType`;
      let response = await axios.get(url).then(res => res.data);
      return response;
    } catch (err) {
      console.log('Error', err);
    }
  };

  const handleCaselistUpdate = (values, actions) => {
    setCaseInfo([]);
    //Show Loader
    setIsLoading(true);
    setIsSearch(false);

        const {     
          caseNo,
          Year,
          lower_court_name,
          case_type_name,
        } = values;

      const searchData = {
        user_id: user_id,
        court_name_id: court_id,
        division_id: division_id,
        geo_district_id: district_id,
        lower_court_id:lower_court_name,
        case_type_id: case_type_name,
        case_number: caseNo,
        case_year: Year,
      };

      console.log(searchData);

    _fetchCaseInfoData(searchData)
    .then(getCaseInfo => {
      setCaseInfo(getCaseInfo);
      //Hide Loader
      setIsLoading(false);
      setIsSearch(true);
    })
    .catch(err => console.log(err));
  };

  const _fetchCaseInfoData = async dataToSend => {
    try {
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }

    formBody = formBody.join('&');
      let url = `${BASE_URL}/GetSingleCaseInfoWithPaging`;
      let response = await axios.post(url, formBody).then(res => res.data);
      //console.log(response);
      return response;
    } catch (err) {
      console.log('Error', err);
    }
  };

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

  const _fetchCourtData = async (district_id) => {
    try {
      let url = `${BASE_URL}/AllDivisionAndDistrictToCourtName?district_id=`+district_id;
      let response = await axios.get(url).then(res => res.data);

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  };

  const getCourtData = (data) => {
    _fetchCourtData(data)
    .then(court => {
      setCourt(court);
    })
    .catch(err => console.log(err));

  }


  const handleCaseCreate = (values) => {
   
  setIsLoading(true);
  
    const caseData = {
    
      case_info_id:values.case_info_id,
      user_id: user_id,
      
      
    };
  // console.log(caseData);
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

  const updateCaseType = (handleChange, value) => {
    handleChange(value);
  };
  const [lowerCourtOpen, setLowerCourtOpen] = useState(false);
  const [caseTypeOpen, setCaseTypeOpen] = useState(false);

  const closeDropdown = useCallback(() => {
    setLowerCourtOpen(false);
    setCaseTypeOpen(false);
  }, []);

  const isPlaceholder = (value) => {
    return value == null;
  }


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


 
  return (
    <View    style={Platform.OS === 'web' && windowWidth >= 600?globalStyles.mainContainer:globalStyles.mainContainerMobile}>
    <LeftBar>   
        <LeftBarItem selectcolor='true' name = 'মামলা খুজুন'  stack = 'MyCase'   screen = 'MyCaseScreen' />
    </LeftBar> 
    
     <View  style={ Platform.OS === 'web' && windowWidth >= 600?globalStyles.bodyContainer:globalStyles.bodyContainerMobile}>
     <TouchableWithoutFeedback onPress={()=>{closeDropdown()}}>
    <ScrollView style={{flexGrow: 1}} nestedScrollEnabled={true}>
     
        <KeyboardAvoidingView
          style={styles.containerSearch}
          behavior="padding"
          enabled
        >
           <WavyTopBar customStyles={[styles.backgroundImage,{ zIndex:-1}] }/>
          <Formik
            enableReinitialize
             initialValues={{
                 caseNo:'',
                 Year:'',
                 division_name: '',
                 district_name: '',
                 lower_court_name: '',
                 case_type_name: '',
            }}
            validationSchema={registerSchema}
            onSubmit={(values, actions) => {
              handleCaselistUpdate(values, actions);
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
                <View style={styles.FormGroup}>
                  {/* <InputLevel>Division Name</InputLevel> */}

                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={division_id ? division_id : 0}
                      style={isPlaceholder(division_id) ?
                        styles.pickerP2:styles.picker2
                      }
                      // onValueChange={(itemValue, itemIndex) => setdivision_id(itemValue)}
                      onValueChange={(itemValue, itemIndex) => {
                       // filterdistrictResults(itemValue);
                       setdivisionId(itemValue);
                      
                        getDstrictsdata(itemValue);
                        updateDivision(handleChange("division_name"), itemValue);
                      }}
                      mode="dropdown"
                    >
                     
                      <Picker.Item label="বিভাগ নির্বাচন করুনঃ–" value="0" />

                      {division.map((item, index) => {
                        return (
                          <Picker.Item
                          color='#333'
                            label={item.division_name_bng.toString()}
                            value={item.geo_division_id.toString()}
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
                      style={isPlaceholder(district_id) ?
                        styles.pickerP2:styles.picker2
                      }
                      onValueChange={(itemValue, itemIndex) => {
                        setDistrictId(itemValue);                       
                        getLowerCourtdata(itemValue);
                        updateDistrict(handleChange("district_name"), itemValue);
                       //getCourtData(itemValue);
                      }}
                      mode="dropdown"
                    >
                      
                      <Picker.Item label="জেলা নির্বাচন করুনঃ–" value="0" />

                      {district.map((item, index) => {
                        return (
                          <Picker.Item
                          color='#333'
                            label={item.district_name_bng.toString()}
                            value={item.geo_district_id.toString()}
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
                      <Picker.Item label="আদালত নির্বাচন করুন" value="0" />
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
                   {/*   <Picker
                      selectedValue={lower_court_id ? lower_court_id : 0}
                      style={{
                        ...styles.pickeru,
                      }}
                      onValueChange={(itemValue, itemIndex) => {
                        setLowerCourtId(itemValue);
                        setCourtName(lower_court[itemIndex-1].office_name_bng);
                        updateLowerCourt(handleChange("lower_court_name"), itemValue);
                      }}
                      mode="dropdown"
                    >
                      
                  <Picker.Item label="অধস্তন আদালত নির্বাচন করুনঃ–" value="0" />
                      
                      {lower_court?.map((item, index) => {
                        return (
                          <Picker.Item
                            label={item.office_name_bng.toString()}
                            value={item.id.toString()}
                            key={index}
                          />
                        );
                      })}
                    </Picker> */}
                     <View style={{flexDirection:'row',width:250, zIndex:100 }}>                   
                      <DropDownFormik
                       zIndex={9999999}
                       zIndexInverse={9999987}
                        listMode={Platform.OS === 'web'&& windowWidth >= 600 ?"FLATLIST":"MODAL"}
                        modalContentContainerStyle={{
                          // minHeight:responsiveHeight(50),
                           height:500, 
                           
                         }}
                         dropDownDirection="BOTTOM"
                         style={{height: windowWidth >= 600?27:40}}
                        open={lowerCourtOpen}
                        setOpen={setLowerCourtOpen}
                      searchable={true}
                        name="lower_court_name"
                        placeholder="অধস্তন আদালত নির্বাচন করুন"
                        items={lower_courts}
                        dropDownContainerStyle={{
                          minHeight:550,
                         
                          lineHeight:15
                        }}
                       
                      />
                   </View>
                    {touched.lower_court_name && errors.lower_court_name ? (
                      <ErrorText>{errors.lower_court_name}</ErrorText>
                    ) : null}
                  </View>
                </View>
                <View style={styles.FormGroup}>
                  {/* <InputLevel>মামলার ধরন:</InputLevel> */}

                  <View style={styles.pickerWrapper}>
                    {/* <Picker
                      selectedValue={case_type_id ? case_type_id : 0}
                      style={{
                        ...styles.picker,
                      }}
                      onValueChange={(itemValue, itemIndex) => {
                        setcaseTypetId(itemValue);
                        updateCaseType(handleChange("case_type_name"), itemValue);
                      }}
                      mode="dropdown"
                    >
                      <Picker.Item label="মামলার ধরন/ধারা নির্বাচন করুনঃ–" value="0" />

                      {case_type.map((item, index) => {
                        return (
                          <Picker.Item
                            label={item.type_name.toString()}
                            value={item.id.toString()}
                            key={index}
                          />
                        );
                      })}
                    </Picker> */}
                      <View style={{flexDirection:'row',width:250, zIndex: 100}}>                   
                      <DropDownFormik
                       zIndex={9999999}
                       zIndexInverse={9999987}
                        listMode={Platform.OS === 'web'&& windowWidth >= 600 ?"FLATLIST":"MODAL"}
                        modalContentContainerStyle={{
                          // minHeight:responsiveHeight(50),
                           height:500, 
                           
                         }}
                         style={{height: windowWidth >= 600?27:40}}
                         dropDownDirection="BOTTOM"
                        open={caseTypeOpen}
                        setOpen={setCaseTypeOpen}
                      searchable={true}
                        name="case_type_name"
                        placeholder="মামলার ধরন নির্বাচন করুনঃ–"
                        items={caseTypes}
                        dropDownContainerStyle={{
                          minHeight:550,
                         
                          lineHeight:15
                        }}
                       
                      />
                      </View>
                    {touched.case_type_name && errors.case_type_name ? (
                      <ErrorText>{errors.case_type_name}</ErrorText>
                    ) : null} 
                  </View>
                </View>
                <View style={styles.FormGroup}>
                    {/* <InputLevel>  মামলা নাম্বার:</InputLevel> */}
                  
                    <TextInput
                   style={styles.inputs4} 
                   placeholderTextColor="#989898"
                      value={values.caseNo}
                      onChangeText={handleChange("caseNo")}
                      onBlur={handleBlur("caseNo")}
                      placeholder={"মামলা নাম্বার"}
                      keyboardType="numeric" 
                    />
                    {touched.caseNo && errors.caseNo ? (
                      <ErrorText>{errors.caseNo}</ErrorText>
                    ) : null}
                  </View> 
                  <View style={styles.FormGroup}>
                    {/* <InputLevel> সাল :</InputLevel> */}
                  
                    <TextInput
                   style={styles.inputs3} 
                   placeholderTextColor="#989898"
                      value={values.Year}
                      onChangeText={handleChange("Year")}
                      onBlur={handleBlur("Year")}
                      placeholder={"সাল"}
                      keyboardType="numeric" 
                    />
                    {touched.Year && errors.Year ? (
                      <ErrorText>{errors.Year}</ErrorText>
                    ) : null}
                  </View> 
                
                
                <TouchableOpacity
                  onPress={() => {
                    handleSubmit;
                    Keyboard.dismiss();
                  }}
                >
                  <View style={styles.Topview}>
                    <AppBtn
                      title="অনুসন্ধান"
                      onPress={handleSubmit}
                      width = {100}
                    />
                  </View>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </KeyboardAvoidingView>
     

      {/* <Button
          title="হিস্ট্রি"
          onPress={() => {
            navigation.navigate('CaseHistoryScreen',{name:'Case History'});
          }}
        /> */}

       { 
          caseInfo.length > 0 && !isLoading ? (
            <Text style={styles.Topheader}>
               {caseInfo[0].office_name_bng?caseInfo[0].office_name_bng: lower_court_name}, {caseInfo[0].district_name_bng}
            </Text> 
            ) 
          : 
          null
       }


      {  Platform.OS === 'web' && windowWidth >= 600
            ? 
            <View style={styles.webView}>

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
                <tbody>
                    {
                      caseInfo.map((item) => (
                            <tr key={item.serial_no}>
                                <td style={styles.bodyTextsl}> {engToBdNum('1')}</td>
                                <td style={styles.bodyText}>{item.type_name + ' - ' + engToBdNum(item.case_number.toString()) + '/' + engToBdNum(item.case_year.toString())+' '+item.upazila_name_bng}</td>
                                <td style={styles.bodyText}>{item.activities}</td>
                                <td style={styles.bodyText}>{item.next_date=="01-01-1970"?"":(item.next_date?engToBdNum(item.next_date.toString()):null)}</td>
                                <td style={styles.bodyText}>{item.result}</td>
                                <td style={styles.bodyText}>
                                    <View style={styles.buttonStyleContainer}>
                                        <Pressable style={styles.buttons} onPress={() => {
                                           // 1. Navigate to the Details route with params 
                                            navigation.navigate('CaseHistoryScreen', {
                                              division_id: division_id,
                                              geo_district_id: district_id,
                                              caseType: item.case_type_id,
                                              case_number: item.case_number,
                                              case_year: item.case_year,
                                              items: item,
                                              lowerCourtName:  item.office_name_bng ? item.office_name_bng : lower_court_name,
                                              districtNameBng: item.district_name_bng
                                            });
                                          }}>
                                          <Text style={styles.texts}>হিস্ট্রি</Text>
                                        </Pressable>
                                        <Pressable style={styles.buttons} 
                                        
                                        onPress={() => {
                                          confirmAlert({
                                            title: 'মামলা যোগ করার জন্য নিশ্চিত করুন',
                                            message: 'আপনি এই কাজ করতে নিশ্চিত "এটা কি আপনার মামলা ??".',
                                            buttons: [
                                              {
                                                label: 'হ্যাঁ',
                                                onClick: () =>    handleCaseCreate(item)
                                              },
                                              {
                                                label: 'না',
                                                //onClick: () => alert('Click No')
                                              }
                                            ]
                                          });
                                         
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
            </View>
        : ( caseInfo.length > 0 && isSearch       
          ?<View style={{...styles.mobileView, width: windowWidth - 16}}>
            <ScrollView horizontal={true}>
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
                          {engToBdNum('1')}
                          </Text>
                        </View>

                        <View style={styles.MCart}>
                          <Text style={styles.textTile}>মামলার নম্বর</Text>
                          <Text style={styles.textTilecln}>:</Text>
                          <Text style={styles.textDescription}>
                          {item.type_name + ' - ' + engToBdNum(item.case_number.toString()) + '/' + engToBdNum(item.case_year.toString())+' '+item.upazila_name_bng}
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
                            {item.next_date=="01-01-1970"?"":(item.next_date?engToBdNum(item.next_date.toString()):null)} 
                          </Text>
                        </View>

                        <View style={styles.MCart}>
                          <Text style={styles.textTile}>সংক্ষিপ্ত আদেশ</Text>
                          <Text style={styles.textTilecln}>:</Text>
                          <Text style={styles.textDescription}>
                            {item.result}
                          </Text>
                        </View>

                        <View style={styles.MCart}>
                          <Text style={styles.textTile}>হিস্ট্রি</Text>
                          <Text style={styles.textTilecln}>:</Text>
                          <Text style={styles.textDescription}>
                          <View style={styles.buttonStyleContainer}>
                              <Pressable style={styles.buttons} onPress={() => {
                                  /* 1. Navigate to the Details route with params */
                                  navigation.navigate('CaseHistoryScreen', {
                                    division_id: division_id,
                                    geo_district_id: district_id,
                                    caseType: item.case_type_id,
                                    case_number: item.case_number,
                                    case_year: item.case_year,
                                  });
                                }}>
                                <Text style={styles.texts}>হিস্ট্রি</Text>
                              </Pressable>
                              <Pressable style={styles.buttons} 
                              
                                  // onPress={() => {
                                  //     navigation.navigate('CaseHistoryScreen', {
                                  //       caseType: case_type_id,
                                  //       case_number: item.case_number,
                                  //       case_year: item.case_year,
                                  //     });
                                  //   }}
                                    
                                    >
                                  <Text style={styles.texts}>মামলা যোগকরি</Text>
                                </Pressable>
                            </View>
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
              /></ScrollView>
        </View>:null) }

      { 
          caseInfo.length == 0 && isSearch ? (
            <Text style={styles.Topheader}>
             কোন মামলা পাওয়া যায়নি
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
                <ScrollView horizontal={true}>
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
                              {engToBdNum('1')}
                              </Text>
                            </View>

                            <View style={styles.MCart}>
                              <Text style={styles.textTile}>মামলার নম্বর</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>
                              {item.type_name + ' - ' + engToBdNum(item.case_number.toString()) + '/' + engToBdNum(item.case_year.toString())+' '+item.upazila_name_bng}
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
                                {item.next_date=="01-01-1970"?"":(item.next_date?engToBdNum(item.next_date.toString()):null)} 
                              </Text>
                            </View>

                            <View style={styles.MCart}>
                              <Text style={styles.textTile}>সংক্ষিপ্ত আদেশ</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>
                                {item.result}
                              </Text>
                            </View>

                            <View style={styles.MCart}>
                              <Text style={styles.textTile}>হিস্ট্রি</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>
                              <View style={styles.buttonStyleContainer}>
                                  <Pressable style={styles.buttons} onPress={() => {
                                      /* 1. Navigate to the Details route with params */
                                      navigation.navigate('CaseHistoryScreen', {
                                        division_id: division_id,
                                        geo_district_id: district_id,
                                        caseType: item.case_type_id,
                                        case_number: item.case_number,
                                        case_year: item.case_year,
                                      });
                                    }}>
                                    <Text style={styles.texts}>হিস্ট্রি</Text>
                                  </Pressable>
                                  <Pressable style={styles.buttons} 
                                  
                                      // onPress={() => {
                                      //     navigation.navigate('CaseHistoryScreen', {
                                      //       caseType: case_type_id,
                                      //       case_number: item.case_number,
                                      //       case_year: item.case_year,
                                      //     });
                                      //   }}
                                        
                                        >
                                      <Text style={styles.texts}>মামলা যোগকরি</Text>
                                    </Pressable>
                                </View>
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
                  /></ScrollView>
            </View>
        : null }

    </ScrollView>
    </TouchableWithoutFeedback>
  </View>
</View>
  );
}

const styles = StyleSheet.create({

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
    zIndex:-1,
},

head: { 
  height: 40, 
  backgroundColor: 'khaki', 
  borderTopLeftRadius:5,
  borderTopRightRadius:5,
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
  fontSize: 14,
  lineHeight: 16,
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
},

mobileView: {
  flex: 1,
  marginRight: 'auto',
  marginLeft: 'auto',
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

  bodyTextsl: { 
    fontSize: 12, 
    // fontWeight: 'bold', 
    textAlign: 'center', 
    color: '#000', 
    justifyContent:'center',
    width: 62,
    backgroundColor:'#ccc'
    
  },
  bodyText: { 
    fontSize: 12, 
    // fontWeight: 'bold', 
    textAlign: 'center', 
    color: '#000', 
    justifyContent:'center',
    backgroundColor:'#ccc'
  
  },
  inputs3: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 5,
    borderRadius: 2,
    width: Platform.OS === 'web' && windowWidth >= 600?55:250,
    fontSize: 13,
    backgroundColor: '#fff',
    marginLeft:Platform.OS === 'web' && windowWidth >= 600?-15:0,
    height: windowWidth >= 600?27:40
  },

  inputs4: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 5,
    borderRadius: 2,
    width: Platform.OS === 'web' && windowWidth >= 600?90:250,
    fontSize: Platform.OS === 'web' && windowWidth >= 600?13:16,
    height: windowWidth >= 600?27:40,
    backgroundColor: '#fff',
  },


  inputs1: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 5,
    borderRadius: 2,
    width: Platform.OS === 'web' && windowWidth >= 600?80:250,
    fontSize: 13,
    backgroundColor: '#fff',
  },
  inputs2: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 5,
    borderRadius: 2,
    width: Platform.OS === 'web' && windowWidth >= 600?120:250,
    fontSize: 13,
    backgroundColor: '#fff',
  },

  inputs: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    borderRadius: 2,
    fontSize: 13,
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
    marginTop:  Platform.OS === 'web' && windowWidth >= 600?-7:10,
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
    width: Platform.OS === 'web' && windowWidth >= 600?190:250,
  },

  pickeru: {
    height: 25,
    color: '#333',
    width: Platform.OS === 'web' && windowWidth >= 600?210:250,
  },
  picker2: {
    height: windowWidth >= 600?27:40,
    color: '#333',
    width: Platform.OS === 'web' && windowWidth >= 600?150:250,
    fontFamily:'SolaimanLipi'
  },
  pickerP2: {
    height: windowWidth >= 600?27:40,
    color: '#989898',
    width: Platform.OS === 'web' && windowWidth >= 600?150:250,
    fontFamily:'SolaimanLipi'
  },
  containerSearch: {
    //flex: 1,
    flexDirection:
      Platform.OS === 'web' && windowWidth >= 600 ? 'row' : 'column',
    justifyContent: 'center',
    //paddingTop: .stConstantsatusBarHeight,
    //backgroundColor: '#708090',
    backgroundColor: 'transparent',
    alignItems: 'center',
   // padding: 8,
    paddingVertical: 10,
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
