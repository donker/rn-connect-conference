import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Card, CardItem, Text, Body, Thumbnail } from "native-base";
import { IComment } from "../../models";
import Moment from "moment";

const Comment = (props: { comment: IComment; host: string }) => (
  <Card>
    <CardItem>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <Thumbnail
            small
            source={{
              uri: `https://${
                props.host
              }/DnnImageHandler.ashx?mode=profilepic&w=48&h=48&userId=${
                props.comment.UserId
              }`
            }}
          />
        </View>
        <View style={{ flex: 6, flexDirection: "column" }}>
          <Text>{props.comment.DisplayName}</Text>
          <Text note>{Moment(props.comment.Datime).format("LLL")}</Text>
        </View>
      </View>
    </CardItem>
    <CardItem>
      <Body>
        <Text>{props.comment.Remarks}</Text>
      </Body>
    </CardItem>
  </Card>
);

export default Comment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
