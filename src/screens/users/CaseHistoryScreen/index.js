import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import {Formik} from 'formik';
import { DataTable } from 'react-native-paper';
import {globalStyles} from '../../../styles/globalStyles';
import moment from "moment";
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
import { confirmAlert } from 'react-confirm-alert'; // Import
//import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
//import '../../../../node_modules/react-confirm-alert/src/react-confirm-alert.css';
//import { FancyAlert } from 'react-native-expo-fancy-alerts';

//import sharedStyles from '../../../sharedStyles';
const windowWidth = Dimensions.get('window').width;
const tableWidth = windowWidth-500;
export default function CaseHistoryScreen({route, navigation}) {
  //function DetailsScreen({ route, navigation }) {


  const { division_id, geo_district_id, caseType, case_number, case_year, items, lowerCourtName, districtNameBng } = route.params;

  //console.log(case_number);
//alert('get'+caseType );
  const [refreshing] = useState(true);
  const [endLoader, setEndLoader] = useState(1);
  const onEndReached = () => {
    //console.log('end reached');
    setEndLoader(0);
  };
  
  const [caseInfo, setCaseInfo] = useState([]);
  const [user_id, setUserId] = useState([]);
  const [case_type, setcaseType] = useState([]);
 // const [case_type_id, setcaseTypetId] = useState(null);
  const [caseNo, setcaseNo] = useState(null);
  const [Year, setYear] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
    
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
    getCaseHistory()
    .then(getCaseInfo=> {
      setCaseInfo(getCaseInfo);
      
    console.log(getCaseInfo);
      setIsLoading(false);
      setIsSearch(false);
    })
    .catch(err => console.log(err));
    getUserId().then(UserId => { 
      setUserId(UserId)
    })
    .catch(err => console.log(err));

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

  const getCaseHistory = async () => {
    try {
    var dataToSend = {
      division_id: division_id,
      geo_district_id: geo_district_id,
      case_type_id: caseType,
      case_number: case_number,
      case_year: case_year,
      };
    let formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    console.log(formBody)
      setIsLoading(true);
      setIsSearch(true);
      let url = `${BASE_URL}/GetCaseInfoHistoryWithPaging`;
      let response = await axios.post(url, formBody).then(res => res.data);  
      //console.log(response);
      return response;
    } catch (err) {
      console.log('Error', err);
    }
  };

  /*
  const getCaseHistorys = async () => {
    try {
      setIsLoading(true);
      setIsSearch(true);
      const users = await axios.get(`${BASE_URL}/lands`);
      setLands(users.data.data);
      setIsLoading(false);
      setIsSearch(false);
    } catch (err) {
      console.log(err);
      // alert("Something went wrong")
    }
  };
*/
/*
  useEffect(() => {
    _fetchCaseTypeData()
    .then(caseType => {
      setcaseType(caseType);
    })
    .catch(err => console.log(err));
    //async fetch user data
      getUserId().then(UserId => { 
        setUserId(UserId)
      })
      .catch(err => console.log(err));
  }, []);

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
        case_type_id: case_type_id,
        case_number: caseNo,
        case_year: Year,
      };

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
    <View  style={Platform.OS === 'web' && windowWidth >= 600?globalStyles.mainContainer:globalStyles.mainContainerMobile}>
    <LeftBar>   
        <LeftBarItem selectcolor='true' name = 'Home'  stack = 'MyCase'   screen = 'MyCaseScreen' />
    </LeftBar>
    
     <View  style={ Platform.OS === 'web' && windowWidth >= 600?globalStyles.bodyContainer:globalStyles.bodyContainerMobile}>
    <ScrollView style={{flexGrow: 1}} nestedScrollEnabled={true}>

    <Text style={styles.Topheader}>
        {lowerCourtName} , {districtNameBng}
    </Text>
       { 
          caseInfo.length > 0 && !isLoading ? (
            <TouchableOpacity style={styles.topBody} >
                <Text style={styles.Topheader}>
                মামলার নম্বর:&nbsp; 
                  <Text style={styles.headText}>{caseInfo[0].type_name} - {engToBdNum(case_number.toString()) + '/' + engToBdNum(case_year.toString())} {caseInfo[0].upazila_name_bng}</Text>
                </Text>
                <Text style={styles.Topheader}>
                বাদী:&nbsp; 
                  <Text style={styles.headText}>{caseInfo[0].complainant}</Text>
                </Text>
                <Text style={styles.Topheader}>
                মোবাইল নম্বর:&nbsp; 
                  <Text style={styles.headText}>{caseInfo[0].complainant_mobile_no?engToBdNum(caseInfo[0].complainant_mobile_no?.toString()):null}</Text>
                </Text>
                <Text style={styles.Topheader}>
                বিবাদী:&nbsp; 
                  <Text style={styles.headText}>{caseInfo[0].defender}</Text>
                </Text>
                <Text style={styles.Topheader}>
                মোবাইল নম্বর:&nbsp; 
                  <Text style={styles.headText}>{caseInfo[0].defender_mobile_no?engToBdNum(caseInfo[0].defender_mobile_no?.toString()):null}</Text>
                </Text>
                <Text style={styles.Topheader}>
                দায়েরের তারিখ:&nbsp; 
                  <Text style={styles.headText}>{caseInfo[0].case_date?engToBdNum(caseInfo[0].case_date?.toString()):null}</Text>
                </Text>
            </TouchableOpacity>
            ) 
          : 
          null
       }

        { 
          caseInfo.length == 0 && !isLoading ? (
            <Text style={styles.Topheader}>
             কোন মামলা পাওয়া যায়নি
            </Text>
            ) 
          : 
          null
       }

      { isLoading ? <ActivityIndicator size="large"/> : null }
    
      { caseInfo.length > 0 && 
            Platform.OS === 'web'
            ? 
            <View style={styles.webView}>

              <table>
                <thead style={styles.head}>
                <tr>
                    <th>ক্রমিক নং</th>
                    <th>শুনানির তারিখ</th>
                    <th>কার্যক্রম</th>
                    {/* <th>মামলার নম্বর</th>
                    <th>পরবর্তী তারিখ</th> */}
                    <th>সংক্ষিপ্ত আদেশ</th>
                    <th>মামলার অবস্থা</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                    {
                      caseInfo.map((item, index) => (
                            <tr key={item.serial_no}>
                                <td style={styles.headText}>{engToBdNum((index+1).toString())}</td>
                                <td style={styles.headText}>{item.case_list_date=="01-01-1970"? "":(item.case_list_date?engToBdNum(item.case_list_date.toString()):null)}</td>
                                {/* <td style={styles.headText}>{item.type_name + ' - ' + item.case_number + '/' + item.case_year+' '+item.upazila_name_bng}</td> */}
                                <td style={styles.headText}>{item.activities}</td>
                                <td style={styles.headText}>{item.result}</td>
                                <td style={styles.headText}>{item.status==1?"চলমান":""}</td>
                                <td style={styles.headText}>
                                    <View style={styles.buttonStyleContainer}>
                                        <Pressable style={styles.buttons} onPress={() => {
                                              /* 1. Navigate to the Details route with params */
                                              // navigation.navigate('CaseHistoryScreen', {
                                              //   caseType: case_type_id,
                                              //   case_number: item.case_number,
                                              //   case_year: item.case_year,
                                              // });
                                              confirmAlert({
                                                title: 'মামলা যোগ করার জন্য নিশ্চিত করুন',
                                                message: 'আপনি এই কাজ করতে নিশ্চিত "এটা কি আপনার মামলা ??".',
                                                buttons: [
                                                  {
                                                    label: 'হ্যাঁ',
                                                    onClick: () =>    handleCaseCreate(items)
                                                  },
                                                  {
                                                    label: 'না',
                                                    //onClick: () => alert('Click No')
                                                  }
                                                ]
                                              });

                                            }}>
                                          <Text style={styles.texts}>মামলা যোগকরি</Text>
                                        </Pressable>
                                    </View>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>



              {/* <DataTable>
                <DataTable.Header style={styles.head}>
                    <DataTable.Title numeric style={styles.headText}>ক্রমিক নং</DataTable.Title>
                    <DataTable.Title style={styles.headText}>মামলার নম্বর</DataTable.Title>
                    <DataTable.Title style={styles.headText}>কার্যক্রম</DataTable.Title>
                    <DataTable.Title style={styles.headText}>পরবর্তী তারিখ</DataTable.Title>
                    <DataTable.Title style={styles.headText}>সংক্ষিপ্ত আদেশ</DataTable.Title>
                    <DataTable.Title style={styles.headText}>হিস্ট্রি</DataTable.Title>
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
                                <DataTable.Cell numeric style={styles.rowText}>1</DataTable.Cell>
                                <DataTable.Cell style={styles.rowText}>{item.type_name + ' - ' + item.case_number + '/' + item.case_year}</DataTable.Cell>
                                <DataTable.Cell style={styles.rowText}>{item.activities} </DataTable.Cell>
                                <DataTable.Cell style={styles.rowText}>{item.next_date=="01-01-1970"?"":item.next_date} </DataTable.Cell>
                                <DataTable.Cell style={styles.rowText}>{item.result} </DataTable.Cell>
                                <DataTable.Cell style={styles.rowText}>
                                  <Button
                                    title="হিস্ট্রি"
                                    onPress={() => {
                                      navigation.navigate('CaseHistoryScreen',{name:'Case History'});
                                    }}
                                  />
                                </DataTable.Cell>
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

            </View>
        : null }

            { caseInfo.length > 0 &&
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
                                1
                              </Text>
                            </View>
                            <View style={styles.MCart}>
                              <Text style={styles.textTile}>শুনানির তারিখ</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>
                                {item.case_list_date=="01-01-1970"?"":(item.case_list_date?engToBdNum(item.case_list_date.toString()):null)}
                              </Text>
                            </View>
                            {/* <View style={styles.MCart}>
                              <Text style={styles.textTile}>মামলার নম্বর</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>
                              {item.type_name + ' - ' + item.case_number + '/' + item.case_year+' '+item.upazila_name_bng}
                              </Text>
                            </View> */}

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
                              <Text style={styles.textTile}>মামলার অবস্থা</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>
                                {item.status==1?"চলমান":""}
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
                                                    caseType: case_type_id,
                                                    case_number: item.case_number,
                                                    case_year: item.case_year,
                                                  });
                                                }}>
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
  </View>
</View>
  );
}

const styles = StyleSheet.create({

  topBody: {
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
  height: 36, 
  backgroundColor: 'khaki', 
  borderTopLeftRadius:5,
  borderTopRightRadius:5,
  fontSize: 13, 
  fontWeight: 'bold', 
},

headText: { 
  fontSize: 13, 
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
    fontSize: 18,
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
