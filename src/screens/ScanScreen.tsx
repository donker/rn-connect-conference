import React, { Component } from "react";
import { Dimensions, Text, View, StyleSheet } from "react-native";
import { BarCodeScanner, Permissions } from "expo";
import Icon from "react-native-vector-icons/Ionicons";
import { IRootState } from "../models/state/state";
import { IAppState, Conference, ISite } from "../models";
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";

interface IScanScreenProps {
}
interface IStateProps {
  appState: IAppState;
}
interface IDispatchProps {}
interface IProps extends IScanScreenProps, IStateProps, IDispatchProps, NavigationScreenProps {}

interface IState {
  hasCameraPermission: boolean | null;
  lastScannedUrl: any;
}

class ScanScreen extends Component<IProps, IState> {
  state = {
    hasCameraPermission: null,
    lastScannedUrl: null
  };

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === "granted"
    });
  };

  _handleBarCodeRead = (result: { type: string; data: string }) => {
    if (result.data !== this.state.lastScannedUrl) {
      // LayoutAnimation.spring();
      this.setState({ lastScannedUrl: result.data });
      try {
        let scannedSite: ISite = JSON.parse(result.data);
        let conf = new Conference();
        conf.Site = scannedSite;
        this.props.navigation.navigate("Login");
      } catch (error) {}
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.hasCameraPermission === null ? (
          <Text>Requesting for camera permission</Text>
        ) : this.state.hasCameraPermission === false ? (
          <Text style={{ color: "#fff" }}>
            Camera permission is not granted
          </Text>
        ) : (
          <BarCodeScanner
            onBarCodeScanned={res => this._handleBarCodeRead(res)}
            style={[StyleSheet.absoluteFill, styles.container]}
          >
            <Text style={styles.description}>Scan your QR code</Text>
            <Text
              onPress={() => this.props.navigation.goBack()}
              style={styles.cancel}
            >
              Cancel
            </Text>
            <Icon name="ios-qr-scanner" style={styles.qr} />
          </BarCodeScanner>
        )}
      </View>
    );
  }
}

export default connect(
  (state: IRootState): IStateProps => {
    return {
      appState: state.app
    };
  },
  {}
)(ScanScreen);

const { width } = Dimensions.get("window");
const qrSize = width * 0.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  qr: {
    color: "white",
    fontSize: qrSize,
    marginTop: "20%",
    marginBottom: "20%"
  },
  description: {
    fontSize: width * 0.09,
    marginTop: "10%",
    textAlign: "center",
    width: "70%",
    color: "white"
  },
  cancel: {
    fontSize: width * 0.05,
    textAlign: "center",
    width: "70%",
    color: "white"
  }
});
