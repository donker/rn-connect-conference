import Moment from "moment";
import { IConference } from "./IConference";

export interface ISchedule {
  Days: { key: number; value: IScheduleDay }[];
}

export class Schedule implements ISchedule {
  Days: { key: number; value: IScheduleDay }[];

  addEvent(
    dayNr: number,
    locationId: number | undefined,
    slotType: number,
    title: string,
    start: string,
    duration: number
  ) {
    let day: IScheduleDay = (this.Days.find(d => d.key == dayNr) as {
      key: number;
      value: IScheduleDay;
    }).value;
    let timeString = Moment(day.DayDate).format("YYYY-MM-DD") + "T" + start;
    let startTime = Moment(timeString);
    if (day) {
      day.Events.push({
        IsPlenary: true,
        LocationId: locationId ? locationId : -1,
        SlotType: slotType,
        EventTimeFrom: startTime.toDate(),
        EventTimeTo: startTime.add(duration, "minute").toDate(),
        Title: title
      });
    }
  }

  constructor(conference: IConference) {
    this.Days = conference.Days.map(d => {
      var newDay = new ScheduleDay();
      newDay.DayNr = d.DayNr;
      newDay.DayDate = d.DayDate;
      return {
        key: d.DayNr,
        value: newDay
      };
    });
    conference.Sessions.forEach(s => {
      if (s.IsScheduled) {
        let day: IScheduleDay = (this.Days.find(d => d.key == s.DayNr) as {
          key: number;
          value: IScheduleDay;
        }).value;
        if (day) {
          day.Events.push({
            SlotType: 0,
            IsPlenary: s.IsPlenary,
            LocationId: s.LocationId ? s.LocationId : -1,
            EventTimeFrom: s.SessionDateAndTime as Date,
            EventTimeTo: s.SessionEnd as Date,
            Title: s.Title,
            Subtitle: s.SubTitle,
            Description: s.Description,
            SessionId: s.SessionId,
            Speakers: s.SessionSpeakers.map(s => s.DisplayName).join(", ")
          });
        }
      }
    });
    conference.Slots.forEach(s => {
      switch (s.SlotType) {
        case 1: // General
        case 2: // Location Specific
          if (s.DayNr) {
            this.addEvent(
              s.DayNr,
              s.LocationId,
              s.SlotType,
              s.Title,
              s.Start,
              s.DurationMins
            );
          } else {
            this.Days.forEach(d => {
              this.addEvent(
                d.key,
                s.LocationId,
                s.SlotType,
                s.Title,
                s.Start,
                s.DurationMins
              );
            });
          }
          break;
      }
    });
    this.Days.forEach(d => {
      d.value.Events.sort((a, b) => {
        return Moment(a.EventTimeFrom).isBefore(Moment(b.EventTimeFrom))
          ? -1
          : 1;
      });
    });
  }
}

export interface IScheduleDay {
  DayNr: number;
  DayDate: Date;
  Events: IScheduleEvent[];
}

export class ScheduleDay implements IScheduleDay {
  DayNr: number;
  DayDate: Date;
  Events: IScheduleEvent[];
  constructor() {
    this.Events = [];
  }
}

export interface IScheduleEvent {
  SlotType: number;
  IsPlenary: boolean;
  EventTimeFrom: Date;
  EventTimeTo: Date;
  Title: string;
  Subtitle?: string;
  Description?: string;
  LocationId: number;
  SessionId?: number;
  Speakers?: string;
}
