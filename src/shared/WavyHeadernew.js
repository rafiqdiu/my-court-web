
import React from 'react';
import { View,Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DefaultThemeColors, DarkThemeColors,ThemeOne,ThemeTwo } from "../utils/constants/Colors";
const windowWidth = Dimensions.get('window').width;

const viBox = '0 0 '+windowWidth+' 260';

export default function WavyHeader({ customStyles }) {
  const Colors2 = ThemeOne;
const Colors1 = ThemeTwo;
  return (
    <View style={customStyles}>
      {/* <View style={{ marginTop: -100, backgroundColor: '#22BDDE', height:260 }}> */}
      <View style={{ marginTop: -100, backgroundColor: Colors2.body, height:260 }}>
      <Svg xmlns="http://www.w3.org/2000/svg" viewBox={viBox}>
      <Path fill={Colors2.leftbar} fill-opacity="1" d="M0,160L26.7,160C53.3,160,107,160,160,186.7C213.3,213,267,267,320,256C373.3,245,427,171,480,144C533.3,117,587,139,640,138.7C693.3,139,747,117,800,112C853.3,107,907,117,960,138.7C1013.3,160,1067,192,1120,186.7C1173.3,181,1227,139,1280,138.7C1333.3,139,1387,181,1413,202.7L1440,224L1440,0L1413.3,0C1386.7,0,1333,0,1280,0C1226.7,0,1173,0,1120,0C1066.7,0,1013,0,960,0C906.7,0,853,0,800,0C746.7,0,693,0,640,0C586.7,0,533,0,480,0C426.7,0,373,0,320,0C266.7,0,213,0,160,0C106.7,0,53,0,27,0L0,0Z"></Path>
  {/* <Path fill="#0099ff" fill-opacity="1" d="M0,160L26.7,160C53.3,160,107,160,160,186.7C213.3,213,267,267,320,256C373.3,245,427,171,480,144C533.3,117,587,139,640,138.7C693.3,139,747,117,800,112C853.3,107,907,117,960,138.7C1013.3,160,1067,192,1120,186.7C1173.3,181,1227,139,1280,138.7C1333.3,139,1387,181,1413,202.7L1440,224L1440,0L1413.3,0C1386.7,0,1333,0,1280,0C1226.7,0,1173,0,1120,0C1066.7,0,1013,0,960,0C906.7,0,853,0,800,0C746.7,0,693,0,640,0C586.7,0,533,0,480,0C426.7,0,373,0,320,0C266.7,0,213,0,160,0C106.7,0,53,0,27,0L0,0Z"></Path> */}
</Svg>
      </View>
    </View>
  );
}