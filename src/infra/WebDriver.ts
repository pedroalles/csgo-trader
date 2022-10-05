import webdriver, { Builder, By, until, Capabilities } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'

import {
  IMonitoring,
  IMonitoringInfos,
  IOrder,
  IOrderInfos,
  ISale,
  ISaleInfos,
  ISticker,
  IStickerMakeOrder
} from '../interface/ISticker'

const TABLE_WAIT = 3 * 1000

export class Driver {
  driver!: webdriver.WebDriver

  async buildDriver (): Promise<void> {
    // const screen = {
    //     width: 1920,
    //     height: 1080
    // };

    const caps = Capabilities.chrome()
    caps.setLoggingPrefs({ performance: 'ALL' })
    // caps.set('goog:loggingPrefs', { performance: 'ALL' })

    const chromeOptions = new chrome.Options()
    // .headless();
    // .windowSize(screen)

    chromeOptions.addArguments(
      ...[
        '--user-data-dir=C:\\Users\\pedro\\AppData\\Local\\Google\\Chrome\\User Data\\Default',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--headless'
        // "--window-size=1920,1080"
      ]
    )
    chromeOptions.excludeSwitches('enable-logging')

    this.driver = await new Builder()
      .withCapabilities(caps)
      .setChromeOptions(chromeOptions)
      .build()

    await this.driver.manage().window().maximize()
  }

  formatOrderUrl (url: string, index: number): string {
    return `${url.split('#p')[0]}#p${index}_quantity_asc`
  }

  async getItemData (): Promise<IStickerMakeOrder[]> {
    const itemLocator = By.className(
      'market_listing_row_link'
    )

    const itemsElements = await this.driver.findElements(itemLocator)

    const itemsData = await Promise.all(
      itemsElements.map(async (el) => ({
        name: await (
          await el.findElement(By.css("span[class='market_listing_item_name']"))
        ).getText(),
        value: await (
          await el.findElement(By.css('span[class="normal_price"]'))
        ).getText(),
        quantity: await (
          await el.findElement(By.className('market_listing_num_listings_qty'))
        ).getText(),
        link: await el.getAttribute('href')
      }))
    )

    return itemsData
  }

  async makeOrders (initialUrl: string): Promise<void> {
    let errors = 0
    let currentPage = 1
    let qtt = 0

    const linksToCeck: string[] = []

    const resultsLocator = By.xpath(
      "//*[@id='searchResultsRows'][contains(@style, 'opacity: 1;')]"
    )

    while (
      // currentPage < 1000 &&
      qtt <= 100) {
      await this.driver.get(
        this.formatOrderUrl(
          initialUrl,
          currentPage
        )
      )

      await this.driver.navigate().refresh()

      async function check (driver: any): Promise<void> {
        console.log('checando')

        try {
          await driver.wait(
            until.elementLocated(resultsLocator),
            5_000
          )
        } catch (error) {
          console.log('f5')

          driver.navigate().refresh()

          errors++

          await check(driver)
        }
      }

      try {
        await check(this.driver)
      } catch (error) {
        console.log('chegando no erro')
        // await check(this.driver)
      }

      const data = await this.getItemData()

      // console.log(data);
      data.forEach(el => console.log(`${el.name} - ${el.value} - ${el.quantity}`))

      qtt = +data[data.length - 1].quantity

      console.log('quantity:', qtt)
      console.log('page:', currentPage)

      currentPage++

      const links = data.map(el => el.link)

      linksToCeck.push(...links)
    }

    const linksToChekFiltered = Array.from(new Set(linksToCeck).values())

    console.log('links to check: ', linksToCeck.length)
    console.log('links to check filtered: ', linksToChekFiltered.length)
    console.log('errors: ', errors)
  }

  async getSalesData (): Promise<ISticker[]> {
    // this.refresh();

    const salesContainerElement = await this.driver.findElement(
      // By.xpath("//*[@id='tabContentsMyActiveMarketListingsRows']")
      By.xpath("//*[@id='tabContentsMyActiveMarketListingsTable']")
    )

    const salesElements = await salesContainerElement.findElements(
      By.className('market_listing_row')
    )

    const salesData = await Promise.all(
      salesElements.map(async (el) => ({
        name: await (
          await el.findElement(By.className('market_listing_item_name_link'))
        ).getText(),
        value: await (
          await el.findElement(
            By.css('span[title="This is the price the buyer pays."]')
          )
        ).getText(),
        link: await (
          await el.findElement(By.className('market_listing_item_name_link'))
        ).getAttribute('href'),
        image: (
          await (
            await el.findElement(By.css('img[id*="mylisting"]'))
          ).getAttribute('srcset')
        )
          .split(',')[1]
          .trim(),
        id: await el.getAttribute('id')
      }))
    )

    return salesData
  }

