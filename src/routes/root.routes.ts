import { Router, NextFunction, Request, Response } from 'express'

import { Driver } from '../infra/WebDriver'

const router = Router()

router.get(
  '/login',
  async (_req: Request, res: Response, next: NextFunction) => {
    const driver = new Driver()
    try {
      await driver.buildDriver()
      await driver.getMarket()

      // await driver.quit();

      return res.status(200).end()
    } catch (error) {
      console.log(error)
      await driver.quit()
      return res.status(500).json({ message: 'Internal Server Error', error })
    }
  }
)

router.get('/all', async (_req: Request, res: Response, next: NextFunction) => {
  // return res.status(500).json({ message: "Internal Server Error" });

  const driver = new Driver()
  try {
    await driver.buildDriver()
    await driver.getMarket()

    // await driver.goToMarket();
    const sales = await driver.getSalesData()
    const orders = await driver.getOrdersData()
    const monitoring = await driver.getMonitoringData()

    const allData = {
      sales: driver.processSalesData(sales),
      orders: driver.processOrdersData(orders),
      monitoring: driver.processMonitoringData(monitoring)
    }

    await driver.quit()

    return res.status(200).json({
      data: allData
    })
  } catch (error) {
    console.log(error)
    await driver.quit()
    return res.status(500).json({ message: 'Internal Server Error', error })
  }
})

router.get(
  '/orders',
  async (req: Request, res: Response, next: NextFunction) => {
    const driver = new Driver()
    try {
      await driver.buildDriver()
      await driver.getMarket()

      // await driver.goToMarket();
      const ordersData = await driver.getOrdersData()

      await driver.quit()

      return res.status(200).json({
        data: ordersData
      })
    } catch (error) {
      console.log(error)
      await driver.quit()
      return res.status(500).json({ message: 'Internal Server Error', error })
    }
  }
)

router.get(
  '/sales',
  async (req: Request, res: Response, next: NextFunction) => {
    const driver = new Driver()
    try {
      await driver.buildDriver()
      await driver.getMarket()

      // await driver.goToMarket();
      const salesData = await driver.getSalesData()

      await driver.quit()

      return res.status(200).json({
        data: salesData
      })
    } catch (error) {
      console.log(error)
      await driver.quit()
      return res.status(500).json({ message: 'Internal Server Error', error })
    }
  }
)

router.get(
  '/monitoring',
  async (req: Request, res: Response, next: NextFunction) => {
    const driver = new Driver()
    try {
      await driver.buildDriver()
      await driver.getMarket()

      // await driver.goToMarket();
      const monitoringData = await driver.getMonitoringData()

      await driver.quit()

      return res.status(200).json({
        data: monitoringData
      })
    } catch (error) {
      console.log(error)
      await driver.quit()
      return res.status(500).json({ message: 'Internal Server Error', error })
    }
  }
)

router.get(
  '/sale/info',
  async (req: Request, res: Response, next: NextFunction) => {
    const driver = new Driver()
    try {
      const url = req.query.url as string

      await driver.buildDriver()
      await driver.getPageByUrl(url)

      const saleData = await driver.getSaleInfoData()

      await driver.quit()

      return res.status(200).json({
        data: saleData
      })
    } catch (error) {
      console.log(error)
      await driver.quit()
      return res.status(500).json({ message: 'Internal Server Error', error })
    }
  }
)

router.get(
  '/order/info',
  async (req: Request, res: Response, next: NextFunction) => {
    const driver = new Driver()
    try {
      const url = req.query.url as string

      await driver.buildDriver()
      await driver.getPageByUrl(url)

      const orderData = await driver.getOrderInfoData()

      await driver.quit()

      return res.status(200).json({
        data: orderData
      })
    } catch (error) {
      console.log(error)
      await driver.quit()
      return res.status(500).json({ message: 'Internal Server Error', error })
    }
  }
)

router.get(
  '/monitoring/info',
  async (req: Request, res: Response, next: NextFunction) => {
    const driver = new Driver()
    try {
      // console.log("------------", req.body);
      // console.log("------------", req.params);
      console.log('------------', req.query)

      const url = req.query.url as string

      await driver.buildDriver()
      await driver.getPageByUrl(url)

      const monitoringInfoData = await driver.getMonitoringInfoData()

      await driver.quit()

      return res.status(200).json({
        data: monitoringInfoData
      })
    } catch (error) {
      console.log(error)
      await driver.quit()
      return res.status(500).json({ message: 'Internal Server Error', error })
    }
  }
)

// interface CustomRequest<T> extends Request {
//   body: T
// }

// interface Cancel {
//   url: string
//   type: 'Sales' | 'Orders' | 'Monitoring'
// }

router.get(
  '/cancel',
  async (req: Request, res: Response, next: NextFunction) => {
    const driver = new Driver()
    try {
      console.log('CANCELLL')

      // console.log(req);
      const { type, url } = req.query as { url: string, type: string }

      if (type === '' || url === '') {
        return res.status(422).json({
          message: 'Invalid body'
        })
      }

      await driver.buildDriver()
      await driver.getPageByUrl(url)

      if (type === 'Sales') {
        await driver.cancelSale()
      }

      if (type === 'Orders' || type === 'Monitoring') {
        await driver.cancelOrder()
      }

      await driver.quit()

      return res.status(200).json({
        //   data: ,
      })
    } catch (error) {
      console.log(error)
      await driver.quit()
      return res.status(500).json({ message: 'Internal Server Error', error })
    }
  }
)

export default router
