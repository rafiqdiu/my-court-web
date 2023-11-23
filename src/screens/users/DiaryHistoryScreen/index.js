import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState ,useEffect } from "react";
import {Text, ScrollView,FlatList, ActivityIndicator,StyleSheet, Platform, Dimensions, View, Image, TouchableOpacity } from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import ScreenBackground from '../../../components/ScreenBackground';
import LeftBar from '../../../shared/LeftBar';
import LeftBarItem from '../../../shared/LeftBarItem';
import sharedStyles from '../../../sharedStyles';
import {globalStyles} from '../../../styles/globalStyles';
import WavyHeader from '../../../shared/WavyHeader';
import axios from 'axios';
import {BASE_URL} from '../../../components/BaseUrl';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import moment from "moment";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Modal from "react-native-modal";
import DiaryBox from "../../../shared/updateDiary";

const windowWidth = Dimensions.get('window').width;

export default function DiaryHistoryScreen({ route }) {
 // const {error, showError} = useErrorHandler(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();
  const [CaseInfo, setCaseInfo] = useState(null);
  const [diaryIfo, setDiaryIfo] = useState([]);
  const [endLoader, setEndLoader] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalEntry, setModalEntry] = useState();

  const onEndReached = () => {
    //console.log('end reached');
    setEndLoader(0);
  };
  const [refreshing] = useState(true);


  useEffect(() => {
    getUserId().then(user_id => {getUserdata(user_id); getCasedata(user_id);} )

  }, [route]);
 
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
 
  const getUserdata = (data) => { _fetchUserData(data)
    // eslint-disable-next-line no-shadow
    .then(user_info => {
       //console.log(user_info);
       setDiaryIfo(user_info);
      //setalldistrict(district);
    })
    .catch(err => console.log(err)); 
  }  
  const _fetchUserData = async (data) => {
   // console.log(route);
    try {let dataToSend = {
      user_id: data,
      case_id:route.params.case_id ,
      };
      console.log(dataToSend);
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
      let url = `${BASE_URL}/GetCaseDiaryView`;
      let response = await axios.post(url, formBody).then(res => res.data);

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  };


  const getCasedata = (data) => { _fetchCaseData(data)
    // eslint-disable-next-line no-shadow
    .then(case_info => {
     //  console.log(case_info);
       setCaseInfo(case_info.CaseInfo);
      //setalldistrict(district);
    })
    .catch(err => console.log(err)); 
  }  
  const _fetchCaseData = async (data) => {
   // console.log(route);
    try {let dataToSend = {
      user_id: data,
      id:route.params.case_id ,
      };
      //console.log(dataToSend);
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

  const ListFooterComponent = (
    <View style={styles.listFooter}>
      <ActivityIndicator animating={true} size="large" color="#00ff00" />
    </View>
  );

  return (
    <View    style={Platform.OS === 'web' && windowWidth >= 600?globalStyles.mainContainer:globalStyles.mainContainerMobile}>
    <LeftBar>   
    {/* <LeftBarItem   name = 'Home'  stack = 'Settings'   screen = 'SettingsScreen' /> */}
    <LeftBarItem    selectcolor='false'  name = 'নতুন মামলা যোগ করুন'  stack = 'মামলা'   screen = 'CaseEntry' />     
            <LeftBarItem    selectcolor='true'  name = 'সকল মামলা ও রেজিস্ট্রার'  stack = 'মামলা'   screen = 'TotalCaseScreen' />
   </LeftBar>
          <Modal isVisible={isModalVisible}  
            onSwipeComplete={() => setModalVisible(false)}
            //onBackdropPress={() => setModalVisible(false)}
            swipeDirection={['left', 'right','down','up']}>
              <View style={{alignItems:'center'}}>
              
                <DiaryBox item={modalEntry}  closeModal={() => setModalVisible(false)} />
                
              </View>
             </Modal>
     <View style={ [Platform.OS === 'web' && windowWidth >= 600?globalStyles.bodyContainer:globalStyles.bodyContainerMobile,{backgroundColor:'#fff'}]}>
     <ScrollView><WavyHeader customStyles={styles.svgCurve} />
     <View style={styles.headerBar}>
     <TouchableOpacity style={styles.headerBarButton} 
      onPress={ () => {
     navigation.navigate('মামলা', {
          screen: 'CaseEditScreen',
          params: { case_id: CaseInfo.case_id},
        });} } ><Text style={styles.headerBarText}><FontAwesome    name='edit'  color='#f00'  />সম্পাদনা</Text></TouchableOpacity> 
     <TouchableOpacity onPress={ () => {
     navigation.navigate('মামলা', {
          screen: 'CaseViewScreen',
          params: { case_id: CaseInfo.case_id},
        });} } style={styles.headerBarButton}><Text style={styles.headerBarText}><FontAwesome   name='history'  color='#f00'  />বৃত্তান্ত</Text></TouchableOpacity> 
       <TouchableOpacity   onPress={() => {  setModalVisible(!isModalVisible);
                                      setModalEntry(CaseInfo);}} style={styles.headerBarButton}><Text style={styles.headerBarText}><FontAwesome   name='history'  color='#f00'  />ডায়েরী আপডেট</Text></TouchableOpacity> 
     
      
      </View>
    <View style={styles.headerContainer}>
        <Text style={styles.headerTexth}>মামলার ডায়েরীর ইতিহাস</Text>
      </View>
     { diaryIfo.length > 0 && CaseInfo != null?<>
              <View style={styles.headerContainer1}>
              <Text style={styles.headerText1}>{CaseInfo.office_name_bng+", "+CaseInfo.district_name_bng}</Text>
            </View>
                 
            <View style={{...styles.mobileView, width: windowWidth - 16}}>
            <View style={[styles.hddata1, {flexDirection: Platform.OS === 'web' && windowWidth >= 600?'row':'column'}]}>

                        <View style={{flexDirection: 'column'}}>
                            <View style={{flexDirection:'row'}}>
                              <Text style={styles.textTile}>মামলার নম্বর</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>  {CaseInfo.type_name + ' - ' + CaseInfo.case_number?engToBdNum(CaseInfo.case_number.toString()):null + '/' + CaseInfo.case_year?engToBdNum(CaseInfo.case_year.toString()):null}                             
                              </Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                              <Text style={styles.textTile}>মোবাইল নম্বর</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>  {CaseInfo.mobile?engToBdNum(CaseInfo.mobile.toString()):null}                             
                              </Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'column'}}>  
                            <View style={{flexDirection:'row'}}>
                              <Text style={styles.textTile}>বাদী</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}> {CaseInfo.parties_one}                          
                              </Text>
                            </View>
                           
                            <View style={{flexDirection:'row'}}>
                              <Text style={styles.textTile}>বিবাদী</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}> {CaseInfo.parties_two}                              
                              </Text>
                            </View>
                           </View>
                        </View>
            <View>
              <Text style={styles.headerText2}>মামলার ইতিহাস</Text>
            </View>
            <ScrollView horizontal={true}>    
                <FlatList
                    data={diaryIfo}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    numColumns={1}
                    renderItem={({item, index }) => (
                      <View key={item.key}><TouchableOpacity>
                        <View style={styles.hddata}>
                            <View style={{flexDirection:'row'}}>
                              <Text style={styles.textTile}>ক্রমিক নং</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>
                                {index +1}
                              </Text>
                            </View>

                           

                            <View style={{flexDirection:'row'}}>
                              <Text style={styles.textTile}>কার্যক্রম</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>
                               {item.cause_of_hearing}
                              </Text>
                            </View>
                            {item.case_status == 1 ?(
                            <View style={{flexDirection:'row'}}>
                              <Text style={styles.textTile}> পরবর্তী তারিখ</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>
                                {item.hearing_date=="01-01-1970"?"": (item.hearing_date !==null ? engToBdNum((moment(item.hearing_date).format("DD-MM-YYYY")).toString()) : "")} 
                              </Text>
                            </View>):(
                              <View style={{flexDirection:'row'}}>
                              <Text style={styles.textTile}>মামলার অবস্থা</Text>
                              <Text style={styles.textTilecln}>:</Text>
                              <Text style={styles.textDescription}>
                                {item.case_status==3?"নিষ্পত্তি হয়েছে":"পরবর্তী তারিখ নেই"} 
                              </Text>
                            </View>
                            )
                            }
                            <View style={{flexDirection:'row'}}>
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
                      endLoader && diaryIfo.length > 0 ? ListFooterComponent : null
                    }
                    windowSize={10}
                  /></ScrollView>   
            </View>
            </>
        : null }
</ScrollView>
    </View>
   
    </View>
  );


}

