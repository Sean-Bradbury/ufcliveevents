import puppeteer from 'puppeteer';

export async function scrapeUFC() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36");
    await page.goto("https://www.ufc.com/events", { waitUntil: "domcontentloaded" });

    // get all 'c-card-event--result' elements
    const eventCards = await page.$$(".c-card-event--result");

    // loop through each event and get details
    const eventDetails: {
        headline: string;
        cardUrl: string;
        prelimsTimestamp: string | null;
        mainTimestamp: string | null;
    }[] = [];
    for (const card of eventCards) {
        const headline = await card.$eval(
            ".c-card-event--result__headline",
            el => (el as HTMLElement).textContent?.trim() || ""
        );
        const cardUrl = await card.$eval(
            ".c-card-event--result__headline a",
            el => (el as HTMLAnchorElement).href.trim()
        );
        const prelimsTimestamp = await card.$eval(
            ".c-card-event--result__date",
            el => (el as HTMLElement).getAttribute("data-prelims-card-timestamp")
        );
        const mainTimestamp = await card.$eval(
            ".c-card-event--result__date",
            el => (el as HTMLElement).getAttribute("data-main-card-timestamp")
        );
        eventDetails.push({ headline, cardUrl, prelimsTimestamp, mainTimestamp });
    }

    await browser.close();

    return { eventDetails };
}