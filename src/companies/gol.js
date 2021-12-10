const cheerio = require('cheerio');
const qs = require('qs');
const { instance } = require('../config/axios').default;
const { parseDate } = require('../utils').default;
const logger = require('../config/logger').default;

const getLowestPrice = async (programOptions) => {
  logger.info('[GOL] - Seeking tickets');

  const parsedDate = parseDate(programOptions);

  const authURL = 'https://gol-auth-api.voegol.com.br/api/authentication/create-token'

  const authHeaders = {
    'X-AAT': 'NEUgdaCsLXoDdbB0/Jfb+d6O72lprMfUJxaW/eTW7ncXFZgMqTtFpi5mQdzidn0c0EnON6hHWtrBAshheNOhtQ==',
    'DNT': 1,
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
    'Referer': 'https://b2c.voegol.com.br/',
    'Accept': 'text/plain',
  }

  const authResponse = await instance.get(authURL, {
    authURL,
    headers: authHeaders,
    maxRedirects: 0,
    validateStatus: (status) => status >= 200 && status < 303,
  }).then((response) => response.data);


  const token = authResponse.response.token;

  const searchURL = 'https://b2c-api.voegol.com.br/api/sabre-default/flights?context=b2c&flow=Issue'

  const searchHeaders = {
    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:93.0) Gecko/20100101 Firefox/93.0',
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.5',
    'Content-Type': 'application/json',
    'Referer': 'https://b2c.voegol.com.br/',
    'Origin': 'https://b2c.voegol.com.br',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'x-jsessionid': '',
    'Authorization': `Bearer ${token}`
  }

  const searchBody = {
    "promocodebanner": false,
    "destinationCountryToUSA": false,
    "airSearch": {
      "cabinClass": null,
      "currency": null,
      "pointOfSale": "BR",
      "awardBooking": false,
      "searchType": "BRANDED",
      "promoCodes": [],
      "originalItineraryParts": [{
        "from": {
          "code": "SAO",
          "useNearbyLocations": false
        },
        "to": {
          "code": "BEL",
          "useNearbyLocations": false
        },
        "when": {
          "date": `${parsedDate}T00:00:00`
        },
        "selectedOfferRef": null,
        "plusMinusDays": null
      }, {
        "from": {
          "code": "BEL",
          "useNearbyLocations": false
        },
        "to": {
          "code": "SAO",
          "useNearbyLocations": false
        },
        "when": {
          "date": "2022-01-13T00:00:00"
        },
        "selectedOfferRef": null,
        "plusMinusDays": null
      }],
      "itineraryParts": [{
        "from": {
          "code": "SAO",
          "useNearbyLocations": false
        },
        "to": {
          "code": "BEL",
          "useNearbyLocations": false
        },
        "when": {
          "date": "2021-12-23T00:00:00"
        },
        "selectedOfferRef": null,
        "plusMinusDays": null
      }, {
        "from": {
          "code": "BEL",
          "useNearbyLocations": false
        },
        "to": {
          "code": "SAO",
          "useNearbyLocations": false
        },
        "when": {
          "date": "2022-01-13T00:00:00"
        },
        "selectedOfferRef": null,
        "plusMinusDays": null
      }],
      "passengers": {
        "ADT": 1,
        "CHD": 0,
        "INF": 0
      },
      "trendIndicator": null,
      "preferredOperatingCarrier": null
    }
  }

  const searchResponse = await instance.post(searchURL, searchBody, {
    searchURL,
    headers: searchHeaders,
    maxRedirects: 0,
    validateStatus: (status) => status >= 200 && status < 303,
  }).then((response) => response.data);

  console.log(searchResponse.response.airSearchResults.unbundledOffers);


  // const baseURL = 'https://compre2.voegol.com.br';

  // const headers = {
  //   'content-type': 'application/x-www-form-urlencoded',
  //   origin: 'https://www.voegol.com.br',
  // };

  // const prefix = 'ControlGroupSearchView$AvailabilitySearchInputSearchView$';

  // const data = {
  //   [`${prefix}TextBoxMarketOrigin1`]: programOptions.to,
  //   [`${prefix}TextBoxMarketDestination1`]: programOptions.from,
  //   [`${prefix}DropDownListMarketDay1`]: parsedDate.getDepartureDay(),
  //   [`${prefix}DropDownListMarketMonth1`]: parsedDate.getDepartureMonthWithYear(),
  //   [`${prefix}DropDownListMarketDay2`]: parsedDate.getReturnDay(),
  //   [`${prefix}DropDownListMarketMonth2`]: parsedDate.getReturnMonthWithYear(),
  //   [`${prefix}DropDownListPassengerType_ADT`]: '1',
  //   [`${prefix}DropDownListPassengerType_CHD`]: '0',
  //   [`${prefix}DropDownListPassengerType_INFT`]: '0',
  //   [`${prefix}RadioButtonMarketStructure`]: 'RoundTrip',
  //   ControlGroupSearchView$ButtonSubmit: 'compre aqui',
  //   __EVENTTARGET: '',
  // };

  // const formString = qs.stringify(data);

  // const searchResponse = await instance.post('/CSearch.aspx', formString, {
  //   baseURL,
  //   headers,
  //   maxRedirects: 0,
  //   validateStatus: (status) => status >= 200 && status < 303,
  // }).then((response) => response);

  // return instance.post('/Select2.aspx', formString, {
  //   baseURL,
  //   headers: {
  //     ...headers,
  //     cookie: searchResponse.headers['set-cookie'].join(';'),
  //   },
  // }).then((response) => {
  //   const $ = cheerio.load(response.data);
  //   const lowestPriceStr = $('#fareComboBanner > div.fare-combo > div.banner-details > div.fare-details > div:nth-child(4) > div.value').text();
  //   const lowestPrice = Number(lowestPriceStr.replace('R$', '').replace('.', '').replace(',', '.'));

  //   logger.info('[GOL] - Lowest price: %d', lowestPrice);

  //   return { company: 'GOL', lowestPrice };
  // });
};

exports.default = { getLowestPrice };
