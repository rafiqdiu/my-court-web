import React, {useContext} from 'react';
import {Text, TouchableOpacity,Platform,Dimensions } from 'react-native';
import {DefaultThemeColors, DarkThemeColors} from '../utils/constants/Colors';
//import { ThemeContext } from "../contexts/ThemeContext";

export default function AppBtn(props) {
  //const { isThemeDark } = useContext(ThemeContext);
  const windowWidth = Dimensions.get('window').width;
  const Colors = DefaultThemeColors;
  const p = props.paddingRight ? props.paddingRight : 12;
  const h = props.paddingLeft ? props.paddingLeft : 12;
  const t = props.paddingTop ? props.paddingTop :  Platform.OS === 'web' && windowWidth >= 600 ?5:8;
  const b = props.paddingBottom ? props.paddingBottom : Platform.OS === 'web' && windowWidth >= 600 ?6:8;
  const FB = props.fontwidth ? props.fontwidth : 'normal';
  const w = props.width ? props.width : '100%';
  const BGcolor = props.BGcolor ? props.BGcolor : Colors.btnPrimaryBg;
  const Tcolor = props.Tcolor ? props.Tcolor : Colors.btnPrimaryText;
  return (
    <TouchableOpacity
      style={{
        paddingLeft: h,
        paddingRight: p,
        paddingTop: t,
        paddingBottom: b,
        
        borderRadius: 6,
        backgroundColor: BGcolor,
        width: w,
        //margin:10,
      }}
      onPress={props.onPress}
      {...props}
    >
      <Text
        style={{
          color: Tcolor,
          fontSize: Platform.OS === 'web' && windowWidth >= 600 ?14:18,
          textTransform: 'capitalize',
          fontWeight:FB,
          textAlign: 'center',
          width: '100%',
          fontFamily:'SolaimanLipi'

        }}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  );
}
