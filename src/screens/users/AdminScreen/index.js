import React, {useState,useEffect,Fragment} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
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
  
} from 'react-native';
import { BASE_URL } from '../../../components/BaseUrl';
import axios from 'axios';
import {Formik} from 'formik';
import * as yup from "yup";
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import sharedStyles from '../../../sharedStyles';
import LeftBar from '../../../shared/LeftBar';
import LeftBarItem from '../../../shared/LeftBarItem';
import {globalStyles} from '../../../styles/globalStyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import WavyHeader from '../../../shared/WavyHeader';
import WavyTopBar from '../../../shared/WavyTopBar';
import { DefaultThemeColors, DarkThemeColors,ThemeOne,ThemeTwo } from "../../../utils/constants/Colors";
//import SortableGridView from 'react-native-sortable-gridview';
import DateTimePickerModal from "react-native-modal-datetime-picker"; 
import moment from "moment";
import AppBtn from '../../../shared/appBtn';
import {
  DatePickerModal,
  DatePickerModalContent,
  TimePickerModal,
  DatePickerInput,
  // @ts-ignore TODO: try to fix expo to work with local library
} from 'react-native-paper-dates';
import ErrorText from "../../../shared/errorText";
const basicInfoSchema = yup.object({
  division_name: yup.string().required('Division is required'),
 
});
const windowWidth = Dimensions.get('window').width;
const Colors2 = ThemeOne;
export default function AdminScreen() {
  const navigation = useNavigation();
 

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [select_date, setselectdate] = useState(null);
  const [end_select_date, setendselectdate] = useState(null);
  const [user_id, setUserId] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearch, setIsSearch] = useState(false);


const [district_name, setDistrictName] = useState("");
const [lower_court_id, setLowerCourtId] = useState(null);
const [lower_court_name, setLowerCourtName] = useState("");
const [lower_court, setLowerCourt] = useState([]);
const [division, setdivision] = useState([]);
const [division_id, setdivisionId] = useState(null);
const [district_id, setDistrictId] = useState(null);
const [district, setDistrict] = useState([]);



const getLowerCourtdata = (data) => { _fetchLowerCourtData(data)
  // eslint-disable-next-line no-shadow
  .then(lower_court => {
     //console.log(lower_court);
     setLowerCourt(lower_court);
    //setalldistrict(district);
  })
  .catch(err => console.log(err)); 
}  


const updateDistrict = (handleChange, e) => {
  handleChange(e);
};


