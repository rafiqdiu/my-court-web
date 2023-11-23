import {Picker} from '@react-native-picker/picker';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import {Formik} from 'formik';
// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import {responsiveWidth} from 'react-native-responsive-dimensions';
//import {Row, Table} from 'react-native-table-component';
import {BASE_URL} from '../../../components/BaseUrl';
//import ScreenBackground from '../../../components/ScreenBackground';
import AppBtn from '../../../shared/appBtn';
import LeftBar from '../../../shared/LeftBar';
import LeftBarItem from '../../../shared/LeftBarItem';
import InputLevel from '../../../shared/inputLevel';


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

 /*
  const filterdistrictResults = court_id =>
  setLowerCourt(_district =>
      alldistrict.filter(dist => dist.court_id === court_id),
    );
  const filtercourtResults = court_id =>
    setCourt(_court =>
      allCourt.filter(dist => dist.lower_court_id === lower_court_id),
    );
*/

  const [court_id, setCourtId] = useState(null);
  const [lower_court_id, setLowerCourtId] = useState(null);


  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [select_date, setselectdate] = useState(null);
  
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

  const _fetchCourtData = async () => {
    try {
      let url = `${BASE_URL}/GetCourtName`;
      let response = await axios.get(url).then(res => res.data);

      return response;
      //if (response.country) return response.country;
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
      //if (response.country) return response.country;
    } catch (err) {
      console.log('Error', err);
    }
  };


  const _fetchCaseInfoData = async () => {
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

  useEffect(() => {
    //async fetch user data
    _fetchCourtData()
      // eslint-disable-next-line no-shadow
      .then(court => {
        //console.log(division);
        setCourt(court);
      })
      .catch(err => console.log(err));

  }, []);

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
    _fetchCaseInfoData()
    // eslint-disable-next-line no-shadow
    .then(court => {
      //console.log(country);
      setCourt(court);
     // setallCourt(court);
    })
    .catch(err => console.log(err));
  };

  return (
    <View   style={styles.mainContainer}>
    <LeftBar>   
       <LeftBarItem   name = 'Home'  stack = 'DailyCaseList'   screen = 'DailyCaseListScreen' />
      
   </LeftBar>
    
     <View  style={styles.bodyContainer}>
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
            // initialValues={{
            //   division_id: '',
            //   district_id: '',
            //   court_type_id: '',
            //   court_id: '',
            // }}
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
                    <InputLevel>Date :</InputLevel>
                   <>
                   <TextInput
                   style={styles.inputs} 
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
      <Text style={styles.Topheader}>
        District and Sessions Judge Court, Barisal , বরিশাল
      </Text>
      <Text style={styles.Topheader}>দৈনিক কার্যতালিকা</Text>
      <Text style={styles.TopheaderDate}>Date: 05-03-2023</Text>
      {
        Platform.OS === 'web' && windowWidth >= 600 ? (
          <View style={styles.container}>
            {/* <ScrollView horizontal={true}>
            <View>
              <Table borderStyle={styles.borderStyles}>
                <Row
                  data={[
                    'Sl',
                    'Case Information',
                    'Activities',
                    'Next date',
                    'Result',
                  ]}
                  widthArr={[70, 300, 300, 300, 300]}
                  style={styles.header}
                  textStyle={styles.texts}
                />
              </Table>
              <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={styles.borderStyles}>
                  {tableData.map((rowData, index) => (
                    <Row
                      key={index}
                      data={rowData}
                      widthArr={[70, 300, 300, 300, 300]}
                      style={[
                        styles.row,
                        index % 2 && {backgroundColor: '#F7F6E7'},
                      ]}
                      // textStyle={styles.texts}
                    />
                  ))}
                </Table>
              </ScrollView>
            </View>
          </ScrollView> */}
          </View>
        ) : null
        // <View style={styles.main_body}>
        //   <Text style={styles.TotalCaseFound}>
        //     Total Case Result Found: {tableData.length}
        //   </Text>
        //   <Text style={styles.asperSupremeCourt}>
        //     Case Result (As Per Supreme Court Website)
        //   </Text>

        //   <FlatList
        //     data={tableData}
        //     keyExtractor={(item, index) => index.toString()}
        //     showsVerticalScrollIndicator={false}
        //     bounces={false}
        //     numColumns={1}
        //     renderItem={({item, i}) => (
        //       <View key={item.key}>
        //         <TouchableOpacity
        //         // onPress={() => {
        //         //   setModalVisible(!isModalVisible);
        //         //   setModalEntry(item);
        //         // }}
        //         >
        //           <View style={styles.hddata}>
        //             <View style={styles.MCart}>
        //               <Text style={styles.textTile}>Sl</Text>
        //               <Text style={styles.textTilecln}>:</Text>
        //               <Text style={styles.textDescription}>
        //                 {/* {item.court_division_name} */}
        //               </Text>
        //             </View>

        //             <View style={styles.MCart}>
        //               <Text style={styles.textTile}>Case Information</Text>
        //               <Text style={styles.textTilecln}>:</Text>
        //               <Text style={styles.textDescription}>
        //                 {/* {item.order_date} */}
        //               </Text>
        //             </View>

        //             <View style={styles.MCart}>
        //               <Text style={styles.textTile}>Activities</Text>
        //               <Text style={styles.textTilecln}>:</Text>
        //               <Text style={styles.textDescription}>
        //                 {/* {item.court_name + ' ' + item.caseNoYear} */}
        //               </Text>
        //             </View>

        //             <View style={styles.MCart}>
        //               <Text style={styles.textTile}>Next date</Text>
        //               <Text style={styles.textTilecln}>:</Text>
        //               <Text style={styles.textDescription}>
        //                 {/* {item.upload_date} 8:00 pm */}
        //               </Text>
        //             </View>

        //             <View style={styles.MCart}>
        //               <Text style={styles.textTile}>Result</Text>
        //               <Text style={styles.textTilecln}>:</Text>
        //               <Text style={styles.textDescription}>
        //                 {/* {item.result} */}
        //               </Text>
        //             </View>

        //             {/* <View style={{flexDirection: 'row', padding: 0}}>
        //                 <Text style={styles.textTile}>Status</Text>
        //                 <Text style={styles.textTilecln}>:</Text>
        //                 <Text style={styles.textDescription}>
        //                 </Text>
        //               </View> */}
        //           </View>
        //         </TouchableOpacity>
        //       </View>
        //     )}
        //     removeClippedSubviews={true}
        //     initialNumToRender={30}
        //     maxToRenderPerBatch={20}
        //     onEndReachedThreshold={0.1}
        //     onEndReached={onEndReached}
        //     refreshing={refreshing}
        //     updateCellsBatchingPeriod={20}
        //     ListFooterComponent={() =>
        //       endLoader && tableData.length > 0 ? ListFooterComponent : null
        //     }
        //     windowSize={10}
        //   />
        // </View>
      }
    </ScrollView>
  </View>
  </View>
  );
}

const styles = StyleSheet.create({
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
    padding: 8,
    paddingVertical: 70,
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
    fontSize: 26,
    color: '#000',
  },
  TopheaderDate: {
    textAlign: 'center',
    //fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },
  header: {height: 50, backgroundColor: '#537791'},
  texts: {textAlign: 'center', fontWeight: '100'},
  dataWrapper: {marginTop: -1, width: '99%'},
  row: {height: 40, backgroundColor: '#E7E6E1'},
});
