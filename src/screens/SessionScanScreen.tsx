import React, { Component } from "react";
import { Dimensions, Text, View, StyleSheet } from "react-native";
import { BarCodeScanner, Permissions } from "expo";
import Icon from "react-native-vector-icons/Ionicons";
import { IRootState } from "../models/state/state";
import {
  IAppState,
  Conference,
  IScannedSite,
  ISession,
  Session
} from "../models";
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { setConference } from "../actions/appActions";
import Service from "../lib/service";

interface ISessionScanScreenProps {}
interface IStateProps {
  appState: IAppState;
}
interface IDispatchProps {
  setConference: typeof setConference;
}
interface IProps
  extends ISessionScanScreenProps,
    IStateProps,
    IDispatchProps,
    NavigationScreenProps {}

interface IState {
  hasCameraPermission: boolean | null;
  lastScannedUrl: any;
}

class SessionScanScreen extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      lastScannedUrl: null
    };
  }

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
      this.setState({ lastScannedUrl: result.data });
      try {
        let scannedSession: { id: number } = JSON.parse(result.data);
        let session: ISession = new Session();
        this.props.appState.conference.Sessions.forEach(s => {
          if (s.SessionId == scannedSession.id) {
            session = s;
          }
        });
        if (session != null) {
          Service.attendSession(
            this.props.appState.conference.Site,
            this.props.appState.conference.ConferenceId,
            session.SessionId
          )
            .then(res => {
              this.props.navigation.navigate("reviewSession", {
                session: session
              });
            })
            .catch(err => {
              console.log(err);
            });
        }
      } catch (error) {
        console.log(error);
      }
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
            <Text
              style={styles.cancel}
              onPress={() => {
                let s = {
                  type: "qr",
                  data: '{"id":224}'
                };
                this._handleBarCodeRead(s);
              }}
            >
              Mock Scan
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
  {
    setConference
  }
)(SessionScanScreen);

const { width } = Dimensions.get("window");
const qrSize = width * 0.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "yellow"
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
