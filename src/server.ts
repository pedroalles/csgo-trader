import express, { NextFunction, Request, Response } from "express";
import queue from "express-queue";
import cors from "cors";

import { Driver } from "./infra/WebDriver";

const app = express();
app.use(cors());
app.use(express.json());

const expressQueue = queue({
  activeLimit: 1,
  queuedLimit: -1,
  rejectHandler: (_req: Request, res: Response) => {
    res.sendStatus(500);
  },
});

app.use(expressQueue);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  console.log("Queue Length:", expressQueue.queue.getLength());
  next();
});

app.use((_req: Request, res: Response, next: NextFunction) => {
  let oldJson = res.json;

  res.json = function (data) {
    console.log(data); // do something with the data
    res.json = oldJson; // set function back to avoid the 'double-send'
    return res.json(data); // just call as normal with data
  };

  next();
});

app.get("/all", async (_req: Request, res: Response, next: NextFunction) => {
  const driver = new Driver();
  try {
    await driver.buildDriver();
    await driver.getMarket();

    // await driver.goToMarket();
    const sales = await driver.getSalesData();
    const orders = await driver.getOrdersData();

    const all = {
      sales: driver.processSalesData(sales),
      ...driver.processOrdersData(orders),
    };

    await driver.quit();

    return res.status(200).json(all);
  } catch (error) {
    console.log(error);
    await driver.quit();
    return res.status(500).json({ message: "Internal Server Error", error });
  }
});

app.get("/orders", async (req: Request, res: Response, next: NextFunction) => {
  const driver = new Driver();
  await driver.buildDriver();
  await driver.getMarket();

  // await driver.goToMarket();
  const orders = await driver.getOrdersData();

  await driver.quit();

  res.json(orders);
});

app.get("/sales", async (req: Request, res: Response, next: NextFunction) => {
  const driver = new Driver();
  await driver.buildDriver();
  await driver.getMarket();

  // await driver.goToMarket();
  const sales = await driver.getSalesData();

  await driver.quit();

  res.json(sales);
});

app.get("/sale", async (req: Request, res: Response, next: NextFunction) => {
  const driver = new Driver();
  try {
    const url = req.body.url;

    await driver.buildDriver();
    await driver.getPageByUrl(url);

    const data = await driver.getSaleData();

    await driver.quit();

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    await driver.quit();
    return res.status(500).json({ message: "Internal Server Error", error });
  }
});

app.get("/order", async (req: Request, res: Response, next: NextFunction) => {
  const driver = new Driver();
  try {
    const url = req.body.url;

    await driver.buildDriver();
    await driver.getPageByUrl(url);

    const data = await driver.getOrderData();

    await driver.quit();

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    await driver.quit();
    return res.status(500).json({ message: "Internal Server Error", error });
  }
});

const PORT = 3001;

app.listen(PORT, () => console.log(`Running on ${PORT}`));
