const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();

  await page.goto('http://localhost:3000/');
});

afterEach(async () => {
  await page.close();
});

describe('When loggen in', () => {
  beforeEach(async () => {
    await page.login();

    await page.click('a.btn-floating');
  });

  test('Can see blog form', async () => {
    const label = await page.getContent('form label');

    expect(label).toEqual('Blog Title');
  });

  describe('using valid inputs', async () => {
    beforeEach(async () => {
      await page.type('.title input', 'my title');

      await page.type('.content input', 'my content');

      await page.click('form button');
    });

    test('submitting takes user to review screen', async () => {
      const confirmTitle = await page.getContent('h5');

      expect(confirmTitle).toEqual('Please confirm your entries');
    });
    test('submitting saves to index page', async () => {
      await page.click('button.green');

      await page.waitFor('.card');

      const title = await page.getContent('.card-title');
      const content = await page.getContent('p');

      expect(title).toEqual('my title');
      expect(content).toEqual('my content');
    });
  });

  describe('using invalid inputs', async () => {
    beforeEach(async () => {
      await page.click('form button');
    });
    test('the form show error msg', async () => {
      const titleErr = await page.getContent('.title .red-text');

      const contentErr = await page.getContent('.content .red-text');

      expect(titleErr).toEqual('You must provide a value');
      expect(contentErr).toEqual('You must provide a value');
    });
  });
});

describe('User is not logged in', async () => {
  test('User cannot create blog post', async () => {
    const result = await page.get('/api/blogs');

    expect(result).toEqual({ error: 'You must log in!' });
  });

  test('user cannot get list of posts', async () => {
    const res = await page.post('/api/blogs', {
      title: 'title',
      content: 'content'
    });

    expect(res).toEqual({ error: 'You must log in!' });
  });
});
