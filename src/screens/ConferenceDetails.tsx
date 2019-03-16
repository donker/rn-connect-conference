import * as React from "react";
import { NavigationScreenProps, Header } from "react-navigation";
import { setConference, refreshConference } from "../actions/appActions";
import { IAppState } from "../models";
import { connect } from "react-redux";
import { IRootState } from "../models/state/state";
import { View, Text, Card, CardItem, Body, Button } from "native-base";
import { StyleSheet, ScrollView, SafeAreaView, Dimensions } from "react-native";
import Moment from "moment";
import { Image } from "react-native-expo-image-cache";
import PropValue from "./components/PropValue";
import SponsorListPropValue from "./components/SponsorListPropValue";

interface IConferenceDetailsProps {}
interface IStateProps {
  appState: IAppState;
}
interface IDispatchProps {
  setConference: typeof setConference;
  refreshConference: typeof refreshConference;
}
interface IProps
  extends IConferenceDetailsProps,
    IStateProps,
    IDispatchProps,
    NavigationScreenProps {}

class ConferenceDetails extends React.Component<IProps> {
  static navigationOptions = () => ({
    header: headerProps => <Header {...headerProps} />
  });

  private refreshConference() {
    if (this.props.appState.network) {
      this.props.refreshConference();
      this.props.navigation.navigate("LoadConference");
    }
  }

  public render() {
    var conf = this.props.appState.conference;
    var imgUri = `https://${
      conf.Site.Host
    }/DesktopModules/Connect/Conference/API/Conference/${
      conf.ConferenceId
    }/Conferences/Image?size=600`;
    Moment.locale("en");
    var dateString = `From ${Moment(conf.StartDate).format(
      "D MMM"
    )} to ${Moment(conf.EndDate).format("D MMM YYYY")}`;
    return (
      <ScrollView
        style={styles.container}
        contentInsetAdjustmentBehavior="automatic"
      >
        <SafeAreaView>
          <View>
            <Image uri={imgUri} style={styles.mainImg} resizeMode="cover" />
          </View>
          <Card>
            <CardItem header>
              <Text>{conf.Name}</Text>
            </CardItem>
            <CardItem>
              <Body>
                <PropValue prop="Location" value={conf.Location} />
                <PropValue prop="Description" value={conf.Description} />
                <PropValue prop="Dates" value={dateString} />
              </Body>
            </CardItem>
          </Card>
          <Card>
            <CardItem
              header
              button
              onPress={() => this.props.navigation.navigate("sponsors")}
            >
              <Text>Sponsors</Text>
            </CardItem>
            <CardItem>
              <Body>
                <SponsorListPropValue sponsors={conf.Sponsors} />
              </Body>
            </CardItem>
          </Card>
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button
                bordered
                block
                info
                onPress={() => this.props.navigation.navigate("cd_scanSession")}
                disabled={!this.props.appState.network}
              >
                <Text>Review Session</Text>
              </Button>
            </View>
            <View style={styles.button}>
              <Button
                bordered
                block
                info
                onPress={() => this.refreshConference()}
                disabled={!this.props.appState.network}
              >
                <Text>Refresh</Text>
              </Button>
            </View>
            <View style={styles.button}>
              <Button bordered block danger>
                <Text>Forget</Text>
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
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
    setConference,
    refreshConference
  }
)(ConferenceDetails);

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
  }
});
