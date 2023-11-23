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
  Image
  
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
import SortableGridView from 'react-native-sortable-gridview';
import { responsiveScreenHeight } from 'react-native-responsive-dimensions';


const Colors2 = ThemeOne;

async function getUsername() {
  try {
    const jsonValue = await AsyncStorage.getItem('user_name');
    if (jsonValue !== null) {
      //console.log("user_name: "+JSON.parse(jsonValue));
      return JSON.parse(jsonValue);
    }
  } catch (err) {
    console.error(err);
  }
}

async function getPassword() {
  try {
    const jsonValue = await AsyncStorage.getItem('user_password');
    if (jsonValue !== null) {
      //console.log("user_password: "+JSON.parse(jsonValue));
      return JSON.parse(jsonValue);
    }
  } catch (err) {
    console.error(err);
  }
}

//export default function DashboardScreen() {
  const DashboardScreen = () => {
  const navigation = useNavigation();
  const windowWidth = Dimensions.get('window').width;
  const [isAdmin, setIsAdmin] = useState(false);

   useFocusEffect(
    React.useCallback(() => {
      getUsername().then(getUser => { 
        getPassword().then(getPass => { 
        if(getUser !=undefined && getPass !=undefined)
          setIsLoggedIn(true)
          getUser === '100' ? setIsAdmin(true): setIsAdmin(false)
        });
    });
    }, [])
   );
 
  return (
    <View   style={Platform.OS === 'web' && windowWidth >= 600?globalStyles.mainContainer:globalStyles.mainContainerMobile}>
    <LeftBar>   
       <LeftBarItem  selectcolor='true' name = 'ড্যাসবোর্ড'  stack = 'Dashboard'   screen = 'DashboardScreen' />
      
   </LeftBar>
    
     <View style={ Platform.OS === 'web' && windowWidth >= 600?globalStyles.bodyContainer:globalStyles.bodyContainerMobile}>
      {/* <WavyHeader customStyles={[styles.svgCurve,{ height:'100'}]} />
       <View style={styles.headerContainer}>
        <Text style={styles.headerTexth}>Judge Court Case Search & Diary</Text>
        </View> */}
         <WavyTopBar customStyles={[styles.backgroundImage,{zIndex:-1}] }/> 
{Platform.OS === 'web'?
<View>
    <SortableGridView
       style={{overflow: 'scroll', height:responsiveScreenHeight(90), fontFamily:'SolaimanLipi', marginTop: 5}}
       useScrollView={true} 
        data={[
          {name: 'মামলা', screen:'CaseEntryScreen', backgroundColor: '#09f', color: '#fff' , icon:'legal'},
          {name: 'দৈনিক কার্যতালিকা',  screen:'CaseEntryScreen', backgroundColor: '#f60', color: '#fff',icon:'th-list' },
          {name: 'আমার ডায়েরী',  screen:'CaseEntryScreen', backgroundColor: '#333', color: '#fff', icon:'book'},
          {name: 'মামলা খুজুন',  screen:'CaseEntryScreen', backgroundColor: '#rgba(255, 216, 58, 1)', color: '#333',icon:'search'},
         // {name: 'প্রোফাইল',  screen:'CaseEntryScreen', backgroundColor: '#rgba(0, 222, 144, 1)', color: '#fff', icon:'user-circle-o'},
        ]}
        customAnimation={{
          startTimingOption: {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
          },
          endTimingOption: {
            toValue: 0,
            duration: 0,
          },
          style: (animation) => {
            let onSelectRotateAnimation = {}
            let rotate = animation.interpolate({
              inputRange: [0, .4, .6, 1], // only 0 to 1
              outputRange: ['0deg', '-15deg', '-30deg', '360deg'],
            });
            onSelectRotateAnimation = {
              transform: [{
                rotate: rotate,
              }],
            }
            return onSelectRotateAnimation;
          }
        }}
        onDragStart={() => {
          console.log('CustomAnimation onDragStart');
        }}
        onDragRelease={(data) => {
          console.log('CustomAnimation onDragRelease', data);
        }}
        numPerRow={Platform.OS === 'web' && windowWidth >= 600?(isAdmin?5:4):2} // let each row has four items. Default is 3
  aspectRatio={1} // let height = width * 1.2. Default is 1
  gapWidth={16} // let the gap between items become to 8. Default is 16
  paddingTop={16} // let container's paddingTop become to 8. Default is 16
  paddingBottom={16} // let container's paddingBottom become to 8. Default is 16
  paddingLeft={16} // let container's paddingLeft become to 8. Default is 16
  paddingRight={16} // let container's paddingRight become to 8. Default is 16
        renderItem={(item, index) => {
          return (
           
            <View uniqueKey={index}   style={[styles.item, {backgroundColor: item.backgroundColor}]} >
               <TouchableOpacity  onPress={() => navigation.navigate(item.name,{screen:item.screen})}>
               <FontAwesome     name={item.icon}  size={100} color='#FF0000'   ></FontAwesome>
              <Text style={[styles.text, {color: item.color}]}>{item.name}</Text>
              </TouchableOpacity>
            </View>
            
          )
        }}
      />  </View>:null}
      {/*
    //   : <View style={styles.container}>
    //   <Swiper style={styles.wrapper} height={200} horizontal={false} autoplay>
    //     <View style={styles.slide1}>
    //       <Text style={styles.text}>মামলা</Text>
    //     </View>
    //     <View style={styles.slide2}>
    //       <Text style={styles.text}>দৈনিক কার্যতালিকা</Text>
    //     </View>
    //     <View style={styles.slide3}>
    //       <Text style={styles.text}>And simple</Text>
    //     </View>
    //     <View style={styles.slide3}>
    //       <Text style={styles.text}>And simple</Text>
    //     </View>
    //   </Swiper>

    //   <Swiper
    //     style={styles.wrapper}
    //     height={240}
    //     onMomentumScrollEnd={(e, state, context) =>
    //       console.log('index:', state.index)
    //     }
    //     dot={
    //       <View
    //         style={{
    //           backgroundColor: 'rgba(0,0,0,.2)',
    //           width: 5,
    //           height: 5,
    //           borderRadius: 4,
    //           marginLeft: 3,
    //           marginRight: 3,
    //           marginTop: 3,
    //           marginBottom: 3
    //         }}
    //       />
    //     }
    //     activeDot={
    //       <View
    //         style={{
    //           backgroundColor: '#000',
    //           width: 8,
    //           height: 8,
    //           borderRadius: 4,
    //           marginLeft: 3,
    //           marginRight: 3,
    //           marginTop: 3,
    //           marginBottom: 3
    //         }}
    //       />
    //     }
    //     paginationStyle={{
    //       bottom: -23,
    //       left: null,
    //       right: 10
    //     }}
    //     loop
    //   >
    //     <View
    //       style={styles.slide}
    //       title={
    //         <Text numberOfLines={1}>Aussie tourist dies at Bali hotel</Text>
    //       }
    //     >
    //       <Image
    //         resizeMode="stretch"
    //         style={styles.image}
    //         source={require('../img/case.jpg')}
    //       />
    //     </View>
    //     <View
    //       style={styles.slide}
    //       title={
    //         <Text numberOfLines={1}>Big lie behind Nine’s new show</Text>
    //       }
    //     >
    //       <Image
    //         resizeMode="stretch"
    //         style={styles.image}
    //         source={require('../img/case_list.jpg')}
    //       />
    //     </View>
    //     <View
    //       style={styles.slide}
    //       title={<Text numberOfLines={1}>Why Stone split from Garfield</Text>}
    //     >
    //       <Image
    //         resizeMode="stretch"
    //         style={styles.image}
    //         source={require('../img/diary.jpg')}
    //       />
    //     </View>
    //     <View
    //       style={styles.slide}
    //       title={
    //         <Text numberOfLines={1}>Learn from Kim K to land that job</Text>
    //       }
    //     >
    //       <Image
    //         resizeMode="stretch"
    //         style={styles.image}
    //         source={require('../img/search.jpg')}
    //       />
    //     </View>
    //   </Swiper>
      // </View> */}
  
    </View>
    </View>
   
  );
}

export default DashboardScreen;
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
    fontFamily:'SolaimanLipi',
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
    textAlign: 'center',
    fontFamily:'SolaimanLipi'
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
