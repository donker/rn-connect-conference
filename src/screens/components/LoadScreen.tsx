import * as React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ImageBackground
} from "react-native";
import { material, materialColors } from 'react-native-typography';

const LoadScreen = props => (
  <View style={styles.container}>
    <ImageBackground
      resizeMode={"stretch"}
      style={styles.bgImage}
      source={require("../../../assets/images/launchscreen-bg.png")}
    >
      <Text style={styles.loadingText}>Loading</Text>
      <ActivityIndicator />
    </ImageBackground>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  bgImage: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  loadingText: {
    ...material.headlineWhiteObject,
    color: materialColors.whitePrimary,
  }
});

export default LoadScreen;
