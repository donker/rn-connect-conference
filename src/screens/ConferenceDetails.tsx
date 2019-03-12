import * as React from "react";
import { NavigationScreenProps } from "react-navigation";
import { setConference } from "../actions/appActions";
import { IAppState } from "../models";
import { connect } from "react-redux";
import { IRootState } from "../models/state/state";
import { View, Text, Card, CardItem, Body } from "native-base";
import { StyleSheet, ScrollView, SafeAreaView, Dimensions } from "react-native";
import Moment from "moment";
import { Image } from "react-native-expo-image-cache";
import PropValue from "./components/PropValue";

interface IConferenceDetailsProps {}
interface IStateProps {
  appState: IAppState;
}
interface IDispatchProps {
  setConference: typeof setConference;
}
interface IProps
  extends IConferenceDetailsProps,
    IStateProps,
    IDispatchProps,
    NavigationScreenProps {}

class ConferenceDetails extends React.Component<IProps> {
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
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView style={styles.container}>
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
        </ScrollView>
      </SafeAreaView>
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
)(ConferenceDetails);

const styles = StyleSheet.create({
  container: {
  },
  mainImg: {
    height: Dimensions.get("window").width / 2.5,
  },
  titleBox: {
    height: 40,
    padding: 10,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }
});
