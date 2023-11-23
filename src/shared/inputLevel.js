//import React, { useContext } from "react";
import {Text} from 'react-native';
//import { ThemeContext } from "../contexts/ThemeContext";
import AppText from './appText';

export default function InputLevel({children}) {
  return (
    <Text
      style={{
        marginBottom: 5,
        fontWeight: 'bold',
      }}
    >
      <AppText size={15}>{children}</AppText>
    </Text>
  );
}
