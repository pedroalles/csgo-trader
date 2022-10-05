import { Driver } from './infra/WebDriver'
import fetch from 'isomorphic-fetch'

(async function () {
  const driver = new Driver()
  await driver.buildDriver()
  await driver.getMarket()

  const cookies = await driver.driver.manage().getCookies()

  const aditionalCookies = [
    'steamCurrencyId=false',
    'steamCountry=7',
    'tsTradeOffersLastRead=BR%7C34b6d72606820f16c5b1ed2a87728ec1',
    'enableSIH=1661740357'
  ]

  const allCookies = [
    ...cookies.map(cookie => `${cookie.name}=${cookie.value}`),
    ...aditionalCookies
  ]

  const requestCookies = allCookies.join('; ')

  const sessionid = cookies.find(el => el.name === 'sessionid')?.value

  const infos = {
    sessionid: sessionid ?? '',
    appid: '730',
    contextid: '2',
    assetid: '27240828926',
    amount: '1',
    price: '2099'
  }

  const queredInfos = Object.entries(infos).map(el => `${el[0]}=${el[1]}`).join('&')
  const url = 'https://steamcommunity.com/market/sellitem'
  const response = await fetch(url, {
    headers: {
      accept: 'text/javascript, text/html, application/xml, text/xml, */*',
      'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'x-prototype-version': '1.7',
      'x-requested-with': 'XMLHttpRequest',
      Referer: 'https://steamcommunity.com/id/pedroalles/inventory',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      cookie: requestCookies
    },
    body: queredInfos,
    method: 'POST'
  })

  console.log('-', response.status)
  console.log('-', response.statusText)

  await driver.quit()
})().catch((err) => {
  console.log(err)
})
