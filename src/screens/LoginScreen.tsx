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
import { connect } from "react-redux";
import { IRootState } from "../models/state/state";
import { NavigationScreenProps } from "react-navigation";
import { IAppState, IJwtToken } from "../models";
import Service from "../lib/service";
import { setJwtToken } from "../actions/appActions";

interface ILoginScreenProps {
}
interface IStateProps {
  appState: IAppState;
}
interface IDispatchProps {
  setJwtToken: typeof setJwtToken;
}
interface IProps extends ILoginScreenProps, IStateProps, IDispatchProps, NavigationScreenProps {}

interface IState {
  username: string;
  pwd: string;
}

class LoginScreen extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      username: "",
      pwd: ""
    };
  }

  tryLogin() {
    Service.authenticate(
      this.props.appState.conference.Site.Host,
      this.state.username,
      this.state.pwd,
      (jwt: IJwtToken) => {
        // console.log(jwt);
        this.props.setJwtToken(jwt);
      },
      () => {
        // console.log("failed");
      }
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
  {}
)(LoginScreen);
