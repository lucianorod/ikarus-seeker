const cheerio = require('cheerio');
const qs = require('qs');
const { instance } = require('../config/axios').default;
const { parseDate } = require('../utils').default;
const logger = require('../config/logger').default;

const getLowestPrice = async (programOptions) => {
  logger.info('[Azul] - Seeking tickets');

  const parsedDate = parseDate(programOptions);

  const baseURL = 'https://viajemais.voeazul.com.br';

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Origin: 'https://www.voeazul.com.br',
  };

  const prefix = 'ControlGroupSearch$SearchMainSearchView$';

  const form = {
    __EVENTTARGET: 'ControlGroupSearch$LinkButtonSubmit',
    [`${prefix}RadioButtonMarketStructure`]: 'RoundTrip',
    [`${prefix}TextBoxMarketOrigin1`]: programOptions.to,
    [`${prefix}TextBoxMarketDestination1`]: programOptions.from,
    [`${prefix}DropDownListMarketDay1`]: parsedDate.getDepartureDay(),
    [`${prefix}DropDownListMarketMonth1`]: parsedDate.getDepartureMonthWithYear(),
    [`${prefix}DropDownListMarketDay2`]: parsedDate.getReturnDay(),
    [`${prefix}DropDownListMarketMonth2`]: parsedDate.getReturnMonthWithYear(),
    [`${prefix}DropDownListPassengerType_ADT`]: '1',
    [`${prefix}DropDownListFareTypes`]: 'R',
  };

  const formString = qs.stringify(form);

  const searchResponse = await instance.post('/Search.aspx', formString, {
    baseURL,
    headers,
    maxRedirects: 0,
    validateStatus: (status) => status >= 200 && status < 303,
  }).then((response) => response);

  return instance.post('/Availability.aspx', formString, {
    baseURL,
    headers: {
      ...headers,
      Cookie: searchResponse.headers['set-cookie'].join(';'),
    },
  }).then((response) => {
    const $ = cheerio.load(response.data);
    const departureItems = $('#tbl-depart-flights > .flight-item > .flight-price-container.-azul > .area-radio.no-touch > .flight-price > .fare-price').toArray();
    const departurePrices = departureItems.map((item) => parseFloat(item.firstChild.data.replace('.', '').replace(',', '.'), 10));

    const returnItems = $('#tbl-return-flights > .flight-item > .flight-price-container.-azul > .area-radio.no-touch > .flight-price > .fare-price').toArray();
    const returnPrices = returnItems.map((item) => parseFloat(item.firstChild.data.replace('.', '').replace(',', '.'), 10));
    const lowestPrice = Number((Math.min(...departurePrices) + Math.min(...returnPrices)).toFixed(2));

    logger.info('[Azul] - Lowest price: %d', lowestPrice);

    return lowestPrice;
  });
};

exports.default = { getLowestPrice };
