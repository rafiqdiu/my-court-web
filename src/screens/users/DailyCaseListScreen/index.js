import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import {Formik} from 'formik';
import { DataTable } from 'react-native-paper';
import {globalStyles} from '../../../styles/globalStyles';
import { confirmAlert } from 'react-confirm-alert'; 
import { FancyAlert } from 'react-native-expo-fancy-alerts';
import React, {useEffect,useCallback , useState, useContext, createRef, useRef} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
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
  Pressable ,
  Alert, 
    
} from 'react-native';
if (Platform.OS === 'web') {
 require('react-confirm-alert/src/react-confirm-alert.css');
}
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
import DropDownFormik from "../../../shared/DropDownFormik";

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
import { DefaultThemeColors, DarkThemeColors,ThemeOne,ThemeTwo } from "../../../utils/constants/Colors";
import { showAlert, closeAlert } from "react-native-customisable-alert";
const registerSchema = yup.object({
  division_name: yup.string().required('Division is required'),
  district_name: yup.string().required('District is required'),
  lower_court_name: yup.string().required('Lower Court is required'),

 
});

const Colors2 = ThemeOne;
const windowWidth = Dimensions.get('window').width;
const tableWidth = windowWidth-220;
export default function DashboardScreen() {
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
  const [isSearchDateBig, setIsSearchDateBig] = useState(0);
  const [court_id, setCourtId] = useState(null);
  const [lower_court_id, setLowerCourtId] = useState(null);
  const [caseInfoId, setCaseInfoId] = useState(null);
  //const [lower_court_name, setLowerCourtName] = useState("");
  const [district_name, setDistrictName] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [select_date, setselectdate] = useState(null);
  const [user_id, setUserId] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [lower_courts, setLowerCourts] = useState([]);
 // const inputRef = React.useRef(null); 
  const [division, setdivision] = useState([]);
  const [division_id, setdivisionId] = useState(null);
  const [district_id, setDistrictId] = useState(null);
  const [district, setDistrict] = useState([]);
  const [halnagatTime, setHalnagatTime] = useState([]);
  const [dayName, setDayName] = useState([]);

 
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
    console.log(values)
    try {let dataToSend = {
      //user_id: 22,
      user_id: user_id,
      //court_id: court_id,
      //our_lower_court_id: lower_court_id,

      division_id: division_id,
      geo_district_id: district_id,
      lower_court_id:values.lower_court_name,
      //search_date: "2023-03-29",
      search_date: Platform.OS === 'web' ? date !==null ? moment(date).format("YYYY-MM-DD") : "" : select_date !==null ? moment(select_date).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
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
      //console.log(response); 
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



    /*
   ReturnCleanASCII =  (stIn) => {
    try {
      const stIn = stIn;
      stIn = stIn.Replace("0", "০");
      stIn = stIn.Replace("1", "১");
      stIn = stIn.Replace("2", "২");
      stIn = stIn.Replace("3", "৩");
      stIn = stIn.Replace("4", "৪");
      stIn = stIn.Replace("5", "৫");
      stIn = stIn.Replace("6", "৬");
      stIn = stIn.Replace("7", "৭");
      stIn = stIn.Replace("8", "৮");
      stIn = stIn.Replace("9", "৯");
      return stIn;
      
    } catch (err) {
      console.log('Error', err);
    }
  }*/


  //ReplaceTextFunction=(stIn)=>{
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

    function ReplaceTextDayFunction(stIn) 
   {
 
      var SampleText = stIn;
      var stIn = SampleText.replace("Saturday", "শনিবার");
        stIn = stIn.replace("Sunday", "রবিবার");
        stIn = stIn.replace("Monday", "সোমবার");
        stIn = stIn.replace("Tuesday", "মঙ্গলবার");
        stIn = stIn.replace("Wednesday", "বুধবার");
        stIn = stIn.replace("Thursday", "বৃহস্পতিবার");
        stIn = stIn.replace("Friday", "শুক্রবার");
        //console.log(stIn);
      return stIn;
    
    }

    function ReplaceTextFunctionNumber(stIn) 
   {
 
      var SampleText = stIn;
      var stIn = SampleText.replace("00", "০০");
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
        stIn = stIn.replace("60", "৬০");
        stIn = stIn.replace("61", "৬১");
        stIn = stIn.replace("62", "৬২");
        stIn = stIn.replace("63", "৬৩");
        stIn = stIn.replace("64", "৬৪");
        stIn = stIn.replace("65", "৬৫");
        stIn = stIn.replace("66", "৬৬");
        stIn = stIn.replace("67", "৬৭");
        stIn = stIn.replace("68", "৬৮");
        stIn = stIn.replace("69", "৬৯");
        stIn = stIn.replace("70", "৭০");
        stIn = stIn.replace("71", "৭১");
        stIn = stIn.replace("72", "৭২");
        stIn = stIn.replace("73", "৭৩");
        stIn = stIn.replace("74", "৭৪");
        stIn = stIn.replace("75", "৭৫");
        stIn = stIn.replace("76", "৭৬");
        stIn = stIn.replace("77", "৭৭");
        stIn = stIn.replace("78", "৭৮");
        stIn = stIn.replace("79", "৭৯");
        stIn = stIn.replace("80", "৮০");
        stIn = stIn.replace("81", "৮১");
        stIn = stIn.replace("82", "৮২");
        stIn = stIn.replace("83", "৮৩");
        stIn = stIn.replace("84", "৮৪");
        stIn = stIn.replace("85", "৮৫");
        stIn = stIn.replace("86", "৮৬");
        stIn = stIn.replace("87", "৮৭");
        stIn = stIn.replace("88", "৮৮");
        stIn = stIn.replace("89", "৮৯");
        stIn = stIn.replace("90", "৯০");
        stIn = stIn.replace("91", "৯১");
        stIn = stIn.replace("92", "৯২");
        stIn = stIn.replace("93", "৯৩");
        stIn = stIn.replace("94", "৯৪");
        stIn = stIn.replace("95", "৯৫");
        stIn = stIn.replace("96", "৯৬");
        stIn = stIn.replace("97", "৯৭");
        stIn = stIn.replace("98", "৯৮");
        stIn = stIn.replace("99", "৯৯");
        stIn = stIn.replace("100", "১০০");
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
    const closeDropdown = useCallback(() => {
      setLowerCourtOpen(false);
     // setCaseTypeOpen(false)
  
  
    }, []);
    const isPlaceholder = (value) => {
      return value == null;
    }

  useEffect(() => {
    //async fetch user data
      getUserId().then(UserId => { 
        setUserId(UserId)
        _fetchCourtData(UserId)
        .then(court => {
          setCourt(court);
        })
        .catch(err => console.log(err));

        _fetchdivisionData()
        // eslint-disable-next-line no-shadow
        .then(division => {
          //console.log(division);
          setdivision(division);
        })
        .catch(err => console.log(err));

      });



      /*
      halnagatDateTime()
      .then(halnagat => {
          setHalnagatTime(ReplaceTextFunction(halnagat[0].halnagatTime));
          setDayName(ReplaceTextDayFunction(halnagat[0].day_name));
      })
      .catch(err => console.log(err));
      */


      // if (inputRef?.current) {
      //   inputRef?.current?.setNativeProps({
      //     type: 'date',
      //     min: '1920-01-01',
      //     max: '2120-01-01',
      //     pattern: 'd{4}-d{2}-d{2}',
      //   })
      // }
      LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.']);
  }, []);

  const halnagatDateTime = async () => {

    try {
      //let url = `${BASE_URL}/GetHalnagatTime`;
      //let response = await axios.get(url).then(res => res.data);


      let dataToSend = {
        division_id: division_id,
        search_date: Platform.OS === 'web' ? date !==null ? engToBdNum(moment(date).format("YYYY-MM-DD").toString()) : "" : select_date !==null ? engToBdNum(moment(select_date).format("YYYY-MM-DD").toString() ): moment().format("YYYY-MM-DD"),
      };
  
      let formBody = [];
      for (let key in dataToSend) {
        let encodedKey = encodeURIComponent(key);
        let encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
  
        let url = `${BASE_URL}/GetHalnagatTime`;
        let response = await axios.post(url, formBody).then(res => res.data);


      return response;
    } catch (err) {
      console.log('Error', err);
    }
  };


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
  //console.log(data);
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
  
    case_info_id:values,
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
        
        Alert.alert( 'New Case Entry',
         user.msg);
       navigation.navigate("মামলা",{screen:'TotalCaseScreen'})
       }        
      else
       {  
        setIsLoading(false);       
        Alert.alert( 'New Case Entry',
        user.msg);
       }
       // alert("Successfully updated");
       // fetchData();
      }
     
    })
    .catch((err) => console.log(err));
  
};

