import * as React from "react";
import { ISponsor } from "../../models";
import PropValue from "./PropValue";

interface IProps {
  sponsors: ISponsor[];
}

export default class SponsorListPropValue extends React.Component<IProps> {
  render() {
    let levelList: JSX.Element[] = [];
    let crtLevel: string = "";
    let crtList: string = "";
    this.props.sponsors.forEach(s => {
      if (crtLevel != s.SponsorLevel) {
        if (crtLevel != "")
          levelList.push(
            <PropValue key={crtLevel} prop={crtLevel} value={crtList} />
          );
        crtLevel = s.SponsorLevel;
        crtList = "";
      }
      if (crtList != "") crtList += ", ";
      crtList += s.Name;
    });
    levelList.push(
      <PropValue key={crtLevel} prop={crtLevel} value={crtList} />
    );
    return levelList;
  }
}
