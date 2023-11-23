import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useState, Fragment, useEffect} from 'react';
import {
  Text, 
  ScrollView, 
  StyleSheet,
  ImageBackground,
  Platform ,
  Dimensions, 
  View, 
  SafeAreaView, 
  StatusBar,
  Easing,
  TouchableOpacity,
  Image,
  Button,
  Linking,
} from 'react-native';
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
// import SortableGridView from 'react-native-sortable-gridview';
import{ ImagesAssets } from '../../../utils/constants/Consts';


const Colors2 = ThemeOne;
//export default function DashboardScreen() {
  const AppHomeScreen = () => {
  const navigation = useNavigation();
  const windowWidth = Dimensions.get('window').width;

  const [user_id, setUserId] = useState([]);
  const [user_Pass, setUserPass] = useState(null);
  const [userAccessStatus, setUserAccessStatus] = useState([]);


  useEffect(() => {
    getUserPass().then(UserPass => { 
      setUserPass(UserPass)     
    });
    getUserId().then(UserId => { 
      setUserId(UserId)
      
      fetchAppsUserAccessStatus(UserId)
      //async fetch user data
     .then(res => {
       //console.log(res);
       setUserAccessStatus(res);
     })
     .catch(err => console.log(err));
    });
  
  }, []);

  const fetchAppsUserAccessStatus  = async (UserId) => {
    try {
      //console.log(UserId);
     // let url = `https://reactnative.bdlawservice.com/public/api/appsUserAccessStatus?username=`+UserId;
     let url = `https://reactnative.bdlawservice.com/public/api/appsUserAccessStatus?username=105`;
      //console.log(url);
      let response = await axios.post(url).then(res => res.data);

      return response;
      //if (response.country) return response.country;
    } catch (err) {
      console.log('Error', err);
    }
  };
  async function getUserPass() {
    try {
      const jsonValue = await AsyncStorage.getItem('user_password');
      if (jsonValue !== null) {
       // setUserId(JSON.parse(jsonValue));
        return JSON.parse(jsonValue);
      }
    } catch (err) {
      console.error(err);
    }
  }
  async function getUserId() {
    try {
      const jsonValue = await AsyncStorage.getItem('user_id');
      if (jsonValue !== null) {
        setUserId(JSON.parse(jsonValue));
        return JSON.parse(jsonValue);
      }
    } catch (err) {
      console.error(err);
    }
  }


  const bdlawAppsPress = () => {

    if(userAccessStatus.data.status==1 && userAccessStatus.data.bdlawservice_allow==1)
    {
      // const url = 'app://bdlawApps';
      // Linking.openURL(url)
      //   .catch(err => {
      //     Linking.openURL('https://play.google.com/store/apps/details?id=com.sel.bdlawApps');
      //     //navigation.navigate("BdlawScreen")
      // })
      let  dd = btoa(user_id+"&pass="+user_Pass);
      var urls = "https://app.bdlawservice.com/?token="+dd;
      if(windowWidth<600){
        urls = "https://app.bdlawservice.com/?token="+dd;
      }
         
      // let url='https://new.bdlawreference.com/Common/dokarindexlawbddibinak';
       var win= window.open(urls);
    }
    else
    {
      alert("Your Account is blocked, Please contact this phone number : 01771335577")
    }

  }

 const bdlawReferencePress = () => {

    if(userAccessStatus.data.status==1 && userAccessStatus.data.bdlawreference_allow==1)
    {
      // const url = 'app://bdlawReference';
      // Linking.openURL(url)
      //   .catch(err => {
      //     Linking.openURL('https://play.google.com/store/apps/details?id=com.rafiqse.LCMS_APPS');
      // })

      let  dd = btoa(user_id+"&pass="+user_Pass);
      var urls = "https://app.bdlawreference.com/?token="+dd;
         
      // let url='https://new.bdlawreference.com/Common/dokarindexlawbddibinak';
       var win= window.open(urls);
    }
    else
    {
      alert("Your Account is blocked, Please contact this phone number : 01771335577")
    }

  }


  return (
    <View   style={Platform.OS === 'web' && windowWidth >= 600?globalStyles.mainContainer:globalStyles.mainContainerMobile}>
    {/* <LeftBar>   
       <LeftBarItem  selectcolor='true' name = 'ড্যাসবোর্ড'  stack = 'Dashboard'   screen = 'DashboardScreen' />
      
   </LeftBar> */}
    
     <View style={ Platform.OS === 'web' && windowWidth >= 600?globalStyles.bodyContainer:globalStyles.bodyContainerMobile}>
  
     {/* <Text style={styles.buttonMiddle}>
      <View style={styles.buttonTextStyle}> 
        <Button title="Supreme Court Cause List Search"  style={{fontSize: 32}} onPress={ ()=>{ Linking.openURL('app://bdlawApps')}} />
       
        <Text style={styles.devided}> </Text>
        <Button color="#1E6738" title="Judgment / Reference (BLR)"   style={{ color: "#FFFFFF", fontSize: 32}} onPress={ ()=>{ Linking.openURL('app://bdlawReference')}} />
      </View>
      </Text> */}
      <ScrollView>
        <View style={styles.buttonMiddle}> 
        <View style={{ backgroundColor:'#1075c7' , borderRadius: 23, height:230, marginBottom:20}}>
        <TouchableOpacity
          style={styles.customBtnBGtop}
          onPress={bdlawAppsPress}
         
        ><Image style={styles.imgBannertop} source={ImagesAssets.logo1} />
          <Text style={styles.customBtnTexttop}>BD Law Service For{"\n"} Supreme Court Cause List Search </Text><Text style={[styles.customBtnTexttop,{textDecorationLine:'underline' }]}> Version-1 </Text>
        </TouchableOpacity>
        </View>
        <View style={{flex: 1, width:'100%', marginBottom:3,  borderWidth: 1,
        borderColor:'black',}} />
        <View style={{flex: 1, width:'100%', marginBottom:20,  borderWidth: 1,
        borderColor:'black',}} />
      <TouchableOpacity
          style={[styles.customBtnBG,{backgroundColor:'#3342ce'}]}
          onPress={ ()=>{ navigation.navigate("HomeDashboard")}} 
        ><Image style={styles.imgBanner} source={ImagesAssets.logo3} />
          <Text style={styles.customBtnText}>BD Law Service For {"\n"} Judge Court Case Search & Diary </Text><Text style={[styles.customBtnText,{textDecorationLine:'underline' }]}>Trial Version</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.customBtnBG,,{backgroundColor:'#1a6656'}]}
          onPress={bdlawReferencePress}
        ><Image style={styles.imgBanner} source={ImagesAssets.logo2} />
          <Text style={styles.customBtnText}>BD Law Reference (BLR){"\n"}For Judgment / Reference Search</Text><Text style={[styles.customBtnText, {textDecorationLine:'underline' }]}>Trial Version</Text>
        </TouchableOpacity>
        </View>
        </ScrollView>
    </View>
    </View>
   
  );
}