const updateDivision =  (handleChange, e) => {
  //console.log(e);
  handleChange(e);
};
const updateDistrict = (handleChange, e) => {
  handleChange(e);
};

const updateLowerCourt = (handleChange, e) => {
  handleChange(e);
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

    _fetchCaseInfoData(values)
    // eslint-disable-next-line no-shadow
    .then(getCaseInfo => {
      setCaseInfo(getCaseInfo.fulldatas);
      setIsSearchDateBig(getCaseInfo.is_search_date_bigs);
      
      //Hide Loader
     // console.log(getCaseInfo);
      setIsLoading(false);
      setIsSearch(true);
    })
    .catch(err => console.log(err));

    /*
    halnagatDateTime()
    .then(halnagat => {
        setHalnagatTime(ReplaceTextFunction(halnagat[0].halnagatTime));
        setDayName(ReplaceTextDayFunction(halnagat[0].day_name));
    })
    .catch(err => console.log(err));
    */

  };

  const _causeListScrapUpdate =  async (data) => {
       
    //console.log(data);
  //  return data;
    try {
         let url = `${BASE_URL}/CauseListScrapUpdate`;
        // let response = await axios.post(url, data).then((res) => res.data);
        let formBody = [];
        for (let key in data) {
          let encodedKey = encodeURIComponent(key);
          let encodedValue = encodeURIComponent(data[key]);
          formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');
      
        let response = await  axios.post(url, formBody)
      
        .then((res) => res.data);
        //alert('hi in exe back')
        console.log(response);
        return response;
    } catch (error) {
      
    }
  };

  const handleCaseDiaryFromToDate = (values) => {
 
    setIsLoading(true);
    setCaseInfo([]);

      const caseData = {        
        

        StartDate: Platform.OS === 'web' ? date !==null ? moment(date).format("YYYY-MM-DD") : "" : select_date !==null ? moment(select_date).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
        EndDate: Platform.OS === 'web' ? date !==null ? moment(date).format("YYYY-MM-DD") : "" : select_date !==null ? moment(select_date).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
        DivissionId: division_id,
        geo_district_id: district_id,
        lower_court_id:values.lower_court_name,        
      };

     

     console.log(caseData);
      //perform api call to update password
      _causeListScrapUpdate(caseData)
        .then((val) => {
        //  setCaseInfo(val.fulldatas);
       // if(val.code==200){
         setIsLoading(false);
        //  setFinalSearchDate(val.FinalSearchDate)
      //  console.log(val.fulldatas);
        alert(val.msg)
      //  }

        })
        .catch((err) => console.log(err));
      
    }; 

    const [lowerCourtOpen, setLowerCourtOpen] = useState(false);

  return (
    <View    style={Platform.OS === 'web' && windowWidth >= 600?globalStyles.mainContainer:globalStyles.mainContainerMobile}>
    <LeftBar>   
       <LeftBarItem  selectcolor='true' name = 'দৈনিক কার্যতালিকা'  stack = 'দৈনিক কার্যতালিকা'   screen = 'DailyCaseListScreen' />
      
   </LeftBar> 
    
     <View style={ Platform.OS === 'web' && windowWidth >= 600?globalStyles.bodyContainer:globalStyles.bodyContainerMobile}>
     <TouchableWithoutFeedback onPress={()=>{closeDropdown()}}>
   <ScrollView  style={{flexGrow: 1}} nestedScrollEnabled={true}>
   
   
  <View style={Platform.OS === 'web' && windowWidth >= 600?styles.headerFixed:null}>
        <KeyboardAvoidingView
          style={styles.containerSearch}
          behavior="padding"
          enabled
        >
           <WavyTopBar customStyles={[styles.backgroundImage,{  zIndex:-1}] } /> 

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
                      <Picker.Item label="বিভাগ নির্বাচন করুনঃ–" value="0" color='red' />

                      {division?.map((item, index) => {
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
                        setDistrictName(district[itemIndex-1]?.district_name_bng);
                        updateDistrict(handleChange("district_name"), itemValue);
                       //getCourtData(itemValue);
                      }}
                      mode="dropdown"
                    >

                      <Picker.Item label="জেলা নির্বাচন করুনঃ–" value="0" color='red' />

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
                <View style={styles.FormGroup}>
                  {/* <InputLevel>অধস্তন আদালত :</InputLevel> */}
                  <View style={styles.pickerWrapper}>
                  {/* <Popable style={{ opacity: 0.8, width:'auto', height:32,  marginLeft:0, }} action="hover" content="অধস্তন আদালত নির্বাচন করুন"> */}
                    {/* <Picker
                      selectedValue={lower_court_id ? lower_court_id : 0}
                      style={{
                        ...styles.picker,
                      }}
                      onValueChange={(itemValue, itemIndex) => {
                        setLowerCourtId(itemValue);
                        setLowerCourtName(lower_court[itemIndex-1]?.office_name_bng)
                        updateLowerCourt(handleChange("lower_court_name"), itemValue);
                      }}
                      mode="dropdown"
                    >
                      
                  <Picker.Item label="অধস্তন আদালত নির্বাচন করুনঃ–" value="0" color='red' /> 

                      {lower_court.map((item, index) => {
                        return (
                          <Picker.Item
                            label={item.office_name_bng.toString()}
                            value={item.id.toString()}
                            key={index}
                          />
                        );
                      })}
                    </Picker> */}
                    <View style={{flexDirection:'row', width:320 , height: windowWidth >= 600?27:40,zIndex:100}}>                   
                      <DropDownFormik
                       zIndex={9999999}
                       zIndexInverse={9999987}
                        listMode= {Platform.OS === 'web'&& windowWidth >= 600 ?"FLATLIST":"MODAL"}
                        modalContentContainerStyle={{
                          // minHeight:responsiveHeight(50),
                           height:500, 
                           
                         }}
                         style={{ width:319 , height: windowWidth >= 600?27:40}}
                        open={lowerCourtOpen}
                        dropDownDirection="BOTTOM"
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
                   value={ Platform.OS === 'web' ?(date !==null ? engToBdNum(moment(date).format("DD-MM-YYYY").toString()) : ""):(select_date !==null ? engToBdNum(moment(select_date).format("DD-MM-YYYY").toString()) : "")}
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
                   value={ select_date !==null ? engToBdNum(moment(select_date).format("DD-MM-YYYY").toString()) :engToBdNum( moment().format("DD-MM-YYYY").toString())}
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
                        style={{width:300 , height:400}}
                       presentationStyle = "formSheet"
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
                      date={select_date?select_date: new Date()}
                       onConfirm={handleConfirm}
                       onCancel={hideDatePicker}
                      // minimumDate={new Date()}
                      // minimumDate={("YYYY, MM, DD")}
                      // maximumDate={moment().add(30, 'days').format("DD-MM-YYYY")}
                     /> )}
                   </>
                    {touched.search_date && errors.search_date ? (
                      <ErrorText>{errors.search_date}</ErrorText>
                    ) : null}
                  </View> 

                  {/* { isLoading === true ? (

                  ):(

                    )}

                     */}
                  <View style={{flexDirection:'row'}}>   
                  <View style={styles.Topview}>
                    <AppBtn
                      title="অনুসন্ধান "
                      onPress={handleSubmit}
                      width = {100}
                      fontwidth = 'bold'
                      disabled={isLoading ? true : false}
                    />
                  </View>

                  <View style={styles.halnagadbtn} >
                    <AppBtn
                      title="হালনাগাদ"
                    //  onPress={handleCaseDiaryFromToDate(values)}
                      onPress={() =>handleCaseDiaryFromToDate(values)} 
                      BGcolor='#102020'
                      width = {100}
                      disabled={isLoading ? true : false}
                    />
                  </View>
                  </View>

          </>
            )}
        </Formik> 
      </KeyboardAvoidingView>
    
      <View style={{zIndex:-1}}>
      <Text style={styles.Topheader}>
        {caseInfo?.length > 0?caseInfo[0]?.office_name_bng+",":""} {caseInfo?.length > 0?caseInfo[0]?.district_name_bng:""}             
            </Text>
           <Text style={styles.Topheader}>দৈনিক কার্যতালিকা</Text> 
           <View>
           {  !isLoading && Platform.OS === 'web' ? (<>
            <Text style={styles.TopheaderDate}>তারিখঃ {date !==null ? ReplaceTextFunction(moment(date).format("DD-MM-YYYY")) : ""}, {date !==null ? ReplaceTextDayFunction(moment(date).format('dddd')) : ""} (সর্বশেষ হালনাগাদঃ {caseInfo?.length > 0? ReplaceTextFunction(caseInfo[0]?.halnagatTime):""})</Text> 
            <Text style={styles.Topheader}>সর্বমোট মামলা: {caseInfo.length?engToBdNum(caseInfo.length.toString()):engToBdNum('0')}</Text>
            </>  ):null  } 

            {  !isLoading && Platform.OS === 'android' ? (<>
            <Text style={styles.TopheaderDate}>তারিখঃ {select_date !==null ? ReplaceTextFunction(moment(select_date).format("DD-MM-YYYY")) : ReplaceTextFunction(moment().format("DD-MM-YYYY"))}, {select_date !==null ? ReplaceTextDayFunction(moment(select_date).format('dddd')) : ReplaceTextDayFunction(moment().format('dddd'))} </Text>
            <Text style={styles.TopheaderDate2}>(সর্বশেষ হালনাগাদঃ {caseInfo?.length > 0? ReplaceTextFunction(caseInfo[0]?.halnagatTime):""})</Text>
            <Text style={styles.Topheader}>সর্বমোট মামলা: {engToBdNum(caseInfo?.length.toString())}</Text>
            </> ):null  }   
          </View>
      </View>
     
