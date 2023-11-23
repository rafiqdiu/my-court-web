import React, {useEffect, useState, useContext, createRef, useRef} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import ScreenBackground from '../../../components/ScreenBackground';
import LeftBar from '../../../shared/LeftBar';
import { DataTable } from 'react-native-paper';
import LeftBarItem from '../../../shared/LeftBarItem';
import sharedStyles from '../../../sharedStyles';
import {globalStyles} from '../../../styles/globalStyles';
import axios from 'axios';
import {BASE_URL} from '../../../components/BaseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {responsiveWidth} from 'react-native-responsive-dimensions';
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
import Modal from "react-native-modal";
import DiaryBox from "../../../shared/updateDiary";


const windowWidth = Dimensions.get('window').width;
const tableWidth = windowWidth-220;

export default function TotalCaseScreen() {

  const [refreshing] = useState(true);
  const [endLoader, setEndLoader] = useState(1);
  const onEndReached = () => {
    //console.log('end reached');
    setEndLoader(0);
  };
  const [user_id, setUserId] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [caseSumary, setCaseSumary] = useState([]);
  const [caseDetails, setCaseDetails] = useState([]);
  const [totalCaseDetails, setTotalCaseDetails] = useState([]);
  const [total, setTotal] = useState(0);
  const [position, setPosition] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalEntry, setModalEntry] = useState();

  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      getUserId().then(UserId => { 
        setUserId(UserId);

        _fetchCaseSumaryData(UserId)
        .then(Sumary => {
          setCaseSumary(Sumary);
        })
        .catch(err => console.log(err));

      });
    }, [])
   );
  useEffect(() => {
  
    

  }, []);

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

  const _fetchCaseSumaryData = async (user_id) => {
    try {
      setIsLoading(true);
      let url = `${BASE_URL}/GetCaseSumary?user_id=`+user_id;
      let response = await axios.get(url).then(res => res.data);
      setIsLoading(false);
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

  const getTotalCaseDetailsTypeWise = async (case_type_id) => { 
    try {
      setTotalCaseDetails([]);
      setIsLoading(true);
      let url = `${BASE_URL}/GetCaseSumaryDetails?user_id=`+user_id+'&case_type_id='+case_type_id;
      let response = await axios.post(url).then(res => res.data)
      //console.log(response)
      setCaseDetails(response);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }       
 }

  const getTotalCaseDetails = async (case_type_id) => { 
      try {
        setCaseDetails([]);
        setIsLoading(true);
        let url = `${BASE_URL}/GetCaseSumaryDetails?user_id=`+user_id+'&case_type_id='+case_type_id;
        let response = await axios.post(url).then(res => res.data)
        //console.log(response)
        setTotalCaseDetails(response);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }       
   }


   const getPartiesBehalfOf = async (case_id,parties_behalf_of) => { 
    try {
      let url = `${BASE_URL}/getPartiesBehalfOf?user_id=`+user_id+'&case_id='+case_id+'&parties_behalf_of='+parties_behalf_of;
      let response = await axios.post(url).then(res => res.data)
      //console.log(response)
   
       const newPostElements=  response.map((item, index) => (
           <Text key={index}> {item.name_bng}</Text>
         ))

      //console.log(newPostElements)
      setPosition(newPostElements); 

    } catch (err) {
      console.log(err);
    }       
 }

 function myFunction(item) {
  return item.toUpperCase();
}
const ListFooterComponent = (
  <View style={styles.listFooter}>
    <ActivityIndicator animating={true} size="large" color="#00ff00" />
  </View>
);

 const data = ['apple', 'banana', 'cherry'];

 const TableRow = ({ item }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.cell1}>{item.type_name}</Text>
      <Text style={styles.cell2}>{item.Total}</Text>
      <Pressable style={styles.cell} onPress={ () => {getTotalCaseDetailsTypeWise(item.id)} }><Text style={styles.cellT}>বিস্তারিত</Text></Pressable>
    </View>
  );
};
  
  return (
    <View    style={Platform.OS === 'web' && windowWidth >= 600?globalStyles.mainContainer:globalStyles.mainContainerMobile}>
        <LeftBar>   
            {/* <LeftBarItem    selectcolor='false' name = 'Home'  stack = 'Case'   screen = 'CaseScreen' /> */}
            {/* <LeftBarItem    selectcolor='false' name = 'আমার ডায়েরী'  stack = 'মামলা'   screen = 'CaseDiaryScreen' /> */}
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

        <View  style={ Platform.OS === 'web' && windowWidth >= 600?globalStyles.bodyContainer:globalStyles.bodyContainerMobile}>
          <ScreenBackground style={sharedStyles.bodyPadding}>  
        <ScrollView>
          
          <TouchableOpacity>
              <Text style={styles.Topheader}>আপনার  মামলার সারসংক্ষেপ</Text>
          </TouchableOpacity>
            
          {  Platform.OS === 'web' && windowWidth >= 600
            ? <View style={styles.webView}>


               {/* <View>
                {data.map((item, index) => (
                  <Text key={index}>{myFunction(item)}</Text>
                ))}
              </View>  */}

                 <table style={{ width: 600, margin: '0 auto'}}>
                  <thead style={styles.head}>
                  <tr>
                      <th style={styles.headText}><Text>মামলার ধরন</Text></th>
                      <th style={styles.headText}><Text>মোট</Text></th>
                      <th style={styles.headText}><Text>পদক্ষেপ</Text></th>
                  </tr>
                  </thead>
                    <tbody>
                      <tr></tr>
                        {
                          
                        caseSumary.map((item, key) => (
                          
                                <tr key={key}>
                                    <td style={key % 2 == 0?styles.bodyText:styles.bodyText1}><Text>{item.type_name}</Text></td>
                                    <td style={key % 2 == 0?styles.bodyText:styles.bodyText1}><Text>{engToBdNum(item.Total.toString())}</Text></td>
                                    <td style={key % 2 == 0?styles.bodyText:styles.bodyText1}>
                                        <View style={styles.buttonStyleContainer}>
                                            <Pressable style={styles.buttons} 
                                            
                                               onPress={ () => {getTotalCaseDetailsTypeWise(item.id)} }
                                            
                                            >
                                            <Text style={styles.texts1}>বিস্তারিত</Text>
                                            </Pressable>
                                        </View>
                                      </td>
                                </tr>
                            ))
                        }
                      </tbody>
                    </table>

                    <table style={{ width: 600, margin: '0 auto'}}>
                          <tr style={styles.detailsHead} >
                              <td style={styles.headText}><Pressable onPress={ () => {getTotalCaseDetails(0)} }><Text>সর্বমোট মামলা </Text></Pressable></td>
                              <td style={styles.headText}><Pressable onPress={ () => {getTotalCaseDetails(0)} }><Text>{engToBdNum(caseSumary.reduce((a,v) =>  a = a + v.Total , 0 ).toString())}</Text></Pressable></td>
                              <td style={styles.headText}><Pressable onPress={ () => {getTotalCaseDetails(0)} }><Text >বিস্তারিত</Text></Pressable></td>
                          </tr>
                    </table>

             

                {   caseDetails.length > 0 && !isLoading ? (<> 
                    <Text style={styles.ToatlheadText}>সর্বমোট {caseDetails[0].type_name} : {engToBdNum(caseDetails.length.toString())}</Text>
                  <table>
                  <thead style={styles.head}>
                  <tr>
                    <th style={styles.headTextsl}><Text>ক্রমিক নং</Text></th>
                   
                    <th style={styles.headText}><Text>মামলা নাম্বার</Text></th>
                    <th style={styles.headText}><Text>বাদী ও বিবাদীর নাম</Text></th>
                    
                    <th style={styles.headText}><Text>অবস্থা</Text></th>
                    <th style={styles.headText}><Text>পদক্ষেপ</Text></th>
                  </tr>
                  </thead>
                    <tbody>
                      <tr></tr>
                        {
                          caseDetails.map((item,key) => (
                              
                            <tr key={key}> 
                                <td style={key % 2 == 0?styles.bodyTextsl:styles.bodyTextsl1 }><Text>{engToBdNum((key+1).toString())}</Text></td>
                               
                                <td style={key % 2 == 0?styles.bodyText:styles.bodyText1}><Text>{item.type_name + ' - ' + engToBdNum(item.case_number.toString()) + '/' + engToBdNum(item.case_year.toString())}</Text></td>
                                <td style={key % 2 == 0?styles.bodyText:styles.bodyText1}><Text>{(item.parties_one !=null && item.parties_two !=null) ? item.parties_one+" বনাম "+item.parties_two:""}</Text></td>
                               
                                <td style={key % 2 == 0?styles.bodyText:styles.bodyText1}><Text>{item.status==1?"বিচারাধীন":"বিচার শেষ"}</Text></td>
                                <td style={key % 2 == 0?styles.bodyText:styles.bodyText1}>  <View style={styles.buttonStyleContainer}>
                                    <Pressable style={styles.buttons} 
                                    
                                    onPress={() => {

                                    // handleCaseCreate(item);
                                    navigation.navigate('মামলা', {
                                      screen: 'CaseViewScreen',
                                      params: { case_id: item.case_id},
                                           });
                                        }}
                                        
                                        >
                                      <Text style={styles.texts1}>দেখুন</Text>
                                    </Pressable>
                                       
                                    <Pressable style={styles.buttons} 
                                    
                                    onPress={() => {  setModalVisible(!isModalVisible);
                                      setModalEntry(item);}}
                                        >
                                      <Text style={styles.texts1}>ডায়েরী আপডেট</Text>
                                    </Pressable>
                                    <Pressable style={styles.buttons} 
                                        
                                        onPress={() => {

                                          //navigation.navigate('CaseEditScreen', {item});

                                          navigation.navigate('মামলা', {
                                            screen: 'CaseEditScreen',
                                            params: { case_id: item.case_id},
                                                 });

                                            }}
                                          // handleCaseCreate(item); 
                                           >
                                          <Text style={styles.texts1}>আপডেট</Text>
                                        </Pressable>
                                    </View>
                                </td>
                            </tr>

                            ))
                        }
                      </tbody>
                    </table> 
                    
                    </> ) 
                : 
                null }


           

               {   totalCaseDetails.length > 0 && !isLoading ? (<> 
                <Text style={styles.ToatlheadText}>সর্বমোট মামলা পাওয়া গেছে : {engToBdNum(totalCaseDetails?.length.toString())}</Text>
                  <table>
                  <thead style={styles.head}>
                  <tr>
                    <th style={styles.headTextsl}><Text>ক্রমিক নং</Text></th>
                  
                    <th style={styles.headText}><Text>মামলা নাম্বার</Text></th>
                    <th style={styles.headText}><Text>বাদী ও বিবাদীর নাম</Text></th>
                 
                    <th style={styles.headText}><Text>অবস্থা</Text></th>
                  </tr>
                  </thead>
                    <tbody>
                      <tr></tr>
                        {
                          totalCaseDetails.map((item,key) => (
                              
                            <tr key={key}>
                                <td style={key % 2 == 0?styles.bodyTextsl:styles.bodyTextsl1}><Text>{engToBdNum((key+1).toString())}</Text></td>
                                
                                <td style={key % 2 == 0?styles.bodyText:styles.bodyText1}><Text>{item.type_name + ' - ' + engToBdNum(item.case_number.toString()) + '/' + engToBdNum(item.case_year.toString())}</Text></td>
                                <td style={key % 2 == 0?styles.bodyText:styles.bodyText1}><Text>{(item.parties_one !=null && item.parties_two !=null) ? item.parties_one+" বনাম "+item.parties_two:""}</Text></td>
                              
                                <td style={key % 2 == 0?styles.bodyText:styles.bodyText1}><Text>{item.status==1?"বিচারাধীন":"বিচার শেষ"}</Text></td>
                            </tr>

                            ))
                        }
                      </tbody>
                    </table>
                    
                    </> ) 
                  : 
                  null }

                { isLoading ? <ActivityIndicator size="large"/> : null }
                   
                </View>
                :<>
                 <View style={styles.containerMobile}>
                  <View style={styles.header}>
                   <Text style={styles.headerText1}>মামলার ধরন</Text>
                   <Text style={styles.headerText2}>মোট</Text>
                   <Text style={styles.headerText}>পদক্ষেপ</Text>
                  </View>
                  <ScrollView horizontal={true}>
                  <FlatList
                    data={caseSumary}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <TableRow item={item} />}
                  /></ScrollView>
                 <Pressable  onPress={ () => {getTotalCaseDetailsTypeWise(0)} }>
                   <View style={styles.headerB}>
                   
                   <Text style={styles.headerText1}>সর্বমোট মামলা</Text>
                   <Text style={styles.headerText2}>{engToBdNum(caseSumary.reduce((a,v) =>  a = a + v.Total , 0 ).toString())}</Text>
                   <Text style={styles.headerText}>বিস্তারিত</Text>
                   </View></Pressable>
                </View>
                {   caseDetails.length > 0 && !isLoading ? (<> 
                
                  <ScrollView horizontal={true}>
      
      <FlatList
          data={caseDetails}
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
                      {engToBdNum((index+1).toString())}
                    </Text>
                             
                                      {/* <TouchableOpacity style={styles.buttonsMobile} 
                                      
                                      onPress={() => { handleCaseCreate(item)
                                      
                                          }}
                                          
                                          >
                                        <Text style={styles.textsMobile}>মামলা যোগকরি</Text>
                                      </TouchableOpacity> */}
                                 
                  </View>

                  <View style={styles.MCart}>
                    <Text style={styles.textTile}>মামলার নম্বর</Text>
                    <Text style={styles.textTilecln}>:</Text>
                    <Text style={styles.textDescription}>
                    {item.type_name + ' - ' + engToBdNum(item.case_number.toString()) + '/' + engToBdNum(item.case_year.toString())}
                    </Text>
                    
                  </View>

                  <View style={styles.MCart}>
                    <Text style={styles.textTile}>বাদী ও বিবাদীর নাম</Text>
                    <Text style={styles.textTilecln}>:</Text>
                    <Text style={styles.textDescription}>
                    {(item.parties_one !=null && item.parties_two !=null) ? item.parties_one+" বনাম "+item.parties_two:""}
                    </Text>
                  </View>

                  <View style={styles.MCart}>
                    <Text style={styles.textTile}>অবস্থা</Text>
                    <Text style={styles.textTilecln}>:</Text>
                    <Text style={styles.textDescription}>
                    {item.status==1?"বিচারাধীন":"বিচার শেষ"}
                    </Text>
                  </View>

                  <View style={styles.MCart}>
                    <Text style={styles.textTile}>পদক্ষেপ</Text>
                    <Text style={styles.textTilecln}>:</Text>
                    {/* <Text style={styles.textDescription}>
                    
                    </Text> */}
                    <TouchableOpacity style={styles.buttonsMobile}   onPress={() => {

                                        // handleCaseCreate(item);
                                        navigation.navigate('মামলা', {
                                          screen: 'CaseViewScreen',
                                          params: { case_id: item.case_id},
                                               });
                                            }}>
                                      <Text style={styles.textsMobile}>দেখুন</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonsMobile} onPress={() => {  setModalVisible(!isModalVisible);
                                      setModalEntry(item);}}  >
                                      <Text style={styles.textsMobile}>ডায়েরী আপডেট</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonsMobile}   
                    
                    
                                          // onPress={() => {
                                          // navigation.navigate('মামলা', {
                                          //   screen: 'CaseEditScreen',
                                          //   params: { case_id: item.case_id},
                                          //        });
                                          //   }} 
                                            
                                            
                                            onPress={() => {
                                              navigation.navigate('মামলা', {
                                                screen: 'CaseEditScreen',
                                                params: { case_id: item.case_id},
                                                     });
                                            }}
                                            
                                            
                                            >
                                      <Text style={styles.textsMobile}>আপডেট</Text>
                    </TouchableOpacity>
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
            endLoader && caseDetails?.length > 0 ? ListFooterComponent : null
          }
          windowSize={10}
        />
        </ScrollView>
                
                </>):null}

                {   totalCaseDetails.length > 0 && !isLoading ? (<> 
                
                <ScrollView horizontal={true}>
    
    <FlatList
        data={totalCaseDetails}
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
                    {engToBdNum((index +1).toString())}
                  </Text> </View>

                <View style={styles.MCart}>
                  <Text style={styles.textTile}>মামলার নম্বর</Text>
                  <Text style={styles.textTilecln}>:</Text>
                  <Text style={styles.textDescription}>
                  {item.type_name + ' - ' + item.case_number + '/' + item.case_year}
                  </Text>
                  
                </View>

                <View style={styles.MCart}>
                  <Text style={styles.textTile}>বাদী ও বিবাদীর নাম</Text>
                  <Text style={styles.textTilecln}>:</Text>
                  <Text style={styles.textDescription}>
                  {(item.parties_one !=null && item.parties_two !=null) ? item.parties_one+" বনাম "+item.parties_two:""}
                  </Text>
                </View>

                <View style={styles.MCart}>
                  <Text style={styles.textTile}>অবস্থা</Text>
                  <Text style={styles.textTilecln}>:</Text>
                  <Text style={styles.textDescription}>
                  {item.status==1?"বিচারাধীন":"বিচার শেষ"}
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
          endLoader && totalCaseDetails?.length > 0 ? ListFooterComponent : null
        }
        windowSize={10}
      />
      </ScrollView>
              
              </>):null}

                
                </> 
              }
        </ScrollView>
          </ScreenBackground>
        </View>
    </View>
  );


}

