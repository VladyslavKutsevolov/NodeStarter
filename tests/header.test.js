const pt = require('puppeteer');

let browser;
let page;

beforeEach(async () => {
  browser = await pt.launch({});
  page = await browser.newPage();

  await page.goto('http://localhost:3000/');
});

afterEach(async () => {
  await browser.close();
});

test('The header has correct text', async () => {
  const logo = await page.$eval('a.brand-logo', el => el.innerHTML);

  expect(logo).toEqual('Blogster');
});

test('clicking login starts auth flow', async () => {
  await page.click('.right a');

  const url = await page.url();

  expect(url).toMatch(/accounts.google.com/);
});
