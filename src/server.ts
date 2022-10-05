import express, { NextFunction, Request, Response } from 'express'
import queue from 'express-queue'
import cors from 'cors'

import rootRouter from './routes/root.routes'
import orderRouter from './routes/order.routes'

const app = express()
app.use(cors())
app.use(express.json())

const expressQueue = queue({
  activeLimit: 1,
  queuedLimit: -1,
  rejectHandler: (_req: Request, res: Response) => {
    res.sendStatus(500)
  }
})

app.use(expressQueue)

app.use((_req: Request, _res: Response, next: NextFunction) => {
  console.log('Queue Length:', expressQueue.queue.getLength())
  next()
})

app.use((_req: Request, res: Response, next: NextFunction) => {
  const oldJson = res.json

  res.json = function (data) {
    const time = new Date()
    const timeString = `${time.getHours().toString().padStart(2, '0')}:${time
      .getMinutes()
      .toString()
      .padStart(2, '0')
      .padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`

    const dataWithTime = { ...data, time: timeString }
    console.log(dataWithTime) // do something with the data

    res.json = oldJson // set function back to avoid the 'double-send'
    return res.json(dataWithTime) // just call as normal with data
  }

  next()
})

app.use(rootRouter)
app.use(orderRouter)

const PORT = 3001

app.listen(PORT, () => console.log(`Running on ${PORT}`))
