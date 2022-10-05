import { Driver } from './infra/WebDriver'
import fetch from 'isomorphic-fetch'

(async function () {
  const driver = new Driver()
  await driver.buildDriver()
  await driver.getMarket()
  // const data = await driver.getSalesData()

  // if (data.length === 0) {
  //   return await driver.quit()
  // }

  // const itemId = data[0].id.split('mylisting_')[1]

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
    sessionid: sessionid ?? ''
  }

  const queredInfos = Object.entries(infos).map(el => `${el[0]}=${el[1]}`).join('&')
  // const url = `https://steamcommunity.com/market/removelisting/${itemId}`
  // const response = await fetch(url, {
  //   headers: {
  //     accept: 'text/javascript, text/html, application/xml, text/xml, */*',
  //     'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  //     'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
  //     'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
  //     'sec-ch-ua-mobile': '?0',
  //     'sec-ch-ua-platform': '"Windows"',
  //     'sec-fetch-dest': 'empty',
  //     'sec-fetch-mode': 'cors',
  //     'sec-fetch-site': 'same-origin',
  //     'x-prototype-version': '1.7',
  //     'x-requested-with': 'XMLHttpRequest',
  //     cookie: requestCookies,
  //     Referer: 'https://steamcommunity.com/market/',
  //     'Referrer-Policy': 'strict-origin-when-cross-origin'
  //   },
  //   body: queredInfos,
  //   method: 'POST'
  // })

  const response = await fetch('https://steamcommunity.com/market/listings/730/Sticker%20%7C%20waterfaLLZ%20(Foil)%20%7C%20Boston%202018', {
    headers: {
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      cookie: requestCookies,
      Referer: 'https://steamcommunity.com/id/pedroalles/inventory',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    },
    body: null,
    method: 'GET'
  })
  // .then(async res => await res.json())

  console.log(response.body)

  // console.log('-', response.status)
  // console.log('-', response.statusText)

  await driver.quit()
})().catch((err) => {
  console.log(err)
})