const styles = StyleSheet.create({
  buttonsMobile: {
    flex: 1,
   // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    //paddingHorizontal: 4,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#29962f',
    marginTop:0,
   // paddingTop:10,
    marginRight:5,
    //left:-130,
   // top:0
  },
  containerMobile: {
   flex: 1,
    padding: 16,

  },
  header: {
    flexDirection: 'row',
    marginBottom: 3,
    color:'#000',
   // backgroundColor:'#ccc',
   height:25
   
  },
  textsMobile: {
color:'#fff',
width: '100%',
textAlign: 'center'
  },
  headerB: {
    flexDirection: 'row',
    marginBottom: 2,
    color:'#000',
   // backgroundColor:'#ccc',
   height:25,
   marginLeft:0
  },
  headerText: {
    
    fontWeight: 'bold',
    backgroundColor:'khaki',
    width:70,
    textAlign: 'center',
    height:25,
    paddingVertical:3
  },
  headerText1: {
    
   // color:'#000',
    width:200,
    backgroundColor:'khaki',
    marginRight:3,
   height:25,
   textAlign: 'center',
    fontWeight: 'bold',
    paddingVertical:3
   
    
  },
  headerText2: {
    
    fontWeight: 'bold',
    width:40,
    backgroundColor:'khaki',
    marginRight:3,
    textAlign: 'center',
    height:25,
    paddingVertical:3
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3,
    color:'#000',
   // backgroundColor:'#ccc',
   height:'auto',

  },
  cell1: {
    flex: 1,
    color:'#000',
    width:200,
    backgroundColor:'#ccc',
    marginRight:3,
    textAlign: 'center',
   // paddingHorizontal:10,
    paddingVertical:3
   // height:25
  },
  cell2: {
   flex: 1,
    color:'#000',
    width:40,
    backgroundColor:'#ccc',
    marginRight:3,
    textAlign: 'center',
  //  height:25
  paddingHorizontal:10,
  paddingVertical:3
  },
  cell: {
    //flex: 1,
    color:'#00f',
    backgroundColor:'#ccc',
    width:70,
    marginRight:3,
    textAlign: 'center',
    //paddingHorizontal:10,
    paddingVertical:3
  
  },
  cellT: {
    //flex: 1,
    color:'#00f',
   
    textAlign: 'center',
   
  
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
  height: 40, 
  backgroundColor: 'khaki', 
  borderTopLeftRadius:5,
  borderTopRightRadius:5,
},

detailsHead: { 
  height: 30, 
  backgroundColor: '#cca', 
},

headTextsl: { 
  fontSize: 13, 
  // fontWeight: 'bold', 
  textAlign: 'center', 
  color: '#000', 
  justifyContent:'center',
  width: 70,
},
headText: { 
  fontSize: 13, 
  // fontWeight: 'bold', 
  textAlign: 'center', 
  color: 'blue', 
  justifyContent:'center',
  
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
  fontSize: 12, 
  // fontWeight: 'bold', 
  textAlign: 'center', 
  color: '#000', 
  justifyContent:'center',
  backgroundColor:'#ccc'

},
bodyText1: { 
  fontSize: 12, 
  // fontWeight: 'bold', 
  textAlign: 'center', 
  color: '#000', 
  justifyContent:'center',
  backgroundColor:'#fffffc'

},

ToatlheadText: { 
  fontSize: 15, 
  fontWeight: 'bold', 
  // textAlign: 'center', 
  color: '#000', 
  padding:5,
  // justifyContent:'center',
},


buttons: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 1,
  paddingHorizontal: 1,
  //borderRadius: 4,
  elevation: 3,
  //backgroundColor: 'green',
  marginBottom:4,
  color:'blue',
  marginRight:5,
},
texts: {
  fontSize: 12,
  lineHeight: 14,
  fontWeight: 'bold',
  letterSpacing: 0.25,
  color: 'white',
},
texts1: {
  fontSize: 12,
  lineHeight: 14,
  fontWeight: 'bold',
  letterSpacing: 0.25,
  color: 'blue',
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