const styles = StyleSheet.create({
  headerContainer1: {
    marginTop:  Platform.OS === 'web' && windowWidth >= 600?10:20,
    marginHorizontal: 10
  },
  hddata1: {
    padding: 5,
   // borderWidth: 1,
    //borderColor: 'black',
    borderRadius: 6,
   marginTop: Platform.OS === 'web' && windowWidth >= 600?-50:0,
    marginBottom: 0,
    //backgroundColor: '#C1EfFf',
    marginLeft: Platform.OS === 'web' && windowWidth >= 600?20: 0 ,
    width: Platform.OS === 'web' && windowWidth >= 600?700: responsiveWidth(99) ,
  },
  hddata: {
    padding: 5,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 6,
    marginTop: 5,
    marginBottom: 0,
    backgroundColor: '#C1EfFf',
    marginLeft: Platform.OS === 'web' && windowWidth >= 600?20: 0 ,
    width: Platform.OS === 'web' && windowWidth >= 600?700: responsiveWidth(99) ,
  },
  textDescription: {
    paddingTop: 3,
    fontSize: 13,
    width: Platform.OS === 'web' && windowWidth >= 600?300: responsiveWidth(60) ,
  },
  textTile: {
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width:  Platform.OS === 'web' && windowWidth >= 600?100: responsiveWidth(28),
  },
  textTilecln: {
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 8,
  },

  mobileView: {
    marginTop: '7%', 
    flex: 1,
    marginRight: 'auto',
    marginLeft: 'auto',
  },

  headerContainer: {
    marginTop: 10,
    marginHorizontal: 10
  },
  headerBar: {
    marginTop: Platform.OS === 'web' && windowWidth >= 600?20:20,
    marginHorizontal: 10,
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'center',
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
  headerText2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00c',
    textAlign: 'left',
    marginTop: 5,
    marginLeft: 20
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00c',
    textAlign: 'center',
    marginTop: 40
  },
  headerTexth: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00c',
    textAlign: 'center',
   // marginTop: 40
  },
  headerBarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00c',
    textAlign: 'center',
    //marginTop: 40
  },
  svgCurve: {
    position: 'absolute',
    width: Dimensions.get('window').width
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
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
  header: {
    //backgroundColor: '#00BFFF',
    height: 200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 130,
  },
  name: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  body: {
    marginTop: 40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  name: {
    fontSize: 28,
    color: '#696969',
    fontWeight: '600',
  },
  info: {
    fontSize: 16,
    color: '#00BFFF',
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: '#696969', 
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
   // backgroundColor: '#00BFFF',
  },
});
