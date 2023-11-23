import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import { Formik } from 'formik';
// eslint-disable-next-line no-unused-vars
import React, { useEffect,createRef, useState, useCallback } from 'react';
import {
  TouchableWithoutFeedback,
  ActivityIndicator,
  Dimensions,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  Image
} from 'react-native';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
//import {Row, Table} from 'react-native-table-component';
import { BASE_URL } from '../../../components/BaseUrl';
//import ScreenBackground from '../../../components/ScreenBackground';
import AppBtn from '../../../shared/appBtn';
import ErrorText from "../../../shared/errorText";
import LeftBar from '../../../shared/LeftBar';
import LeftBarItem from '../../../shared/LeftBarItem';
import InputLevel from '../../../shared/inputLevel';
import BasicFormInput from "../../../shared/basicFormInput";
import ModalFilterPicker from 'react-native-modal-filter-picker';
import { globalStyles } from '../../../styles/globalStyles';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import * as yup from "yup";
import SelectBox from 'react-native-multi-selectbox';
import { xorBy } from 'lodash';
import { Popable } from 'react-native-popable';

import Modal from "react-native-modal";
import DiaryBox from "../../../shared/updateDiary";
import WavyHeader from '../../../shared/WavyHeader';
import WavyTopBar from '../../../shared/WavyTopBar';
import DropDownFormikEdit from "../../../shared/DropDownFormikEdit";
import DateTimePickerModal from "react-native-modal-datetime-picker"; 
import moment from "moment";
import {
  DatePickerModal,
  DatePickerModalContent,
  TimePickerModal,
  DatePickerInput,
  // @ts-ignore TODO: try to fix expo to work with local library
} from 'react-native-paper-dates';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { DefaultThemeColors, DarkThemeColors,ThemeOne,ThemeTwo } from "../../../utils/constants/Colors";

const Colors2 = ThemeOne;

