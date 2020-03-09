const airports = require('./airports').default;

function urlGenerator(url, programOptions) {
  // const urlPattern = 'https://www.decolar.com/shop/flights/search/roundtrip/<to>/<from>/<departure>/<return>/1/0/0/NA/NA/NA/NA/NA/';
  const formattedUrl = url.replace('<to>', programOptions.to)
    .replace('<from>', programOptions.from)
    .replace('<departure>', programOptions.departure)
    .replace('<return>', programOptions.return);

  return formattedUrl;
}

function isValidDate(dateStr) {
  const dateRegex = /(\d{4})-(\d{2})-(\d{2})$/;

  if (!dateRegex.test(dateStr)) throw new Error(`Date ${dateStr} is invalid. The value must be in following format: yyyy-mm-dd.`);

  const date = dateRegex.exec(dateStr);
  const year = parseInt(date[1], 10);
  const month = parseInt(date[2], 10);
  const day = parseInt(date[3], 10);
  const validYears = [...Array(3).keys()].map((n) => year + n);
  const lastDayInMonth = new Date(year, month, 0).getDate();

  if (validYears.includes(year) && (month < 12) && (day < lastDayInMonth)) {
    return true;
  }
  throw new Error(`Date ${dateStr} is invalid. Inform a valid date.`);
}

function isValidCities(programOptions) {
  const airportsNames = airports.map((airport) => airport.code);
  if (airportsNames.includes(programOptions.to.toUpperCase()) && airportsNames.includes(programOptions.from.toUpperCase())) {
    return true;
  }

  throw new Error('Informed city of departure or return is invalid.');
}

function validateArguments(programOptions) {
  if (isValidDate(programOptions.departure) && isValidDate(programOptions.return) && isValidCities(programOptions)) {
    const departureDate = new Date(programOptions.departure);
    const returnDate = new Date(programOptions.return);

    if (departureDate <= Date(Date().toLocaleString())) throw new Error('Departure date must be greater than today.');

    if (departureDate > returnDate) throw new Error('Date of return must be after the departure date.');

    if (Number.isNaN(programOptions.maximum)) throw new Error('Maximum price must be an number value.');
  }
  return true;
}

const parseDate = (programOptions) => {
  const departureDate = new Date(programOptions.departure);
  const returnDate = new Date(programOptions.return);

  return {
    getDepartureDay: function getDepartureDay() {
      return departureDate.getDate() + 1;
    },
    getReturnDay: function getReturnDay() {
      return returnDate.getDate() + 1;
    },
    getDepartureMonthWithYear: function getDepartureMonthWithYear() {
      return `${departureDate.getFullYear()}-${departureDate.getMonth() + 1}`;
    },
    getReturnMonthWithYear: function getReturnMonthWithYear() {
      return `${returnDate.getFullYear()}-${returnDate.getMonth() + 1}`;
    },
  };
};

exports.default = { validateArguments, urlGenerator, parseDate };
