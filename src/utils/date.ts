import { matches } from "./constants";

// Source: https://www.hl7.org/fhir/datatypes.html#date
const DATE_REGEXP =
  /([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1]))?)?/g;
// Source: https://www.hl7.org/fhir/datatypes.html#dateTime
const DATE_TIME_REGEXP =
  /([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)))?)?)?/g;
// Source: https://www.hl7.org/fhir/datatypes.html#dateTime
const DATE_TIMEZONE_OFFSET_REGEXP =
  /(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))/g;
// Source: https://www.hl7.org/fhir/datatypes.html#time
const TIME_REGEXP = /([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?/g;
// Source: https://www.hl7.org/fhir/datatypes.html#instant
const INSTANT_REGEXP =
  /([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]{1,9})?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))/g;

class DateTools {
  isDate(s: string | undefined | null): true | string {
    if (!s) return "date has to be non-empty";
    return (
      matches(DATE_REGEXP, s) ||
      "value doesn't match YYYY, YYYY-MM or YYYY-MM-DD"
    );
  }

  isDateOrEmpty(s: string | undefined | null): true | string {
    return (
      !s ||
      matches(DATE_REGEXP, s) ||
      "value doesn't match YYYY, YYYY-MM or YYYY-MM-DD"
    );
  }

  isDateTime(s: string | undefined | null): true | string {
    if (!s) return "dateTime has to be non-empty";
    return (
      matches(DATE_TIME_REGEXP, s) ||
      "value doesn't match YYYY, YYYY-MM, YYYY-MM-DD or YYYY-MM-DDThh:mm:ss+zz:zz"
    );
  }

  isDateTimeOrEmpty(s: string | undefined | null): true | string {
    return (
      !s ||
      matches(DATE_TIME_REGEXP, s) ||
      "value doesn't match YYYY, YYYY-MM, YYYY-MM-DD or YYYY-MM-DDThh:mm:ss+zz:zz"
    );
  }

  isTimezoneOffset(s: string | undefined | null): true | string {
    if (!s) return "dateTimezoneOffset has to be non-empty";
    return (
      matches(DATE_TIMEZONE_OFFSET_REGEXP, s) ||
      "value doesn't match examples Z, +02:00, or -01:30"
    );
  }

  isTimezoneOffsetOrEmpty(s: string | undefined | null): true | string {
    if (!s) return true;
    return (
      matches(DATE_TIMEZONE_OFFSET_REGEXP, s) ||
      "value doesn't match examples Z, +02:00, or -01:30"
    );
  }

  isTime(s: string | undefined | null): true | string {
    if (!s) return "time has to be non-empty";
    return matches(TIME_REGEXP, s) || "value doesn't match HH:MM:SS";
  }

  isTimeOrEmpty(s: string | undefined | null): true | string {
    return !s || matches(TIME_REGEXP, s) || "value doesn't match HH:MM:SS";
  }

  isInstant(s: string | undefined | null): true | string {
    if (!s) return "instant has to be non-empty";
    return (
      matches(INSTANT_REGEXP, s) ||
      "value doesn't match YYYY-MM-DDThh:mm:ss.sss+zz:zz"
    );
  }

  isInstantOrEmpty(s: string | undefined | null): true | string {
    return (
      !s ||
      matches(INSTANT_REGEXP, s) ||
      "value doesn't match YYYY-MM-DDThh:mm:ss.sss+zz:zz"
    );
  }

  getCurrentDate(): string {
    const now = new Date();
    const yyyy = this.padClock(now.getFullYear());
    const mm = this.padClock(now.getMonth() + 1);
    const dd = this.padClock(now.getDate());
    return `${yyyy}-${mm}-${dd}`;
  }

  getCurrentTime(): string {
    const now = new Date();
    const hh = this.padClock(now.getHours());
    const mm = this.padClock(now.getMinutes());
    const ss = this.padClock(now.getSeconds());
    return `${hh}:${mm}:${ss}`;
  }

  getCurrentDateTime(): string {
    const now = new Date();
    const year = this.padClock(now.getFullYear());
    const month = this.padClock(now.getMonth() + 1);
    const day = this.padClock(now.getDate());
    const hour = this.padClock(now.getHours());
    const minute = this.padClock(now.getMinutes());
    const second = this.padClock(now.getSeconds());
    const offset = this.getTimezoneOffset(now);
    return `${year}-${month}-${day}T${hour}:${minute}:${second}${offset}`;
  }

  getDateTime(date: string, time: string): string {
    const now = new Date();
    const offset = this.getTimezoneOffset(now);
    return `${date}T${time}${offset}`;
  }

  getInstant(): string {
    const now = new Date();
    const year = this.padClock(now.getFullYear());
    const month = this.padClock(now.getMonth() + 1);
    const day = this.padClock(now.getDate());
    const hour = this.padClock(now.getHours());
    const minute = this.padClock(now.getMinutes());
    const second = this.padClock(now.getSeconds());
    const offset = this.getTimezoneOffset(now);
    return `${year}-${month}-${day}T${hour}:${minute}:${second}${offset}`;
  }

  getTimezoneOffset(date: Date): string {
    const offset = date.getTimezoneOffset();
    const sign = offset > 0 ? "-" : "+";
    const minutes = 60;
    const absOffset = Math.abs(offset);
    const hour = this.padClock(Math.floor(absOffset / minutes));
    const minute = this.padClock(absOffset % minutes);
    return `${sign}${hour}:${minute}`;
  }

  private padClock(time: number): string {
    return time < 10 ? `0${time}` : time.toString();
  }
}

export const dateTools = new DateTools();
