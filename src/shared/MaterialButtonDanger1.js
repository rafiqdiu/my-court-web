import React, { Component } from "react"; 
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/Feather";

function MaterialButtonDanger1(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]}>
      <Text style={styles.submit}>Submit</Text>
      <Icon name="repeat" style={styles.icon}></Icon>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(141,54,244,1)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.39,
    shadowRadius: 6,
    elevation: 18,
    minWidth: 88,
    paddingLeft: 16,
    paddingRight: 16
  },
  submit: {
    color: "#fff",
    fontSize: 16,
    
  },
  icon: {
    top: 10,
    left: 2,
    position: "absolute",
    color: "rgba(250,246,246,1)",
    fontSize: 16
  }
});

export default MaterialButtonDanger1;
