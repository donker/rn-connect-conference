import * as React from "react";
import { View, Text, StyleSheet, Linking } from "react-native";
import { material } from "react-native-typography";

interface IPropValueProps {
  prop: string;
  value: string | null;
  type?: string;
  mustShow?: boolean;
}

export default class PropValue extends React.Component<IPropValueProps> {
  render() {
    if (
      (this.props.value === null ||
        this.props.value == "" ||
        this.props.value == "Invalid date") &&
      !this.props.mustShow
    )
      return null;
    let valBlock: JSX.Element | null = null;
    switch (this.props.type) {
      case "phone":
        valBlock = (
          <Text
            style={[
              material.body1,
              styles.valueText,
              { textDecorationLine: "underline", color: "blue" }
            ]}
            onPress={e => Linking.openURL("tel:" + this.props.value)}
          >
            {this.props.value}
          </Text>
        );
        break;
      case "email":
        valBlock = (
          <Text
            style={[
              material.body1,
              styles.valueText,
              { textDecorationLine: "underline", color: "blue" }
            ]}
            onPress={e => Linking.openURL("mailto:" + this.props.value)}
          >
            {this.props.value}
          </Text>
        );
        break;
      default:
        valBlock = (
          <Text style={[material.body1, styles.valueText]}>
            {this.props.value}
          </Text>
        );
    }
    return (
      <View style={styles.container}>
        <View style={styles.propBox}>
          <Text style={[material.body1, styles.propText]}>
            {this.props.prop}
          </Text>
        </View>
        <View style={styles.valueBox}>{valBlock}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
    paddingLeft: 8
  },
  propBox: {},
  valueBox: {},
  propText: {
    color: "#666"
  },
  valueText: {}
});
