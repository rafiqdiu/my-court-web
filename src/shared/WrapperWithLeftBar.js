import React from 'react';
import { StyleSheet, View } from 'react-native';
import LeftBar from './LeftBar';

const WrapperWithLeftBar = ({ children }) => {
  return (
    <View style={styles.container}>
      <LeftBar></LeftBar>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  leftBar: {
    width: 100,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingLeft: 10,
  },
});

export default WrapperWithLeftBar;
