const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const golLowestPrice = require('./companies/gol').default;

const { validateArguments } = require('./utils').default;

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

function runSeeker(programOptions) {
  if (validateArguments(programOptions)) {
    golLowestPrice(programOptions);
  }
}

exports.default = { getFirstFlights, runSeeker };
