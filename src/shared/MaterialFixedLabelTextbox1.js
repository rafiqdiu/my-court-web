import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";

function MaterialFixedLabelTextbox1(props) {
  return (
    
     
      <TextInput style={styles.inputStyle}

      {...props}
      />
    
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: "#D9D5DC",
    backgroundColor: "transparent",
    flexDirection: "row",
    paddingLeft: 16
  },
  label: {
    fontSize: 16,
    lineHeight: 16,
    paddingTop: 12,
    paddingBottom: 8,
    color: "#000",
    opacity: 0.5,
    alignSelf: "flex-start"
  },
  inputStyle: {
    color: "#000",
    paddingRight: 5,
    fontSize: 16,
    alignSelf: "stretch",
    flex: 1,
    lineHeight: 16,
    paddingTop: 12,
    paddingBottom: 8,
    paddingLeft: 30
  }
});

export default MaterialFixedLabelTextbox1;
