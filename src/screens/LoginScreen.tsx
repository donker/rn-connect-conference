import React, { Component } from "react";
import { Constants } from "expo";
import {
  Container,
  Header,
  Button,
  Text,
  Body,
  Form,
  Item as FormItem,
  Input,
  Label,
  Title
} from "native-base";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { IRootState } from "../models/state/state";
import { NavigationScreenProps } from "react-navigation";
import { IAppState } from "../models";
import Service from "../lib/service";
import { setJwtToken } from "../actions/appActions";

interface ILoginScreenProps {}
interface IStateProps {
  appState: IAppState;
}
interface IDispatchProps {
  setJwtToken: typeof setJwtToken;
}
interface IProps
  extends ILoginScreenProps,
    IStateProps,
    IDispatchProps,
    NavigationScreenProps {}

interface IState {
  username: string;
  pwd: string;
  errorString: string;
}

class LoginScreen extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      username: props.navigation.getParam("username", ""),
      pwd: "",
      errorString: ""
    };
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.appState.conference.Site.Token != undefined) {
      this.props.navigation.navigate("LoadConference");
    }
  }

  tryLogin() {
    Service.authenticate(
      this.props.appState.conference.Site.Host,
      this.state.username,
      this.state.pwd
    )
      .then(jwt => this.props.setJwtToken(jwt))
      .catch((err: Error) =>
        this.setState({
          errorString: err.message
        })
      );
  }

  render() {
    return (
      <Container style={{ paddingTop: Constants.statusBarHeight }}>
        <Header>
          <Body>
            <Title>Login</Title>
          </Body>
        </Header>
        <Form style={{ padding: 10 }}>
          <FormItem floatingLabel>
            <Label>Username</Label>
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              value={this.state.username}
              onChangeText={txt => this.setState({ username: txt })}
            />
          </FormItem>
          <FormItem floatingLabel last>
            <Label>Password</Label>
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={true}
              value={this.state.pwd}
              onChangeText={txt => this.setState({ pwd: txt })}
            />
          </FormItem>
          <Button
            full
            primary
            style={{ padding: 10, marginTop: 14, borderRadius: 4 }}
            onPress={() => this.tryLogin()}
          >
            <Text> Login </Text>
          </Button>
          <Text>{this.state.errorString}</Text>
        </Form>
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
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        setJwtToken: setJwtToken
      },
      dispatch
    )
)(LoginScreen);
