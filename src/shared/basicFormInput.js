//import React, {useContext} from 'react';
import {StyleSheet, TextInput} from 'react-native';
//import {ThemeContext} from '../contexts/ThemeContext';

export default function BasicFormInput(props) {
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
    borderColor: '#000',
    borderWidth: 1,
    padding: 10,
    borderRadius: 2,
    fontSize: 13,
  },
  inputNotEditable: {
    backgroundColor: "#fff",
    borderWidth: 1,
  },
});
