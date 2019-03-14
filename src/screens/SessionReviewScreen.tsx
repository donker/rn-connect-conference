import * as React from "react";
import { StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { ISession, Session, IAppState, SessionEvaluation } from "../models";
import { NavigationScreenProps } from "react-navigation";
import { material, materialColors } from "react-native-typography";
import {
  List,
  ListItem,
  Left,
  Body,
  Text,
  Button,
  Textarea,
  Card,
  CardItem
} from "native-base";
import { Image } from "react-native-expo-image-cache";
import PropValue from "./components/PropValue";
import Moment from "moment";
import { connect } from "react-redux";
import { IRootState } from "../models/state/state";
import StarRating from "react-native-star-rating";
import Service from "../lib/service";

interface ISessionReviewScreenProps {}
interface IStateProps {
  appState: IAppState;
}
interface IDispatchProps {}
interface IProps
  extends ISessionReviewScreenProps,
    IStateProps,
    IDispatchProps,
    NavigationScreenProps {}

interface IState {
  reviewText: string;
  starCount: number;
}

class SessionReviewScreen extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      reviewText: "",
      starCount: 3
    };
  }

  onSubmitReview(sessionId: number) {
    var review = new SessionEvaluation();
    review.UserId = this.props.appState.conference.Security.UserId;
    review.SessionId = sessionId;
    review.Stars = this.state.starCount;
    review.Review = this.state.reviewText;
    Service.submitEvaluation(
      this.props.appState.conference.Site,
      this.props.appState.conference.ConferenceId,
      review
    ).then(res => {
      this.props.navigation.navigate("conference");
    });
  }

  render() {
    let session: ISession = this.props.navigation.getParam(
      "session",
      new Session()
    );
    let speakers = session.SessionSpeakers.map(ss => (
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
    let whereAndWhen = session.IsScheduled ? (
      <PropValue
        prop="Where and when"
        value={`${session.LocationName} on ${Moment(
          session.SessionDateAndTime
        ).format("ddd D MMM")} at ${Moment(session.SessionDateAndTime).format(
          "HH:mm"
        )}`}
      />
    ) : null;
    return (
      <ScrollView
        style={styles.container}
        contentInsetAdjustmentBehavior="automatic"
      >
        <SafeAreaView>
          <Text style={styles.title}>{session.Title}</Text>
          <Text style={styles.subtitle}>{session.SubTitle}</Text>
          <List>{speakers}</List>
          {whereAndWhen}
          <PropValue prop="Level" value={session.Level} />
          <Card>
            <CardItem header>
              <Text>Your Review</Text>
            </CardItem>
            <CardItem>
              <Body>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  fullStarColor="gold"
                  rating={this.state.starCount}
                  selectedStar={rating => this.setState({ starCount: rating })}
                />
                <Text style={styles.inputLabel}>Comments</Text>
                <Textarea
                  style={{
                    width: "100%",
                    borderWidth: 1,
                    borderColor: "#999",
                    padding: 6,
                    borderRadius: 6,
                    marginTop: 10,
                    marginBottom: 10
                  }}
                  rowSpan={4}
                  onChangeText={text => this.setState({ reviewText: text })}
                  value={this.state.reviewText}
                />
                <Button
                  block
                  primary
                  onPress={() => this.onSubmitReview(session.SessionId)}
                >
                  <Text>Submit</Text>
                </Button>
              </Body>
            </CardItem>
          </Card>
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
  {}
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
