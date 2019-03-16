import * as React from "react";
import { NavigationScreenProps } from "react-navigation";
import { IAppState } from "../models";
import { connect } from "react-redux";
import { IRootState } from "../models/state/state";
import { StyleSheet, ScrollView, Picker } from "react-native";
import Moment from "moment";
import {
  Tabs,
  Tab,
  Container,
  Header,
  Body,
  List,
  ListItem,
  Text
} from "native-base";

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
  public renderSchedule(day: number, location: number): JSX.Element | null {
    let daySchedule = this.props.appState.conference.Schedule.Days.find(
      d => d.key == day
    );
    if (daySchedule) {
      let listElements: JSX.Element[] = [];
      daySchedule.value.Events.forEach(ev => {
        if (ev.LocationId == -1 || ev.LocationId == location) {
          listElements.push(
            <ListItem itemDivider>
              <Text>{`${Moment(ev.EventTimeFrom).format("LT")} - ${Moment(
                ev.EventTimeTo
              ).format("LT")}`}</Text>
            </ListItem>
          );
          listElements.push(
            <ListItem>
              <Body>
                <Text>{ev.Title}</Text>
                <Text note>{ev.Speakers}</Text>
              </Body>
            </ListItem>
          );
        }
      });
      return (
        <ScrollView>
          <List>{listElements}</List>
        </ScrollView>
      );
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
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  controls: {
    flex: 1
  },
  tabContainer: {
    flex: 4
  }
});
