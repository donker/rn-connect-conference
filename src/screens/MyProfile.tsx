import * as React from "react";
import { ImagePicker, Permissions } from "expo";
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Image,
  Alert
} from "react-native";
import {
  View,
  Text,
  Card,
  CardItem,
  Body,
  Icon,
  Button,
  Fab
} from "native-base";
import { CacheManager } from "react-native-expo-image-cache";
import { IAppState, IAttendee, IConference } from "../models";
import {
  NavigationScreenProps,
  NavigationEventSubscription
} from "react-navigation";
import PropValue from "./components/PropValue";
import { material, materialColors } from "react-native-typography";
import { connect } from "react-redux";
import { IRootState } from "../models/state/state";
import { updateAttendee } from "../actions/appActions";
import { IAuthState } from "../models/state/authState";
import { IErrorState } from "../models/state/errorState";
import AppService from "../lib/appService";

interface IMyProfileProps {}
interface IStateProps {
  appState: IAppState;
  authState: IAuthState;
  errorState: IErrorState;
}
interface IDispatchProps {
  updateAttendee: typeof updateAttendee;
}
interface IProps
  extends IMyProfileProps,
    IStateProps,
    IDispatchProps,
    NavigationScreenProps {}

interface IState {
  active: boolean;
  person: IAttendee | null;
  cnt: number;
}

class MyProfile extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      active: false,
      person: null,
      cnt: 0
    };
  }
  getPerson(conference: IConference): IAttendee | null {
    let person = conference.Attendees
      ? conference.Attendees.find(
          a => a.UserId === this.props.appState.conference.Security.UserId
        )
      : null;
    if (person === undefined) person = null;
    return person;
  }
  changeImage(imgPickResult: ImagePicker.ImageResult): void {
    if (!imgPickResult.cancelled) {
      var service = new AppService({
        site: this.props.appState.conference.Site,
        token: this.props.authState.tokens.Item(this.props.appState.conference.Site.Host)
      });
      service
        .changeProfilePic(
          (this.state.person as IAttendee).UserId as number,
          imgPickResult.base64 as string
        )
        .then(res => {
          CacheManager.clearCache();
          this.props.updateAttendee(res);
        })
        .catch(err => {
          Alert.alert("Failed to update profile pic");
        });
    }
  }
  componentWillReceiveProps(props: IProps) {
    // setTimeout(() => {
    //   this.setState({ cnt: this.state.cnt + 1 });
    // }, 180000);
  }
  didFocusSubscription: NavigationEventSubscription;
  componentDidMount() {
    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      payload => {
        this.setState({
          person: this.getPerson(this.props.appState.conference)
        });
      }
    );
  }
  componentWillUnmount() {
    this.didFocusSubscription.remove();
  }
  edit() {
    this.props.navigation.navigate("ps_editprofile", {
      person: this.state.person
    });
  }
  async launchPicker(camera: boolean) {
    var res = await Permissions.askAsync(Permissions.CAMERA);
    if (res.status != "granted") {
      Alert.alert("You must allow the app to use the camera");
    }
    res = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (res.status != "granted") {
      Alert.alert("You must allow the app access to the camera roll");
    }
    if (camera) {
      ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        base64: true
      }).then(res => this.changeImage(res));
    } else {
      ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        base64: true
      }).then(res => this.changeImage(res));
    }
  }
  public render() {
    if (!this.props.appState.conference.Attendees) {
      return null; // todo
    }
    if (!this.state.person) {
      return null; // todo
    }
    let screenWidth = Dimensions.get("window").width;
    var imgUrl = `https://${
      this.props.appState.conference.Site.Host
    }/DnnImageHandler.ashx?mode=profilepic&w=${screenWidth}&h=${screenWidth}&nocache=true&userId=${
      this.state.person.UserId
    }&cnt=${this.state.cnt}`;
    return (
      <ScrollView
        style={styles.container}
        contentInsetAdjustmentBehavior="automatic"
      >
        <SafeAreaView>
          <View>
            <Image
              source={{ uri: imgUrl }}
              style={{ height: screenWidth }}
              resizeMode="cover"
            />
            <Fab
              active={this.state.active}
              direction="up"
              containerStyle={{}}
              style={{ backgroundColor: "#1CA3DC" }}
              position="bottomRight"
              onPress={() => this.setState({ active: !this.state.active })}
            >
              <Icon name="build" />
              <Button
                style={{ backgroundColor: "#EE3644" }}
                onPress={() => {
                  this.launchPicker(true);
                }}
              >
                <Icon name="camera" />
              </Button>
              <Button
                style={{ backgroundColor: "#47292b" }}
                onPress={() => {
                  this.launchPicker(false);
                }}
              >
                <Icon name="images" />
              </Button>
            </Fab>
          </View>
          <View style={{ padding: 10 }}>
            <Card>
              <CardItem header>
                <View style={{ flexDirection: "column" }}>
                  <Text>{this.state.person.DisplayName}</Text>
                </View>
              </CardItem>
              <CardItem>
                <Body>
                  <PropValue prop="Company" value={this.state.person.Company} />
                  <PropValue prop="About" value={this.state.person.Biography} />
                </Body>
              </CardItem>
            </Card>
            <Button block bordered info onPress={() => this.edit()}>
              <Text>Edit</Text>
            </Button>
          </View>
        </SafeAreaView>
      </ScrollView>
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
    updateAttendee
  }
)(MyProfile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  mainImg: {
    height: Dimensions.get("window").width / 2.5
  },
  titleBox: {
    height: 40,
    padding: 10,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    padding: 10,
    flex: 1
  },
  sectionTitle: {
    ...material.headlineObject,
    color: materialColors.blackPrimary
  }
});
