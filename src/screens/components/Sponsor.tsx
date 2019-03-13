import * as React from "react";
import { ISponsor } from "../../models";
import { Card, CardItem, Left, Body, Text, Button } from "native-base";
import { Image } from "react-native-expo-image-cache";

const Sponsor = (props: {
  sponsor: ISponsor;
  host: string;
  conferenceId: number;
}) => (
  <Card style={{ flex: 0 }}>
    <CardItem>
      <Left>
        <Image
          uri={`https://${
            props.host
          }/DesktopModules/Connect/Conference/API/Conference/${
            props.conferenceId
          }/Sponsors/Image/${props.sponsor.SponsorId}?size=40`}
          style={{ height: 40, width: 40 }}
          resizeMode="contain"
        />
        <Body>
          <Text>{props.sponsor.Name}</Text>
          <Text note>Level: {props.sponsor.SponsorLevel}</Text>
        </Body>
      </Left>
    </CardItem>
    <CardItem>
      <Body>
        <Text>{props.sponsor.Description}</Text>
      </Body>
    </CardItem>
    <CardItem>
      <Left>
        <Button transparent textStyle={{ color: "#87838B" }}>
          <Text>{props.sponsor.Url}</Text>
        </Button>
      </Left>
    </CardItem>
  </Card>
);

export default Sponsor;
