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
  Pressable,
  Animated,
  LogBox 
} from 'react-native';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import {BASE_URL} from '../../../components/BaseUrl';
//import ScreenBackground from '../../../components/ScreenBackground';
import AppBtn from '../../../shared/appBtn';

import InputLevel from '../../../shared/inputLevel';
import LeftBar from '../../../shared/LeftBar';
import LeftBarItem from '../../../shared/LeftBarItem';

import DateTimePickerModal from "react-native-modal-datetime-picker"; 
import moment from "moment";

import {
  DatePickerModal,
  DatePickerModalContent,
  TimePickerModal,
  DatePickerInput,
  // @ts-ignore TODO: try to fix expo to work with local library
} from 'react-native-paper-dates'


//import sharedStyles from '../../../sharedStyles';
const windowWidth = Dimensions.get('window').width;
const tableWidth = windowWidth-500;

export default function CaseScreen() {
  
  const [refreshing] = useState(true);
  const [endLoader, setEndLoader] = useState(1);
  const onEndReached = () => {
    //console.log('end reached');
    setEndLoader(0);
  };
  const [tableData] = useState([]);
  const [courtType, setcourtType] = useState([]);
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
  const [case_type_id, setcaseTypetId] = useState(null);
  const [caseNo, setcaseNo] = useState(null);
  const [Year, setYear] = useState(null);
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
      let url = `${BASE_URL}/GetCourtName?user_id=`+user_id;
      let response = await axios.get(url).then(res => res.data);

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  };

  const _fetchLowerCourtData = async (data) => {
    try {let dataToSend = {
      id: data,
      };
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
      let url = `${BASE_URL}/CourtNameToLowerCourt`;
      let response = await axios.post(url, formBody).then(res => res.data);

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  };

  /*
  const _fetchCaseInfoData = async (values, actions) => {
    try {let dataToSend = {
      //user_id: 22,
      user_id: user_id,
      court_id: court_id,
      lower_court_id: lower_court_id,
      case_type_id: case_type_id,
      case_number: caseNo,
      case_year: Year,
      end_date: Platform.OS === 'web' ? enddate !==null ? moment(enddate).format("YYYY-MM-DD") : "" : end_select_date !==null ? moment(end_select_date).format("YYYY-MM-DD") : "",
      search_date: Platform.OS === 'web' ? date !==null ? moment(date).format("YYYY-MM-DD") : "" : select_date !==null ? moment(select_date).format("YYYY-MM-DD") : "",
      };

      console.log(dataToSend);
      
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }

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
  */

  useEffect(() => {
    _fetchcourtTypeData()
    // eslint-disable-next-line no-shadow
    .then(courtType => {
      // console.log(courtType);
      setcourtType(courtType);
    })
    .catch(err => console.log(err));
    //async fetch user data
    getUserId().then(UserId => { 
      setUserId(UserId)
      _fetchCourtData(UserId)
      .then(court => {
        setCourt(court);
      })
      .catch(err => console.log(err));
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

const getLowerCourtdata = (data) => { _fetchLowerCourtData(data)
  // eslint-disable-next-line no-shadow
  .then(lower_court => {
     console.log(lower_court);
     setLowerCourt(lower_court);
    //setalldistrict(district);
  })
  .catch(err => console.log(err)); 
}  

const handleCaselistUpdate = (values, actions) => {

  //Show Loader
  setIsLoading(true);
  setIsSearch(false);

      const {     
        caseNo,
        Year,
      } = values;

    const searchData = {
      user_id: user_id,
      court_id: court_id,
      lower_court_id: lower_court_id,
      case_type_id: case_type_id,
      case_number: caseNo,
      case_year: Year,
      end_date: Platform.OS === 'web' ? enddate !==null ? moment(enddate).format("YYYY-MM-DD") : "" : end_select_date !==null ? moment(end_select_date).format("YYYY-MM-DD") : "",
      search_date: Platform.OS === 'web' ? date !==null ? moment(date).format("YYYY-MM-DD") : "" : select_date !==null ? moment(select_date).format("YYYY-MM-DD") : "",
    };

    //console.log(searchData)

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
      let url = `${BASE_URL}/GetCasesWithPagination`;
      let response = await axios.post(url, formBody).then(res => res.data);
      //console.log(response);
      return response;
    } catch (err) {
      console.log('Error', err);
    }
  };

  return (
    <View    style={Platform.OS === 'web' && windowWidth >= 600?globalStyles.mainContainer:globalStyles.mainContainerMobile}>
    <LeftBar>   
        {/* <LeftBarItem    selectcolor='true' name = 'Home'  stack = 'Case'   screen = 'CaseScreen' /> */}
        <LeftBarItem    selectcolor='false'  name = 'নতুন মামলা যোগ'  stack = 'Case'   screen = 'CaseEntry' />        
        {/* <LeftBarItem    selectcolor='false' name = 'আমার ডায়েরী'  stack = 'Case'   screen = 'CaseDiaryScreen' />     */}
        <LeftBarItem    selectcolor='false'  name = 'সকল মামলা'  stack = 'Case'   screen = 'TotalCaseScreen' />
    </LeftBar>
    
    <View  style={ Platform.OS === 'web'&& windowWidth >= 600?globalStyles.bodyContainer:globalStyles.bodyContainerMobile}>
    <ScrollView style={{flexGrow: 1}} nestedScrollEnabled={true}>
      <ImageBackground
        source={require('../../../../assets/liquid-cheese.svg')}
        style={styles.backgroundImage}
      >
        <KeyboardAvoidingView
          style={styles.containerSearch}
          behavior="padding"
          enabled
        >
          <Formik
            enableReinitialize
             initialValues={{
                 search_date: '',
                 caseNo:'',
                 Year:'',
            //   district_id: '',
            //   court_type_id: '',
            //   court_id: '',
            }}
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
                  <InputLevel>Court Name :</InputLevel>

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
                      <Picker.Item label="Choose Court" value="0" />
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
                </View>

                <View style={styles.FormGroup}>
                  <InputLevel>Lower Court :</InputLevel>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={lower_court_id ? lower_court_id : 0}
                      style={{
                        ...styles.picker,
                      }}
                      onValueChange={(itemValue, itemIndex) => {
                        setLowerCourtId(itemValue);
                      }}
                      mode="dropdown"
                    >
                      <Picker.Item label="Choose Lower Court" value="0" />

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
                  </View>
                </View>
                <View style={styles.FormGroup}>
                  <InputLevel>Case Type</InputLevel>

                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={case_type_id ? case_type_id : 0}
                      style={{
                        ...styles.picker,
                      }}
                      //  onValueChange={(itemValue, itemIndex) => setcountry_id(itemValue)}
                      onValueChange={(itemValue, itemIndex) => {
                        //setcourTypetId(itemValue);
                        setcaseTypetId(itemValue);
                        //filterEvenResults(itemValue);
                        //filterdistrictBycountry(itemValue);
                      }}
                      mode="dropdown"
                    >
                      <Picker.Item label="Choose Case Type" value="0" />

                      {courtType.map((item, index) => {
                        return (
                          <Picker.Item
                            label={item.type_name}
                            value={item.id}
                            key={index}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                </View>
                {/* <View style={styles.FormGroup}>
                    <InputLevel> Case No :</InputLevel>
                  
                    <TextInput
                   style={styles.inputs1} 
                      value={values.caseNo}
                      onChangeText={handleChange("caseNo")}
                      onBlur={handleBlur("caseNo")}
                      placeholder={"Case No"}
                     
                    />
                    {touched.caseNo && errors.caseNo ? (
                      <ErrorText>{errors.caseNo}</ErrorText>
                    ) : null}
                  </View> 
                  <View style={styles.FormGroup}>
                    <InputLevel> Year:</InputLevel>
                  
                    <TextInput
                   style={styles.inputs1} 
                      value={values.year}
                      onChangeText={handleChange("year")}
                      onBlur={handleBlur("year")}
                      placeholder={"Year"}
                     
                    />
                    {touched.year && errors.year ? (
                      <ErrorText>{errors.year}</ErrorText>
                    ) : null}
                  </View>  */}

                  <View style={styles.FormGroup}>
                    <InputLevel> Case No. :</InputLevel>
                  
                    <TextInput
                   style={styles.inputs1} 
                      value={values.caseNo}
                      onChangeText={handleChange("caseNo")}
                      onBlur={handleBlur("caseNo")}
                      placeholder={"Case No."}
                     
                    />
                    {touched.caseNo && errors.caseNo ? (
                      <ErrorText>{errors.caseNo}</ErrorText>
                    ) : null}
                  </View> 
                  <View style={styles.FormGroup}>
                    <InputLevel> Case Year :</InputLevel>
                  
                    <TextInput
                   style={styles.inputs1} 
                      value={values.Year}
                      onChangeText={handleChange("Year")}
                      onBlur={handleBlur("Year")}
                      placeholder={"Year"}
                     
                    />
                    {touched.Year && errors.Year ? (
                      <ErrorText>{errors.Year}</ErrorText>
                    ) : null}
                  </View> 
                
                
                <View style={styles.FormGroup}>
                    <InputLevel> Start Date :</InputLevel>
                   <>
                   <TextInput
                   style={styles.inputs1} 
                   value={ Platform.OS === 'web' ?(date !==null ? moment(date).format("DD-MM-YYYY") : ""):(select_date !==null ? moment(select_date).format("DD-MM-YYYY") : "")}
                   onChangeText={handleChange("search_date")}
                   onBlur={handleBlur("search_date")}
                   placeholder={"MM-DD-YYYY"}
                  // isEditing={isEditing}
                   onTouchStart={showDatePicker}
                 />
                  
                { Platform.OS === 'web' ? (
                  <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
        
                    <Button onPress={() => setVisible(true)} uppercase={false} mode="outlined">  Pick time </Button>

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
                    <InputLevel> End Date :</InputLevel>
                   <>
                   <TextInput
                   style={styles.inputs1} 
                   value={ Platform.OS === 'web' ?(enddate !==null ? moment(enddate).format("DD-MM-YYYY") : ""):(end_select_date !==null ? moment(end_select_date).format("DD-MM-YYYY") : "")}
                   onChangeText={handleChange("end_date")}
                   onBlur={handleBlur("end_date")}
                   placeholder={"MM-DD-YYYY"}
                  // isEditing={isEditing}
                   onTouchStart={showEndDatePicker}
                 />
                  
                { Platform.OS === 'web' ? (
                  <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
        
                    <Button onPress={() => setEndVisible(true)} uppercase={false} mode="outlined">  Pick time </Button>

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
                       isVisible={isEndDatePickerVisible}
                       mode="date"
                      // date={ values?.application_deadline? moment(values?.application_deadline).format("DD-MM-YYYY") : ""}
                       onConfirm={handleConfirm}
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

                <TouchableOpacity
                  onPress={() => {
                    handleSubmit;
                    // eslint-disable-next-line no-undef
                    Keyboard.dismiss();
                  }}
                >
                  <View style={styles.Topview}>
                    <AppBtn
                      title="Search"
                      onPress={handleSubmit}
                      //disabled={isSubmitting ? true : false}
                    />
                  </View>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </KeyboardAvoidingView>
      </ImageBackground>
      {/* <Text style={styles.Topheader}>
        District and Sessions Judge Court, Barisal, বরিশাল
      </Text>
      <Text style={styles.Topheader}>দৈনিক কার্যতালিকা</Text>
      <Text style={styles.TopheaderDate}>Date: { Platform.OS === 'web' ?(date !==null ? moment(date).format("DD-MM-YYYY") : ""):(select_date !==null ? moment(select_date).format("DD-MM-YYYY") : "")}</Text>
           */}


      
         
            <Text style={styles.Topheader}>
              District and Sessions Judge Court,  {caseInfo[0]?.division_name_bng},  {caseInfo[0]?.district_name_bng}
            </Text>
          
         
      

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

      { Platform.OS === 'web'
            ? <View style={styles.webView}>

              {/* <DataTable>
                <DataTable.Header style={styles.head}>
                    <DataTable.Title numeric style={styles.headText}>ক্রমিক নং</DataTable.Title>
                    <DataTable.Title style={styles.headText}>মামলার নম্বর</DataTable.Title>
                    <DataTable.Title style={styles.headText}>কার্যক্রম</DataTable.Title>
                    <DataTable.Title style={styles.headText}>পরবর্তী তারিখ</DataTable.Title>
                    <DataTable.Title style={styles.headText}>সংক্ষিপ্ত আদেশ</DataTable.Title>
                </DataTable.Header>

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
                                <DataTable.Cell numeric style={styles.rowText}>{item.serial_no}</DataTable.Cell>
                                <DataTable.Cell style={styles.rowText}>{item.type_name + ' - ' + item.case_number + '/' + item.case_year}</DataTable.Cell>
                                <DataTable.Cell style={styles.rowText}>{item.activities} </DataTable.Cell>
                                <DataTable.Cell style={styles.rowText}>{item.next_date} </DataTable.Cell>
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
            </DataTable> */}


            {/* <table>
                <thead style={styles.head}>
                <tr>
                    <th>SL.</th>
                    <th>Division</th>
                    <th>District</th>
                    <th>Case & No.</th>
                    <th>Name Of Parties</th>
                    <th>On Behalf Of</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
                </thead>
          <tbody>
                    {caseInfo.length > 0 ? (
                      caseInfo.map((item) => (
                            <tr key={item.case_id}>
                                <td style={styles.headText}>1</td>
                                <td style={styles.headText}>{item.division_name_bng}</td>
                                <td style={styles.headText}>{item.district_name_bng}</td>
                                <td style={styles.headText}>{item.type_name + ' - ' + item.case_number + '/' + item.case_year}</td>
                                <td style={styles.headText}>{item.parties_one+" -VS.- "+item.parties_two}</td>
                                <td style={styles.headText}>{item.parties_behalf_of}</td>
                                <td style={styles.headText}>{item.status==1?"Pending":"Dismis"}</td>
                                <td style={styles.headText}>
                                    <View style={styles.buttonStyleContainer}>
                                        <Pressable style={styles.buttons} 

                                        // onPress={() => {
                                        //     navigation.navigate('CaseHistoryScreen', {
                                        //       caseType: case_type_id,
                                        //       case_number: item.case_number,
                                        //       case_year: item.case_year,
                                        //     });
                                        //   }}

                                          >
                                          <Text style={styles.texts}>View</Text>
                                        </Pressable>
                                        <Pressable style={styles.buttons} 
                                        
                                        // onPress={() => {
                                        //       navigation.navigate('CaseHistoryScreen', {
                                        //         caseType: case_type_id,
                                        //         case_number: item.case_number,
                                        //         case_year: item.case_year,
                                        //       });
                                        //     }}
                                            
                                            >
                                          <Text style={styles.texts}>Update Diary</Text>
                                        </Pressable>
                                    </View>
                                  </td>
                            </tr>
                        ))
                    ):null
                    }
                </tbody>
            </table> */}



            </View>
            : <View style={{...styles.mobileView, width: windowWidth - 16}}>
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
                              {item.type_name + ' - ' + item.case_number + '/' + item.case_year}
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
                                {item.next_date} 
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
          
      }
    </ScrollView>
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
},

head: { 
  height: 44, 
  backgroundColor: 'khaki', 
  borderTopLeftRadius:5,
  borderTopRightRadius:5,
},

headText: { 
  fontSize: 26, 
  fontWeight: 'bold', 
  textAlign: 'center', 
  color: 'white', 
  justifyContent:'center',
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
  inputs1: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 2,
    width: 80,
    fontSize: 13,
    backgroundColor: '#fff',
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
    marginTop: 20,
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
    width: 150,
  },
  picker2: {
    height: 45,
    color: '#333',
    width: 80,
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
    padding: 8,
    paddingVertical: 30,
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
    width: '100%',
    height: 'auto',
    //height: 120,
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