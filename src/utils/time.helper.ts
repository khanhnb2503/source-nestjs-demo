import * as moment from 'moment-timezone';

export function getCurrentTime() {
  return moment().tz('UTC').add(7, 'hours').toDate();
}