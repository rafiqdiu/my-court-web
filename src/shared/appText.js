import React, {useContext} from 'react';
import {Text} from 'react-native';
import {DefaultThemeColors, DarkThemeColors} from '../utils/constants/Colors';

function AppText({children, size, family, color}) {
  //get theme color
  //const { isThemeDark } = useContext(ThemeContext);
  const Colors = DefaultThemeColors;

  //resolve text styles
  const fontSize = size ? size : 14;

  //resolve font Family
  switch (family) {
    case 'light':
      family = 'SolaimanLipi';
      break;
    case 'light-italic':
      family = 'SolaimanLipi';
      break;
    case 'semi-bold':
      family = 'SolaimanLipi-Bold';
      break;
    case 'semi-bold-italic':
      family = 'SolaimanLipi-Bold';
      break;
    case 'bold':
      family = 'SolaimanLipi-Bold';
      break;
    case 'bold-italic':
      family = 'SolaimanLipi-Bold';
      break;
    default:
      family = 'SolaimanLipi';
      break;
  }

  //resolve font color
  switch (color) {
    case 'secondary':
      color = Colors.secondayText;
      break;
    case 'info':
      color = Colors.infoText;
      break;
    case 'light':
      color = '#fff';
      break;
    case 'dark':
      color = '#333';
      break;
    case 'red':
      color = '#f00';
      break;
    case 'green':
      color = '#008c23';
      break;
    default:
      color = Colors.primaryText;
  }

  return (
    <Text
      style={{
        // fontFamily: family,
        fontSize,
        color,
      }}
    >
      {children}
    </Text>
  );
}

export default AppText;
