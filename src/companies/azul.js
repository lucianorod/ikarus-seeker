const cheerio = require('cheerio');
const qs = require('qs');
const { instance } = require('../config/axios').default;

(async () => {
  const baseURL = 'https://viajemais.voeazul.com.br';

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Origin: 'https://www.voeazul.com.br',
  };

  const prefix = 'ControlGroupSearch$SearchMainSearchView$';

  const form = {
    __EVENTTARGET: 'ControlGroupSearch$LinkButtonSubmit',
    [`${prefix}RadioButtonMarketStructure`]: 'RoundTrip',
    [`${prefix}TextBoxMarketOrigin1`]: 'SAO',
    [`${prefix}TextBoxMarketDestination1`]: 'BEL',
    [`${prefix}DropDownListMarketDay1`]: '15',
    [`${prefix}DropDownListMarketMonth1`]: '2020-04',
    [`${prefix}DropDownListMarketDay2`]: '21',
    [`${prefix}DropDownListMarketMonth2`]: '2020-05',
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

  instance.post('Availability.aspx', formString, {
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

    console.log(departurePrices, returnPrices);
    console.log(Math.min(...departurePrices), Math.min(...returnPrices));
  });
})();
