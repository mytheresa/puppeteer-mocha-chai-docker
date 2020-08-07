const puppeteer = require('puppeteer');
const urls = process.env.URLS.split(',');

const cookies = [{
  'name': 'myth_cookie_policy',
  'value': '1'
},{
  'name': 'TC_PRIVACY',
  'value': '0@005@1%2C2%2C3@'
},{
  'name': 'TC_PRIVACY_CENTER',
  'value': '1%2C2%2C3'
}];

urls.forEach(async (url) => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-dev-shm-usage']});
    const page = await browser.newPage();

    await page.setViewport({width: 1280, height: 720});
    await page.goto(url, {'waitUntil': 'networkidle0'}).then(()=>{
        console.log('Generating screeshot for ' + url);
    });
    await page.setCookie(...cookies);
    await page.screenshot({
        fullPage: true,
        path: '/validator/screenshots/' + url.replace(/^.*\/\/[^\/]+/, '').replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '_').replace(/(\.html)|(\.htm)|(\.php)/, '').substr(1) + '.png'
    });
    await browser.close();
});
