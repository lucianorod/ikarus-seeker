const cheerio = require('cheerio');
const qs = require('qs');
const { instance } = require('../config/axios').default;
const { parseDate } = require('../utils').default;

const getLowestPrice = async (programOptions) => {
  const parsedDate = parseDate(programOptions);

  const baseURL = 'https://compre2.voegol.com.br';

  const headers = {
    'content-type': 'application/x-www-form-urlencoded',
    origin: 'https://www.voegol.com.br',
  };

  const prefix = 'ControlGroupSearchView$AvailabilitySearchInputSearchView$';

  const data = {
    [`${prefix}TextBoxMarketOrigin1`]: programOptions.to,
    [`${prefix}TextBoxMarketDestination1`]: programOptions.from,
    [`${prefix}DropDownListMarketDay1`]: parsedDate.getDepartureDay(),
    [`${prefix}DropDownListMarketMonth1`]: parsedDate.getDepartureMonthWithYear(),
    [`${prefix}DropDownListMarketDay2`]: parsedDate.getReturnDay(),
    [`${prefix}DropDownListMarketMonth2`]: parsedDate.getReturnMonthWithYear(),
    [`${prefix}DropDownListPassengerType_ADT`]: '1',
    [`${prefix}DropDownListPassengerType_CHD`]: '0',
    [`${prefix}DropDownListPassengerType_INFT`]: '0',
    [`${prefix}RadioButtonMarketStructure`]: 'RoundTrip',
    ControlGroupSearchView$ButtonSubmit: 'compre aqui',
    __EVENTTARGET: '',
  };

  const formString = qs.stringify(data);

  const searchResponse = await instance.post('/CSearch.aspx', formString, {
    baseURL,
    headers,
    maxRedirects: 0,
    validateStatus: (status) => status >= 200 && status < 303,
  }).then((response) => response);

  instance.post('/Select2.aspx', formString, {
    baseURL,
    headers: {
      ...headers,
      cookie: searchResponse.headers['set-cookie'].join(';'),
    },
  }).then((response) => {
    const $ = cheerio.load(response.data);
    const price = $('#fareComboBanner > div.fare-combo > div.banner-details > div.fare-details > div:nth-child(4) > div.value').text();
    console.log(price);
  });
};

exports.default = getLowestPrice;
