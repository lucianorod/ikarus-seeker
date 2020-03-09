const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const gol = require('./companies/gol').default;
const latam = require('./companies/latam').default;
const azul = require('./companies/azul').default;
const { validateArguments } = require('./utils').default;
const logger = require('./config/logger').default;

const companies = [gol, latam, azul];

async function getFirstFlights(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });

  const html = await page.content();

  const $ = cheerio.load(html);
  const items = $('.item-fare.fare-price > span > flights-price > span > flights-price-element > span > span > em > .amount.price-amount').toArray();
  const prices = items.map((span) => span.firstChild.data);

  await browser.close();

  return prices;
}

async function runSeeker(programOptions) {
  if (validateArguments(programOptions)) {
    const prices = await Promise.all(companies.map((company) => company.getLowestPrice(programOptions)));

    logger.info('The lowest price of all companies is %d', Math.min(...prices));
  }
}

exports.default = { getFirstFlights, runSeeker };
