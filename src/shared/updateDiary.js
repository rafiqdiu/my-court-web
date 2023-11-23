import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component,useEffect, useState} from 'react';
import {ActivityIndicator,StyleSheet,Image, View, Text, TouchableOpacity, Platform, KeyboardAvoidingView, Dimensions} from 'react-native';
import MaterialFixedLabelTextbox1 from './MaterialFixedLabelTextbox1';
import MaterialRadio from './MaterialRadio';
import MaterialButtonDanger1 from './MaterialButtonDanger1';
import MaterialButtonPink from './MaterialButtonPink';
import RadioButtonGroup, {RadioButtonItem} from 'expo-radio-button';
import Icon from 'react-native-vector-icons/Entypo';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
//import { DateTimePickerModal } from 'react-native-paper-datetimepicker';
import moment from 'moment'; 
import {BASE_URL} from '../components/BaseUrl';

import {Formik} from 'formik';
import * as yup from 'yup';
import {
  DatePickerModal,
  DatePickerModalContent,
  TimePickerModal,
  DatePickerInput,
  // @ts-ignore TODO: try to fix expo to work with local library
} from 'react-native-paper-dates';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AppBtn from './appBtn';
import ErrorText from './errorText';
import axios from 'axios';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
const basicInfoSchema = yup.object({
  Next_Date: yup.string().required('Next Date is required'),
 
});
const windowWidth = Dimensions.get('window').width;
function UpdateDiary(props) {
  const [current, setCurrent] = useState('1');
  const [user_id, setUserId] = useState([]);
  const navigation = useNavigation();
  const [diaryIfo, setDiaryIfo] = useState([]);
  //date picker strat
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
  const [isVisible, setVisibility] = useState(false);
  const [select_date, setselectdate] = useState(null);
  const [select_next_date, setselectdNxteDate] = useState(null);
  const [case_diary, setCase_diary] = useState({
   
    //  user_id: "",     
    //  case_id: "",
      result: "",
      sort_description:"",
      cause_of_hearing:"", 
      Next_Date:"",    
  
   
  });
  const [isLoading, setIsLoading] = useState(false);

  // const showDatePicker = () => {
  //   setDatePickerVisibility(true);
  // };
  const showDatePicker = React.useCallback(() => {
    setDatePickerVisibility(true);
  }, [setDatePickerVisibility]);

  const hideDatePicker = React.useCallback(() => {
    setDatePickerVisibility(false);
  }, [setDatePickerVisibility])
  // const hideDatePicker = () => {
  //   setDatePickerVisibility(false);
  // };

  const showDatePicker2 = () => {
    setVisibility(true);
  };

  const hideDatePicker2 = () => {
    setVisibility(false);
  };

  const handleConfirm = val => {
    // console.warn("A date has been picked: ", date);
    //console.log(val);
    setselectdate(val);
    //console.log(select_date);
    hideDatePicker();
  };
  const [visible, setVisible] = React.useState(false);
  const onDismiss = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);
 
  const onChange = React.useCallback(({ date }) => {
    setVisible(false);
    //console.log({ date });
    setselectdate(date);
  }, []);
 


  const handlenextDate = val => {
    // console.warn("A date has been picked: ", date);
    //console.log(val);
    setselectdNxteDate(val);
    //console.log(select_date);
    hideDatePicker2();
  };
  // date picker end
  
  const [endvisible, setEndVisible] = React.useState(false) 
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

  useEffect(() => {
 //async fetch user data
 getUserId().then(UserId => { 
  setUserId(UserId)
  getDiarydata(UserId);
})
.catch(err => console.log(err));

  }, []);

  const getDiarydata = (data) => { _fetchDiaryData(data)
    // eslint-disable-next-line no-shadow
    .then(D_info => {
       //console.log(user_info);
       setDiaryIfo(D_info);
       setDate(D_info.entry_date.toString());
      // setEndDate(D_info.hearing_date.toString());
      // setCurrent(D_info.case_status.toString());
       setCase_diary({ 
        result: D_info.result,
        sort_description:D_info.short_description,
        cause_of_hearing:D_info.cause_of_hearing,    
    
      });
     
      //setalldistrict(district);
    })
    .catch(err => console.log(err)); 
  }  
  const _fetchDiaryData = async (data) => {
    //console.log(props);
    try {let dataToSend = {
      user_id: data,
      case_id: props.item.case_id ,
      };
     // console.log(dataToSend);
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
      let url = `${BASE_URL}/GetCaseDiaryEdit`;
      let response = await axios.post(url, formBody).then(res => res.data);

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  };

  const updateNextDate = (handleChange, value) => {
    handleChange(value);
  };

  const handleCaseDiaryUpdate = (values, actions) => {
   // setCaseInfo([]);
    //Show Loader
    setIsLoading(true);
   // setIsSearch(false);
//console.log(props);
        const {  
          result,
          sort_description,
          cause_of_hearing,
        } = values;

      const searchData = {
        user_id: user_id,
        case_id: props.item.case_id,
        entry_date: Platform.OS === 'web' ?(date !==null ? moment(date).format("DD-MM-YYYY") : ""):(select_date !==null ? moment(select_date).format("DD-MM-YYYY") : ""),
        hearing_date: Platform.OS === 'web' ?(enddate !==null ? moment(enddate).format("DD-MM-YYYY") : ""):(select_next_date !==null ? moment(select_next_date).format("DD-MM-YYYY") : ""),
        cause_of_hearing:cause_of_hearing ,
        short_description:sort_description,
        result: result,
        case_status: current,
       
      };

      console.log(searchData);

    _fetchCaseDiaryupdate(searchData)
    .then(diary => {

      if (diary.code == 200)
       {
         alert( diary.msg);
        // props.closeModal;
         navigation.navigate('মামলা', {
          screen: 'DiaryHistoryScreen',
          params: { case_id: props.item.case_id},
        });
       }        
      else
       {         
          alert(diary.msg);
       }
     // setCaseInfo(getCaseInfo);
      //Hide Loader
      setIsLoading(false);
      //setIsSearch(true);
    })
    .catch(err => console.log(err));
  };

  const _fetchCaseDiaryupdate =  dataToSend => {
    try {
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }

    formBody = formBody.join('&');
      let url = `${BASE_URL}/CaseDiaryUpdate`;
      let response =  axios.post(url, formBody).then(res => res.data);
      //console.log(response);
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


  return (
    <View style={styles.container}>
      { isLoading ? <ActivityIndicator size="large"/> : null }
      <View style={styles.rect}>
      <KeyboardAvoidingView>
      <Formik
            enableReinitialize
         
           initialValues={{ ...case_diary }}
           // validationSchema={basicInfoSchema}
            onSubmit={(values, actions) => {
              handleCaseDiaryUpdate(values, actions);
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
                
        <View style={styles.rect2}>
          <Text style={styles.updateDiary}>
            Update Diary 
          </Text>
          <TouchableOpacity onPress={props.closeModal} >
           <Icon name="circle-with-cross" style={styles.icon}></Icon>
          </TouchableOpacity>
        </View>       
        <MaterialFixedLabelTextbox1
          style={[styles.materialFixedLabelTextbox2,{flexDirection:'row'}]}
          onTouchStart={null}
          value={values.result}
          onChangeText={handleChange("result")}
          onBlur={handleBlur("result")}
          placeholder={'Case Result'}
        />
        <View style={[styles.materialFixedLabelTextbox3Stack,{flexDirection:'row'}]}><TouchableOpacity  onPress={() =>Platform.OS === 'web' ? setVisible(true):null} style={styles.sectionStyle}>
          <MaterialFixedLabelTextbox1
            style={styles.materialFixedLabelTextbox3}
            value={Platform.OS === 'web' ?(date !==null ? moment(date).format("DD-MM-YYYY") : ""):(select_date !==null ? moment(select_date).format("DD-MM-YYYY") : "")
            }
            showSoftInputOnFocus={false}
            onChangeText={null}
            onBlur={null}
            onTouchStart={() =>{setVisible(true); showDatePicker();}}
            placeholder={'Order Date'}
          /><Image
          source={{
            uri:
              'https://causelist.judiciary.gov.bd/img/calendar.png',
          }}
          style={styles.imageStyle}
        /></TouchableOpacity>
       
    </View>
          { Platform.OS === 'web' ? (  
          <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
        <DatePickerModal
          
            locale={locale}
            mode="single"
            visible={visible}
            onDismiss={onDismiss}
            date={date}
            onConfirm= {onChangeSingle}
            onDateChanged = {onChangeDate}
            validRange={{
              startDate: pastDate,
              disabledDates: [futureDate],
              
            }}
            onChange={onChangeSingle}         

          />
          
    </View>
    ):(<View>

                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      // date={ values?.application_deadline? moment(values?.application_deadline).format("DD-MM-YYYY") : ""}
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                      minimumDate={new Date()}

                      // minimumDate={("YYYY, MM, DD")}
                      // maximumDate={moment('08-06-2022').add(30, 'days').format("DD-MM-YYYY")}
                    />
                </View>
          )}
         
       
        <MaterialFixedLabelTextbox1
          style={styles.materialFixedLabelTextbox4}
        
          value={values.sort_description}
          onChangeText={handleChange("sort_description")}
          onBlur={handleBlur("sort_description")}
          placeholder={'Update Description'}
        />
        <View style={styles.materialRadioStackStackRow}>
          <View style={styles.materialRadioStackStack}>
            <View style={styles.nextDateStack}>
              
              <RadioButtonGroup
                containerStyle={{marginBottom: 10}}
                selected={current}
                onSelected={value => setCurrent(value)}
                radioBackground="green"
              >
                <RadioButtonItem value="1" label="Next date" />
                <RadioButtonItem value="2" label="No Next date" />
                <RadioButtonItem
                  value="3"
                  label={<Text style={{color: 'red'}}>Disposed</Text>}
                />
              </RadioButtonGroup>
            </View>
            
          </View>
         
        </View>
        {current == 1 ?(
          <View style={[styles.materialFixedLabelTextbox5Stack,{flexDirection:'row'} ]}><TouchableOpacity  onPress={() =>Platform.OS === 'web' ? setEndVisible(true):null} style={styles.sectionStyle}><MaterialFixedLabelTextbox1
              style={styles.materialFixedLabelTextbox6}
              showSoftInputOnFocus={false}
              //onChangeText={null} 
              ChangeText={handleChange("Next_Date")}
          onBlur={handleBlur("Next_Date")}             
              value={ Platform.OS === 'web' ?(enddate !==null ? moment(enddate).format("DD-MM-YYYY") : ""):(select_next_date !==null ? moment(select_next_date).format("DD-MM-YYYY") : "")}
             
              onTouchStart={showDatePicker2}
              //onBlur={null}
              placeholder={'Next Date'}
            /><Image
            source={{
              uri:
                'https://causelist.judiciary.gov.bd/img/calendar.png',
            }}
            style={styles.imageStyle}
          /></TouchableOpacity>
             { Platform.OS === 'web' ? (
                  <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
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
                     
                      style={{ width:300}}

                    />
                      
                </View>
              ):(<View>
             <DateTimePickerModal
              isVisible={isVisible}
              mode="date"
              // date={ values?.application_deadline? moment(values?.application_deadline).format("DD-MM-YYYY") : ""}
              onConfirm={handlenextDate}
              onCancel={hideDatePicker}
            //  minimumDate={new Date()}

              // minimumDate={("YYYY, MM, DD")}
              // maximumDate={moment('08-06-2022').add(30, 'days').format("DD-MM-YYYY")}
            /></View> 
              )}
            <MaterialFixedLabelTextbox1
              style={styles.materialFixedLabelTextbox5}
              value={values.cause_of_hearing}
              onChangeText={handleChange("cause_of_hearing")}
              onBlur={handleBlur("cause_of_hearing")}
              placeholder={'Next Date For'}
            />
          </View>
        ) : <View></View>}
        <View style={styles.materialButtonDanger2Row}>
          <View style={styles.Topview}>
                    <AppBtn
                      title="Submit"
                      onPress={handleSubmit}
                      //disabled={isSubmitting ? true : false}
                    />
                  </View>
          <MaterialButtonPink
            style={styles.materialButtonPink}
            closeModal={props.closeModal}
          ></MaterialButtonPink>
        </View>

        </>
            )}
          </Formik>
          </KeyboardAvoidingView>
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
    borderColor: '#000',
    height: 38,
    borderRadius: 5,
    marginTop: Platform.OS === 'web' && windowWidth >= 600?0:10,
   // margin: 10,
  },
  imageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: Platform.OS === 'web' && windowWidth >= 600?300:'100%', 
    alignContent: 'center',
    justifyContent: 'center',
     },
  rect: {
    width: '92%',
    height: 'auto',
    backgroundColor: 'rgba(251,249,249,1)',
    marginTop: -25,
    marginLeft: 10,
    borderRadius: 13,
  },
  rect2: {
    width: '100%',
    height: 42,
    backgroundColor: 'rgba(92,184,92,1)',
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
  },
  updateDiary: {
    color: '#121212',
    fontSize: 20,
    marginTop: 9,
    marginLeft: 20,
  },
  courtNameNo: {
    color: '#121212',
    width: 150,
    height: 17,
    marginLeft: 26,
  },
  materialFixedLabelTextbox1: {
    height: 38,
    width: '90%',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 45,
    shadowOpacity: 0.25,
    shadowRadius: 15,
    marginTop: 5,
    marginLeft: 15,
  },
  result: {
    color: '#121212',
    width: 86,
    height: 17,
    marginTop: 3,
    marginLeft: 25,
  },
  materialFixedLabelTextbox2: {
    height: 38,
    width: '90%',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 45,
    shadowOpacity: 0.25,
    shadowRadius: 15,
    marginLeft: 15,
    marginTop:10,
    paddingLeft:10,
  },
  materialFixedLabelTextbox3: {
    height: 38,
    width: Platform.OS === 'web' && windowWidth >= 600?'85%':230,
    //position: 'absolute',
    left:30,
    top: Platform.OS === 'web' && windowWidth >= 600?16:0,
   //borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 45,
    shadowOpacity: 0.25,
    shadowRadius: 15,
    paddingLeft:10,
  },
  orderDate: {
    top: 0,

    left: 11,
    position: 'absolute',

    color: '#121212',
    width: 100,
    height: 17,
  },
  materialFixedLabelTextbox3Stack: {
    width: '100%',
    height: 54,
    marginTop: 7,
    marginLeft: 15,
  },
  updateDescription: {
    color: '#121212',
    width: 121,
    height: 17,
    marginTop: 5,
    marginLeft: 26,
  },
  materialFixedLabelTextbox4: {
    height: 38,
    width: '90%',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 45,
    shadowOpacity: 0.25,
    shadowRadius: 15,
    marginTop: 10,
    marginLeft: 15,
    paddingLeft:10,
  },
  materialRadio: {
    height: 40,
    width: 29,
    position: 'absolute',
    left: 2,
    top: 0,
  },
  materialRadio2: {
    height: 40,
    width: 29,
    position: 'absolute',
    left: 82,
    top: 32,
  },
  nextDate2: {
    top: -25,
    left: 19,
    position: 'absolute',

    color: '#121212',
    width: 80,
    height: 17,
  },
  materialRadioStack: {
    top: 0,
    left: 0,
    width: 99,
    height: 79,
    position: 'absolute',
  },
  nextDate: {
    top: 11,
    left: 0,
    position: 'absolute',

    color: '#121212',
    width: 87,
    height: 16,
  },
  materialRadio1: {
    height: 40,
    width: 29,
    position: 'absolute',
    left: 82,
    top: 0,
  },
  nextDateStack: {
    top: 3,
    left: 32,
    width: 111,
    height: 40,
    position: 'absolute',
  },
  disposed: {
    top: 45,
    left: 144,
    position: 'absolute',

    color: '#121212',
    width: 59,
    height: 16,
  },
  materialRadioStackStack: {
    width: 143,
    height: 79,
  },
  noNextDate: {
    color: '#121212',
    width: 85,
    height: 16,
    marginLeft: 3,
    marginTop: 16,
  },
  materialRadioStackStackRow: {
    height: 115,
    flexDirection: 'row',
    marginTop: 5,
    marginLeft: 7,
    marginRight: 15,
  },
  materialFixedLabelTextbox6: {
    height: 38,
    width: Platform.OS === 'web' && windowWidth >= 600?'77%':230,
   // borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 45,
    top: Platform.OS === 'web' && windowWidth >= 600?-7:0,
    shadowOpacity: 0.25,
    shadowRadius: 15,
    marginLeft: 0,
    paddingLeft:10,
  },
  materialFixedLabelTextbox5: {
    height: 38,
    width: '90%',
    position: 'absolute',
    left: 0,
    top: 52,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 45,
    shadowOpacity: 0.25,
    shadowRadius: 15,
    paddingLeft:10,
  },
  nextDaterFor: {
    top: 32,
    left: 11,
    position: 'absolute',

    color: '#121212',
    width: 117,
    height: 17,
  },
  materialFixedLabelTextbox5Stack: {
    width: '100%',
    height: 100,
    marginTop: 0,
    marginLeft: 15,
  },
  materialButtonDanger2: {
    height: 36,
    width: 78,
  },
  materialButtonPink: {
    height: 36,
    width: 48,
    marginLeft: 8,
  },
  materialButtonDanger2Row: {
    height: 36,
    flexDirection: 'row',
    marginTop: 7,
    width: '100%',
    // marginLeft: 35,
    alignContent: 'center',
    justifyContent: 'center',

    marginBottom: 10,
  },
  icon: {
    color: 'rgba(244,74,74,1)',
    fontSize: 25,
    opacity: 0.79,
    height: 27,
    width: 25,
    top: Platform.OS === 'web' && windowWidth >= 600? 0: -25,
    left: Platform.OS === 'web' && windowWidth >= 600? 500:'88%',
    marginTop: Platform.OS === 'web' && windowWidth >= 600? -25:0,
    marginLeft:  Platform.OS === 'web' && windowWidth >= 600? '60%': 0,
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
  },
});

export default UpdateDiary;
