const pt = require('puppeteer');
const sessionFactofy = require('./factories/session');
const userFactory = require('./factories/user');

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

test('When sign in, shows logout button', async () => {
  const user = await userFactory();

  const { session, sig } = sessionFactofy(user);

  await page.setCookie({ name: 'session', value: session });
  await page.setCookie({ name: 'session.sig', value: sig });

  await page.goto('http://localhost:3000/');

  await page.waitFor('a[href="/auth/logout"]');

  const logoutBtn = await page.$eval(
    'a[href="/auth/logout"]',
    el => el.innerHTML
  );

  expect(logoutBtn).toEqual('Logout');
});
