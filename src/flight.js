const gol = require('./companies/gol').default;
const latam = require('./companies/latam').default;
const azul = require('./companies/azul').default;
const decolar = require('./companies/decolar').default;
const { validateArguments } = require('./utils').default;
const logger = require('./config/logger').default;

const companies = [gol, latam, azul, decolar];

async function runSeeker(programOptions) {
  if (validateArguments(programOptions)) {
    const companyPrices = await Promise.all(companies.map((company) => company
      .getLowestPrice(programOptions)));

    const lowestCompanyPrice = companyPrices.reduce(
      (prev, curr) => (prev.lowestPrice < curr.lowestPrice ? prev : curr),
    );

    logger.info(`The lowest price of all companies: [${lowestCompanyPrice.company}] - R$${lowestCompanyPrice.lowestPrice}`);
  }
}

exports.default = { runSeeker };
