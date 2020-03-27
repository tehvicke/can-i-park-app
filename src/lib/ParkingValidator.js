import moment from 'moment';

class ParkingValidator {
  constructor(features, date) {
    this.test = 'hej';
    this.date = date;
    this.features = features;
  }
  updateFeatures(features) {
    this.features = features; /* parse date here! */
  }

  dateParser(feature) {
    return null;
  }

  checkOddEvenWeek(oddEven) {
    switch (oddEven) {
      case undefined:
        return undefined;
      case 'udda veckor':
        return 1;
      case 'jämna veckor':
        return 0;
    }
  }

  featureIsActive(feature) {
    const prop = feature.properties;

    if (!prop.START_MONTH && !prop.END_MONTH) {
      return true;
    }

    const validStartDate = moment(
      `${this.date.year()}-${prop.START_MONTH}-${prop.START_DAY}`,
      'YYYY-M-D',
    );

    const validEndDate = moment(
      `${this.date.year()}-${prop.END_MONTH}-${prop.END_DAY}`,
      'YYYY-M-D',
    );

    if (validStartDate > validEndDate)
      validStartDate.subtract(
        1,
        'y',
      ); /* CHECK IF THIS IS VALID FOR E.G. DATES LATER IN THE YEAR */

    if (validStartDate > this.date || validEndDate < this.date) {
      return false;
    } else if (
      /* Om det är undefined ( = gäller för BÅDE jämn och ojämn så SANT,  */
      prop.ODD_EVEN &&
      (this.date.week() + 1) % 2 !=
        this.checkOddEvenWeek(prop.ODD_EVEN) /* DUBBELKOLLA JÄMFÖRELSE! */
    ) {
      return false;
    } else {
      return true;
    }
  }

  getWeekDay(weekday) {
    switch (weekday) {
      case 'måndag':
        return 1;
      case 'tisdag':
        return 2;
      case 'onsdag':
        return 3;
      case 'torsdag':
        return 4;
      case 'fredag':
        return 5;
    }
  }

  extractHourMinutes(time) {
    if (time.length === 3) {
      return [time[0], time.splice(1, 2)];
    } else if (time.length === 4) {
      return [time.splice(0, 2), time.splice(2, 2)];
    }
    return [0, 0];
  }

  weekDayDelta(today, comparison) {
    const res = moment(today).isoWeekday() - comparison;
    return res;
  }

  parkingIsAllowed(feature) {
    const prop = feature.properties; /* TODO */

    if (prop.VF_PLATS_TYP === 'Tidsreglerad lastplats')
      return false; /* Tills vidare får vi säga falskt iom att det inte finns information i datan... */

    if (!prop.START_TIME && !prop.START_DAY) {
      return true; /* if no regulation exist then ok to park - must be verified through looking at the data! */
    }

    if (this.weekDayDelta(this.date, this.getWeekDay(prop.START_WEEKDAY)) !== 0)
      return true;

    const now = moment(this.date).format('HH:mm');
    const forbiddenStartTime = moment(prop.END_TIME, 'Hmm').format('HH:mm');
    const forbiddenEndTime = moment(prop.START_TIME, 'Hmm').format('HH:mm');

    if (now > forbiddenStartTime && now < forbiddenEndTime) return false;
    return true;

    // const startTime = moment(this.date).subtract(
    //   this.weekDayDelta(this.date, this.getWeekDay(prop.START_WEEKDAY)),
    //   'd',
    // );

    // const startHoursMinutes = moment(
    //   prop.START_TIME,
    //   'Hmm',
    // ); /* Another ugly implementation... */

    // startTime.set({
    //   h: startHoursMinutes.hours(),
    //   m: startHoursMinutes.minutes(),
    // });

    // const endTime = moment(startTime).add(7, 'd');

    // const endHoursMinutes = moment(
    //   prop.END_TIME,
    //   'Hmm',
    // ); /* Another ugly implementation... */

    // endTime.set({ h: endHoursMinutes.hours(), m: endHoursMinutes.minutes() });

    // if (this.date > startTime && this.date < endTime) return true;

    // console.log('start: ', startTime, ', now: ', this.date, ', end: ', endTime);
    // console.log(
    //   this.weekDayDelta(this.date, this.getWeekDay(prop.START_WEEKDAY)),
    // );
    // return false;
  }
}

module.exports = ParkingValidator;
