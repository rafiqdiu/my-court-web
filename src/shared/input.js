//import React, { useContext } from "react";
import {TextInput, StyleSheet, Platform, Dimensions} from 'react-native';
//import { ThemeContext } from "../contexts/ThemeContext";
const windowWidth = Dimensions.get('window').width;
export default function Input(props) {
  // const { isThemeDark } = useContext(ThemeContext);
  const color = '#fff';

  return (
    <TextInput
      placeholderTextColor="#fff"
      style={styles.inputstyle}
      {...props}
    />
  );
}
const styles = StyleSheet.create({
  inputstyle: {
    height: 40,
    marginBottom: 20,
    color: '#fff',
    width: 300,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    borderWidth: Platform.OS === 'web' && windowWidth >= 600 ? 1 : 0,
    borderColor: '#fff',
    paddingHorizontal: 10,
    fontSize: 18,
  },
});