  async getOrdersData (): Promise<ISticker[]> {
    const ordersElements = await this.driver.findElements(
      By.xpath("//div[contains(@id,'mybuyorder')][not(contains(.,'0,03'))]")
    )

    const ordersData = await Promise.all(
      ordersElements.map(async (el) => ({
        name: await (
          await el.findElement(By.className('market_listing_item_name_link'))
        ).getText(),
        value: await (
          await el.findElement(By.css('span[class="market_listing_price"]'))
        ).getText(),
        link: await (
          await el.findElement(By.className('market_listing_item_name_link'))
        ).getAttribute('href'),
        image: (
          await (
            await el.findElement(By.css('img[id*="mybuyorder"]'))
          ).getAttribute('srcset')
        )
          .split(',')[1]
          .trim()
      }))
    )

    return ordersData
  }

  async getMonitoringData (): Promise<ISticker[]> {
    const monitoringElements = await this.driver.findElements(
      By.xpath(
        "//div[contains(@id,'mybuyorder')][.//span[contains(.,'R$ 0,03')]]"
      )
    )

    const monitoringData = await Promise.all(
      monitoringElements.map(async (el) => ({
        name: await (
          await el.findElement(By.className('market_listing_item_name_link'))
        ).getText(),
        value: await (
          await el.findElement(By.css('span[class="market_listing_price"]'))
        ).getText(),
        link: await (
          await el.findElement(By.className('market_listing_item_name_link'))
        ).getAttribute('href'),
        image: (
          await (
            await el.findElement(By.css('img[id*="mybuyorder"]'))
          ).getAttribute('srcset')
        )
          .split(',')[1]
          .trim()
      }))
    )

    return monitoringData
  }

  async getSaleInfoData (): Promise<ISaleInfos> {
    console.log('INICIO DO GET SALE DATA')

    const tableLocator = By.xpath(
      '//*[@id="market_commodity_forsale_table"]/table'
    )

    const quantityLocator = By.xpath(
      '//*[@id="market_commodity_forsale_table"]/../..//span[1]'
    )

    const startingValueLocator = By.xpath(
      '//*[@id="market_commodity_forsale_table"]/../..//span[2]'
    )

    // const tableContainerLocator = By.xpath(
    //   '//*[@id="market_commodity_forsale_table"]'
    // );

    // const tableContainerExist = await this.driver.wait(
    //   until.elementLocated(tableContainerLocator),
    //   1000
    // );

    // console.log("---", tableContainerExist);

    try {
      // throw new Error("ERROOOOOO");
      await this.driver.wait(
        until.elementLocated(tableLocator),
        TABLE_WAIT
      )

      // console.log("---", tableExist);
    } catch (error) {
      console.log(error)

      console.log('NAO EXISTE, REFRESH')
      await this.driver.navigate().refresh()

      console.log(' DEPOIS DO REFRESH')
      return await this.getSaleInfoData()
    }

    const tableElement = await this.driver.findElement(tableLocator)

    const quantityElement = await tableElement.findElement(quantityLocator)

    const startingValueElement = await tableElement.findElement(
      startingValueLocator
    )

    const quantityText = await quantityElement.getText()
    const startingValueText = await startingValueElement.getText()
    // const tableText = await tableElement.getText();

    const tableRows = await tableElement.findElements(By.css('tr'))
    tableRows.shift()

    const tableValues = await this.getTableData(tableRows)

    return {
      quantity: quantityText,
      startingValue: startingValueText,
      table: tableValues
    }
  }

  async getOrderInfoData (): Promise<IOrderInfos> {
    console.log('INICIO DO GET ORDER DATA')

    const tableLocator = By.xpath(
      '//*[@id="market_commodity_buyreqeusts_table"]/table'
    )

    const quantityLocator = By.xpath(
      '//*[@id="market_commodity_buyreqeusts_table"]/../..//span[1]'
    )

    const startingValueLocator = By.xpath(
      '//*[@id="market_commodity_buyreqeusts_table"]/../..//span[2]'
    )

    // const tableContainerLocator = By.xpath(
    //   '//*[@id="market_commodity_buyreqeusts_table"]'
    // );

    // const tableContainerExist = await this.driver.wait(
    //   until.elementLocated(tableContainerLocator),
    //   1000
    // );

    // console.log("---", tableContainerExist);

    try {
      // throw new Error("ERROOOOOO");
      await this.driver.wait(
        until.elementLocated(tableLocator),
        TABLE_WAIT
      )

      // console.log("---", tableExist);
    } catch (error) {
      console.log(error)

      console.log('NAO EXISTE, REFRESH')
      await this.driver.navigate().refresh()

      console.log(' DEPOIS DO REFRESH')
      return await this.getOrderInfoData()
    }

    const tableElement = await this.driver.findElement(tableLocator)

    const quantityElement = await tableElement.findElement(quantityLocator)

    const startingValueElement = await tableElement.findElement(
      startingValueLocator
    )

    const quantityText = await quantityElement.getText()
    const startingValueText = await startingValueElement.getText()

    const tableRows = await tableElement.findElements(By.css('tr'))
    tableRows.shift()

    const tableValues = await this.getTableData(tableRows)

    // const tableText = await tableElement.getText();

    return {
      quantity: quantityText,
      startingValue: startingValueText,
      table: tableValues
    }
  }

