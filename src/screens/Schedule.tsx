import * as React from "react";
import { NavigationScreenProps } from "react-navigation";
import { IAppState } from "../models";
import { connect } from "react-redux";
import { IRootState } from "../models/state/state";
import { StyleSheet, ScrollView, Picker, TouchableOpacity } from "react-native";
import Moment from "moment";
import {
  Tabs,
  Tab,
  Container,
  Header,
  Body,
  Text,
  Card,
  CardItem
} from "native-base";
import { material, materialColors } from "react-native-typography";

interface IScheduleProps {}
interface IStateProps {
  appState: IAppState;
}
interface IDispatchProps {}
interface IProps
  extends IScheduleProps,
    IStateProps,
    IDispatchProps,
    NavigationScreenProps {}

interface IState {
  Day: number;
}

class Schedule extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    var day = props.appState.conference.Days.find(
      d => Moment().diff(d.DayDate, "days") == 0
    );
    this.state = {
      Day: day ? day.DayNr : 1
    };
  }
  gotoSession(sessionId?: number) {
    console.log(sessionId);
    this.props.navigation.navigate("schs_session", {
      host: this.props.appState.conference.Site.Host,
      session: this.props.appState.conference.Sessions.find(
        s => s.SessionId === sessionId
      ),
      stack: "schs_"
    });
  }
  public renderSchedule(day: number, location: number): JSX.Element | null {
    let daySchedule = this.props.appState.conference.Schedule.Days.find(
      d => d.key == day
    );
    if (daySchedule) {
      let listElements: JSX.Element[] = [];
      let i = 0;
      daySchedule.value.Events.forEach(ev => {
        i++;
        if (ev.LocationId == -1 || ev.LocationId == location) {
          if (ev.SlotType == 0) {
            listElements.push(
              <TouchableOpacity
                key={i}
                onPress={() => this.gotoSession(ev.SessionId)}
              >
                <Card>
                  <CardItem header bordered>
                    <Text>
                      {`${Moment(ev.EventTimeFrom).format("LT")} - ${Moment(
                        ev.EventTimeTo
                      ).format("LT")}`}{" "}
                      {ev.IsPlenary ? "Plenary Session" : null}
                    </Text>
                  </CardItem>
                  <CardItem bordered>
                    <Body>
                      <Text style={styles.sessionTitle}>{ev.Title}</Text>
                      <Text style={styles.sessionSubtitle}>{ev.Subtitle}</Text>
                      <Text style={styles.speakers}>{ev.Speakers}</Text>
                    </Body>
                  </CardItem>
                </Card>
              </TouchableOpacity>
            );
          } else {
            listElements.push(
              <Card key={i}>
                <CardItem bordered style={{ backgroundColor: "#ddd" }}>
                  <Body>
                    <Text>
                      {`${Moment(ev.EventTimeFrom).format("LT")} - ${Moment(
                        ev.EventTimeTo
                      ).format("LT")}`}{" "}
                      {ev.Title}
                    </Text>
                  </Body>
                </CardItem>
              </Card>
            );
          }
        }
      });
      return <ScrollView>{listElements}</ScrollView>;
    }
    return null;
  }
  public render() {
    var days = this.props.appState.conference.Days.map(d => (
      <Picker.Item
        key={d.DayNr}
        label={Moment(d.DayDate).format("l")}
        value={d.DayNr}
      />
    ));
    var locations = this.props.appState.conference.Locations.map(l => (
      <Tab key={l.LocationId} heading={l.Name}>
        {this.renderSchedule(this.state.Day, l.LocationId)}
      </Tab>
    ));
    return (
      <Container>
        <Header
          style={{
            height: 80,
            borderWidth: 1
          }}
        >
          <Body>
            <Picker
              selectedValue={this.state.Day}
              style={{
                height: 90,
                width: "100%"
              }}
              itemStyle={{ height: 50 }}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ Day: itemValue })
              }
            >
              {days}
            </Picker>
          </Body>
        </Header>
        <Tabs>{locations}</Tabs>
      </Container>
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
)(Schedule);

const styles = StyleSheet.create({
  sessionTitle: {
    ...material.body2Object,
    color: materialColors.blackPrimary
  },
  sessionSubtitle: {
    ...material.body1Object,
    color: materialColors.blackPrimary
  },
  speakers: {
    ...material.subheadingObject,
    color: materialColors.blackSecondary
  }
});
