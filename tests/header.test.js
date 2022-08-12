const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();

  await page.goto('http://localhost:3000/');
});

afterEach(async () => {
  await page.close();
});

test('The header has correct text', async () => {
  const logo = await page.getContent('a.brand-logo');

  expect(logo).toEqual('Blogster');
});

test('clicking login starts auth flow', async () => {
  await page.click('.right a');

  const url = await page.url();

  expect(url).toMatch(/accounts.google.com/);
});

test('When sign in, shows logout button', async () => {
  await page.login();

  const logoutBtn = await page.getContent('a[href="/auth/logout"]');

  expect(logoutBtn).toEqual('Logout');
});