  async getMonitoringInfoData (): Promise<IMonitoringInfos> {
    const saleTableLocator = By.xpath(
      '//*[@id="market_commodity_forsale_table"]/table'
    )

    const saleQuantityLocator = By.xpath(
      '//*[@id="market_commodity_forsale_table"]/../..//span[1]'
    )

    const saleStartingValueLocator = By.xpath(
      '//*[@id="market_commodity_forsale_table"]/../..//span[2]'
    )

    // const tableContainerLocator = By.xpath(
    //   '//*[@id="market_commodity_forsale_table"]'
    // );

    // const tableContainerExist = await this.driver.wait(
    //   until.elementLocated(tableContainerLocator),
    //   1000
    // );

    // console.log("---", tableContainerExist);

    try {
      // throw new Error("ERROOOOOO");
      await this.driver.wait(
        until.elementLocated(saleTableLocator),
        TABLE_WAIT
      )

      // console.log("---", tableExist);
    } catch (error) {
      console.log(error)

      console.log('NAO EXISTE, REFRESH')
      await this.driver.navigate().refresh()

      console.log(' DEPOIS DO REFRESH')
      return await this.getMonitoringInfoData()
    }

    const saleTableElement = await this.driver.findElement(saleTableLocator)

    const saleQuantityElement = await saleTableElement.findElement(
      saleQuantityLocator
    )

    const saleStartingValueElement = await saleTableElement.findElement(
      saleStartingValueLocator
    )

    const saleQuantityText = await saleQuantityElement.getText()
    const saleStartingValueText = await saleStartingValueElement.getText()
    // const tableText = await tableElement.getText();

    const saleTableRows = await saleTableElement.findElements(By.css('tr'))
    saleTableRows.shift()

    const saleTableValues = await this.getTableData(saleTableRows)

    const saleData = {
      saleQuantityText,
      saleStartingValueText,
      saleTableValues
    }

    /// ////////////////////////////////////////////////
    console.log('INICIO DO GET MONITORING DATA')

    const orderTableLocator = By.xpath(
      '//*[@id="market_commodity_buyreqeusts_table"]/table'
    )

    const orderQuantityLocator = By.xpath(
      '//*[@id="market_commodity_buyreqeusts_table"]/../..//span[1]'
    )

    const orderStartingValueLocator = By.xpath(
      '//*[@id="market_commodity_buyreqeusts_table"]/../..//span[2]'
    )

    // const tableContainerLocator = By.xpath(
    //   '//*[@id="market_commodity_buyreqeusts_table"]'
    // );

    // const tableContainerExist = await this.driver.wait(
    //   until.elementLocated(tableContainerLocator),
    //   1000
    // );

    // console.log("---", tableContainerExist);

    try {
      // throw new Error("ERROOOOOO");
      await this.driver.wait(
        until.elementLocated(orderTableLocator),
        TABLE_WAIT
      )

      // console.log("---", tableExist);
    } catch (error) {
      console.log(error)

      console.log('NAO EXISTE, REFRESH')
      await this.driver.navigate().refresh()

      console.log(' DEPOIS DO REFRESH')
      return await this.getMonitoringInfoData()
    }

    const orderTableElement = await this.driver.findElement(orderTableLocator)

    const orderQuantityElement = await orderTableElement.findElement(
      orderQuantityLocator
    )

    const orderStartingValueElement = await orderTableElement.findElement(
      orderStartingValueLocator
    )

    const orderQuantityText = await orderQuantityElement.getText()
    const orderStartingValueText = await orderStartingValueElement.getText()

    const orderTableRows = await orderTableElement.findElements(By.css('tr'))
    orderTableRows.shift()

    const orderTableValues = await this.getTableData(orderTableRows)

    // const tableText = await tableElement.getText();

    const orderData = {
      orderQuantityText,
      orderStartingValueText,
      orderTableValues
    }

    return {
      saleQuantity: saleData.saleQuantityText,
      saleStartingValue: saleData.saleStartingValueText,
      saleTable: saleData.saleTableValues,
      orderQuantity: orderData.orderQuantityText,
      orderStartingValue: orderData.orderStartingValueText,
      orderTable: orderData.orderTableValues
    }
  }

