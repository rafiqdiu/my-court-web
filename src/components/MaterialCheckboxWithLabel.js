import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function MaterialCheckboxWithLabel(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]}>
      <Icon
        name={props.checked ? "checkbox-marked" : "checkbox-blank-outline"}
        style={styles.checkIcon}
      ></Icon>
      <Text style={styles.rememberMe}>{props.label || "Remember me"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    opacity: 0.93
  },
  checkIcon: {
    fontSize: 22,
    lineHeight: 28,
    color: "rgba(78,73,73,1)"
  },
  rememberMe: {
    marginLeft: 2,
    fontSize: 15,
    color: "rgba(0,0,0,0.87)"
  }
});

export default MaterialCheckboxWithLabel;