</View> 


<View>
      {  Platform.OS === 'web' && windowWidth >= 600 
            ? <View style={styles.webView}>


              <Table style={styles.table}>
                <thead style={styles.head}>
                <tr>
                    <th style={styles.headTextsl}>ক্রমিক নং</th>
                    <th style={styles.headText}>মামলার নম্বর</th>
                    <th style={styles.headText}>কার্যক্রম</th>
                    <th style={styles.headText}>পরবর্তী তারিখ</th>
                    <th style={styles.headText}>সংক্ষিপ্ত আদেশ</th>
                    <th style={styles.headText}>পদক্ষেপ</th>
                </tr>
                </thead>
                <tbody  style={styles.body}>
                    {
                      caseInfo.map((item, index) => (
                      
                            <tr key={index}>
                                <td style={index % 2 == 0?styles.bodyTextsl:styles.bodyTextsl1}>{isSearchDateBig==1?engToBdNum((index+1).toString()):engToBdNum(item.serial_no.toString())}</td>
                                <td style={index % 2 == 0?styles.bodyText:styles.bodyText1}>{item.type_name + ' - ' + engToBdNum(item.case_number.toString()) + item.arising_out_of +'/' + engToBdNum(item.case_year.toString())+' '+ item.upazila_name_bng }</td>
                                <td style={index % 2 == 0?styles.bodyText:styles.bodyText1}>{isSearchDateBig==1?item.result:item.activities}</td>
                                <td style={index % 2 == 0?styles.bodyText:styles.bodyText1}>{isSearchDateBig==1?"":(item.next_date=="01-01-1970"?"":engToBdNum(item.next_date.toString()))}</td>
                                <td style={index % 2 == 0?styles.bodyText:styles.bodyText1}>{isSearchDateBig==1?"":item.result}</td>
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
                                                onClick: () =>   handleCaseCreate(item.case_info_id)
                                              },
                                              {
                                                label: 'না',
                                                //onClick: () => alert('Click No')
                                              }
                                            ]
                                          });
                                          // Alert.alert(
                                          //   "মামলা যোগ করার জন্য নিশ্চিত করুন",
                                          //   "Alert text",
                                          //   item !== null
                                          //     ? [
                                          //       { text: "হ্যাঁ", onPress: () => handleCaseCreate(item)},
                                             
                                          //       { text: "না", }
                                          //     ]
                                          //     : null
                                              
                                          // );
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
            </Table>

            </View>
          :( caseInfo?.length > 0 && isSearch
            
            ?
          
          <View style={{...styles.mobileView, width: windowWidth - 16}}>
            
            <ScrollView horizontal={true}>
            
              <FlatList
                  data={caseInfo}
                  contentContainerStyle={{ flex: 1 }}
                  //keyExtractor={(item, index) => index.toString()}
                  nestedScrollEnabled
                  keyExtractor={(item, index) => item.id + index.toString()}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                  numColumns={1}
                  renderItem={({item, index }) => (
                    <View key={index }>
                      <TouchableOpacity>
                        <View style={styles.hddata}>
                          <View style={styles.MCart}>
                            <Text style={styles.textTile}>ক্রমিক নং</Text>
                            <Text style={styles.textTilecln}>:</Text>
                            <Text style={styles.textDescription}>
                              {isSearchDateBig==1?engToBdNum((index+1).toString()):engToBdNum(item.serial_no.toString())}
                            </Text>
                                     
                                              <TouchableOpacity style={styles.buttonsMobile} 
                                              
                                              // onPress={() => { handleCaseCreate(item.case_info_id)
                                              //   // confirmAlert({
                                              //   //   title: 'মামলা যোগ করার জন্য নিশ্চিত করুন',
                                              //   //   message: 'আপনি এই কাজ করতে নিশ্চিত "এটা কি আপনার মামলা ??".',
                                              //   //   buttons: [
                                              //   //     {
                                              //   //       label: 'হ্যাঁ',
                                              //   //       onClick: () =>   handleCaseCreate(item)
                                              //   //     },
                                              //   //     {
                                              //   //       label: 'না',
                                              //   //       //onClick: () => alert('Click No')
                                              //   //     }
                                              //   //   ]
                                              //   // });
                                               
                                              //     }}
                                                  onPress={() => {
                                                  
                                                    Alert.alert(
                                                      'মামলা যোগ করার জন্য নিশ্চিত করুন',
                                                      'আপনি এই কাজ করতে নিশ্চিত "এটা কি আপনার মামলা ??',
                                                      [
                                                        
                                                        {
                                                          text: 'হ্যাঁ',
                                                          onPress: () => {
                                                            //AsyncStorage.clear();
                                                            handleCaseCreate(item.case_info_id);
                                                           
                                                          // props.navigation.navigate("LoginScreen");
                                                         // navigation.popToTop();
                                                         // navigation.dispatch(StackActions.popToTop());
                                                          },
                                                        },
                                                        {
                                                          text: 'না',
                                                          onPress: () => {
                                                            return null;
                                                          },
                                                        },
                                                      ],
                                                      {cancelable: false},
                                                    );
                                                  }}
                                                  >
                                                <Text style={styles.textsMobile}>মামলা যোগকরি</Text>
                                              </TouchableOpacity>
                                         
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
                              {isSearchDateBig==1?item.result:item.activities}
                            </Text>
                          </View>
      
                          <View style={styles.MCart}>
                            <Text style={styles.textTile}>পরবর্তী তারিখ</Text>
                            <Text style={styles.textTilecln}>:</Text>
                            <Text style={styles.textDescription}>
                              {isSearchDateBig==1?"":(item.next_date=="01-01-1970"?"":engToBdNum(item.next_date.toString()))} 
                            </Text>
                          </View>
      
                          <View style={styles.MCart}>
                            <Text style={styles.textTile}>সংক্ষিপ্ত আদেশ</Text>
                            <Text style={styles.textTilecln}>:</Text>
                            <Text style={styles.textDescription}>
                              {isSearchDateBig==1?"":item.result}
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
                    endLoader && caseInfo?.length > 0 ? ListFooterComponent : null
                  }
                  windowSize={10}
                />
                </ScrollView>
          </View>:null)
        }
           {  Platform.OS === 'web'?
          caseInfo?.length == 0 &&  isSearch && isLoading==false ? (
            <Text style={styles.Topheader}>
              কোন মামলা পাওয়া যায়নি। 
            </Text>
            ) 
          : 
          null : 
          caseInfo == 'undefined' &&  isSearch && isLoading==false ? (
            <Text style={styles.Topheader}>
              কোন মামলা পাওয়া যায়নি। 
            </Text>
            ) 
          : 
          null
       }
         { isLoading ? <ActivityIndicator size="large"/> : null }
         </View>
       
        
        
