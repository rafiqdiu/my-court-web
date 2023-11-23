import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import {Formik} from 'formik';
import { DataTable } from 'react-native-paper';
import {globalStyles} from '../../../styles/globalStyles';
// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState, useContext, createRef, useRef} from 'react';
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

import InputLevel from '../../../shared/inputLevel';
import LeftBar from '../../../shared/LeftBar';
import LeftBarItem from '../../../shared/LeftBarItem';
import WavyTopBar from '../../../shared/WavyTopBar';

import DateTimePickerModal from "react-native-modal-datetime-picker"; 
import moment from "moment";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {
  DatePickerModal,
  DatePickerModalContent,
  TimePickerModal,
  DatePickerInput,
  // @ts-ignore TODO: try to fix expo to work with local library
} from 'react-native-paper-dates';
import { DefaultThemeColors, DarkThemeColors,ThemeOne,ThemeTwo } from "../../../utils/constants/Colors";

const Colors2 = ThemeOne;


//import sharedStyles from '../../../sharedStyles';
const windowWidth = Dimensions.get('window').width;
const tableWidth = windowWidth-200;
export default function MySearchListScreen({navigation}) {
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
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [select_date, setselectdate] = useState(null);
  const [end_select_date, setendselectdate] = useState(null);
  const [user_id, setUserId] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearch, setIsSearch] = useState(false);



  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setEndDatePickerVisibility(false);
  };

  const handleConfirm = (val) => {
  // console.warn("A date has been picked: ", date);
//console.log(val);
    setselectdate(  val );
   // setDate(val)
    //console.log(select_date);
    hideDatePicker();
  };
  const handleConfirmEnd = (val) => {
    // console.warn("A date has been picked: ", date);
  //console.log(val);
  setendselectdate(  val );
     // setDate(val)
      //console.log(select_date);
      hideDatePicker();
    };


  
  const [selectTab1, setSlectTab1] = useState(false)
  const [selectTab2, setSlectTab2] = useState(true)
  const [selectTab3, setSlectTab3] = useState(false)
  const [finalSearchDate, setFinalSearchDate] = useState('')

  const [countPlus, setCountPlus] = useState(0);
  const [countMinus, setCountMinus] = useState(0);

  const [visible, setVisible] = React.useState(false)
  const [endvisible, setEndVisible] = React.useState(false)
  const onDismiss = React.useCallback(() => {
    setVisible(false)
    setEndVisible(false)
  }, [setVisible])
  const [date, setDate] = React.useState();
  const [enddate, setEndDate] = React.useState();
  const onChangeSingle = React.useCallback(
    (params) => {
      setVisible(false) 
      setDate(params.date)
    },
    [setVisible, setDate]
  )
  const onChangeDate = React.useCallback(
    (params) => {
     // setVisible(false) 
      setDate(params.date)
    },
    [setVisible, setDate]
  )

  const onEndChangeSingle = React.useCallback(
    (params) => {
      setEndVisible(false) 
      setEndDate(params.date)
    },
    [setEndVisible, setEndDate]
  )
  const onEndChangeDate = React.useCallback(
    (params) => {
     // setEndVisible(false) 
      setEndDate(params.date)
    },
    [setEndVisible, setEndDate]
  )
  const pastDate = new Date(new Date().setDate(new Date().getDate() - 500000));
  const futureDate = new Date(new Date().setDate(new Date().getDate() + 500000));

  const locale = 'en-GB';


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
    //async fetch user data
    getUserId().then(UserId => { 
      setUserId(UserId);
    });
    handleCaseDiary(0);
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


  const _fetchCaseInfoData =  (data) => {
    console.log(data);
  //  return data;
    try {
         let url = `${BASE_URL}/GetCaseDiaryWithPaging`;
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
      
    }
  };

  const incrementCount = (val) => {
    //setCountMinus(0);
    setCountPlus(countPlus + val);
    console.log(countPlus + val);
    handleCaseDiary(countPlus + val);

  };

  const decrementCount = (val) => {
    //setCountMinus(0);
    setCountPlus(countPlus + val);
    console.log(countPlus + val);
    handleCaseDiary(countPlus + val);

  };
  
  const handleDefault = (val) => {
    setCountPlus(0);
    //setCountMinus(0);
    handleCaseDiary(0);

  };

  const handleCaseDiary = (values) => {
 
    setIsLoading(true);
    setCaseInfo([]);

      const caseData = {
      
        date: values,
        from_date: "",
        to_date:  "",
        user_id: user_id,
        
      };

     console.log(caseData);
      //perform api call to update password
      _fetchCaseInfoData(caseData)
        .then((val) => {
          setCaseInfo(val.fulldatas);
          setIsLoading(false);
          setFinalSearchDate(val.FinalSearchDate)
        console.log(val.fulldatas);
         
        })
        .catch((err) => console.log(err));
      
    }; 


    const handleCaseDiaryFromToDate = (values) => {
 
      setIsLoading(true);
      setCaseInfo([]);
  
        const caseData = {
        
          date: 0,
          from_date: Platform.OS === 'web' ?(date !==null ? moment(date).format("DD-MM-YYYY") : ""):(select_date !==null ? moment(select_date).format("DD-MM-YYYY") : moment().format("DD-MM-YYYY")),
          to_date: Platform.OS === 'web' ?(enddate !==null ? moment(enddate).format("DD-MM-YYYY") : ""):(end_select_date !==null ? moment(end_select_date).format("DD-MM-YYYY") : moment().format("DD-MM-YYYY")),
          user_id: user_id,
          
        };
  
       //console.log(caseData);
        //perform api call to update password
        _fetchCaseInfoData(caseData)
          .then((val) => {
            setCaseInfo(val.fulldatas);
            setIsLoading(false);
            setFinalSearchDate(val.FinalSearchDate)
          console.log(val.fulldatas);
           
          })
          .catch((err) => console.log(err));
        
      }; 



      const CaseTodayMatches = (values) => {
 
        setIsLoading(true);
        setCaseInfo([]);
    
          const caseData = {
          
            date: 0,
            StartDate: Platform.OS === 'web' ?(date !==null ? moment(date).format("DD-MM-YYYY") : ""):(select_date !==null ? moment(select_date).format("DD-MM-YYYY") : moment().format("DD-MM-YYYY")),
            EndDate: Platform.OS === 'web' ?(enddate !==null ? moment(enddate).format("DD-MM-YYYY") : ""):(end_select_date !==null ? moment(end_select_date).format("DD-MM-YYYY") : moment().format("DD-MM-YYYY")),
            user_id: user_id,
            
          };

          console.log(caseData);
    
          const CaseTodayMatchesData =  (data) => {
  
            try {
                 let url = `${BASE_URL}/CaseTodayMatches`;
                let formBody = [];
                for (let key in data) {
                  let encodedKey = encodeURIComponent(key);
                  let encodedValue = encodeURIComponent(data[key]);
                  formBody.push(encodedKey + '=' + encodedValue);
                }
                formBody = formBody.join('&');
              
                //let response =   axios.post(url, formBody)
                let response =   axios.post(url)
              
                .then((res) => res.data);
                return response;
            } catch (error) {
              
            }
          };

          CaseTodayMatchesData(caseData)
            .then((val) => {
              setIsLoading(false);
              alert(val.msg);
            })
            .catch((err) => console.log(err));
          
        }; 

        function ReplaceTextFunction(stIn) 
        {
      
           var SampleText = stIn;
           var stIn = SampleText.replace("2023", "২০২৩");
             stIn = stIn.replace("2024", "২০২৪");
             stIn = stIn.replace("2025", "২০২৫");
             stIn = stIn.replace("2026", "২০২৬");
             stIn = stIn.replace("2027", "২০২৭");
             stIn = stIn.replace("2028", "২০২৮");
             stIn = stIn.replace("2029", "২০২৯");
             stIn = stIn.replace("2030", "২০৩০");
             stIn = stIn.replace("00", "০০");
             stIn = stIn.replace("01", "০১");
             stIn = stIn.replace("01", "০১");
             stIn = stIn.replace("02", "০২");
             stIn = stIn.replace("02", "০২");
             stIn = stIn.replace("03", "০৩");
             stIn = stIn.replace("03", "০৩");
             stIn = stIn.replace("04", "০৪");
             stIn = stIn.replace("04", "০৪");
             stIn = stIn.replace("05", "০৫");
             stIn = stIn.replace("05", "০৫");
             stIn = stIn.replace("06", "০৬");
             stIn = stIn.replace("06", "০৬");
             stIn = stIn.replace("07", "০৭");
             stIn = stIn.replace("07", "০৭");
             stIn = stIn.replace("08", "০৮");
             stIn = stIn.replace("08", "০৮");
             stIn = stIn.replace("09", "০৯");
             stIn = stIn.replace("09", "০৯");
             stIn = stIn.replace("10", "১০");
             stIn = stIn.replace("10", "১০");
             stIn = stIn.replace("11", "১১");
             stIn = stIn.replace("11", "১১");
             stIn = stIn.replace("12", "১২");
             stIn = stIn.replace("12", "১২");
             stIn = stIn.replace("13", "১৩");
             stIn = stIn.replace("14", "১৪");
             stIn = stIn.replace("15", "১৫");
             stIn = stIn.replace("16", "১৬");
             stIn = stIn.replace("17", "১৭");
             stIn = stIn.replace("18", "১৮");
             stIn = stIn.replace("19", "১৯");
             stIn = stIn.replace("20", "২০");
             stIn = stIn.replace("21", "২১");
             stIn = stIn.replace("22", "২২");
             stIn = stIn.replace("23", "২৩");
             stIn = stIn.replace("24", "২৪");
             stIn = stIn.replace("25", "২৫");
             stIn = stIn.replace("26", "২৬");
             stIn = stIn.replace("27", "২৭");
             stIn = stIn.replace("28", "২৮");
             stIn = stIn.replace("29", "২৯");
             stIn = stIn.replace("30", "৩০");
             stIn = stIn.replace("31", "৩১");
             stIn = stIn.replace("32", "৩২");
             stIn = stIn.replace("33", "৩৩");
             stIn = stIn.replace("34", "৩৪");
             stIn = stIn.replace("35", "৩৫");
             stIn = stIn.replace("36", "৩৬");
             stIn = stIn.replace("37", "৩৭");
             stIn = stIn.replace("38", "৩৮");
             stIn = stIn.replace("39", "৩৯");
             stIn = stIn.replace("40", "৪০");
             stIn = stIn.replace("41", "৪১");
             stIn = stIn.replace("42", "৪২");
             stIn = stIn.replace("43", "৪৩");
             stIn = stIn.replace("44", "৪৪");
             stIn = stIn.replace("45", "৪৫");
             stIn = stIn.replace("46", "৪৬");
             stIn = stIn.replace("47", "৪৭");
             stIn = stIn.replace("48", "৪৮");
             stIn = stIn.replace("49", "৪৯");
             stIn = stIn.replace("50", "৫০");
             stIn = stIn.replace("51", "৫১");
             stIn = stIn.replace("52", "৫২");
             stIn = stIn.replace("53", "৫৩");
             stIn = stIn.replace("54", "৫৪");
             stIn = stIn.replace("55", "৫৫");
             stIn = stIn.replace("56", "৫৬");
             stIn = stIn.replace("57", "৫৭");
             stIn = stIn.replace("58", "৫৮");
             stIn = stIn.replace("59", "৫৯");
             stIn = stIn.replace("PM", "পি এম");
             stIn = stIn.replace("AM", "এ এম");
             stIn = stIn.replace("0", "০");
            // console.log(stIn);
           return stIn;
         
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
       <LeftBarItem selectcolor='true'   name = 'আমার ডায়েরী'  stack = 'আমার ডায়েরী'   screen = 'MySearchListScreen' />
      
   </LeftBar>
    
     <View style={ Platform.OS === 'web' && windowWidth >= 600?globalStyles.bodyContainer:globalStyles.bodyContainerMobile}>
    <ScrollView style={{flexGrow: 1}} nestedScrollEnabled={true}>
   
  <View style={styles.Tabhead} > 
  <WavyTopBar customStyles={[styles.backgroundImage,{zIndex:-1}] }/>
  
       <TouchableOpacity  onPress={() =>{ decrementCount(-1); setSlectTab1(true); setSlectTab2(false); setSlectTab3(false) }}><Text style={selectTab1?styles.TabTopheaderselect:styles.TabTopheader}>{"<<<"}আগের দিনগুলোর ডায়েরী</Text></TouchableOpacity> 
      <TouchableOpacity  onPress={() =>{ handleDefault(0); setSlectTab1(false); setSlectTab2(true); setSlectTab3(false) }}><Text style={selectTab2? styles.TabTopheaderselect:styles.TabTopheader}>আজকের ডায়েরী</Text></TouchableOpacity> 
      <TouchableOpacity onPress={() =>{ incrementCount(1); setSlectTab1(false); setSlectTab2(false); setSlectTab3(true) }}><Text style={selectTab3? styles.TabTopheaderselect:styles.TabTopheader}>পরবর্তী দিনগুলোর ডায়েরী{">>>"}</Text></TouchableOpacity> 
      {/* <TouchableOpacity onPress={() =>{handleCaseDiary(false);setSlectTab2(false);setSlectTab3(true) }}><Text style={selectTab3? styles.TabTopheaderselect:styles.TabTopheader}>পরবর্তী দিনগুলোর ডায়েরী {" >>"}</Text></TouchableOpacity>  */}
     
      <KeyboardAvoidingView
          style={styles.containerSearch}
          behavior="padding"
          enabled
        >
          <Formik
            enableReinitialize
             initialValues={{
                 //search_date: '',
                //  caseNo:'',
                //  Year:'',
            //   district_id: '',
            //   court_type_id: '',
            //   court_id: '',
            }}
            onSubmit={(values, actions) => {
              handleCaseDiaryFromToDate(values, actions);
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
                    
                   <>
                   <View style={{ flexDirection:'row', marginTop:Platform.OS === 'web' && windowWidth >= 600 ?15:2}}>
                   <TouchableOpacity  onPress={() => Platform.OS === 'web' ?setVisible(true):null}  style={styles.sectionStyle} >
                   <TextInput
                   style={styles.inputs1} 
                   value={ Platform.OS === 'web' ?(date !==null ? engToBdNum(moment(date).format("DD-MM-YYYY").toString() ): ""):(select_date !==null ? engToBdNum(moment(select_date).format("DD-MM-YYYY").toString()) : "")}
                   onChangeText={handleChange("search_date")}
                   onBlur={handleBlur("search_date")}
                   placeholder={"MM-DD-YYYY"}
                  // isEditing={isEditing}
                   onTouchStart={showDatePicker}
                 /><Image
                    source={{ uri:'https://bdjudgecourt.com/assets/calendar.png', }}
                    style={styles.imageStyle}
                  /></TouchableOpacity>
                  
                   <Text style={{color: Platform.OS === 'web' && windowWidth >= 600 ?Colors2.top9:Colors2.top3,
                   marginTop:15 ,marginRight:-5, marginLeft:-5,  fontWeight: 'bold',fontFamily:'SolaimanLipi',
    fontSize: 14,}}> হইতে</Text>
               </View>
                { Platform.OS === 'web' ? (
                  <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
        
                    {/* <TouchableOpacity onPress={() => setVisible(true)}>  <FontAwesome name="calendar"></FontAwesome></TouchableOpacity> */}

                      <DatePickerModal
                      
                        locale={locale}
                        mode="single"
                        visible={visible}
                        onDismiss={onDismiss}
                        date={date}
                        onConfirm={onChangeSingle}
                        onDateChanged={onChangeDate}
                        validRange={{
                          startDate: pastDate,
                          disabledDates: [futureDate],
                          // startDate: new Date(2021, 1, 2), // optional
                          // endDate: new Date(), // optional
                        }}
                        onChange={onChangeSingle}
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
                      // minimumDate={new Date()}
                      // minimumDate={("YYYY, MM, DD")}
                      // maximumDate={moment('08-06-2022').add(30, 'days').format("DD-MM-YYYY")}
                     /> )}
                   </>
                    {touched.search_date && errors.search_date ? (
                      <ErrorText>{errors.search_date}</ErrorText>
                    ) : null}
                  </View> 
                
                  <View style={styles.FormGroup}>
                  
                   <>
                   <View style={{ flexDirection:'row', marginTop:Platform.OS === 'web' && windowWidth >= 600 ?15:0, }}>
                   <TouchableOpacity  onPress={() => Platform.OS === 'web' ?setEndVisible(true):null}  style={styles.sectionStyle} >
                   <TextInput
                   style={styles.inputs1} 
                   value={ Platform.OS === 'web' ?(enddate !==null ?engToBdNum( moment(enddate).format("DD-MM-YYYY").toString() ): ""):(end_select_date !==null ? engToBdNum(moment(end_select_date).format("DD-MM-YYYY").toString()) : "")}
                   onChangeText={handleChange("end_date")}
                   onBlur={handleBlur("end_date")}
                   placeholder={"MM-DD-YYYY"}
                  // isEditing={isEditing}
                   onTouchStart={showEndDatePicker}
                 /><Image
                 source={{ uri:'https://bdjudgecourt.com/assets/calendar.png', }}
                 style={styles.imageStyle}
               /></TouchableOpacity>
                   {/* { Platform.OS === 'web' ? (  <FontAwesome.Button     name='calendar'  backgroundColor= '#ccd'  color='#000'  style={{ width:30, height:25, marginLeft:-5, }}  onPress={() =>setEndVisible(true)}></FontAwesome.Button> ):null } */}
                   <Text style={{color:Platform.OS === 'web' && windowWidth >= 600 ?Colors2.top9:Colors2.top3,
                   marginTop:15, marginLeft:-10,fontFamily:'SolaimanLipi', marginRight:Platform.OS === 'web' && windowWidth >= 600 ?10:0,  fontWeight: 'bold',
    fontSize: 14,}}> পর্যন্ত</Text>
                   </View>
                
                { Platform.OS === 'web' ? (
      
            <>
                  <View style={{justifyContent: 'center',  alignItems: 'center'}}>       
                   

                      <DatePickerModal
                      
                        locale={locale}
                        mode="single"
                        visible={endvisible}
                        onDismiss={onDismiss}
                        date={enddate}
                        onConfirm={onEndChangeSingle}
                        onDateChanged={onEndChangeDate}
                        validRange={{
                          startDate: pastDate,
                          disabledDates: [futureDate],
                          // startDate: new Date(2021, 1, 2), // optional
                          // endDate: new Date(), // optional
                        }}
                        onChange={onEndChangeSingle}
                        // saveLabel="Save" // optional
                        // uppercase={false} // optional, default is true
                        // label="Select date" // optional
                        // animationType="slide" // optional, default is 'slide' on ios/android and 'none' on web
                        // startYear={2000} // optional, default is 1800
                        // endYear={2100} // optional, default is 2200
                         //allowEditing={true} // optional, default is true
                        //inputEnabled={true} // optional, default is true
                        style={{ width:300}}

                      />
                      
                </View>
               
                </>
                
              ):(
                  <DateTimePickerModal
                       isVisible={isEndDatePickerVisible}
                       mode="date"
                      // date={ values?.application_deadline? moment(values?.application_deadline).format("DD-MM-YYYY") : ""}
                       onConfirm={handleConfirmEnd}
                       onCancel={hideDatePicker}
                     //  minimumDate={new Date()}
                      // minimumDate={("YYYY, MM, DD")}
                      // maximumDate={moment('08-06-2022').add(30, 'days').format("DD-MM-YYYY")}
                     /> )}
                   </>
                    {touched.end_date && errors.end_date ? (
                      <ErrorText>{errors.end_date}</ErrorText>
                    ) : null}
                  </View> 
                {Platform.OS === 'web' && windowWidth >= 600 ?  <View style={ { height:70, borderRightWidth:4, borderRightColor:'#fff'}}></View> : null} 
                {/* <TouchableOpacity
                  onPress={() => {
                    handleSubmit;
                    // eslint-disable-next-line no-undef
                    Keyboard.dismiss();
                  }}
                > */}
                <View style={{flexDirection:'row', marginLeft:Platform.OS === 'web' && windowWidth >= 600 ?0:40}}>
                  <View style={styles.Topview}>
                    <AppBtn
                      title="অনুসন্ধান"
                      onPress={handleSubmit}
                      width = {100}
                      fontwidth = 'bold'
                      //disabled={isSubmitting ? true : false}
                    />
                  </View>
                  <View style={styles.Topview}>
                    <AppBtn
                      title="হালনাগাদ"
                      onPress={CaseTodayMatches}
                      width = {100}
                      
                      BGcolor='#102020'
                      //disabled={isSubmitting ? true : false}
                    />
                  </View>
                  </View>
                {/* </TouchableOpacity> */}
              </>
            )}
          </Formik>
        </KeyboardAvoidingView>
       
     
       
  </View>  
  
      {  Platform.OS === 'web' && windowWidth >= 600
            ? <View style={styles.webView}>  

              <TouchableOpacity><Text style={styles.Topheader}>অনুসন্ধানের তারিখ: <Text  style={styles.SearchDate}>{engToBdNum(finalSearchDate.toString())}</Text></Text></TouchableOpacity>
        
            <table>
              <thead style={styles.head}>
              <tr>
                  <th style={styles.headTextsl}>ক্রমিক নং </th>
                  <th style={styles.headText}>আদালতের নাম/ নং</th>
                  <th style={styles.headText}>মামলার নম্বর</th>
                  <th style={styles.headText}>কার্যক্রম</th>
                  
                  <th style={styles.headText}>পরবর্তী তারিখ</th>
                  <th style={styles.headText}>সংক্ষিপ্ত আদেশ</th>        
                  <th style={styles.headText}>পদক্ষেপ</th>
              </tr>
              </thead>           
              
             
              <tbody>
                  {
                    caseInfo?.map((item , index) => (
                          <tr key={index}>
                              <td style={ index % 2 == 0? styles.bodyTextsl:styles.bodyTextsl1}>{engToBdNum((index+1).toString())}</td>
                              <td style={ index % 2 == 0?styles.bodyText:styles.bodyText1}>{item.office_name_bng}</td>
                              <td style={index % 2 == 0?styles.bodyText:styles.bodyText1}>{item.type_name + ' - ' + engToBdNum(item.case_number.toString()) + '/' + engToBdNum(item.case_year.toString())}</td>
                              <td style={index % 2 == 0?styles.bodyText:styles.bodyText1}>{item.activities}</td>
                              
                              <td style={index % 2 == 0?styles.bodyText:styles.bodyText1}>{item.next_date=="01-01-1970"?"":engToBdNum(item.next_date.toString())}</td>
                              <td style={index % 2 == 0?styles.bodyText:styles.bodyText1}>{item.result}</td>
                            
                              <td style={index % 2 == 0?styles.bodyText:styles.bodyText1}>
                                  <View style={styles.buttonStyleContainer}>
                                      <Pressable style={styles.buttons} 
                                      
                                      // onPress={() => {
                                      //       navigation.navigate('CaseHistoryScreen', {
                                      //         caseType: case_type_id,
                                      //         case_number: item.case_number,
                                      //         case_year: item.case_year,
                                      //       });
                                      //     }}
                                          
                                          >
                                        <Text style={styles.texts}>দেখুন | আপডেট </Text>
                                      </Pressable>
                                  </View>
                                </td>
                          </tr>
                         
                      ))
                  }

                  { caseInfo.length == 0 && !isLoading ? <tr>
                          <td colSpan={10} style={styles.bodyText}>কোন মামলা পাওয়া যায়নি।{isSearch}</td>
                        </tr> : null 
                  }
              </tbody>
       
             
            </table> 
            { isLoading ? <ActivityIndicator size="large"/> : null }
            </View>
            :(
            <View>{Platform.OS === 'web'  ?<><TouchableOpacity><Text style={styles.Topheader}>অনুসন্ধানের তারিখ: <Text  style={styles.SearchDate}>{engToBdNum(finalSearchDate.toString())}</Text></Text></TouchableOpacity>
            <View>{ caseInfo.length == 0 && !isLoading ?<View>
              <Text  style={styles.bodyText}>কোন মামলা পাওয়া যায়নি।{isSearch}</Text>
            </View>: null 
      }</View></>:
            <View><Text style={styles.Topheader}>অনুসন্ধানের তারিখ: <Text  style={styles.SearchDate}>{engToBdNum(finalSearchDate.toString())}</Text></Text>
             { caseInfo.length == 0 && !isLoading ? <View>
                          <Text  style={styles.bodyText}>কোন মামলা পাওয়া যায়নি।{isSearch}</Text>
                        </View> : null 
                  }</View>
                 }
                   { isLoading ? <ActivityIndicator size="large"/> : null }
           {caseInfo.length > 0 ?
             
            <View style={{...styles.mobileView, width: windowWidth - 16}}>
              
              <ScrollView horizontal={true}>
                <FlatList
                    data={caseInfo}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    numColumns={1}
                    renderItem={({item, index}) => (
                      <View key={item.key}>
                        <TouchableOpacity>
                          <View style={styles.hddata}>
                            <View style={styles.MCart}>
                              <Text style={styles.textTile}>ক্রমিক নং</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>
                               {engToBdNum((index +1).toString())}
                              </Text>
                            </View>

                            <View style={styles.MCart}>
                              <Text style={styles.textTile}>আদালতের নাম/ নং</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>
                              {item.office_name_bng}
                              </Text>
                            </View>

                            <View style={styles.MCart}>
                              <Text style={styles.textTile}>মামলার নম্বর</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>
                              {item.type_name + ' - ' + engToBdNum(item.case_number.toString()) + '/' + engToBdNum(item.case_year.toString())}
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
                              <Text style={styles.textTile}>সংক্ষিপ্ত আদেশ</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>
                                {item.result}
                              </Text>
                            </View>
                            
                            <View style={styles.MCart}>
                              <Text style={styles.textTile}>পরবর্তী তারিখ</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>
                              {item.next_date=="01-01-1970"?"":engToBdNum(item.next_date.toString())}
                              </Text>
                            </View>

                            <View style={styles.MCart}>
                              <Text style={styles.textTile}>পরবর্তী তারিখের কার্যক্রম</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>
                                
                              </Text>
                            </View>

                            <View style={styles.MCart}>
                              <Text style={styles.textTile}>পদক্ষেপ</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <View style={styles.buttonStyleContainer}>
                                      <Pressable style={styles.buttons} 
                                      
                                      // onPress={() => {
                                      //       navigation.navigate('CaseHistoryScreen', {
                                      //         caseType: case_type_id,
                                      //         case_number: item.case_number,
                                      //         case_year: item.case_year,
                                      //       });
                                      //     }}
                                          
                                          >
                                        <Text style={styles.texts}>দেখুন | আপডেট </Text>
                                      </Pressable>
                                  </View>
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
            </View>:null }
            </View>
      ) }
            

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
    // paddingTop: 10,
    paddingBottom:10, 
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom:10,
},

head: { 
  height: 38, 
  backgroundColor: 'khaki', 
  borderTopLeftRadius:5,
  borderTopRightRadius:5,
},
Tabhead: { 
  justifyContent: 'center',
  alignItems:'center',
  alignContent: 'center',

  flexDirection:  Platform.OS === 'web' && windowWidth >= 600 ? 'row' : 'column',
  height:  Platform.OS === 'web' && windowWidth >= 600 ? 60 : 'auto', 
  backgroundColor: 'skyblue', 
  borderTopLeftRadius:5,
  borderTopRightRadius:5,
  backgroundColor:'tranparent'
},

headTextsl: { 
  fontSize: 12, 
  // fontWeight: 'bold', 
  textAlign: 'center', 
  color: '#000', 
  justifyContent:'center',
  width: 62,
  //backgroundColor:'#aaa'
  
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
headText: { 
  fontSize: 12, 
  // fontWeight: 'bold', 
  textAlign: 'center', 
  color: '#000', 
  justifyContent:'center',

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
bodyText1: { 
  fontSize: 12, 
  // fontWeight: 'bold', 
  textAlign: 'center', 
  color: '#000', 
  justifyContent:'center',
  backgroundColor:'#fffffc'

},



rowSection: { 
  height: 40, 
  backgroundColor: '#f7f7f7',
},

rowText: { 
  margin: 6, 
  fontSize: 10, 
  //fontWeight: 'bold', 
  textAlign: 'center',
  justifyContent:'center', 
  borderRightColor:"#ccc",
  borderRightWidth:1,
},

mobileView: {
  flex: 1,
  marginRight: 'auto',
  marginLeft: 'auto',
},
inputs1: {
  borderColor: '#ccc',
  borderWidth: 1,
  padding: Platform.OS === 'web' && windowWidth >= 600 ?12:0,
  paddingLeft:Platform.OS === 'web' && windowWidth >= 600 ?0:12,
  borderRadius: 2,
  width: Platform.OS === 'web' && windowWidth >= 600 ?100:150,
  fontSize: 14,
  height: Platform.OS === 'web' && windowWidth >= 600 ?25:25,
  backgroundColor: '#fff',
  fontFamily:'SolaimanLipi'
 // color:'#000'
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

  inputs: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 2,
    fontSize: 13,
    backgroundColor: '#fff',
  },
  FormGroup: {
    paddingHorizontal: 5,
    marginBottom: Platform.OS === 'web' && windowWidth >= 600 ?10:0,
  },
  MCart: {flexDirection: 'row', padding: 0},
  borderStyles: {
    borderWidth: 1,
    borderColor: '#C1C0B9',
    // width: '100%',
  },
  Topview: {
    marginTop: Platform.OS === 'web' && windowWidth >= 600 ?2:10,
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
    height: 45,
    color: '#333',
    width: 200,
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
    padding: Platform.OS === 'web' && windowWidth >= 600 ?8:2,
    paddingVertical: Platform.OS === 'web' && windowWidth >= 600 ?30:0,
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
    fontSize: 14,
    width: responsiveWidth(60),
    fontFamily:'SolaimanLipi'
  },
  textTile: {
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: responsiveWidth(28),
    fontFamily:'SolaimanLipi'
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
    fontSize: 18,
    color: '#000',
    fontFamily:'SolaimanLipi'
  },
  SearchDate: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
    fontFamily:'SolaimanLipi'
  },
  TabTopheaderselect: {
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: Platform.OS === 'web' && windowWidth >= 600 ?13:14,
    color: '#000',
   // borderTopEndRadius:6,
   // borderTopLeftRadius:6,
   // borderTopRightRadius:6,
   borderRightWidth:Platform.OS === 'web' && windowWidth >= 600 ?4:0,
   borderRightColor:'white',
    padding: 10,
    backgroundColor:'khaki',
    fontFamily:'SolaimanLipi'
  },
  TabTopheader: {
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize:Platform.OS === 'web' && windowWidth >= 600 ?13:14,
    color: Platform.OS === 'web' && windowWidth >= 600 ?Colors2.top11:Colors2.top2,    
    //borderTopLeftRadius:6,
   // borderTopRightRadius:6,
    padding: 10,
    borderRightWidth:Platform.OS === 'web' && windowWidth >= 600 ?4:0,
    borderRightColor:'white',
    fontFamily:'SolaimanLipi'
   // backgroundColor:'white'
  },
  TopheaderDate: {
    textAlign: 'center',
    //fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
    fontFamily:'SolaimanLipi'
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
