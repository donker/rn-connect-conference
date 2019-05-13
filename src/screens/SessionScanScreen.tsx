import React, { Component } from "react";
import { Dimensions, Text, View, StyleSheet } from "react-native";
import { BarCodeScanner, Permissions } from "expo";
import Icon from "react-native-vector-icons/Ionicons";
import { IRootState } from "../models/state/state";
import { IAppState, ISession, Session, ISessionAttendee } from "../models";
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { updateAttendance } from "../actions/appActions";
import AppService from "../lib/appService";
import { IAuthState } from "../models/state/authState";
import { IErrorState } from "../models/state/errorState";

interface ISessionScanScreenProps {}
interface IStateProps {
  appState: IAppState;
  authState: IAuthState;
  errorState: IErrorState;
}
interface IDispatchProps {
  updateAttendance: typeof updateAttendance;
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
        let scannedSession: { sid: number } = JSON.parse(
          "{" + result.data + "}"
        );
        let session: ISession = new Session();
        this.props.appState.conference.Sessions.forEach(s => {
          if (s.SessionId == scannedSession.sid) {
            session = s;
          }
        });
        if (session != null) {
          var service = new AppService({
            site: this.props.appState.conference.Site,
            token: this.props.authState.tokens.Item(this.props.appState.conference.Site.Host)
          });
          service
            .attendSession(session.SessionId)
            .then((res: ISessionAttendee) => {
              this.props.updateAttendance(res);
              this.props.navigation.navigate("reviewSession", {
                session: session,
                attendance: res,
                redirectToRoute: "cd_conference"
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
                  data: '"sid":224'
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
      appState: state.app,
      authState: state.auth,
      errorState: state.error
    };
  },
  {
    updateAttendance
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
