import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://solstice23.top');
  await page.screenshot({ path: 'example.png' });

  await browser.close();
})();