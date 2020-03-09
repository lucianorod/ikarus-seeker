const { instance } = require('../config/axios').default;
const { urlGenerator } = require('../utils').default;
const logger = require('../config/logger').default;

const getLowestPrice = async (programOptions) => {
  logger.info('[LATAM] - Seeking tickets');

  const URL = 'https://bff.latam.com/ws/proxy/booking-webapp-bff/v1/public/revenue/bestprices/outbound?departure=<departure>'
  + '&origin=<from>&destination=<to>&cabin=Y&country=BR&language=PT&home=pt_br&return=<return>&adult=1&promoCode=';

  return instance.get(urlGenerator(URL, programOptions)).then((response) => {
    const lowestPrice = response.data.itinerary.pricePerPassenger.adult.total.amount;

    logger.info('[LATAM] - Lowest price: %d', lowestPrice);

    return { company: 'LATAM', lowestPrice };
  });
};

exports.default = { getLowestPrice };