const basicInfoSchema = yup.object({
  //division_id: yup.string().required("Courts/Division is required"), 
  // district_id: yup.string().required("District is required"),
  //court_name_id: yup.string().required("Court Name is required"),
  // position: yup.string().required("Name of parties is required"),
  //  position1: yup.string().required("Court Name is required"),
  //  versus: yup.string().required("Name of parties is required"),
  //  versus1: yup.string().required("Name of parties is required"),
  //case_number: yup.string().required(" Case No./Year (Year must Four Digit) is required"),
  //  jurisdictions: yup.string().required("Case Category is required"),
  //  case_type: yup.string().required("Case Type is required"),

});
//import sharedStyles from '../../../sharedStyles';
const windowWidth = Dimensions.get('window').width;
export default function CaseEditScreen({ route  }) {
  // let {width} = Dimensions.get('window');
  const CourtName = [
    { label: 'All Court', value: '1' },
    { label: 'District Court', value: '2' },
    { label: 'Tribunal Court', value: '3' },
    { label: 'Magistrate Court', value: '4' },
    { label: 'Others Court', value: '5' },
  ];
  const positions = [
    { item: 'Appellant', id: '1' },
    { item: 'Defendant', id: '2' },
  ];

  const [refreshing] = useState(true);
  const [endLoader, setEndLoader] = useState(1);
  const onEndReached = () => {
    //console.log('end reached');
    setEndLoader(0);
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableData] = useState([]);
  const [division, setdivision] = useState([]);
  const [courtType, setcourtType] = useState([]);
  const [district, setDistrict] = useState([]);
  const [alldistrict, setalldistrict] = useState([]);
  const [court, setCourt] = useState([]);
  const [position, setPosition] = useState([]);
  const [allcases, setAllCases] = useState([]);
  const [allCourt, setallCourt] = useState([]);
  const [Court_Name_id, setCourNameId] = useState(null);

  const filterdistrictResults = division_id =>
    setDistrict(_district =>
      alldistrict.filter(dist => dist.division_id === division_id),
    );
  const filtercourtResults = district_id =>
    setCourt(_court =>
      allCourt.filter(dist => dist.geo_district_id === district_id),
    );
  const [selected_posision_one, setSelectedPOne] = useState([]);
  const [selected_posision_two, setSelectedPTwo] = useState([]);
  const [division_id, setdivisionId] = useState(null);
  const [district_id, setDistrictId] = useState(null);

  const [court_division_id, setCourtdivisionId] = useState(null);
  const [court_id, setCourtId] = useState(null);
  const [court_type_id, setcourTypetId] = useState(null);
  const [courtTypes, setcourtTypes] = useState([]);
  const [lower_courts, setLowerCourts] = useState([]);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [parties_position_id, setPartiesPositionId] = useState(null);
  const [parties_vs_position_id, setPartiesVsPositionId] = useState(null);
  const [current, setCurrent] = useState("1");
  const [lower_court, setLowerCourt] = useState([]);
  const [user_id, setUserId] = useState([]);
  const [insertMessage, setInsertMessage] = useState([]);
  const [CaseInfo, setCaseInfo] = useState(null);
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalEntry, setModalEntry] = useState();
  const formikElement = createRef(null); 

  const NewCaseEntry = (handleChange, value) => {
    handleChange(value);
  };

  const [cases, setCases] = useState({

    user_id: "",
    case_type_id: "",
    court_name_id: "",
    parties_behalf_of: "",
    case_number: "",
    case_year: "",
  
    parties_one: "",
    position_one_id: "",
    parties_two: "",
    position_two_id: "",
    mobile: "",
    remarks: "",

  });



  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (val) => {
    // console.warn("A date has been picked: ", date);
    //console.log(val);
    setselectdate(val);
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

  const [select_date, setselectdate] = useState(null);


  const ListFooterComponent = (
    <View style={styles.listFooter}>
      <ActivityIndicator animating={true} size="large" color="#00ff00" />
    </View>
  );
  const _fetchcourtTypeData = async () => {
    try {
      let url = `${BASE_URL}/GetCaseType`;
      let response = await axios.get(url).then(res => res.data);

      return response;
      //if (response.country) return response.country;
    } catch (err) {
      console.log('Error', err);
    }
  };

  const _fetchCourtData = async (user_id) => {
    try {
      let url = `${BASE_URL}/GetCourtName?user_id=` + user_id;
      let response = await axios.get(url).then(res => res.data);

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  };

  const _fetchPositionData = async () => {
    try {
      let url = `${BASE_URL}/GetCasePosition`;
      let response = await axios.get(url).then(res => res.data);

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  };
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
     console.log(lower_court);
     setLowerCourt(lower_court);
    //setalldistrict(district);
  })
  .catch(err => console.log(err)); 
}  

  const _fetchLowerCourtData = async (data) => {
    try {let dataToSend = {
      id: data,
      user_id: user_id,
      };
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
      //let url = `${BASE_URL}/CourtNameToLowerCourt`;  //Custom Old
      let url = `${BASE_URL}/GetCourtNameToCourtNameNumber`;
      let response = await axios.post(url, formBody).then(res => res.data);

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  };

  */


  const _fetchCaseInfoData = async () => {
    try {
      let dataToSend = {
        //user_id: data,
        division_id: division_id,
        geo_district_id: district_id,
        court_name_id: court_id,
        case_type_id: court_type_id,
        //  hearing_date: data,
        // case_number: data,
        //  case_year: data,

      };
      let formBody = [];
      for (let key in dataToSend) {
        let encodedKey = encodeURIComponent(key);
        let encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      let url = `${BASE_URL}/GetCaseDiaryInfo`;
      let response = await axios.post(url, formBody).then(res => res.data);

      return response;
      //if (response.country) return response.country;
    } catch (err) {
      console.log('Error', err);
    }
  };

 
  const getdivisionData = () => {
    _fetchdivisionData()
      .then(division => {
        setdivision(division);
      })
      .catch(err => console.log(err));;
  }
  const getPositionData = () => {
    _fetchPositionData()
      // eslint-disable-next-line no-shadow
      .then(position => {
       // console.log(position);
        setPosition(position);
      })
      .catch(err => console.log(err));
  }
  const getcourtTypeData = () => {
    _fetchcourtTypeData()
    // eslint-disable-next-line no-shadow
    .then(courtType => {
      // console.log(courtType);
      setcourtType(courtType);
        setcourtTypes( courtType.map(marker =>{ 
          marker.value = marker.id
           marker.label = marker.type_name 
            return marker
        }));
    })
    .catch(err => console.log(err));
  }

  useEffect(() => {
    //async fetch user data
    getdivisionData();
    getPositionData();
    getcourtTypeData();

   
    getUserId().then(UserId => {
      setUserId(UserId);
      getCasedata(UserId);
      _fetchCourtData(UserId)
        .then(court => {
          setCourt(court); 
         
        })
        .catch(err => console.log(err));
    });



   

  }, []);





  const _fetchLowerCourtData = async (data) => {
    try {
      let dataToSend = {

        geo_district_id: data,
        //geo_district_id:district_id,
        geo_division_id: division_id,

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
  const getLowerCourtdata = (data) => {
    _fetchLowerCourtData(data)
      // eslint-disable-next-line no-shadow
      .then(lower_court => {
       // console.log(lower_court);
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
    try {
      let dataToSend = {
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

  const getDstrictsdata = (data) => {
    _fetchDistrictData(data)
      // eslint-disable-next-line no-shadow
      .then(district => {
        // console.log(district);
        setDistrict(district);
        //setalldistrict(district);
      })
      .catch(err => console.log(err));


  }
  const getCasedata = (data) => { 
    _fetchCaseData(data)
    // eslint-disable-next-line no-shadow
    .then(alldata => {
      console.log(alldata);
      alldata.CaseInfo?setCaseInfo(alldata.CaseInfo):setCaseInfo([]);

      const dataListone = alldata.PositionOne?.map(s => ({
        item: s.item,
        id: s.id
        }));
        const dataListtwo = alldata.PositionTwo?.map(s => ({
          item: s.item,
          id: s.id
          }));
         
      // setSelectedPOne(xorBy(selected_posision_one, [alldata.PositionOne?alldata.PositionOne:null], 'id'));
      // setSelectedPTwo(xorBy(selected_posision_two, [alldata.PositionTwo?alldata.PositionTwo:null], 'id'));
      setTimeout(function(){
       setCases({
        user_id: data,
        case_type_id: alldata.CaseInfo.case_type_id?.toString(),
        court_name_id:alldata.CaseInfo.court_name_id?.toString(),
        
        parties_behalf_of:alldata.CaseInfo.parties_behalf_of?.toString(),
        case_number: alldata.CaseInfo.case_number?.toString(),
        case_year: alldata.CaseInfo.case_year?.toString(),
       
        parties_one:alldata.CaseInfo.parties_one?.toString(),
        position_one_id: "",
        parties_two: alldata.CaseInfo.parties_two?.toString(),
        position_two_id: "",
        mobile: alldata.CaseInfo.mobile?.toString(),
        remarks: alldata.CaseInfo.remarks?.toString(),

    
      });
      setdivisionId(alldata.CaseInfo.division_id?.toString());
      getDstrictsdata(alldata.CaseInfo.division_id?.toString());
      setDistrictId(alldata.CaseInfo.district_id?.toString());
      getLowerCourtdata(alldata.CaseInfo.district_id?.toString())
      setCourNameId(alldata.CaseInfo.court_name_id);    
       
     
      setcourTypetId(alldata.CaseInfo.case_type_id);
      setCurrent(alldata.CaseInfo.parties_behalf_of?alldata.CaseInfo.parties_behalf_of.toString():1 );
      setDate(moment(alldata.CaseInfo.created_at, moment.defaultFormat).toDate());
      setselectdate(moment(alldata.CaseInfo.created_at, moment.defaultFormat).toDate());
      
        setSelectedPOne(dataListone);

        setSelectedPTwo(dataListtwo);
      }, 10);

      //setalldistrict(district);
    })
    .catch(err => console.log(err)); 
  }  
  const _fetchCaseData = async (data) => {
    //console.log(route);
    try {let dataToSend = {
      user_id: data,
      id:route.params.case_id ,
      };
      console.log(dataToSend);
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
      let url = `${BASE_URL}/GetMyCaseView`;
      let response = await axios.post(url, formBody).then(res => res.data);

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  };


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
const getDstrictsdata = (data) => { _fetchDistrictData(data)
  // eslint-disable-next-line no-shadow
  .then(district => {
    // console.log(district);
    setDistrict(district);
    //setalldistrict(district);
  })
  .catch(err => console.log(err));

  
}  
const getCourtsdata = (data) => {
  _fetchCourtData(data)
      // eslint-disable-next-line no-shadow
      .then(court => {
        //console.log(country);
        setCourt(court);
       // setallCourt(court);
      })
      .catch(err => console.log(err));
 }
*/


  const handleCaselistSearch = (values, actions) => {
    _fetchCaseInfoData()
      // eslint-disable-next-line no-shadow
      .then(allcases => {
        //console.log(country);
        setAllCases(allcases);
        // setallCourt(court);
      })
      .catch(err => console.log(err));
  };

  const handleCaseCreate = (values, actions) => {
    setIsSubmitting(true);
    // const { FullName,   email,  address,  mobile,  phone,  altemail,  country_id, division_id,  district_id } = values;
    // console.log("rr "+pickedCategory.key);
    let position_one_ids = selected_posision_one.map((x) => x.id);
    let position_two_ids = selected_posision_two.map((x) => x.id);

    const caseData = {
      user_id: user_id,
      //court_id:court_id, 
      id:route.params.case_id, 
      court_name_id:Court_Name_id,

      division_id: division_id,
      geo_district_id: district_id,
     // lower_court_id: lower_court_id,
      case_filing_date: Platform.OS === 'web' ? date !==null ? moment(date).format("YYYY-MM-DD") : "" : select_date !==null ? moment(select_date).format("YYYY-MM-DD") : "",

      case_type_id: court_type_id,
      parties_behalf_of: current,
      case_number: values.case_number,
      case_year: values.case_year,
      parties_one: values.parties_one,
      //position_one_id: parties_position_id,  
      position_one_id: position_one_ids,
      parties_two: values.parties_two,
      //position_two_id:parties_vs_position_id,    
      position_two_id: position_two_ids,
      mobile: values.mobile,
      remarks: values.remarks,

    };

   //console.log(caseData);

    //perform api call to update password
    _saveBasicInfo(caseData)
      .then((user) => {
        //console.log(user.msg);

        setInsertMessage(user);

        // Reset Form Data Start
        // actions.resetForm({
        //   values:''
        // });

        // setdivisionId([]);
        // setDistrictId([]);
        // setCourNameId([]);
        // setcourTypetId([]);

        // setSelectedPOne([]);
        // setSelectedPTwo([]);

        // Reset Form Data End
        if(Platform.OS === 'web'){
        setTimeout(function(){
          setInsertMessage([]);
        }, 3000) }else{
          Alert.alert( 'Case edit', user.msg );
          navigation.navigate("মামলা",{screen:'TotalCaseScreen'});
        }

        //  if (user.code == 200)
        //  {
        //    alert( user.msg);
        //  }        
        // else
        //  {         
        //     alert(user.msg);
        //  }

        // alert("Successfully updated");
        // fetchData();

        // updateAuthUserName(`${user.FullName}`).then(() => {
        //   console.log(user);
        //   setUser(values);
        //   alert("Successfully updated");
        // });
      })
      .catch((err) => console.log(err))
      .then(() => setIsSubmitting(false))
    // .then(() =>setIsEditing(!isEditing));



  };

  //save user data
  const _saveBasicInfo = (data) => {
    //console.log(data);
    //  return data;
    try {
      let url = `${BASE_URL}/CaseEdit`;
      // let response = await axios.post(url, data).then((res) => res.data);
      let formBody = [];
      for (let key in data) {
        let encodedKey = encodeURIComponent(key);
        let encodedValue = encodeURIComponent(data[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');

      let response = axios.post(url, formBody)
        //   axios({
        //   method: 'post',      
        //   url: url,
        //   headers: {
        //    // 'Content-Type': 'application/x-www-form-urlencoded',
        //     'Accept': 'application/json',
        //     'Authorization':'Basic YnJva2VyOmJyb2tlcl8xMjM='
        //   },
        //   data: data
        // })
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


  const onSelectPosition = (handleChange, data) => {
    //  console.log(data);
    // const {key,label} = data;
    setPartiesPositionId(data);
    handleChange(data);

  };
  function onMultiChangePOne() {
    // console.log( selected_Jobcat);
    return (item) => setSelectedPOne(xorBy(selected_posision_one, [item], 'id'))

  };
  function onMultiChangePTwo() {
    // console.log( selected_Jobcat);
    return (item) => setSelectedPTwo(xorBy(selected_posision_two, [item], 'id'))

  };

  const [lowerCourtOpen, setLowerCourtOpen] = useState(false);
  const [caseTypeOpen, setCaseTypeOpen] = useState(false);

  const closeDropdown = useCallback(() => {
    setLowerCourtOpen(false);
    setCaseTypeOpen(false)


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
    <View style={Platform.OS === 'web' && windowWidth >= 600 ? globalStyles.mainContainer : globalStyles.mainContainerMobile}>
      <LeftBar>
        {/* <LeftBarItem    name = 'Home'  stack = 'Case'   screen = 'CaseScreen' /> */}
        {/* <LeftBarItem     name = 'আমার ডায়েরী'  stack = 'মামলা'   screen = 'CaseDiaryScreen' /> */}
        <LeftBarItem selectcolor='true' name='নতুন মামলা যোগ করুন' stack='মামলা' screen='CaseEntry' />
        <LeftBarItem name='সকল মামলা ও রেজিস্ট্রার' stack='মামলা' screen='TotalCaseScreen' />
      </LeftBar>
      <Modal isVisible={isModalVisible}  
            onSwipeComplete={() => setModalVisible(false)}
            //onBackdropPress={() => setModalVisible(false)}
            swipeDirection={['left', 'right','down','up']}>
              <View style={{alignItems:'center'}}>
              
                <DiaryBox item={modalEntry}  closeModal={() => setModalVisible(false)} />
                
              </View>
             </Modal>
     
      <View style={Platform.OS === 'web' && windowWidth >= 600 ? globalStyles.bodyContainer : globalStyles.bodyContainerMobile}>
      <TouchableWithoutFeedback onPress={()=>{closeDropdown()}}>
      <ScrollView>
      <WavyHeader customStyles={styles.svgCurve} />
     <View style={styles.headerBar}>
     <TouchableOpacity style={styles.headerBarButton} 
      onPress={ () => {
     navigation.navigate('মামলা', {
          screen: 'DiaryHistoryScreen',
          params: { case_id: CaseInfo.case_id},
        });} } ><Text style={styles.headerBarText}><FontAwesome    name='edit'  color='#f00'  />ডায়েরীর ইতিহাস</Text></TouchableOpacity> 
     <TouchableOpacity onPress={ () => {
     navigation.navigate('মামলা', {
          screen: 'CaseViewScreen',
          params: { case_id: CaseInfo.case_id},
        });} } style={styles.headerBarButton}><Text style={styles.headerBarText}><FontAwesome   name='history'  color='#f00'  />বৃত্তান্ত</Text></TouchableOpacity> 
      <TouchableOpacity   onPress={() => {  setModalVisible(!isModalVisible);
                                      setModalEntry(CaseInfo);}} style={styles.headerBarButton}><Text style={styles.headerBarText}><FontAwesome   name='history'  color='#f00'  />ডায়েরী আপডেট</Text></TouchableOpacity> 
     
      
      </View> 
    {/* <View style={styles.headerContainer}>
        <Text style={styles.headerTexth}>মামলা সম্পাদনা </Text>
      </View>
      
        <View style={styles.headerContainer1}>
              <Text style={styles.headerText1}>{CaseInfo?.office_name_bng+", "+CaseInfo?.district_name_bng}</Text>
            </View> */}
           <WavyTopBar           
           customStyles={[styles.backgroundImage,{ height:'100%', zIndex:-1}] }
          />
            <View style={styles.message}>
              {insertMessage.code == 200 ? <Text style={styles.succesMessage}>{insertMessage.msg}</Text> : null}
              {insertMessage.code == 401 ? <Text style={styles.errorMessage}>{insertMessage.msg}</Text> : null}
            </View>

            <KeyboardAvoidingView
              style={styles.containerSearch}
              behavior="padding"
              enabled
            >
              {/* <TouchableWithoutFeedback  onPress={() => Keyboard.dismiss()}> */}

              <Formik
                enableReinitialize={true}

                initialValues={{...cases }}
               // validationSchema={basicInfoSchema}
                onSubmit={(values, actions) => {
                  handleCaseCreate(values, actions);
                }}
              // eslint-disable-next-line no-undef
              innerRef={formikElement}
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
                    <View style={styles.webMobile}>
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
                        </View>
                      </View>

                      <View style={styles.FormGroup}>
                        <View style={styles.pickerWrapper}>
                          <Popable style={{ opacity: 0.8, width: 'auto', marginLeft: -50, }} action="hover" content="অধস্তন আদালত নির্বাচন করুন">
                            {/* <Picker
                              selectedValue={Court_Name_id ? Court_Name_id : 0}
                              style={{
                                ...styles.picker,
                              }}
                              //  onValueChange={(itemValue, itemIndex) => setcountry_id(itemValue)}
                              onValueChange={(itemValue, itemIndex) => {
                                setCourNameId(itemValue);
                                //filterEvenResults(itemValue);
                                //filterdistrictBycountry(itemValue);
                              }}
                              mode="dropdown"
                            >
                              <Picker.Item label="অধস্তন আদালত নির্বাচন করুনঃ–" value="0" />

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
                            <View style={{flexDirection:'row'}}>                   
                      <DropDownFormikEdit
                       zIndex={9999999}
                       zIndexInverse={9999987}
                       listMode={windowWidth >= 600 ?"FLATLIST":"MODAL"}
                        modalContentContainerStyle={{
                          // minHeight:responsiveHeight(50),
                           height:500, 
                           
                         }}
                         value={Court_Name_id}
                        
                         setValue={(val) => {
                          setCourNameId(val()); 
                                            }}
                        open={lowerCourtOpen}
                        setOpen={setLowerCourtOpen}
                      searchable={true}
                      dropDownContainerStyle={{
                        minHeight:responsiveHeight(65),
                       // width:90,
                       // lineHeight:8,
                       width:350,
                        padding:0
                      }}
                        name="lower_court_name"
                        placeholder="অধস্তন আদালত নির্বাচন করুন"
                        items={lower_courts}
                       
                      />
                   </View>
                            </Popable>
                        </View>
                      </View>

                      <View style={[styles.FormGroup, {zIndex:lowerCourtOpen?-1:1} ]}>
                        {/* <InputLevel>মামলার ধরন</InputLevel> */}

                        <View style={styles.pickerWrapper}>
                          <Popable style={{ opacity: 0.8, width: 'auto', marginLeft: -50, }} action="hover" content="মামলার ধরন নির্বাচন করুন">
                            {/* <Picker
                              selectedValue={court_type_id ? court_type_id : 0} 
                              style={{
                                ...styles.picker,
                              }}
                              //  onValueChange={(itemValue, itemIndex) => setcountry_id(itemValue)}
                              onValueChange={(itemValue, itemIndex) => {
                                setcourTypetId(itemValue);
                                //filterEvenResults(itemValue);
                                //filterdistrictBycountry(itemValue);
                              }}
                              mode="dropdown"
                            >
                              <Picker.Item label="মামলার ধরন নির্বাচন করুনঃ–" value="0" />

                              {courtType.map((item, index) => {
                                return (
                                  <Picker.Item
                                    label={item.type_name.toString()}
                                    value={item.id.toString()}
                                    key={index}
                                  />
                                );
                              })}
                            </Picker> */}
<View style={{flexDirection:'row'}}>                   
                      <DropDownFormikEdit
                       zIndex={9999999}
                       zIndexInverse={9999987}
                       listMode={windowWidth >= 600 ?"FLATLIST":"MODAL"}
                        modalContentContainerStyle={{
                          // minHeight:responsiveHeight(50),
                           height:500, 
                           
                         }}
                         value={court_type_id}
                       
                         setValue={(val) => {
                          setcourTypetId(val()); 
                                            }}
                        open={caseTypeOpen}
                        setOpen={setCaseTypeOpen}
                      searchable={true}
                      dropDownContainerStyle={{
                        minHeight:responsiveHeight(60),
                       // width:90,
                       // lineHeight:8,
                       width:600,
                        padding:0
                      }}
                        name="case_type_name"
                        placeholder="মামলার ধরন নির্বাচন করুনঃ–"
                        items={courtTypes}
                       
                      />
                   </View>
                            </Popable>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row',zIndex:-1 }}>
                        <View style={styles.FormGroup}>
                          {/* <InputLevel>মামলা নাম্বার :</InputLevel> */}
                          <Popable style={{ opacity: 0.8, width: 'auto', marginLeft: 0, }} action="hover" content="মামলা নাম্বার">
                            <TextInput
                              style={styles.inputs1}
                              placeholderTextColor="#989898"
                              value={values.case_number}
                              onChangeText={handleChange("case_number")}
                              onBlur={handleBlur("case_number")}
                              placeholder={"মামলা নাম্বার"}
                              keyboardType="numeric"
                            /></Popable>
                          {touched.case_number && errors.case_number ? (
                            <ErrorText>{errors.case_number}</ErrorText>
                          ) : null}
                        </View>
                        <View style={styles.FormGroup}>
                          {/* <InputLevel>সাল :</InputLevel> */}
                          <Popable style={{ opacity: 0.8, width: 'auto', marginLeft: -30, }} action="hover" content="সাল">
                            <TextInput
                              style={styles.inputs1}
                              placeholderTextColor="#989898"
                              value={values.case_year}
                              onChangeText={handleChange("case_year")}
                              onBlur={handleBlur("case_year")}
                              placeholder={"সাল"}
                              keyboardType="numeric"
                            /></Popable>
                          {touched.case_year && errors.case_year ? (
                            <ErrorText>{errors.case_year}</ErrorText>
                          ) : null}
                        </View>                    

                      </View>
                      <View style={[styles.FormGroup, {zIndex:-1}] }>
                       
                       <>
                         <View style={{ flexDirection: 'row' }}>
                         <Popable style={{ opacity: 0.8, width: 'auto', marginLeft: -40, }} action="hover" content="মামলা দায়েরের তারিখ">
                           <TouchableOpacity onPress={() => setVisible(true) }  style={styles.sectionStyle}>
                             <TextInput
                               style={styles.dateInput}
                               placeholderTextColor="#989898"
                               value={Platform.OS === 'web' ? (date !== null ? engToBdNum(moment(date).format("DD-MM-YYYY").toString()) : "") : (select_date !== null ? engToBdNum(moment(select_date).format("DD-MM-YYYY").toString()) : "")}
                               onChangeText={handleChange("filling_date")}
                               onBlur={handleBlur("filling_date")}
                               placeholder={"DD-MM-YYYY"}
                               // isEditing={isEditing}
                               onTouchStart={showDatePicker}
                             />
                             
                             <Image
                                   source={{
                                     uri:
                                       'https://bdjudgecourt.com/assets/calendar.png',
                                   }}
                                   style={styles.imageStyle}
                               />
                             </TouchableOpacity></Popable>
                         
                         </View>
                         {Platform.OS === 'web' ? (
                           <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>

                          

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
                         ) : (
                           <DateTimePickerModal
                             isVisible={isDatePickerVisible}
                             mode="date"
                             // date={ values?.application_deadline? moment(values?.application_deadline).format("DD-MM-YYYY") : ""}
                             onConfirm={handleConfirm}
                             onCancel={hideDatePicker}
                           //  minimumDate={new Date()}
                           // minimumDate={("YYYY, MM, DD")}
                           // maximumDate={moment('08-06-2022').add(30, 'days').format("DD-MM-YYYY")}
                           />)}
                       </>
                       {touched.filling_date && errors.filling_date ? (
                         <ErrorText>{errors.filling_date}</ErrorText>
                       ) : null}
                     </View>
                      </View>
                      <View style={[styles.webMobile,{zIndex:-1}]}>
                      {/* <View style={styles.FormGroup}>
                       
                        <>
                          <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => setVisible(true)}>
                              <TextInput
                                style={styles.dateInput}
                                value={Platform.OS === 'web' ? (date !== null ? moment(date).format("DD-MM-YYYY") : "") : (select_date !== null ? moment(select_date).format("DD-MM-YYYY") :  moment().format("DD-MM-YYYY"))}
                                onChangeText={handleChange("search_date")}
                                onBlur={handleBlur("search_date")}
                                placeholder={"DD-MM-YYYY"}
                                // isEditing={isEditing}
                                onTouchStart={showDatePicker}
                              /></TouchableOpacity>
                            {Platform.OS === 'web' ? (<FontAwesome.Button name='calendar' backgroundColor='#ccd' color='#000' style={{ width: 30, height: 25, marginLeft: -5, marginTop: 3 }} onPress={() => setVisible(true)}></FontAwesome.Button>) : null}
                          </View>
                          {Platform.OS === 'web' ? (
                            <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>

                            

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
                          ) : (
                            <DateTimePickerModal
                              isVisible={isDatePickerVisible}
                              mode="date"
                              // date={ values?.application_deadline? moment(values?.application_deadline).format("DD-MM-YYYY") : ""}
                              onConfirm={handleConfirm}
                              onCancel={hideDatePicker}
                           //   minimumDate={new Date()}
                            // minimumDate={("YYYY, MM, DD")}
                            // maximumDate={moment('08-06-2022').add(30, 'days').format("DD-MM-YYYY")}
                            />)}
                        </>
                        {touched.search_date && errors.search_date ? (
                          <ErrorText>{errors.search_date}</ErrorText>
                        ) : null}
                      </View> */}

                      <View style={styles.FormGroup}>
                        {/* <InputLevel>মোবাইল নাম্বার :</InputLevel> */}
                        <Popable style={{ opacity: 0.8, width: 'auto', marginLeft: -70, }} action="hover" content="মোবাইল নাম্বার">
                          <TextInput
                            style={styles.inputs}
                            placeholderTextColor="#989898"
                            value={values.mobile}
                            onChangeText={handleChange("mobile")}
                            onBlur={handleBlur("mobile")}
                            placeholder={"মোবাইল নাম্বার"}
                            keyboardType="phone-pad"
                          /></Popable>
                        {touched.mobile && errors.mobile ? (
                          <ErrorText>{errors.mobile}</ErrorText>
                        ) : null}
                      </View>
                      <View style={styles.FormGroup}>                       
                        <Popable style={{ opacity: 0.8, width: 'auto', marginLeft: -90, }} action="hover" content="নোট">
                          <TextInput
                            numberOfLines={8}
                            multiline={true}
                            style={styles.inputs}
                            placeholderTextColor="#989898"
                            value={values.remarks}
                            onChangeText={handleChange("remarks")}
                            onBlur={handleBlur("remarks")}
                            placeholder={"নোট"}
                           

                          /></Popable>
                        {touched.remarks && errors.remarks ? (
                          <ErrorText>{errors.remarks}</ErrorText>
                        ) : null}
                      </View>                    
                      { Platform.OS === 'web' && windowWidth >= 600 ?<View style={styles.Topview}>
                          <AppBtn
                            title="Submit"
                            onPress={handleSubmit}
                          //disabled={isSubmitting ? true : false}
                          />
                        </View>:null }                
                    </View>

                    <View style={[styles.webMobile,{zIndex:-1}]}>
                      <View style={{ backgroundColor: '#F0E68C', width:300, marginTop:Platform.OS === 'web' && windowWidth >= 600 ?30:0,  }}>
                        <View style={styles.FormGroup}>                         
                          <Popable style={{ opacity: 0.8, width: 'auto', marginLeft: -50, }} action="hover" content="পক্ষের নাম">
                            <TextInput
                              style={styles.inputsm}
                              value={values.parties_one}
                              placeholderTextColor="#989898"
                              onChangeText={handleChange("parties_one")}
                              onBlur={handleBlur("parties_one")}
                              placeholder={"পক্ষের নাম"}

                            /></Popable>
                          {touched.parties_one && errors.parties_one ? (
                            <ErrorText>{errors.parties_one}</ErrorText>
                          ) : null}
                        </View>
                        <View style={styles.FormGroup}>                         
                          <Popable style={{ opacity: 0.8, width: 'auto', marginLeft: -15, }} action="hover" content="পক্ষের অবস্থান নির্বাচন করুন">
                            
                            <SelectBox
                              label="পক্ষের অবস্থান নির্বাচন করুন"
                              options={position?position:null}
                              selectedValues={selected_posision_one?selected_posision_one:null}
                              onMultiSelect={onMultiChangePOne()}
                              onTapClose={onMultiChangePOne()}
                              selectedItemStyle={styles.selctitem}
                              listOptionProps={{ nestedScrollEnabled: true }}
                              multiListEmptyLabelStyle={{ fontSize:13, color:'#000'}}
                              optionsLabelStyle={{fontSize:13, color:'#000', padding:5}}
                              multiOptionContainerStyle={{paddingVertical:2,backgroundColor:Colors2.top2}}
                              optionContainerStyle={{paddingVertical:2, paddingLeft:8}}
                              inputFilterContainerStyle={{paddingVertical:2}}  
                              inputFilterStyle=  {{paddingVertical:2}}                           
                              containerStyle={{paddingVertical:2, paddingLeft:8}}
                              multiOptionsLabelStyle={{padding:0}}
                              isMulti
                            />
                           
                            </Popable>

                          {touched.position && errors.position ? (
                            <ErrorText>{errors.position}</ErrorText>
                          ) : null}
                        </View>

                        <RadioButtonGroup
                          containerStyle={{ marginBottom: 10, backgroundColor: '#F0E68C' }}
                          selected={current}
                          onSelected={(value) => setCurrent(value)}
                          radioBackground="green"
                          size= {15}
                          radioStyle={{ borderColor: "#000",
                          padding: 1,  marginLeft: "33%", marginBottom: 5, marginTop: 5 }}
                          labelStyle={{width:50}}
                        >
                          <RadioButtonItem value="1" label="পক্ষে" />

                          <View style={{ backgroundColor: '#fff' }}>
                            <Text style={{ textAlign: 'center' }}>বনাম</Text>
                          </View>
                          <RadioButtonItem value="2" label="পক্ষে" />
                        </RadioButtonGroup>

                        <View style={styles.FormGroup}>                       
                          <Popable style={{ opacity: 0.8, width: 'auto', marginLeft: -50, }} action="hover" content="বিপক্ষের নাম">
                            <TextInput
                              style={styles.inputsm}
                              placeholderTextColor="#989898"
                              value={values.parties_two}
                              onChangeText={handleChange("parties_two")}
                              onBlur={handleBlur("parties_two")}
                              placeholder={"বিপক্ষের নাম"}

                            /></Popable>
                          {touched.parties_two && errors.parties_two ? (
                            <ErrorText>{errors.parties_two}</ErrorText>
                          ) : null}
                        </View>

                        <View style={styles.FormGroup}>                        
                          <Popable style={{ opacity: 0.8, width: 'auto', marginLeft: -10, }} action="hover" content="বিপক্ষের অবস্থান নির্বাচন করুন">
                            <SelectBox
                              label="বিপক্ষের অবস্থান নির্বাচন করুন"
                              options={position?position:null}
                              selectedValues={selected_posision_two?selected_posision_two:null}
                              onMultiSelect={onMultiChangePTwo()}
                              onTapClose={onMultiChangePTwo()}
                              selectedItemStyle={styles.selctitem}
                              listOptionProps={{ nestedScrollEnabled: true }}
                              multiListEmptyLabelStyle={{ fontSize:13, color:'#000'}}
                              optionsLabelStyle={{fontSize:13, color:'#000', padding:5}}
                              multiOptionContainerStyle={{paddingVertical:2,backgroundColor:Colors2.top2}}
                              optionContainerStyle={{paddingVertical:2, paddingLeft:8}}
                              inputFilterContainerStyle={{paddingVertical:2}}  
                              inputFilterStyle=  {{paddingVertical:2}}                           
                              containerStyle={{paddingVertical:2, paddingLeft:8}}
                              multiOptionsLabelStyle={{padding:0}}
                              isMulti
                            /></Popable>
                        </View>


                      </View>
                      { Platform.OS === 'web' && windowWidth >= 600 ?null:<View style={styles.buttonMobile}>
                          <AppBtn
                            title="Submit"
                            onPress={handleSubmit}
                          //disabled={isSubmitting ? true : false}
                          />
                        </View> }
                    </View>




                  </>
                )}
              </Formik>
              {/* </TouchableWithoutFeedback> */}
            </KeyboardAvoidingView>
         

          </ScrollView>
          </TouchableWithoutFeedback>
      </View>     
    </View>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    marginTop: 15,
    marginHorizontal: 10,
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'center',
  },
  headerBarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00c',
    textAlign: 'center',
    //marginTop: 40
  },
  headerBarButton: {
  marginRight:Platform.OS === 'web' && windowWidth >= 600?20:10,
  paddingHorizontal:Platform.OS === 'web' && windowWidth >= 600?10:5,
  paddingVertical:2,
  backgroundColor:'khaki',
  borderRadius:13,
  flexDirection:'row',
  },
  headerText1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00c',
    textAlign: 'center',
    marginTop: 0
  },
  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    height: 32,
    borderRadius: 5,
   // margin: 10,
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
  webMobile: {

    flexDirection:
      Platform.OS === 'web' && windowWidth >= 600 ? 'column' : 'column',
      Top:0,
      
  },
  svgCurve: {
    position: 'absolute',
    width: Dimensions.get('window').width
  },
  headerContainer: {
    marginTop: 15,
    marginHorizontal: 10
  },
  selctitem: {
//paddingVertical:2,
    width: 250,
     color: "#000",
     fontSize:13,
     textAlign:'center',
     flexWrap:'nowrap'
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: 200,
    backgroundColor: '#333',
    padding: 20,
  },
  headerTexth: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors2.top11,
    textAlign: 'center',
    fontFamily:'SolaimanLipi',
   // marginTop: 40
  },
  menuItem: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 10,
  },
  button: {
    //position: 'absolute',
    marginTop: 10,
    left: 5,
    padding: 5,
    //paddingHorizontal:20,
    //backgroundColor: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    //borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  picker2: {
    height: Platform.OS === 'web' && windowWidth >= 600 ?30:45,
    color: '#333',
    width: 250,
    fontFamily:'SolaimanLipi'
  },
  pickerP2: {
    height: Platform.OS === 'web' && windowWidth >= 600 ?30:45,
    color: '#989898',
    width: 250,
    fontFamily:'SolaimanLipi'
  },
  inputs: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 5,
    borderRadius: 2,
    fontSize: 13,
    backgroundColor: '#fff',
    width: 250,
    fontFamily:'SolaimanLipi'
  },
  inputsm: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 5,
    borderRadius: 2,
    fontSize: 12,
    backgroundColor: '#fff',
    fontFamily:'SolaimanLipi'
  },
  inputs1: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 5,
    borderRadius: 2,
    fontSize: 14,
    backgroundColor: '#fff',
    width: 115,
    fontFamily:'SolaimanLipi'
  },
  dateInput: {
    borderColor: '#fff',
    borderWidth: 1,
    padding: 5,
    borderRadius: 2,
    fontSize: 14,
    backgroundColor: '#fff',
    width: 213,
    fontFamily:'SolaimanLipi',
    zIndex:-1
  },
  FormGroup: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  MCart: { flexDirection: 'row', padding: 0 },
  borderStyles: {
    borderWidth: 1,
    borderColor: '#C1C0B9',
    // width: '100%',
  },
  Topview: {
    marginTop: 15,
    // marginBottom: 80,
    paddingHorizontal: 10,
  },
  buttonMobile: {
    marginTop: 15,
     marginBottom: 40,
    paddingHorizontal: 10,
  },
  pickerWrapper: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: 'transparent',
    width: 250,
  },
  picker: {
    height: Platform.OS === 'web' && windowWidth >= 600 ? 30:45,
    color: '#333',
    width: 250,
  },
  picker1: {
    height: Platform.OS === 'web' && windowWidth >= 600 ?30:45,
    color: '#333',
    width: 123,
  },

  message: {
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
  },

  succesMessage: {
    color: 'green',
    paddingTop: 10,
    fontWeight: 'bold'
  },

  errorMessage: {
    color: '#f00',
    paddingTop: 10,
    fontWeight: 'bold'
  },

  containerSearch: {
    flex: 1,
    flexDirection:
      Platform.OS === 'web' && windowWidth >= 600 ? 'row' : 'column',
    justifyContent: 'center',
    //paddingTop: .stConstantsatusBarHeight,
    //backgroundColor: '#708090',
    backgroundColor: 'transparent',
    alignItems: 'center',
    padding: 8,
    paddingVertical: 10,
    marginTop:Platform.OS === 'web' && windowWidth >= 600 ?0:30,
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
    fontSize: 26,
    color: '#000',
  },
  TopheaderDate: {
    textAlign: 'center',
    //fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },
  header: { height: 50, backgroundColor: '#537791' },
  texts: { textAlign: 'center', fontWeight: '100' },
  dataWrapper: { marginTop: -1, width: '99%' },
  row: { height: 40, backgroundColor: '#E7E6E1' },
});