export default AppHomeScreen;
const styles = StyleSheet.create({

  imgBannertop:{
    width:80,
    height:80,
    justifyContent:'center',
    alignSelf:'center',
    borderRadius:15,
      },
      imgBanner:{
        width:50,
        height:50,
        justifyContent:'center',
        alignSelf:'center'
          },
      buttonMiddle: {
        textAlign: 'center',
        verticalAlign:'middle',
        justifyContent:'center',
        alignItems:'center',
        marginTop:30,
        width:'100%',
        alignContent:'center'
      },
      customBtnTexttop: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#fff",
        textAlign: 'center',
    },
      customBtnText: {
        fontSize: 18,
        fontWeight: '400',
        color: "#fff",
        textAlign: 'center',
    },
    customBtnBGtop: {
      //backgroundColor: "#1E6738",
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginBottom:60,
      borderRadius: 10,
      justifyContent:'center',
      width:350,
      //flexDirection:'row',
      
      verticalAlign:'middle',
      alignSelf:'center'
      
      },
    /* Here style the background of your button */
    customBtnBG: {
    //backgroundColor: "#3342ce",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom:20,
    borderRadius: 10,
    justifyContent:'center',
    width:300,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15 ,
    shadowOffset : { width: 1, height: 13},
    //flexDirection:'row',
    
    verticalAlign:'middle',
    alignSelf:'center'
    
    },
  buttonTextStyle: {
    color: '#FFFFFF',
    // left: 20,
    paddingVertical: 5,
    fontSize: 18,
    textAlign: 'center',
    verticalAlign:'middle',
    marginTop:50,

  },

  devided: {
    marginTop:20,
    textAlign: 'center',
  },

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
 
});
