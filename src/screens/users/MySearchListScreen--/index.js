import {Picker} from '@react-native-picker/picker';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import {Formik} from 'formik';
import {globalStyles} from '../../../styles/globalStyles';
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
  TouchableOpacity,
  View,
} from 'react-native';
import {responsiveWidth} from 'react-native-responsive-dimensions';
//import {Row, Table} from 'react-native-table-component';
import {BASE_URL} from '../../../components/BaseUrl';
//import ScreenBackground from '../../../components/ScreenBackground';
import AppBtn from '../../../shared/appBtn';

import InputLevel from '../../../shared/inputLevel';

//import sharedStyles from '../../../sharedStyles';
const windowWidth = Dimensions.get('window').width;
export default function MySearchListScreen({navigation}) {
 // let {width} = Dimensions.get('window');
 const CourtName = [
  {label: 'All Court', value: '1'},
  {label: 'District Court', value: '2'},
  {label: 'Taibunal Court', value: '3'},
  {label: 'Magistraite Court', value: '4'},
  {label: 'Others Court', value: '5'},
];

  const [refreshing] = useState(true);
  const [endLoader, setEndLoader] = useState(1);
  const onEndReached = () => {
    //console.log('end reached');
    setEndLoader(0);
  };
  const [tableData] = useState([]);
  const [division, setdivision] = useState([]);
  const [courtType, setcourtType] = useState([]);
  const [district, setDistrict] = useState([]);
  const [alldistrict, setalldistrict] = useState([]);
  const [court, setCourt] = useState([]);
  const [allcases, setAllCases] = useState([]);
  const [allCourt, setallCourt] = useState([]);
  const filterdistrictResults = division_id =>
    setDistrict(_district =>
      alldistrict.filter(dist => dist.division_id === division_id),
    );
  const filtercourtResults = district_id =>
    setCourt(_court =>
      allCourt.filter(dist => dist.geo_district_id === district_id),
    );
  const [division_id, setdivisionId] = useState(null);
  const [district_id, setDistrictId] = useState(null);
  
  const [court_division_id, setCourtdivisionId] = useState(null);
  const [court_id, setcourtId] = useState(null);
  const [court_type_id, setcourTypetId] = useState(null);


  const updateCourtName = (handleChange, value) => {
    handleChange(value);
  };


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
  const _fetchCourtData = async (data) => {
    try {let dataToSend = {
      geo_district_id: data,
      };
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
      let url = `${BASE_URL}/DistrictToCourtName`;
      let response = await axios.post(url, formBody).then(res => res.data);

      return response;
      //if (response.country) return response.country;
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
  const _fetchCaseInfoData = async () => {
    try {let dataToSend = {
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

    //console.log(formBody);

      let url = `${BASE_URL}/GetCaseDiaryInfo`;
      let response = await axios.post(url, formBody).then(res => res.data);

      return response;
      //if (response.country) return response.country;
    } catch (err) {
      console.log('Error', err);
    }
  };
  useEffect(() => {
    //async fetch user data
    _fetchcourtTypeData()
      // eslint-disable-next-line no-shadow
      .then(courtType => {
        // console.log(courtType);
        setcourtType(courtType);
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

  const renderItem = ({ item }) => (
    <View key={item.key}>
            <TouchableOpacity
            // onPress={() => {
            //   setModalVisible(!isModalVisible);
            //   setModalEntry(item);
            // }}
            >
              <View style={styles.hddata}>
                <View style={styles.MCart}>
                  <Text style={styles.textTile}>Sl</Text>
                  <Text style={styles.textTilecln}>:</Text>
                  <Text style={styles.textDescription}>
                    {/* {item.court_division_name} */}
                  </Text>
                </View>

                <View style={styles.MCart}>
                  <Text style={styles.textTile}>Case Information</Text>
                  <Text style={styles.textTilecln}>:</Text>
                  <Text style={styles.textDescription}>
                    {/* {item.order_date} */}
                  </Text>
                </View>

                <View style={styles.MCart}>
                  <Text style={styles.textTile}>Activities</Text>
                  <Text style={styles.textTilecln}>:</Text>
                  <Text style={styles.textDescription}>
                    {/* {item.court_name + ' ' + item.caseNoYear} */}
                  </Text>
                </View>

                <View style={styles.MCart}>
                  <Text style={styles.textTile}>Next date</Text>
                  <Text style={styles.textTilecln}>:</Text>
                  <Text style={styles.textDescription}>
                    {/* {item.upload_date} 8:00 pm */}
                  </Text>
                </View>

                <View style={styles.MCart}>
                  <Text style={styles.textTile}>Result</Text>
                  <Text style={styles.textTilecln}>:</Text>
                  <Text style={styles.textDescription}>
                    {/* {item.result} */}
                  </Text>
                </View>

                {/* <View style={{flexDirection: 'row', padding: 0}}>
                    <Text style={styles.textTile}>Status</Text>
                    <Text style={styles.textTilecln}>:</Text>
                    <Text style={styles.textDescription}>
                    </Text>
                  </View> */}
              </View>
            </TouchableOpacity>
          </View>
  );

  const handleLoadMore = () => {
    //fetchData();
  };

  const data = [
    {
      id:1,
      name: 'Apple',
      category: 'Fruit',
      price: '$2.00',
      quantity: '100gr',
     
    },
    {
      id:2,
      name: 'Banana',
      category: 'Fruit',
      price: '$3.00',
      quantity: '100gr',
     
    },
    {
      id:3,
      name: 'Spinach',
      category: 'Vegetable',
      price: '$1.00',
      quantity: '100gr',
      
    },
  
    {
      id:4,
      name: 'Tomato',
      category: 'Vegetable',
      price: '$2.00',
      quantity: '100gr',
     
    },
    {
      id:5,
      name: 'Beef',
      category: 'Meat',
      price: '$40.00',
      quantity: '1 kg',
    
    },
    {
      id:6,
      name: 'Apple',
      category: 'Fruit',
      price: '$2.00',
      quantity: '100gr',
     
    },
    {
      id:7,
      name: 'Banana',
      category: 'Fruit',
      price: '$3.00',
      quantity: '100gr',
     
    },
    {
      id:8,
      name: 'Spinach',
      category: 'Vegetable',
      price: '$1.00',
      quantity: '100gr',
     
    },
  
    {
      id:9,
      name: 'Tomato',
      category: 'Vegetable',
      price: '$2.00',
      quantity: '100gr',
     
    },
    {
      id:10,
      name: 'Beef',
      category: 'Meat',
      price: '$40.00',
      quantity: '1 kg',
      
    },
    {
      id:11,
      name: 'Apple',
      category: 'Fruit',
      price: '$2.00',
      quantity: '100gr',
     
    },
    {
      id:12,
      name: 'Banana',
      category: 'Fruit',
      price: '$3.00',
      quantity: '100gr',
     
    },
    {
      id:13,
      name: 'Spinach',
      category: 'Vegetable',
      price: '$1.00',
      quantity: '100gr',
     
    },
  
    {
      id:14,
      name: 'Tomato',
      category: 'Vegetable',
      price: '$2.00',
      quantity: '100gr',
     
    },
    {
      id:15,
      name: 'Beef',
      category: 'Meat',
      price: '$40.00',
      quantity: '1 kg',
      
    },
  ];

  return (
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
              handleCaselistSearch(values, actions);
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
                  <InputLevel>Division Name</InputLevel>

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
                      }}
                      mode="dropdown"
                    >
                      <Picker.Item label="Choose Division" value="0" />

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
                  </View>
                </View>
                <View style={styles.FormGroup}>
                  <InputLevel>District Name</InputLevel>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={district_id ? district_id : 0}
                      style={{
                        ...styles.picker,
                      }}
                      onValueChange={(itemValue, itemIndex) => {
                        getCourtsdata(itemValue);
                        setDistrictId(itemValue);
                      }}
                      mode="dropdown"
                    >
                      <Picker.Item label="Choose District" value="0" />

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
                  </View>
                </View>
                {/* <View style={styles.FormGroup}>
                  <InputLevel>Court Name</InputLevel>

                  <View style={styles.pickerWrapper}>
                    <Picker
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
                      <Picker.Item label="Choose Court Type" value="0" />

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
                </View> */}
               <View style={styles.FormGroup}>
               <InputLevel>Court</InputLevel>

                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={court_division_id ? court_division_id : 0}
                    style={{
                      ...styles.picker,
                    }}
                    //  onValueChange={(itemValue, itemIndex) => setcountry_id(itemValue)}
                    onValueChange={(itemValue, itemIndex) => {
                      setCourtdivisionId(itemValue);
                      //filterEvenResults(itemValue);
                      //filterdistrictBycountry(itemValue);
                    }}
                    mode="dropdown"
                  >
                    <Picker.Item label="Choose Court Type" value="0" />

                    {CourtName.map((item, index) => {
                      return (
                        <Picker.Item
                          label={item.label}
                          value={item.value}
                          key={index}
                        />
                      );
                    })}
                  </Picker>
                  </View>
                </View>
                <View style={styles.FormGroup}>
                  <InputLevel>Court Name / No. </InputLevel>

                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={court_id ? court_id : 0}
                      style={{
                        ...styles.picker,
                      }}
                      //  onValueChange={(itemValue, itemIndex) => setcountry_id(itemValue)}
                      onValueChange={(itemValue, itemIndex) => {
                        setcourtId(itemValue);
                        //filterEvenResults(itemValue);
                        //filterdistrictBycountry(itemValue);
                      }}
                      mode="dropdown"
                    >
                      <Picker.Item label="Choose Court" value="0" />

                      {court.map((item, index) => {
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
        ) : (
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
            />
            
           )
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    width: 250,
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
