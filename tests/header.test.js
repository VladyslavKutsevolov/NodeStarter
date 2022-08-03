const pt = require('puppeteer');
const Buffer = require('safe-buffer').Buffer;

const Keygrip = require('keygrip');
const keys = require('../config/keys');

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

test.only('When sign in, shows logout button', async () => {
  const id = '62dede5c7e66157935e6ac72';

  const sessionObj = {
    passport: {
      user: id
    }
  };

  const sessionStr = Buffer.from(JSON.stringify(sessionObj)).toString('base64');

  const keygrip = new Keygrip([keys.cookieKey]);

  const sig = keygrip.sign('session=' + sessionStr);

  await page.setCookie({ name: 'session', value: sessionStr });
  await page.setCookie({ name: 'session.sig', value: sig });

  await page.goto('http://localhost:3000/');

  await page.waitFor('a[href="/auth/logout"]');

  const logoutBtn = await page.$eval(
    'a[href="/auth/logout"]',
    el => el.innerHTML
  );

  expect(logoutBtn).toEqual('Logout');
});