  async getTableData (
    array: webdriver.WebElement[]
  ): Promise<Array<{ value: string, quantity: string }>> {
    return await Promise.all(
      array.map(async (row) => {
        const values = await row.findElements(By.css('td'))
        return {
          value: (await values[0].getText())
            .replace('or more', 'or >')
            .replace('or less', 'or <'),
          quantity: await values[1].getText()
        }
      })
    )
  }

  processSalesData (data: ISticker[]): ISale[] {
    return data.map((el) => ({
      name: el.name,
      link: el.link,
      image: el.image,
      sellValue: el.value,
      buyValue: 'R$ 10,00',
      receiveValue: `R$ ${this.roundValue(
        this.formatValue(el.value) - this.formatValue(el.value) * 0.13
      )}`,
      profitValue: `R$ ${this.roundValue(
        this.formatValue(el.value) - this.formatValue(el.value) * 0.13 - 10
      )}`,
      profitPercent: `${this.roundValue(
        ((this.formatValue(el.value) - this.formatValue(el.value) * 0.13 - 10) *
          100) /
          10
      )}`
    }))
  }

  processOrdersData (data: ISticker[]): IOrder[] {
    return data.map((el) => ({
      name: el.name,
      link: el.link,
      image: el.image,
      buyValue: el.value,
      quantity: '1'
    }))
  }

  processMonitoringData (data: ISticker[]): IMonitoring[] {
    return data.map((el) => ({
      name: el.name,
      link: el.link,
      image: el.image,
      buyValue: el.value
    }))
  }

  roundValue (value: number): string {
    const round = Math.round((value + Number.EPSILON) * 100) / 100
    const fixed = round.toFixed(2)
    return fixed.replace('.', ',')
  }

  formatValue (value: string): number {
    return Number(value.replace('R$ ', '').replace(',', '.'))
  }

  async cancelOrder (): Promise<void> {
    // const buttonContainerLocator = By.xpath(
    //   '//*[@id="tabContentsMyActiveMarketListingsRows"]'
    // );

    const buttonContainerLocator = By.xpath(
      '//*[@class="my_listing_section market_content_block market_home_listing_table"]'
    )

    try {
      await this.driver.wait(
        until.elementLocated(buttonContainerLocator),
        TABLE_WAIT
      )
    } catch (error) {
      console.log(error)
      console.log('NAO EXISTE, REFRESH')
      await this.driver.navigate().refresh()
      return await this.cancelOrder()
    }

    const buttonContainertElement = await this.driver.findElement(
      buttonContainerLocator
    )

    await this.driver.executeScript(
      'arguments[0].scrollIntoView(true);',
      buttonContainertElement
    )

    const cancelButton = await buttonContainertElement.findElement(
      By.xpath('./div[2]/div[5]/div/a/span[2]')
    )

    await cancelButton.click()

    await this.driver.wait(until.stalenessOf(cancelButton))
  }

  async cancelSale (): Promise<void> {
    const buttonContainerLocator = By.xpath(
      '//*[@id="tabContentsMyActiveMarketListingsTable"]'
    )

    try {
      await this.driver.wait(
        until.elementLocated(buttonContainerLocator),
        TABLE_WAIT
      )
    } catch (error) {
      console.log(error)
      console.log('NAO EXISTE, REFRESH')
      await this.driver.navigate().refresh()
      return await this.cancelSale()
    }

    const buttonContainertElement = await this.driver.findElement(
      buttonContainerLocator
    )

    await this.driver.executeScript(
      'arguments[0].scrollIntoView(true);',
      buttonContainertElement
    )

    const cancelButton = await buttonContainertElement.findElement(
      By.xpath('./div[2]/div/div[5]/div/a/span[2]')
    )

    await cancelButton.click()

    await this.driver.wait(until.stalenessOf(cancelButton))
  }

  async refresh (): Promise<void> {
    await this.driver.navigate().refresh()
  }

  async getMarket (): Promise<void> {
    await this.driver.get('https://steamcommunity.com/market/')
  }

  async getPageByUrl (url: string): Promise<void> {
    await this.driver.get(url)
  }

  async goToMarket (): Promise<void> {
    const root = (await this.driver.getAllWindowHandles())[0]
    await this.driver.switchTo().window(root)
  }

  async newPage (typeHint: string): Promise<void> {
    await this.driver.switchTo().newWindow(typeHint)
  }

  async getPages (): Promise<string[]> {
    return await this.driver.getAllWindowHandles()
  }

  async quit (): Promise<void> {
    await this.driver.quit()
  }

  async sleep (ms: number): Promise<unknown> {
    return await new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }
}
