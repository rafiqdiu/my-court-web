import React, {useState,Fragment} from 'react';
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
import {Card} from 'react-native-shadow-cards';
import {responsiveWidth} from 'react-native-responsive-dimensions';


const Colors2 = ThemeOne;
//export default function DashboardScreen() {
  const DashboardForMobileScreen = () => {
  const navigation = useNavigation();
  const windowWidth = Dimensions.get('window').width;
  return (
    <View   style={Platform.OS === 'web' && windowWidth >= 600?globalStyles.mainContainer:globalStyles.mainContainerMobile}>
    {/* <LeftBar>   
       <LeftBarItem  selectcolor='true' name = 'ড্যাসবোর্ড'  stack = 'Dashboard'   screen = 'DashboardScreen' />
      
   </LeftBar> */}
    
     <View style={ Platform.OS === 'web' && windowWidth >= 600?globalStyles.bodyContainer:globalStyles.bodyContainerMobile}>
     <View style={{flexDirection:'row',justifyContent:'space-evenly', marginTop:20}}>
     <TouchableOpacity  onPress={() => navigation.navigate('মামলা',{screen:'CaseEntryScreen'})}>
      <Card style={{ backgroundColor:'#25dfd5', width:responsiveWidth(43), height:160, }}>       
      <FontAwesome  style={{paddingTop:20, textAlign:'center',}}  name={'legal'}  size={100} color='#FF0000'  />
      <Text style={{fontSize:22, textAlign:'center',  fontWeight:'bold', color:'#ffff'}}>মামলা</Text>
      </Card>
      </TouchableOpacity>
      <TouchableOpacity  onPress={() => navigation.navigate('দৈনিক কার্যতালিকা',{screen:'CaseEntryScreen'})}>
      <Card style={{  backgroundColor:'#25dfd5', width:responsiveWidth(43), height:160,}}>       
      <FontAwesome style={{paddingTop:20, textAlign:'center',}}  name={'th-list'}  size={100} color='#FF0000'  />
      <Text style={{fontSize:18, textAlign:'center',  fontWeight:'bold', color:'#ffff'}}>দৈনিক কার্যতালিকা</Text>
      </Card>
      </TouchableOpacity>      
      </View>
      <View style={{flexDirection:'row',justifyContent:'space-evenly', marginTop:20}}>
      <TouchableOpacity  onPress={() => navigation.navigate('আমার ডায়েরী',{screen:'CaseEntryScreen'})}>
      <Card style={{  backgroundColor:'#25dfd5', width:responsiveWidth(43), height:160, }}>       
      <FontAwesome  style={{paddingTop:20, textAlign:'center',}}  name={'book'}  size={100} color='#FF0000'  />
      <Text style={{fontSize:22, textAlign:'center',  fontWeight:'bold', color:'#ffff'}}>আমার ডায়েরী</Text>
      </Card>
      </TouchableOpacity> 
      <TouchableOpacity  onPress={() => navigation.navigate('মামলা খুজুন',{screen:'CaseEntryScreen'})}>
      <Card style={{  backgroundColor:'#25dfd5', width:responsiveWidth(43), height:160, }}>       
      <FontAwesome   style={{paddingTop:20, textAlign:'center',}} name={'search'}  size={100} color='#FF0000'  />
      <Text style={{fontSize:22, textAlign:'center',  fontWeight:'bold', color:'#ffff'}}>মামলা খুজুন</Text>
      </Card>
      </TouchableOpacity> 
      </View>
      <View style={{justifyContent:'center', alignItems:'center', alignContent:'center', marginTop:20}}>
      <TouchableOpacity  onPress={() => navigation.navigate('প্রোফাইল',{screen:'CaseEntryScreen'})}>
      <Card style={{  backgroundColor:'#25dfd5', width:responsiveWidth(43), height:160, }}>       
      <FontAwesome style={{paddingTop:20, textAlign:'center', }}   name={'user-circle-o'}  size={100} color='#FF0000'  />
      <Text style={{fontSize:22, textAlign:'center',  fontWeight:'bold', color:'#ffff'}}>প্রোফাইল</Text>
      </Card>
      </TouchableOpacity> 
      
      </View>
    
    </View>
    </View>
   
  );
}

export default DashboardForMobileScreen;
const styles = StyleSheet.create({

  imgBannertop:{
    width:100,
    height:100,
    justifyContent:'center',
    alignSelf:'center'
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
        color: "#270ac9",
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
      marginBottom:50,
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
