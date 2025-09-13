const { scrapeUFC } = require('../../server');

exports.handler = async function (event, context) {
  try {
    const data = await scrapeUFC();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal Server Error',
        details: err.message,
      }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};
