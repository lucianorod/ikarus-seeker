/* eslint-disable no-undef */
const { instance } = require('../config/axios').default;
const { urlGenerator } = require('../utils').default;
const fs = require('fs');

// const URL = 'https://bff.latam.com/ws/proxy/booking-webapp-bff/v1/public/revenue/bestprices/outbound?departure={departure}'
// + '&origin={from}&destination={to}&cabin=Y&country=BR&language=PT&home=pt_br&return={return}&adult=1&promoCode=';

const URL = 'https://bff.latam.com/ws/proxy/booking-webapp-bff/v1/public/revenue/bestprices/outbound?departure=2020-07-01&origin=SAO&destination=BEL&cabin=Y&country=BR&language=PT&home=pt_br&return=2020-07-31&adult=1&promoCode=';

(async () => {
  // instance.get(URL).then((response) => {
  //   console.log(response.data.itinerary.pricePerPassenger.adult.total.amount);
  // });

  const airports = await instance.get('https://www.voeazul.com.br/en/service/get/stations_order?&culture=pt-br').then((response) => {
    const brasil = response.data.regions.filter((region) => region.name === 'Brasil')[0];

    return brasil.country[0].airports.map((airport) => ({
      code: airport.code,
      fullName: airport.fullName,
    }));
  });

  console.log(airports[0]);
  fs.writeFileSync('airports.json', JSON.stringify(airports));
})();
