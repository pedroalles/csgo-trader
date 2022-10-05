
// import { Driver } from './infra/WebDriver'
// import fetch from 'isomorphic-fetch'

// (async function () {
//   const driver = new Driver()
//   await driver.buildDriver()
//   await driver.getMarket()

//   const itemNameId = '175945436'175880266

//   const url = `https://steamcommunity.com/market/itemordershistogram?country=BR&language=english&currency=7&item_nameid=${itemNameId}&two_factor=0`

//   const response = await fetch(url, {
//     referrerPolicy: 'strict-origin-when-cross-origin',
//     body: null,
//     method: 'GET'
//   }).then(async res => await res.json())

//   console.log(response)

//   await driver.quit()
// })().catch((err) => {
//   console.log(err)
// })

import { Driver } from './infra/WebDriver'
import fetch from 'isomorphic-fetch'

(async function () {
  const driver = new Driver()
  await driver.buildDriver()
  await driver.driver.get('https://steamcommunity.com/market/listings/730/Sticker%20%7C%20waterfaLLZ%20%28Foil%29%20%7C%20Boston%202018')

  // const scripttoexec = 'var performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance || {}; var network = performance.getEntries() || {}; return network;'

  // const data = await driver.driver.executeScript(scripttoexec)
  // console.log(data.map(el => el.name))

  await driver.quit()
})().catch((err) => {
  console.log(err)
})