const updateLowerCourt = (handleChange, e) => {
  handleChange(e);
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

  useEffect(() => {
   

    // getUserId().then(UserId => {
    //   setUserId(UserId)
    //   // _fetchCourtData(UserId)
    //   //   .then(court => {
    //   //     setCourt(court);
    //   //   })
    //     .catch(err => console.log(err));
    // });

   

    _fetchdivisionData()
      .then(division => {
        setdivision(division);
      })
      .catch(err => console.log(err));

  }, []);


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

    const updateDivision = (handleChange, value) => {
      handleChange(value);
    };

    const handleCaseDiaryFromToDate = (values) => {
 
      setIsLoading(true);

        const caseData = {        
          
          StartDate: Platform.OS === 'web' ?(date !==null ? moment(date).format("DD-MM-YYYY") : ""):(select_date !==null ? moment(select_date).format("DD-MM-YYYY") : moment().format("DD-MM-YYYY")),
          EndDate: Platform.OS === 'web' ?(enddate !==null ? moment(enddate).format("DD-MM-YYYY") : ""):(end_select_date !==null ? moment(end_select_date).format("DD-MM-YYYY") : moment().format("DD-MM-YYYY")),
          DivissionId: division_id,
          geo_district_id: district_id,
          lower_court_id:lower_court_id,
          
        };
  
        const _fetchCaseInfoData =  (data) => {
          console.log(data);
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
            
              let response =   axios.post(url, formBody)
            
              .then((res) => res.data);
              // console.log(response);
              return response;
          } catch (error) {
            
          }
        };

       //console.log(caseData);
        //perform api call to update password
        _fetchCaseInfoData(caseData)
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


      //ComplainantAndDefender

      const ComplainantAndDefender = (values) => {
 
        setIsLoading(true);

        const caseData = {        
          
          StartDate: Platform.OS === 'web' ?(date !==null ? moment(date).format("DD-MM-YYYY") : ""):(select_date !==null ? moment(select_date).format("DD-MM-YYYY") : moment().format("DD-MM-YYYY")),
          EndDate: Platform.OS === 'web' ?(enddate !==null ? moment(enddate).format("DD-MM-YYYY") : ""):(end_select_date !==null ? moment(end_select_date).format("DD-MM-YYYY") : moment().format("DD-MM-YYYY")),
          DivissionId: division_id,
          
        };
  
    
          const ComplainantAndDefenderData =  (data) => {

            try {
                 let url = `${BASE_URL}/CauseListScrapNestedUpdate`;
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

          ComplainantAndDefenderData(caseData)
            .then((val) => {
              setIsLoading(false);
              alert(val.msg);  
            })
            .catch((err) => console.log(err));
          
        }; 

        //CaseTodayMatches

        const CaseTodayMatches = (values) => {
 
          setIsLoading(true);
      
          const caseData = {        
          
            StartDate: Platform.OS === 'web' ?(date !==null ? moment(date).format("DD-MM-YYYY") : ""):(select_date !==null ? moment(select_date).format("DD-MM-YYYY") : moment().format("DD-MM-YYYY")),
            EndDate: Platform.OS === 'web' ?(enddate !==null ? moment(enddate).format("DD-MM-YYYY") : ""):(end_select_date !==null ? moment(end_select_date).format("DD-MM-YYYY") : moment().format("DD-MM-YYYY")),
            DivissionId: division_id,
            
          };
    

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



  return (
    <View   style={Platform.OS === 'web' && windowWidth >= 600?globalStyles.mainContainerAdmin:globalStyles.mainContainerMobile}>
    <LeftBar>   
       <LeftBarItem  selectcolor='true' name = 'ড্যাসবোর্ড'  stack = 'Dashboard'   screen = 'DashboardScreen' />
      
   </LeftBar>
    
     <View style={ Platform.OS === 'web' && windowWidth >= 600?globalStyles.bodyContainer:globalStyles.bodyContainerMobile}>
     <WavyHeader customStyles={[styles.svgCurve,{ height:'100'}]} />
        <View style={styles.headerContainer}>
        <Text style={styles.headerTexth}>অ্যাডমিন</Text>
        </View>
         {/* <WavyTopBar customStyles={[styles.backgroundImage,{zIndex:-1}] }/> */}
         <Text style={{color:'white', textAlign:'center', fontWeight: 'bold',
    fontSize: 14,}}> </Text> 
         <Text style={{color:'white', textAlign:'center', fontWeight: 'bold',
    fontSize: 14,}}> Case Entry</Text> 
         <KeyboardAvoidingView
          style={styles.containerSearch}
          behavior="padding"
          enabled
        >
          <Formik
            enableReinitialize
             initialValues={{
              division_name:''
                 //search_date: '',
                //  caseNo:'',
                //  Year:'',
            //   district_id: '',
            //   court_type_id: '',
            //   court_id: '',
            }}
            validationSchema={basicInfoSchema}
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
              <View style={{flexDirection:'column'}}>
              {touched.division_name && errors.division_name ? (
                           <ErrorText>{errors.division_name}</ErrorText>
                         
                         // alert(errors.division_name)
                        ) : null}     
               <View style={styles.FormGroup}>
                      
              
                      <View style={styles.pickerWrapper}>
                     
                        <Picker
                          selectedValue={division_id ? division_id : 0}
                          style={{
                            ...styles.picker,
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
                          <Picker.Item label="বিভাগ নির্বাচন করুনঃ–" value=""  color='red' />

                          {division.map((item, index) => {
                            return (
                              <Picker.Item
                                label={item.division_name_bng.toString()}
                                value={item.geo_division_id.toString()}
                                key={index}
                              />
                            );
                          })}
                        </Picker>
                        
                      </View>
                    </View>
                  </View>
                <View style={styles.FormGroup}>
                  {/* <InputLevel>District Name</InputLevel> */}
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={district_id ? district_id : 0}
                      style={{
                        ...styles.picker,
                      }}
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
                    <Picker
                      selectedValue={lower_court_id ? lower_court_id : 0}
                      style={{
                        ...styles.picker2,
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
                    </Picker>
                    {touched.lower_court_name && errors.lower_court_name ? (
                        <ErrorText>{errors.lower_court_name}</ErrorText>
                      ) : null}
                    {/* </Popable> */}
                  </View>
                </View> 

                <View style={styles.FormGroup}>
                    
                   <>
                   <View style={{ flexDirection:'row', marginTop:Platform.OS === 'web' && windowWidth >= 600 ?15:2}}>
                   <TouchableOpacity  onPress={() => Platform.OS === 'web' ?setVisible(true):null}  style={styles.sectionStyle} >
                   <TextInput
                   style={styles.inputs1} 
                   value={ Platform.OS === 'web' ?(date !==null ? moment(date).format("DD-MM-YYYY") : ""):(select_date !==null ? moment(select_date).format("DD-MM-YYYY") : "")}
                   onChangeText={handleChange("search_date")}
                   onBlur={handleBlur("search_date")}
                   placeholder={"MM-DD-YYYY"}
                  // isEditing={isEditing}
                   onTouchStart={showDatePicker}
                 /><Image
                    source={{ uri:'https://bdjudgecourt.com/assets/calendar.png', }}
                    style={styles.imageStyle}
                  /></TouchableOpacity>
                  
                   <Text style={{color: Platform.OS === 'web' && windowWidth >= 600 ?Colors2.top3:Colors2.top3,
                   marginTop:15 ,marginRight:-5, marginLeft:-5,  fontWeight: 'bold',
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
                       minimumDate={new Date()}
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
                   value={ Platform.OS === 'web' ?(enddate !==null ? moment(enddate).format("DD-MM-YYYY") : ""):(end_select_date !==null ? moment(end_select_date).format("DD-MM-YYYY") : "")}
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
                   <Text style={{color:Platform.OS === 'web' && windowWidth >= 600 ?Colors2.top3:Colors2.top3,
                   marginTop:15, marginLeft:-10, marginRight:Platform.OS === 'web' && windowWidth >= 600 ?10:0,  fontWeight: 'bold',
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
                       minimumDate={new Date()}
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
                  <View style={styles.Topview}>
                    <AppBtn
                      title="Submit"
                      onPress={handleSubmit}
                      //disabled={isSubmitting ? true : false}
                    />
                  </View>
                {/* </TouchableOpacity> */}
              </>
            )}
          </Formik>
        </KeyboardAvoidingView>


          {/* Badi bibadi Updated */}

          <Text style={{color:'white', textAlign:'center', fontWeight: 'bold',
    fontSize: 14,}}> Complainant and Defender</Text> 

        <KeyboardAvoidingView
          style={styles.containerSearch}
          behavior="padding"
          enabled
        >
          <Formik
            enableReinitialize
             initialValues={{}}
            onSubmit={(values, actions) => {
              ComplainantAndDefender(values, actions);
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

               <Text style={{color:Platform.OS === 'web' && windowWidth >= 600 ?Colors2.top3:Colors2.top3,
                   marginTop:15, marginLeft:-10, marginRight:Platform.OS === 'web' && windowWidth >= 600 ?10:0,  fontWeight: 'bold',
    fontSize: 14,}}> Complainant and Defender</Text>                 
                {Platform.OS === 'web' && windowWidth >= 600 ?  <View style={ { height:70, borderRightWidth:4, borderRightColor:'#fff'}}></View> : null} 
               
                  <View style={styles.Topview}>
                    <AppBtn
                      title="Submit"
                      onPress={handleSubmit}
                    />
                  </View>
              </>
            )}
          </Formik>
        </KeyboardAvoidingView>

        {/* CaseTodayMatches */}
        <Text style={{color:'white', textAlign:'center', fontWeight: 'bold',
    fontSize: 14,}}> Case Today Matches</Text> 
        <KeyboardAvoidingView
          style={styles.containerSearch}
          behavior="padding"
          enabled
        >
          <Formik
            enableReinitialize
             initialValues={{}}
            onSubmit={(values, actions) => {
              CaseTodayMatches(values, actions);
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
              <Text style={{color:Platform.OS === 'web' && windowWidth >= 600 ?Colors2.top3:Colors2.top3,
                   marginTop:15, marginLeft:-10, marginRight:Platform.OS === 'web' && windowWidth >= 600 ?10:0,  fontWeight: 'bold',
    fontSize: 14,}}> Case Today Matches</Text>                  
                {Platform.OS === 'web' && windowWidth >= 600 ?  <View style={ { height:70, borderRightWidth:4, borderRightColor:'#fff'}}></View> : null} 
               
                  <View style={styles.Topview}>
                    <AppBtn
                      title="Submit"
                      onPress={handleSubmit}
                    />
                  </View>
              </>
            )}
          </Formik>
        </KeyboardAvoidingView>


        { isLoading ? <ActivityIndicator size="large"/> : null }
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  svgCurve: {
    position: 'absolute',
    width: Dimensions.get('window').width,
   // bottom:0
  },
  headerContainer: {
    marginTop: 15,
    marginHorizontal: 10
  },
  headerTexth: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors2.top8,
    textAlign: 'center',
   // marginTop: 40
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  item: {
    alignItems:'center',
    borderRadius: 4,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    // width: 200,
    // height:200,
    // flexDirection: 'row',
    // flexWrap: 'wrap',
  },
  backgroundImage: {
    flex: 1,
    //width: '100%',
    // height: responsiveHeight(100),
    //height: 120,
    position: 'absolute',
    width: Dimensions.get('window').width,
    bottom: 0,
    zIndex: -3,
  },
  text: {
    fontSize: 20,
    color: '#09f',
    textAlign: 'center'
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
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
  inputs: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 2,
    fontSize: 13,
    backgroundColor: '#fff',
  },

//new css
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
  marginTop: 2,
  // marginBottom: 80,
  paddingHorizontal: 10,
},
pickerWrapper: {
  borderColor: '#ccc',
  borderWidth: 1,
  borderRadius: 4,
  backgroundColor: 'transparent',
  marginTop:20,
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
inputs1: {
  borderColor: '#ccc',
  borderWidth: 1,
  padding: Platform.OS === 'web' && windowWidth >= 600 ?12:0,
  paddingLeft:Platform.OS === 'web' && windowWidth >= 600 ?0:12,
  borderRadius: 2,
  width: Platform.OS === 'web' && windowWidth >= 600 ?110:150,
  fontSize: 14,
  height: Platform.OS === 'web' && windowWidth >= 600 ?25:25,
  backgroundColor: '#fff',
 // color:'#000'
},
picker2: {
 
  height: Platform.OS === 'web' && windowWidth >= 600 ?30:45,
  color: '#333',
  width: 250,
},

picker: {
 
  height: Platform.OS === 'web' && windowWidth >= 600 ?30:45,
  color: '#333',
  width: 150,
},

});
