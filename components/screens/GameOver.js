import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Text,
  ScrollView,
} from "react-native";

import TitleText from "../TitleText";
import BodyText from "../BodyText";
import MainButton from "../MainButton";
import Colors from "../../constants/Colors";

const GameOver = (props) => {
  const [availableDeviceWidth, setAvailableDeviceWidth] = useState(
    Dimensions.get("window").width
  );
  const [availableDeviceHeight, setAvailableDeviceHeight] = useState(
    Dimensions.get("window").height
  );

  useEffect(() => {
    const adjustLayout = () => {
      setAvailableDeviceHeight(Dimensions.get("window").height);
      setAvailableDeviceWidth(Dimensions.get("window").width);
    };

    Dimensions.addEventListener("change", adjustLayout);
    return () => {
      Dimensions.removeEventListener("change", adjustLayout);
    };
  });

  return (
    <ScrollView>
      <View style={styles.screen}>
        <TitleText style={{ color: "red" }}>Game Over!</TitleText>
        <View
          style={Object.assign({}, styles.imageContainer, {
            width: availableDeviceWidth * 0.7,
            height: availableDeviceHeight * 0.7,
            borderRadius: (availableDeviceWidth * 0.7) / 2,
            marginVertical: availableDeviceHeight / 30,
          })}
        >
          <Image
            fadeDuration={300}
            style={styles.image}
            //   source={require("../../assets/success.png")}
            source={{
              uri:
                "https://cdn.pixabay.com/photo/2016/05/05/23/52/mountain-summit-1375015_960_720.jpg",
            }}
            resizeMode="cover"
          />
        </View>

        <View
          style={Object.assign({}, styles.resultContainer, {
            marginVertical: availableDeviceHeight / 60,
          })}
        >
          <BodyText
            style={Object.assign({}, styles.resultText, {
              fontSize: availableDeviceHeight < 400 ? 16 : 20,
            })}
          >
            Your phone needed{" "}
            <Text style={styles.highlight}>{props.numberOfRounds}</Text> rounds
            to guess the number{" "}
            <Text style={styles.highlight}>{props.userNumber}</Text>
          </BodyText>
        </View>

        <MainButton onPress={props.onNewGame}>New Game</MainButton>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },

  imageContainer: {
    borderWidth: 3,
    borderColor: "black",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },
  resultContainer: {
    textAlign: "center",
    fontSize: 20,
  },

  resultText: {
    textAlign: "center",
  },

  highlight: {
    color: Colors.primary,
    fontFamily: "open-sans-bold",
  },
});

export default GameOver;
