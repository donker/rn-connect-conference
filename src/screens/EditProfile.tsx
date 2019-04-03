import * as React from "react";
import { NavigationScreenProps } from "react-navigation";
import { IAppState, Attendee, IAttendee } from "../models";
import { connect } from "react-redux";
import { IRootState } from "../models/state/state";
import { StyleSheet, ScrollView, SafeAreaView, View } from "react-native";
import {
  Input,
  Form,
  Item as FormItem,
  Label,
  Button,
  Text,
  Textarea
} from "native-base";
import { material, materialColors } from "react-native-typography";
import { updateAttendee, updateSpeaker } from "../actions/appActions";
import { IAuthState } from "../models/state/authState";
import { IErrorState } from "../models/state/errorState";
import AppService from "../lib/appService";

interface IEditProfileProps {}
interface IStateProps {
  appState: IAppState;
  authState: IAuthState;
  errorState: IErrorState;
}
interface IDispatchProps {
  updateAttendee: typeof updateAttendee;
  updateSpeaker: typeof updateSpeaker;
}
interface IProps
  extends IEditProfileProps,
    IStateProps,
    IDispatchProps,
    NavigationScreenProps {}

interface IState {
  UserId?: number;
  DisplayName: string;
  FirstName: string;
  LastName: string;
  Biography: string;
  ShortBiography: string;
  Company: string;
  isSpeaker: boolean;
  errorString: string;
}

class EditProfile extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    var person: IAttendee = props.navigation.getParam("person", new Attendee());
    var speaker = props.appState.conference.Speakers.find(
      s => s.UserId == person.UserId
    );
    this.state = {
      ...person,
      ShortBiography: speaker ? speaker.DescriptionShort : "",
      isSpeaker: speaker != undefined,
      errorString: ""
    };
  }
  private save() {
    var service = new AppService({
      site: this.props.appState.conference.Site,
      token: this.props.authState.tokens.Item(this.props.appState.conference.Site.Host)
    });
    service
      .editProfile(this.state.UserId as number, { ...this.state })
      .then(res => {
        let attendee = this.props.appState.conference.Attendees
          ? this.props.appState.conference.Attendees.find(
              a => a.UserId == this.state.UserId
            )
          : undefined;
        if (attendee) {
          attendee = Object.assign({}, attendee, res);
          this.props.updateAttendee(attendee);
        }
        let speaker = this.props.appState.conference.Speakers.find(
          s => s.UserId == this.state.UserId
        );
        if (speaker) {
          speaker = Object.assign({}, speaker, res);
          speaker.Description = res.Biography;
          speaker.DescriptionShort = res.ShortBiography;
          this.props.updateSpeaker(speaker);
        }
        // console.log("receiving ", res);
        this.props.navigation.goBack();
      })
      .catch(err => {
        // do nothing
      });
  }
  public render() {
    var shortBio = this.state.isSpeaker ? (
      <View style={{ marginLeft: 15 }}>
        <Text style={styles.inputLabel}>Short Biography (for speakers)</Text>
        <Textarea
          style={{
            borderWidth: 1,
            borderColor: "#999",
            padding: 6,
            borderRadius: 6,
            marginTop: 10,
            marginBottom: 10
          }}
          rowSpan={3}
          onChangeText={text => this.setState({ ShortBiography: text })}
          value={this.state.ShortBiography}
        />
      </View>
    ) : null;
    return (
      <ScrollView
        style={styles.container}
        contentInsetAdjustmentBehavior="automatic"
      >
        <SafeAreaView>
          <Form style={{ padding: 10 }}>
            <FormItem floatingLabel>
              <Label>Display Name</Label>
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                value={this.state.DisplayName}
                onChangeText={txt => this.setState({ DisplayName: txt })}
              />
            </FormItem>
            <FormItem floatingLabel>
              <Label>Last Name</Label>
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                value={this.state.LastName}
                onChangeText={txt => this.setState({ LastName: txt })}
              />
            </FormItem>
            <FormItem floatingLabel>
              <Label>First Name</Label>
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                value={this.state.FirstName}
                onChangeText={txt => this.setState({ FirstName: txt })}
              />
            </FormItem>
            <FormItem floatingLabel>
              <Label>Company Name</Label>
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                value={this.state.Company}
                onChangeText={txt => this.setState({ Company: txt })}
              />
            </FormItem>
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.inputLabel}>Biography</Text>
              <Textarea
                style={{
                  borderWidth: 1,
                  borderColor: "#999",
                  padding: 6,
                  borderRadius: 6,
                  marginTop: 10,
                  marginBottom: 10
                }}
                rowSpan={8}
                onChangeText={text => this.setState({ Biography: text })}
                value={this.state.Biography}
              />
            </View>
            {shortBio}
            <Button
              full
              primary
              style={{
                padding: 10,
                marginTop: 14,
                borderRadius: 4,
                marginLeft: 15
              }}
              onPress={() => this.save()}
            >
              <Text> Save </Text>
            </Button>
            <Text>{this.state.errorString}</Text>
          </Form>
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
    updateAttendee,
    updateSpeaker
  }
)(EditProfile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  inputLabel: {
    ...material.subheadingObject,
    color: materialColors.blackSecondary,
    marginTop: 15,
    marginBottom: 5
  }
});
