import * as React from "react";
import { StyleSheet } from "react-native";
import { Card, CardItem, Text, Body, Button, Textarea } from "native-base";
import StarRating from "react-native-star-rating";
import { material, materialColors } from "react-native-typography";

interface IProps {
  InitialStars: number;
  InitialReview: string;
  onSubmit: (stars: number, review: string) => void;
}

interface IState {
  Stars: number;
  Review: string;
}

export default class ReviewEdit extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      Stars: props.InitialStars,
      Review: props.InitialReview
    };
  }
  onSubmit() {
    this.props.onSubmit(this.state.Stars, this.state.Review);
  }
  render() {
    return (
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
              rating={this.state.Stars}
              selectedStar={rating => this.setState({ Stars: rating })}
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
              onChangeText={text => this.setState({ Review: text })}
              value={this.state.Review}
            />
            <Button block primary onPress={() => this.onSubmit()}>
              <Text>Submit</Text>
            </Button>
          </Body>
        </CardItem>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  inputLabel: {
    ...material.subheadingObject,
    color: materialColors.blackSecondary,
    marginTop: 15,
    marginBottom: 5
  }
});
