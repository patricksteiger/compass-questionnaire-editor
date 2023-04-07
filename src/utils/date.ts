// Source: https://www.hl7.org/fhir/datatypes.html#dateTime
const DATE_TIME_REGEXP =
  /([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)))?)?)?/g;
// Source: https://www.hl7.org/fhir/datatypes.html#date
const DATE_REGEXP =
  /([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1]))?)?/g;
// Source: https://www.hl7.org/fhir/datatypes.html#time
const TIME_REGEXP = /([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?/g;

class DateTools {
  isDateTime(s: string | undefined | null): boolean {
    if (!s) return false;
    const match = s.match(DATE_TIME_REGEXP);
    return match !== null && s.length === match[0].length;
  }

  isDate(s: string | undefined | null): boolean {
    if (!s) return false;
    const match = s.match(DATE_REGEXP);
    return match !== null && s.length === match[0].length;
  }

  isTime(s: string | undefined | null): boolean {
    if (!s) return false;
    const match = s.match(TIME_REGEXP);
    return match !== null && s.length === match[0].length;
  }
}

export const dateTools = new DateTools();
