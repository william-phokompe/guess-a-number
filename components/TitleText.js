import React from "react";
import { StyleSheet, Text } from 'react-native'

const TitleText = (props) => {
  return <Text style={{...styles.title, ...props.style}}>{props.children}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    marginVertical: 10,
    fontFamily: "open-sans-bold",
  },
});

export default TitleText;
