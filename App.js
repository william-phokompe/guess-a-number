import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import Header from "./components/Header";
import StartGame from "./components/screens/StartGame";
import GameScreen from "./components/screens/GameScreen";
import GameOver from "./components/screens/GameOver";

import * as Font from "expo-font";
import AppLoading from "expo-app-loading";

const fetchFonts = () => {
  Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });
};

export default function App() {
  const [UserNumber, setUserNumber] = useState();
  const [gameRounds, setGameRounds] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // const [dataLoaded] = Font.useFonts({
  //   OpenSansRegular: require("./assets/fonts/OpenSans-Regular.ttf"),
  //   OpenSansBold: require("./assets/fonts/OpenSans-Bold.ttf"),
  // })

  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setDataLoaded(true)}
        onError={ (err) => console.log(err) }
      />
    );
  } 

  const startGameHandler = (selectedNumber) => {
    setUserNumber(selectedNumber);
    setGameRounds(0);
  };

  const configureNewGameHandler = (_) => {
    setGameRounds(0);
    setUserNumber(null);
  };

  let content = <StartGame onStartGame={startGameHandler} />;

  if (UserNumber && gameRounds <= 0) {
    content = <GameScreen userChoice={UserNumber} gameOver={gameOverHandler} />;
  } else if (gameRounds > 0) {
    content = (
      <GameOver
        numberOfRounds={gameRounds}
        userNumber={UserNumber}
        onNewGame={configureNewGameHandler}
      />
    );
  }

  function gameOverHandler(numberOfRounds) {
    setGameRounds(numberOfRounds);
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="auto" />

      <Header title="Guess A Number" />
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
