
function urlGenerator(programOptions) {
  const urlPattern = 'https://www.decolar.com/shop/flights/search/roundtrip/<to>/<from>/<departure>/<return>/1/0/0/NA/NA/NA/NA/NA/';
  const url = urlPattern.replace('<to>', programOptions.to)
    .replace('<from>', programOptions.from)
    .replace('<departure>', programOptions.departure)
    .replace('<return>', programOptions.return);

  return url;
}


function isValidDate(dateStr) {
  const dateFormatRegex = /(\d{4})-(\d{2})-(\d{2})$/;

  if (!dateFormatRegex.test(dateStr)) {
    throw new Error(`Date ${dateStr} is invalid. The value should be in following format yyyy-mm-dd.`);
  }

  const date = dateFormatRegex.exec(dateStr);
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

function validateArguments(programOptions) {
  if (isValidDate(programOptions.departure) && isValidDate(programOptions.return)) {
    const departureDate = new Date(programOptions.departure);
    const returnDate = new Date(programOptions.return);

    if (departureDate > returnDate) {
      throw new Error('Date of return should be after the departure date.');
    }

    if (Number.isNaN(programOptions.maximum)) {
      throw new Error('Maximum price should be an number value');
    }
  }
  return true;
}

exports.default = { validateArguments, urlGenerator };
