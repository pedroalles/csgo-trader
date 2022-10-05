// import { Driver } from './infra/WebDriver'

// const url = 'https://steamcommunity.com/market/search?q=&category_730_ItemSet%5B%5D=any&category_730_ProPlayer%5B%5D=any&category_730_StickerCapsule%5B%5D=any&category_730_TournamentTeam%5B%5D=any&category_730_Weapon%5B%5D=any&category_730_Rarity%5B%5D=tag_Rarity_Rare&category_730_Rarity%5B%5D=tag_Rarity_Mythical&category_730_Rarity%5B%5D=tag_Rarity_Legendary&category_730_StickerCategory%5B%5D=tag_PlayerSignature&category_730_Tournament%5B%5D=tag_Tournament13&category_730_Tournament%5B%5D=tag_Tournament14&category_730_Tournament%5B%5D=tag_Tournament12&category_730_Tournament%5B%5D=tag_Tournament11&category_730_Tournament%5B%5D=tag_Tournament7&category_730_Tournament%5B%5D=tag_Tournament10&category_730_Tournament%5B%5D=tag_Tournament9&category_730_Tournament%5B%5D=tag_Tournament8&category_730_Tournament%5B%5D=tag_Tournament6&category_730_Tournament%5B%5D=tag_Tournament4&category_730_Tournament%5B%5D=tag_Tournament3&category_730_Tournament%5B%5D=tag_Tournament5&category_730_Tournament%5B%5D=tag_Tournament1&category_730_Type%5B%5D=tag_CSGO_Tool_Sticker&appid=730#p1_quantity_asc';

// (async function () {
//   const driver = new Driver()
//   await driver.buildDriver()
//   await driver.makeOrders(url)
//   await driver.quit()
// })().catch((err) => {
//   console.log(err)
// })

// fetch("https://steamcommunity.com/inventory/76561198169338651/730/2?l=english&count=75", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
//     "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "x-requested-with": "XMLHttpRequest",
//     "cookie": "sessionid=1d652238f2e1ece9b579c88c; timezoneOffset=-10800,0; _ga=GA1.2.1302090332.1655170059; Steam_Language=english; browserid=2533851587907600914; webTradeEligibility=%7B%22allowed%22%3A1%2C%22allowed_at_time%22%3A0%2C%22steamguard_required_days%22%3A15%2C%22new_device_cooldown_days%22%3A7%2C%22time_checked%22%3A1655170120%7D; steamMachineAuth76561198169338651=1A66FD495555FD2AAB30F96619FA49F6E563C5BE; steamCurrencyId=7; recentlyVisitedAppHubs=258760%2C108600%2C892970; app_impressions=892970@2_9_100000_|892970@2_9_100006_|892970@2_9_100000_|892970@2_9_100006_100202|892970@2_9_100006_100202|892970@2_9_100006_100202|258760@2_9_100000_|108600@2_9_100000_|108600@2_9_100000_|892970@2_9_100000_|892970@2_9_100000_; strInventoryLastContext=730_2; steamCountry=BR%7C34b6d72606820f16c5b1ed2a87728ec1; _gid=GA1.2.103302002.1664036965; steamLoginSecure=76561198169338651%7C%7CeyAidHlwIjogIkpXVCIsICJhbGciOiAiRWREU0EiIH0.eyAiaXNzIjogInI6MEJBMl8yMTUzRjE5Q182MEM4OCIsICJzdWIiOiAiNzY1NjExOTgxNjkzMzg2NTEiLCAiYXVkIjogWyAid2ViIiBdLCAiZXhwIjogMTY2NDIwMjk0NywgIm5iZiI6IDE2NjQxMTU2ODIsICJpYXQiOiAxNjY0MTE1NjkyLCAianRpIjogIjBCQTNfMjE1M0YxOTdfOTFBMUMiLCAib2F0IjogMTY2NDExNTY5MSwgInJ0X2V4cCI6IDE2ODIyMzA4NjUsICJwZXIiOiAwLCAiaXBfc3ViamVjdCI6ICIxNzkuMjE3LjIyMS44NCIsICJpcF9jb25maXJtZXIiOiAiMTc5LjIxNy4yMjEuODQiIH0.7ptwMivnbA1OCgq-CigHqHHVtN7ulsVCp2VH39boyFQppyFC6uqKdIEI-lXCQM5z95Zm4kfcXdAptmBBkQIYBg",
//     "Referer": "https://steamcommunity.com/id/pedroalles/inventory",
//     "Referrer-Policy": "strict-origin-when-cross-origin"
//   },
//   "body": null,
//   "method": "GET"
// });

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

  const mainHeaders: HeadersInit | undefined = {
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
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    cookie: requestCookies
  }

  const headers1 = {
    ...mainHeaders
    // Referer: 'https://steamcommunity.com/id/pedroalles/inventory'
  }

  const count = 5
  const url = `https://steamcommunity.com/inventory/76561198169338651/730/2?l=english&count=${count}`

  const response = await fetch(url, {
    headers: headers1,
    body: null,
    method: 'GET'
  })

  console.log(response.status)
  console.log(response.statusText)

  const datas = await response.json()

  const assets: Array<{ assetid: string, classid: string }> = datas.assets
  const descriptions: Array<{ assetid: string, classid: string, name: string }> = datas.descriptions

  console.log('assets', JSON.stringify(assets))
  console.log('descriptions', JSON.stringify(descriptions))

  const name = 'Sticker | waterfaLLZ | Boston 2018'

  const classid = descriptions.find(el => el.name === name)?.classid ?? ''

  const assetid = assets.find(el => el.classid === classid)?.assetid ?? ''

  const sessionid = cookies.find(el => el.name === 'sessionid')?.value

  const infos = {
    sessionid: sessionid ?? '',
    appid: '730',
    contextid: '2',
    assetid,
    amount: '1',
    price: '1492'
  }

  const headers2 = {
    ...mainHeaders,
    Referer: 'https://steamcommunity.com/market'
  }

  const queredInfos = Object.entries(infos).map(el => `${el[0]}=${el[1]}`).join('&')
  const url2 = 'https://steamcommunity.com/market/sellitem'

  const response2 = await fetch(url2, {
    headers: headers2,
    body: queredInfos,
    method: 'POST'
  })

  console.log(response2.status)
  console.log(response2.statusText)

  await driver.quit()
})().catch((err) => {
  console.log(err)
})
