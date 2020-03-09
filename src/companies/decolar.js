const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { urlGenerator } = require('../utils').default;
const logger = require('../config/logger').default;


const getLowestPrice = async (programOptions) => {
  logger.info('[Decolar] - Seeking tickets');

  const URL = 'https://www.decolar.com/shop/flights/search/roundtrip/<to>/<from>/<departure>/<return>/1/0/0/NA/NA/NA/NA/NA/';

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(urlGenerator(URL, programOptions), { waitUntil: 'networkidle0' });

  const html = await page.content();

  const $ = cheerio.load(html);
  const items = $('.item-fare.fare-price > span > flights-price > span > flights-price-element > span > span > em > .amount.price-amount').toArray();
  const prices = items.map((span) => span.firstChild.data).map((price) => price.replace('.', '').replace(',', '.'));

  await browser.close();

  const lowestPrice = Math.min(...prices);

  logger.info('[Decolar] - Lowest price: %d', lowestPrice);

  return { company: 'Decolar', lowestPrice };
};

exports.default = { getLowestPrice };
