//import React, { useContext } from 'react';
import {StyleSheet, TextInput} from 'react-native';
//import { ThemeContext } from '../contexts/ThemeContext';

export default function EmailFormInput(props) {
  //const {isThemeDark} = useContext(ThemeContext);

  const color = props.isEditing ? '#fff' : '#111';
  return (
    <TextInput
      style={{
        ...styles.input,
        ...(!props.isEditing && styles.inputNotEditable),
        color,
      }}
      editable={props.isEditing ? true : false}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 0,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 4,
    fontSize: 18,
    backgroundColor: '#fff',
    marginTop: -4,
  },
  inputNotEditable: {
    // backgroundColor: "#ccc",
    borderWidth: 0,
  },
});
