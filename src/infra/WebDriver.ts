import { Builder, By, Key, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import webdriver from "selenium-webdriver";
import { elementIsDisabled } from "selenium-webdriver/lib/until";
import {
  IMonitoring,
  IOrder,
  IOrderInfos,
  ISale,
  ISaleInfos,
  ISticker,
} from "../interface/ISticker";

const TABLE_WAIT = 3 * 1000;

export class Driver {
  driver!: webdriver.WebDriver;

  async buildDriver() {
    // const screen = {
    //     width: 1920,
    //     height: 1080
    // };

    const chromeOptions = new chrome.Options();
    // .headless();
    // .windowSize(screen)

    chromeOptions.addArguments(
      ...[
        "--user-data-dir=C:\\Users\\pedro\\AppData\\Local\\Google\\Chrome\\User Data\\Default",
        "--no-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--headless",
        // "--window-size=1920,1080"
      ]
    );
    chromeOptions.excludeSwitches("enable-logging");

    this.driver = await new Builder()
      .withCapabilities(webdriver.Capabilities.chrome())
      .setChromeOptions(chromeOptions)
      .build();

    await this.driver.manage().window().maximize();
  }

  async getSalesData() {
    // this.refresh();

    const salesContainerElement = await this.driver.findElement(
      By.xpath("//*[@id='tabContentsMyActiveMarketListingsRows']")
    );

    const salesElements = await salesContainerElement.findElements(
      By.className("market_listing_row")
    );

    const salesData = await Promise.all(
      salesElements.map(async (el) => ({
        name: await (
          await el.findElement(By.className("market_listing_item_name_link"))
        ).getText(),
        value: await (
          await el.findElement(
            By.css('span[title="This is the price the buyer pays."]')
          )
        ).getText(),
        link: await (
          await el.findElement(By.className("market_listing_item_name_link"))
        ).getAttribute("href"),
        image: (
          await (
            await el.findElement(By.css('img[id*="mylisting"]'))
          ).getAttribute("srcset")
        )
          .split(",")[1]
          .trim(),
      }))
    );

    return salesData;
  }

  async getOrdersData() {
    const ordersElements = await this.driver.findElements(
      By.xpath("//div[contains(@id,'mybuyorder')][not(contains(.,'0,03'))]")
    );

    const ordersData = await Promise.all(
      ordersElements.map(async (el) => ({
        name: await (
          await el.findElement(By.className("market_listing_item_name_link"))
        ).getText(),
        value: await (
          await el.findElement(By.css('span[class="market_listing_price"]'))
        ).getText(),
        link: await (
          await el.findElement(By.className("market_listing_item_name_link"))
        ).getAttribute("href"),
        image: (
          await (
            await el.findElement(By.css('img[id*="mybuyorder"]'))
          ).getAttribute("srcset")
        )
          .split(",")[1]
          .trim(),
      }))
    );

    return ordersData;
  }

  async getMonitoringData() {
    const monitoringElements = await this.driver.findElements(
      By.xpath(
        "//div[contains(@id,'mybuyorder')][.//span[contains(.,'R$ 0,03')]]"
      )
    );

    const monitoringData = await Promise.all(
      monitoringElements.map(async (el) => ({
        name: await (
          await el.findElement(By.className("market_listing_item_name_link"))
        ).getText(),
        value: await (
          await el.findElement(By.css('span[class="market_listing_price"]'))
        ).getText(),
        link: await (
          await el.findElement(By.className("market_listing_item_name_link"))
        ).getAttribute("href"),
        image: (
          await (
            await el.findElement(By.css('img[id*="mybuyorder"]'))
          ).getAttribute("srcset")
        )
          .split(",")[1]
          .trim(),
      }))
    );

    return monitoringData;
  }

  async getSaleData(): Promise<ISaleInfos> {
    console.log("INICIO DO GET SALE DATA");

    const tableLocator = By.xpath(
      '//*[@id="market_commodity_forsale_table"]/table'
    );

    const quantityLocator = By.xpath(
      '//*[@id="market_commodity_forsale_table"]/../..//span[1]'
    );

    const startingValueLocator = By.xpath(
      '//*[@id="market_commodity_forsale_table"]/../..//span[2]'
    );

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
      const tableExist = await this.driver.wait(
        until.elementLocated(tableLocator),
        TABLE_WAIT
      );

      // console.log("---", tableExist);
    } catch (error) {
      console.log(error);

      console.log("NAO EXISTE, REFRESH");
      await this.driver.navigate().refresh();

      console.log(" DEPOIS DO REFRESH");
      return await this.getSaleData();
    }

    const tableElement = await this.driver.findElement(tableLocator);

    const quantityElement = await tableElement.findElement(quantityLocator);

    const startingValueElement = await tableElement.findElement(
      startingValueLocator
    );

    const quantityText = await quantityElement.getText();
    const startingValueText = await startingValueElement.getText();
    // const tableText = await tableElement.getText();

    const tableRows = await tableElement.findElements(By.css("tr"));
    tableRows.shift();

    const tableValues = await this.getTableData(tableRows);

    return {
      quantity: quantityText,
      startingValue: startingValueText,
      table: tableValues,
    };
  }

  async getOrderData(): Promise<IOrderInfos> {
    console.log("INICIO DO GET ORDER DATA");

    const tableLocator = By.xpath(
      '//*[@id="market_commodity_buyreqeusts_table"]/table'
    );

    const quantityLocator = By.xpath(
      '//*[@id="market_commodity_buyreqeusts_table"]/../..//span[1]'
    );

    const startingValueLocator = By.xpath(
      '//*[@id="market_commodity_buyreqeusts_table"]/../..//span[2]'
    );

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
      const tableExist = await this.driver.wait(
        until.elementLocated(tableLocator),
        TABLE_WAIT
      );

      // console.log("---", tableExist);
    } catch (error) {
      console.log(error);

      console.log("NAO EXISTE, REFRESH");
      await this.driver.navigate().refresh();

      console.log(" DEPOIS DO REFRESH");
      return await this.getOrderData();
    }

    const tableElement = await this.driver.findElement(tableLocator);

    const quantityElement = await tableElement.findElement(quantityLocator);

    const startingValueElement = await tableElement.findElement(
      startingValueLocator
    );

    const quantityText = await quantityElement.getText();
    const startingValueText = await startingValueElement.getText();

    const tableRows = await tableElement.findElements(By.css("tr"));
    tableRows.shift();

    const tableValues = await this.getTableData(tableRows);

    // const tableText = await tableElement.getText();

    return {
      quantity: quantityText,
      startingValue: startingValueText,
      table: tableValues,
    };
  }

  async getTableData(
    array: webdriver.WebElement[]
  ): Promise<{ value: string; quantity: string }[]> {
    return Promise.all(
      array.map(async (row) => {
        const values = await row.findElements(By.css("td"));
        return {
          value: await values[0].getText(),
          quantity: await values[1].getText(),
        };
      })
    );
  }

  processSalesData(data: ISticker[]): ISale[] {
    return data.map((el) => ({
      name: el.name,
      link: el.link,
      image: el.image,
      sellValue: el.value,
      buyValue: "R$ 10,00",
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
      )}`,
    }));
  }

  processOrdersData(data: ISticker[]): IOrder[] {
    return data.map((el) => ({
      name: el.name,
      link: el.link,
      image: el.image,
      buyValue: el.value,
      quantity: "1",
    }));
  }

  processMonitoringData(data: ISticker[]): IMonitoring[] {
    return data.map((el) => ({
      name: el.name,
      link: el.link,
      image: el.image,
      buyValue: el.value,
    }));
  }

  roundValue(value: number): string {
    const round = Math.round((value + Number.EPSILON) * 100) / 100;
    const fixed = round.toFixed(2);
    return fixed.replace(".", ",");
  }

  formatValue(value: string): number {
    return Number(value.replace("R$ ", "").replace(",", "."));
  }

  async refresh() {
    await this.driver.navigate().refresh();
  }

  async getMarket() {
    await this.driver.get("https://steamcommunity.com/market/");
  }

  async getPageByUrl(url: string) {
    await this.driver.get(url);
  }

  async goToMarket() {
    const root = (await this.driver.getAllWindowHandles())[0];
    await this.driver.switchTo().window(root);
  }

  async newPage(typeHint: string) {
    await this.driver.switchTo().newWindow(typeHint);
  }

  async getPages() {
    return this.driver.getAllWindowHandles();
  }

  async quit() {
    await this.driver.quit();
  }

  async sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
