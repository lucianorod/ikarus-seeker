const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const { validateArguments, urlGenerator } = require('./utils').default;

async function getFirstFlights(url) {
  const prices = [];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });

  const html = await page.content();

  const $ = cheerio.load(html);
  const items = $('.item-fare.fare-price > span > flights-price > span > flights-price-element > span > span > em > .amount.price-amount');
  items.each((n) => prices.push(items[n].firstChild.data));
  await browser.close();

  return prices;
}

function runSeeker(programOptions) {
  if (validateArguments(programOptions)) {
    const url = urlGenerator(programOptions);
    getFirstFlights(url).then((prices) => {
      const minPrices = prices.filter((price) => price < programOptions.maximum);
      minPrices.forEach((price) => {
        console.log(price);
      });
    })
      .catch();
  }
}

exports.default = { getFirstFlights, runSeeker };
