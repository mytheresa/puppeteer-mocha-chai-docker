const puppeteer = require('puppeteer');
const urls = process.env.URLS.split(',');

const cookies = [{
  'name'     : 'myth_cookie_policy',   /* required property */
  'value'    : '1',  /* required property */
  'domain'   : 'www.mytheresa.com',
  'path'     : '/',                /* required property */
  'httponly' : false,
  'secure'   : false,
  'expires'  : (new Date()).getTime() + (1000 * 60 * 60)   /* <-- expires in 1 hour */
},{
  'name'     : 'TC_PRIVACY',   /* required property */
  'value'    : '0@005@1%2C2%2C3@',  /* required property */
  'domain'   : 'www.mytheresa.com',
  'path'     : '/',                /* required property */
  'httponly' : false,
  'secure'   : false,
  'expires'  : (new Date()).getTime() + (1000 * 60 * 60)   /* <-- expires in 1 hour */
},{
  'name'     : 'TC_PRIVACY_CENTER',   /* required property */
  'value'    : '1%2C2%2C3',  /* required property */
  'domain'   : 'www.mytheresa.com',
  'path'     : '/',                /* required property */
  'httponly' : false,
  'secure'   : false,
  'expires'  : (new Date()).getTime() + (1000 * 60 * 60)   /* <-- expires in 1 hour */
}];

urls.forEach(async (url) => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-dev-shm-usage']});
    const page = await browser.newPage();

    await page.setViewport({width: 1280, height: 720});
    await page.setCookie(...cookies);
    const cookiesSet = await page.cookies(url);
    console.log(JSON.stringify(cookiesSet));
    await page.goto(url, {'waitUntil': ['load','domcontentloaded','networkidle0','networkidle2']}).then(()=>{
        console.log('Generating screeshot for ' + url);
    });


    await page.screenshot({
        fullPage: true,
        path: '/validator/screenshots/' + url.replace(/^.*\/\/[^\/]+/, '').replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '_').replace(/(\.html)|(\.htm)|(\.php)/, '').substr(1) + '.png'
    });
    await browser.close();
});
