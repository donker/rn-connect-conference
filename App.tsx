import React from "react";
import { Provider } from "react-redux";
import store from "./src/store";
import AppContainer from "./src/routing/AppContainer";
import { Font } from "expo";
import LoadScreen from "./src/screens/components/LoadScreen";

interface IState {
  loading: boolean;
}

export default class App extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true
    };
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading) {
      return <LoadScreen />;
    }
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