{/* { caseInfo?.length > 0 && isSearch &&
      Platform.OS === 'android' &&  windowWidth < 600 
      ?
    
    <View style={{...styles.mobileView, width: windowWidth - 16}}>
      
      <ScrollView horizontal={true}>
      
        <FlatList
            data={caseInfo}
            contentContainerStyle={{ flex: 1 }}
            //keyExtractor={(item, index) => index.toString()}
            nestedScrollEnabled
            keyExtractor={(item, index) => item.id + index.toString()}
            showsVerticalScrollIndicator={false}
            bounces={false}
            numColumns={1}
            renderItem={({item, index }) => (
              <View key={index }>
                <TouchableOpacity>
                  <View style={styles.hddata}>
                    <View style={styles.MCart}>
                      <Text style={styles.textTile}>ক্রমিক নং</Text>
                      <Text style={styles.textTilecln}>:</Text>
                      <Text style={styles.textDescription}>
                        {item.serial_no}
                      </Text>
                               
                                        <TouchableOpacity style={styles.buttonsMobile} 
                                        
                                        // onPress={() => { handleCaseCreate(item.case_info_id)
                                        //   // confirmAlert({
                                        //   //   title: 'মামলা যোগ করার জন্য নিশ্চিত করুন',
                                        //   //   message: 'আপনি এই কাজ করতে নিশ্চিত "এটা কি আপনার মামলা ??".',
                                        //   //   buttons: [
                                        //   //     {
                                        //   //       label: 'হ্যাঁ',
                                        //   //       onClick: () =>   handleCaseCreate(item)
                                        //   //     },
                                        //   //     {
                                        //   //       label: 'না',
                                        //   //       //onClick: () => alert('Click No')
                                        //   //     }
                                        //   //   ]
                                        //   // });
                                         
                                        //     }}
                                            onPress={() => {
                                            
                                              Alert.alert(
                                                'মামলা যোগ করার জন্য নিশ্চিত করুন',
                                                'আপনি এই কাজ করতে নিশ্চিত "এটা কি আপনার মামলা ??',
                                                [
                                                  
                                                  {
                                                    text: 'হ্যাঁ',
                                                    onPress: () => {
                                                      //AsyncStorage.clear();
                                                      handleCaseCreate(item.case_info_id);
                                                     
                                                    // props.navigation.navigate("LoginScreen");
                                                   // navigation.popToTop();
                                                   // navigation.dispatch(StackActions.popToTop());
                                                    },
                                                  },
                                                  {
                                                    text: 'না',
                                                    onPress: () => {
                                                      return null;
                                                    },
                                                  },
                                                ],
                                                {cancelable: false},
                                              );
                                            }}
                                            >
                                          <Text style={styles.textsMobile}>মামলা যোগকরি</Text>
                                        </TouchableOpacity>
                                   
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
              endLoader && caseInfo?.length > 0 ? ListFooterComponent : null
            }
            windowSize={10}
          />
          </ScrollView>
    </View>
: null } */}

