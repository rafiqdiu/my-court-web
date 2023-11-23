import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/Feather";

function MaterialButtonPink(props) {
  return (
    <TouchableOpacity onPress={props.closeModal} style={[styles.container, props.style]}>
      <Text style={styles.close}>Close</Text>
      <Icon name="x" style={styles.icon}></Icon>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E91E63",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 2,
    minWidth: 88,
    paddingLeft: 16,
    paddingRight: 16
  },
  close: {
    color: "#fff",
    fontSize: 14,
    margin: 0
  },
  icon: {
    top: 10,
    left: 11,
    position: "absolute",
    color: "rgba(254,251,251,1)",
    fontSize: 16
  }
});

export default MaterialButtonPink;
