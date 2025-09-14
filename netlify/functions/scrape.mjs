import fetch from 'node-fetch';
import cheerio from 'cheerio';

export async function handler(event, context) {
  try {
    const res = await fetch('https://www.ufc.com/events');
    const html = await res.text();
    const $ = cheerio.load(html);

    const eventDetails = [];
    $('.c-card-event--result').each((_, el) => {
      const headline = $(el)
        .find('.c-card-event--result__headline')
        .text()
        .trim();
      const cardUrl = $(el)
        .find('.c-card-event--result__headline a')
        .attr('href');
      const prelimsTimestamp = $(el)
        .find('.c-card-event--result__date')
        .attr('data-prelims-card-timestamp');
      const mainTimestamp = $(el)
        .find('.c-card-event--result__date')
        .attr('data-main-card-timestamp');
      eventDetails.push({
        headline,
        cardUrl: cardUrl ? `https://www.ufc.com${cardUrl}` : '',
        prelimsTimestamp: Number(prelimsTimestamp),
        mainTimestamp: Number(mainTimestamp),
      });
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ eventDetails }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
}