</ScrollView>
</TouchableWithoutFeedback>

    </View>
    </View>
  );
}

const styles = StyleSheet.create({

  table: {
    width: '100%',
    display: 'table',
    borderSpacing: 0,
    borderCollapse: 'separate',
  },
  th: {
    top: 0,
    left: 0,
    zIndex: 2,
    position: 'sticky',
    backgroundColor: '#fff',
  },

  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    height:  windowWidth >= 600?27:41,
    borderRadius: 5,
    margin: 10,
    zIndex:-1
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
  height: 40, 
  backgroundColor: 'khaki', 
  borderTopLeftRadius:5,
  borderTopRightRadius:5,
  
},
body: { 
  height:'200', overflow:'scroll'
},

headerFixed: {
  top: 0,
  left: 0,
  zIndex: 2,
  position: 'sticky',
  backgroundColor: '#fff',
  // paddingBottom:10,
},

headTextsl: { 
  fontSize: 14, 
  // fontWeight: 'bold', 
  textAlign: 'center', 
  color: '#000', 
  justifyContent:'center',
  width: 66,

  top: 173,
  left: 0,
  position: 'sticky',
  backgroundColor: 'khaki', 
  zIndex: 2,
},
headText: { 
  fontSize: 14, 
  // fontWeight: 'bold', 
  textAlign: 'center', 
  color: '#000', 
  justifyContent:'center',

  top: 173,
  left: 0,
  position: 'sticky',
  backgroundColor: 'khaki', 
  zIndex: 2,
},

buttonsMobile: {
  //flex: 1,
 // flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 5,
  paddingHorizontal: 10,
  borderRadius: 4,
  elevation: 3,
  backgroundColor: '#d1c408',
  marginTop:0,
 // paddingTop:10,
  marginRight:5,
 // left:130,
  top:0
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
  //backgroundColor: 'green',
  marginBottom:4,
  marginRight:5,
},
texts: {
  fontSize: 14,
 // lineHeight: 14,
  fontWeight: 'bold',
  letterSpacing: 0.25,
  color: '#00f',
},

textsMobile: {
  fontSize: 16,
  //lineHeight: 19,
  fontWeight: 'bold',
  letterSpacing: 0.25,
  color: '#000',
},

buttonStyleContainer: {
 flex: 1,
 flexDirection: 'row',
 marginHorizontal: 20,
  marginTop: 5,
  marginRight:5,
},
buttonStyleMobileContainer: {

  
  marginHorizontal: 20,
   marginTop: 5,
   marginRight:5,
 },
rowSection: { 
  height: windowWidth >= 600?27:40, 
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
  fontSize: 14, 
  // fontWeight: 'bold', 
  textAlign: 'center', 
  color: '#000', 
  justifyContent:'center',
  backgroundColor:'#ccc'

},
bodyText1: { 
  fontSize: 14, 
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
    height: windowWidth >= 600?27:40,
    color: '#333',
    width: Platform.OS === 'web' && windowWidth >= 600?150:250,
    backgroundColor: '#fff',
    fontFamily:'SolaimanLipi'
  },
  pickerP2: {
    height: windowWidth >= 600?27:40,
    color: '#989898',
    width: Platform.OS === 'web' && windowWidth >= 600?150:250,
    backgroundColor: '#fff',
    fontFamily:'SolaimanLipi'
  },
  inputs: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 2,
    fontSize: 13,
    backgroundColor: '#fff',
    width:Platform.OS === 'web' && windowWidth >= 600?150:250,
    fontFamily:'SolaimanLipi'
  },
  inputs1: {
    //borderColor: '#ccc',
   // borderWidth: 1,
   zIndex:-1,
   height: windowWidth >= 600?27:40,
    padding: 5,
    borderRadius: 2,
    fontSize: 13,
    width:Platform.OS === 'web' && windowWidth >= 600?90:250,
    backgroundColor: '#fff',
    fontFamily:'SolaimanLipi'
  },
  inputs11: {
    //borderColor: '#ccc',
   // borderWidth: 1,
    padding: 5,
    borderRadius: 2,
    fontSize: 13,
    width:Platform.OS === 'web' && windowWidth >= 600?110:250,
    backgroundColor: '#fff',
    fontFamily:'SolaimanLipi'
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
    marginTop: Platform.OS === 'web' && windowWidth >= 600? -7:10,
    // marginBottom: 80,
   // paddingHorizontal: 10,
   marginLeft:Platform.OS === 'web' && windowWidth >= 600? 0:35,
    },
  halnagadbtn: {
      marginTop:Platform.OS === 'web' && windowWidth >= 600? -7:10,
      // marginBottom: 80,
     // paddingHorizontal: 10,
     marginLeft:Platform.OS === 'web' && windowWidth >= 600? 10:15,
  
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
    width: Platform.OS === 'web' && windowWidth >= 600?200:250,
    backgroundColor: '#fff',
    fontFamily:'SolaimanLipi'
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
     width: responsiveWidth(96),
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
    //fontWeight: '',
    fontSize: 23,
    color: '#000',
    fontFamily:'SolaimanLipi'
  },
  TopheaderDate: {
    textAlign: 'center',
    //fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
    fontFamily:'SolaimanLipi'
  },
  TopheaderDate2: {
    textAlign: 'center',
    //fontWeight: 'bold',
    fontSize: 16,
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
    width:responsiveWidth(96),
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
