import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  Text,
  Dimensions,
  ScrollView,
  LogBox
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";

import NumberContainer from "../NumberContainer";
import Card from "../Card";
import TitleText from "../TitleText";
import MainButton from "../MainButton";

const generateRandomBetween = (min, max, exclude) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  const rndNumber = Math.floor(Math.random() * (max - min)) + min;

  if (rndNumber === exclude) {
    return generateRandomBetween(min, max, exclude);
  } else {
    return rndNumber;
  }
};

const renderListItem = (listLength, itemData) => (
  <View style={styles.listItem}>
    <Text>#{listLength - itemData.index}</Text>
    <Text>{itemData.item}</Text>
  </View>
);

const GameScreen = (props) => {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

  //#region Declarations

  const initialGuess = generateRandomBetween(1, 100, props.userChoice);
  const [currentGuess, setCurrentGuess] = useState(initialGuess);
  const [pastGuesses, setPastGuesses] = useState([initialGuess.toString()]);
  const [availableDeviceWidth, setAvailableDeviceWidth] = useState(
    Dimensions.get("window").width
  );
  const [availableDeviceHeight, setAvailableDeviceHeight] = useState(
    Dimensions.get("window").height
  );
  const currentLow = useRef(1);
  const currentHigh = useRef(100);

  const { gameOver, userChoice } = props;

  //#endregion

  useEffect(_ => {
    LogBox.ignoreAllLogs(["VirtualizedLists should never be nested"]);
  });

  useEffect(() => {
    const adjustLayout = () => {
      setAvailableDeviceWidth(Dimensions.get("window").width);
      setAvailableDeviceHeight(Dimensions.get("window").height);
    };

    Dimensions.addEventListener("change", adjustLayout);
    return () => {
      Dimensions.removeEventListener("change", adjustLayout);
    };
  });

  useEffect(
    (_) => {
      if (currentGuess === userChoice) {
        gameOver(pastGuesses.length);
      }
    },
    [currentGuess, gameOver, userChoice]
  );

  const nextGuessHandler = (direction) => {
    if (
      (direction === "lower" && currentGuess < props.userChoice) ||
      (direction === "greater" && currentGuess > props.userChoice)
    ) {
      Alert.alert("Don't lie!", "You know that this is wrong...", [
        { text: "Give Hint", style: "cancel" },
      ]);
      return;
    }

    if (direction === "lower") {
      currentHigh.current = currentGuess;
    } else {
      currentLow.current = currentGuess + 1;
    }

    const nextNumber = generateRandomBetween(
      currentLow.current,
      currentHigh.current,
      currentGuess
    );

    setCurrentGuess(nextNumber);
    // setRounds((currentRounds) => currentRounds + 1);

    setPastGuesses((currPastGuess) => [nextNumber.toString(), ...pastGuesses]);
  };

  let listStyle = styles.listContainerBig;
  //
  if (availableDeviceWidth > 350) listStyle = styles.listContainer;

  let gameControls = (
    <React.Fragment>
      <NumberContainer>{currentGuess}</NumberContainer>

      <Card
        style={{
          ...styles.buttonContainer,
          ...{
            marginTop: availableDeviceHeight > 600 ? 20 : 5,
          },
        }}
      >
        <MainButton onPress={nextGuessHandler.bind(this, "lower")}>
          <Ionicons name="md-remove" size={24} />
        </MainButton>
        <MainButton onPress={nextGuessHandler.bind(this, "greater")}>
          <Ionicons name="md-add" size={24} />
        </MainButton>
      </Card>
    </React.Fragment>
  );

  if (availableDeviceHeight < 500) {
    gameControls = (
      <View style={styles.controls}>
        <MainButton onPress={nextGuessHandler.bind(this, "lower")}>
          <Ionicons name="md-remove" size={24} />
        </MainButton>
        <NumberContainer>{currentGuess}</NumberContainer>
        <MainButton onPress={nextGuessHandler.bind(this, "greater")}>
          <Ionicons name="md-add" size={24} />
        </MainButton>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.screen}>
        <TitleText>Opponent Guess:</TitleText>
        {gameControls}
        <View style={listStyle}>
          <FlatList
            keyExtractor={(item) => item}
            data={pastGuesses}
            renderItem={renderListItem.bind(this, pastGuesses.length)}
            contentContainerStyle={styles.list}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 400,
    maxWidth: "90%",
  },
  listItem: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 15,
    marginVertical: 10,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "80%",
  },

  listContainer: {
    flex: 1,
    width: "60%",
  },

  listContainerBig: {
    flex: 1,
    width: "80%",
  },

  list: {
    flexGrow: 1,
    // alignItems: 'center',
    justifyContent: "flex-end",
  },
});

export default GameScreen;
