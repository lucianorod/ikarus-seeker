const axios = require('axios').default;

const instance = axios.create({
  timeout: 30000,
});

exports.default = { instance };
