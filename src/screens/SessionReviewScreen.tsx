import * as React from "react";
import { StyleSheet, ScrollView, SafeAreaView, Alert } from "react-native";
import {
  ISession,
  Session,
  IAppState,
  SessionEvaluation,
  ISessionAttendee
} from "../models";
import { NavigationScreenProps } from "react-navigation";
import { material, materialColors } from "react-native-typography";
import { List, ListItem, Left, Body, Text, Button } from "native-base";
import { Image } from "react-native-expo-image-cache";
import PropValue from "./components/PropValue";
import Moment from "moment";
import { connect } from "react-redux";
import { IRootState } from "../models/state/state";
import ReviewEdit from "./components/ReviewEdit";
import { updateAttendance } from "../actions/appActions";
import { IAuthState } from "../models/state/authState";
import { IErrorState } from "../models/state/errorState";
import AppService from "../lib/appService";

interface ISessionReviewScreenProps {}
interface IStateProps {
  appState: IAppState;
  authState: IAuthState;
  errorState: IErrorState;
}
interface IDispatchProps {
  updateAttendance: typeof updateAttendance;
}
interface IProps
  extends ISessionReviewScreenProps,
    IStateProps,
    IDispatchProps,
    NavigationScreenProps {}

interface IState {
  session: ISession;
  attendance: ISessionAttendee;
  redirectToRoute?: string;
}

class SessionReviewScreen extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      session: this.props.navigation.getParam("session", new Session()),
      attendance: this.props.navigation.getParam("attendance", new Session()),
      redirectToRoute: this.props.navigation.getParam(
        "redirectToRoute",
        undefined
      )
    };
  }

  onSubmitReview(sessionId: number, stars: number, reviewText: string) {
    var review = new SessionEvaluation();
    review.UserId = this.props.appState.conference.Security.UserId;
    review.SessionId = sessionId;
    review.Stars = stars;
    review.Review = reviewText;
    var service = new AppService({
      site: this.props.appState.conference.Site,
      token: this.props.authState.tokens.Item(this.props.appState.conference.Site.Host)
    });
    service
      .submitEvaluation(review)
      .then(res => {
        this.props.updateAttendance(
          Object.assign({}, this.state.attendance, {
            HasEvaluated: true
          })
        );
        if (this.state.redirectToRoute) {
          this.props.navigation.navigate(this.state.redirectToRoute);
        } else {
          this.props.navigation.goBack();
        }
      })
      .catch(err => {
        Alert.alert("Couldn't submit review");
      });
  }

  render() {
    let speakers = this.state.session.SessionSpeakers.map(ss => (
      <ListItem
        thumbnail
        key={ss.UserId}
        style={{ marginTop: 20, marginBottom: 20 }}
      >
        <Left>
          <Image
            uri={`https://${
              this.props.appState.conference.Site.Host
            }/DnnImageHandler.ashx?mode=profilepic&w=40&h=40&userId=${
              ss.UserId
            }`}
            style={{ height: 40, width: 40 }}
            resizeMode="contain"
          />
        </Left>
        <Body>
          <Text>{ss.DisplayName}</Text>
          <Text note>{ss.Company}</Text>
        </Body>
      </ListItem>
    ));
    let whereAndWhen = this.state.session.IsScheduled ? (
      <PropValue
        prop="Where and when"
        value={`${this.state.session.LocationName} on ${Moment(
          this.state.session.SessionDateAndTime
        ).format("ddd D MMM")} at ${Moment(
          this.state.session.SessionDateAndTime
        ).format("HH:mm")}`}
      />
    ) : null;
    var edit = this.state.attendance.HasEvaluated ? (
      <Button success block bordered>
        <Text>You already reviewed this session</Text>
      </Button>
    ) : (
      <ReviewEdit
        InitialStars={3}
        InitialReview=""
        onSubmit={(s, r) =>
          this.onSubmitReview(this.state.session.SessionId, s, r)
        }
      />
    );
    return (
      <ScrollView
        style={styles.container}
        contentInsetAdjustmentBehavior="automatic"
      >
        <SafeAreaView>
          <Text style={styles.title}>{this.state.session.Title}</Text>
          <Text style={styles.subtitle}>{this.state.session.SubTitle}</Text>
          <List>{speakers}</List>
          {whereAndWhen}
          <PropValue prop="Level" value={this.state.session.Level} />
          {edit}
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
    updateAttendance
  }
)(SessionReviewScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10
  },
  title: {
    ...material.headlineObject,
    color: materialColors.blackPrimary
  },
  subtitle: {
    ...material.subheadingObject,
    color: materialColors.blackSecondary
  },
  sectionTitle: {
    ...material.subheadingObject,
    color: materialColors.blackPrimary
  },
  inputLabel: {
    ...material.subheadingObject,
    color: materialColors.blackSecondary,
    marginTop: 15,
    marginBottom: 5
  },
  footerWrapper: {
    flexWrap: "wrap",
    alignItems: "flex-start",
    flexDirection: "row"
  },
  footerWrapperNC: {
    flexDirection: "column"
  }
});
