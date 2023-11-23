import {StyleSheet, View} from 'react-native';

export default function FormGroup({children}) {
  return <View style={styles.inputstyle}>{children}</View>;
}
const styles = StyleSheet.create({
  inputstyle: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});
