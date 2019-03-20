import * as React from "react";
import { NavigationScreenProps, createStackNavigator } from "react-navigation";
import { IAppState, IComment } from "../models";
import { connect } from "react-redux";
import { IRootState } from "../models/state/state";
import { StyleSheet, ScrollView, SafeAreaView, Text } from "react-native";
import Comment from "./components/Comment";
import Icon from "react-native-vector-icons/Ionicons";

interface ICommentsProps {}
interface IStateProps {
  appState: IAppState;
}
interface IDispatchProps {}
interface IProps
  extends ICommentsProps,
    IStateProps,
    IDispatchProps,
    NavigationScreenProps {}

class CommentsComponent extends React.Component<IProps> {
  public render() {
    var comments = this.props.appState.comments.map((c: IComment) => {
      return (
        <Comment
          key={c.CommentId}
          comment={c}
          host={this.props.appState.conference.Site.Host}
        />
      );
    });
    return (
      <ScrollView
        style={styles.container}
        contentInsetAdjustmentBehavior="automatic"
      >
        <SafeAreaView>{comments}</SafeAreaView>
      </ScrollView>
    );
  }
}

const CommentsScreen = connect(
  (state: IRootState): IStateProps => {
    return {
      appState: state.app
    };
  },
  {}
)(CommentsComponent);

const Comments = createStackNavigator({
  Conference: {
    screen: CommentsScreen,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: "News",
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

export default Comments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
