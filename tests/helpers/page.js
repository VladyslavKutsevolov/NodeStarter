const pt = require('puppeteer');
const sessionFactofy = require('../factories/session');
const userFactory = require('../factories/user');

class Page {
  static async build() {
    const browser = await pt.launch();

    const page = await browser.newPage();

    const customPage = new Page(page);

    return new Proxy(customPage, {
      get: function (target, prop) {
        return target[prop] || browser[prop] || page[prop];
      }
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    const user = await userFactory();

    const { session, sig } = sessionFactofy(user);

    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });

    await this.page.goto('http://localhost:3000/blogs');

    await this.page.waitFor('a[href="/auth/logout"]');
  }

  async getContent(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  }

  get(route) {
    return this.page.evaluate(
      _route =>
        fetch(_route, {
          method: 'GET',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => res.json()),
      route
    );
  }

  post(path, body) {
    return this.page.evaluate(
      (_path, _body) =>
        fetch(_path, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(_body)
        }).then(res => res.json()),
      path,
      body
    );
  }
}

module.exports = Page;
