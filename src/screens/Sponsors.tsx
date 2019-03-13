import * as React from "react";
import { NavigationScreenProps, createStackNavigator } from "react-navigation";
import { IAppState } from "../models";
import { connect } from "react-redux";
import { IRootState } from "../models/state/state";
import { StyleSheet, ScrollView, SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Container, Header, Content } from "native-base";
import Sponsor from "./components/Sponsor";

interface ISponsorsComponentProps {}
interface IStateProps {
  appState: IAppState;
}
interface IDispatchProps {}
interface IProps
  extends ISponsorsComponentProps,
    IStateProps,
    IDispatchProps,
    NavigationScreenProps {}

class SponsorsComponent extends React.Component<IProps> {
  public render() {
    let sponsors = this.props.appState.conference.Sponsors.map(sponsor => (
      <Sponsor
        key={sponsor.SponsorId}
        sponsor={sponsor}
        host={this.props.appState.conference.Site.Host}
        conferenceId={this.props.appState.conference.ConferenceId}
      />
    ));
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView style={styles.container}>
          <Container>
            <Content>{sponsors}</Content>
          </Container>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const SponsorsScreen = connect(
  (state: IRootState): IStateProps => {
    return {
      appState: state.app
    };
  },
  {}
)(SponsorsComponent);

const Sponsors = createStackNavigator({
  Conference: {
    screen: SponsorsScreen,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: "Sponsors",
        headerLeft: (
          <Icon
            style={{ paddingLeft: 10 }}
            onPress={() => navigation.openDrawer()}
            name="md-menu"
            size={30}
          />
        )
      };
    }
  }
});

export default Sponsors;

const styles = StyleSheet.create({
  container: {}
});
