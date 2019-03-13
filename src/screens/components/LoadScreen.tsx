import * as React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

const LoadScreen = props => (
  <View style={styles.container}>
    <Text>Loading</Text>
    <ActivityIndicator />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default LoadScreen;
