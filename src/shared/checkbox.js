import * as React from 'react';
import {StyleSheet} from 'react-native';
//import { ThemeContext } from "../contexts/ThemeContext";
import RadioForm from 'react-native-simple-radio-button';
//import { DarkThemeColors, DefaultThemeColors } from "../utils/constants/Colors";

export default function Checkbox(props) {
  // const { isThemeDark } = React.useContext(ThemeContext);

  return (
    <RadioForm
      style={styles.radioInput}
      buttonSize={18}
      buttonOuterSize={18}
      formHorizontal={true}
      labelHorizontal={true}
      selectedButtonColor="#fff"
      buttonColor="#fff"
      animation={false}
      labelStyle={{fontSize: 18, color: '#fff', marginRight: 14}}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  radioInput: {
    padding: 8,
    borderRadius: 4,
    fontSize: 18,
    justifyContent: 'space-between',
    // shadowColor: '#ff0000',
    // shadowOpacity: 0.3,
    //  shadowRadius: 2,
    marginHorizontal: 14,
    marginVertical: 16,
  },
});
