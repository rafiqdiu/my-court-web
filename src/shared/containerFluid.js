import React, {useContext} from 'react';
import {StyleSheet, View, KeyboardAvoidingView, Platform} from 'react-native';
//import { ThemeContext } from "../contexts/ThemeContext";
import {DarkThemeColors, DefaultThemeColors} from '../utils/constants/Colors';

function ContainerFluid({children}) {
  //const { isThemeDark } = useContext(ThemeContext);
  //colors object
  const Colors = DefaultThemeColors;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.primaryBg,
        ...{borderTopColor: '#ffffff', borderTopWidth: 0.26},
      }}
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,
          overflow: 'hidden',
          height: '100%',
          paddingTop: 0,
          marginTop: 0,
          marginBottom: 10,
          borderTopWidth: 0,
        }}
      >
        {children}
      </KeyboardAvoidingView>
    </View>
  );
}

export default ContainerFluid;
