import {MaterialIcons} from '@expo/vector-icons';
import React, {useContext} from 'react';
import {View, Text} from 'react-native';

function Icon({name, size, color, style}) {
  //get theme color
  //const { isThemeDark } = useContext(ThemeContext);
  color = color;
  return <MaterialIcons name={name} size={size} color={color} style={style} />;
}

export default Icon;
