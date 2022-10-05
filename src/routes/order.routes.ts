import { Router, NextFunction, Request, Response } from 'express'

import { Driver } from '../infra/WebDriver'

const router = Router()

router.get(
  '/make-orders',
  async (_req: Request, res: Response, next: NextFunction) => {
    const driver = new Driver()

    try {
      const url = 'https://steamcommunity.com/market/search?q=&category_730_ItemSet%5B%5D=any&category_730_ProPlayer%5B%5D=any&category_730_StickerCapsule%5B%5D=any&category_730_TournamentTeam%5B%5D=any&category_730_Weapon%5B%5D=any&category_730_Rarity%5B%5D=tag_Rarity_Rare&category_730_Rarity%5B%5D=tag_Rarity_Mythical&category_730_Rarity%5B%5D=tag_Rarity_Legendary&category_730_StickerCategory%5B%5D=tag_PlayerSignature&category_730_Tournament%5B%5D=tag_Tournament13&category_730_Tournament%5B%5D=tag_Tournament14&category_730_Tournament%5B%5D=tag_Tournament12&category_730_Tournament%5B%5D=tag_Tournament11&category_730_Tournament%5B%5D=tag_Tournament7&category_730_Tournament%5B%5D=tag_Tournament10&category_730_Tournament%5B%5D=tag_Tournament9&category_730_Tournament%5B%5D=tag_Tournament8&category_730_Tournament%5B%5D=tag_Tournament6&category_730_Tournament%5B%5D=tag_Tournament4&category_730_Tournament%5B%5D=tag_Tournament3&category_730_Tournament%5B%5D=tag_Tournament5&category_730_Tournament%5B%5D=tag_Tournament1&category_730_Type%5B%5D=tag_CSGO_Tool_Sticker&appid=730#p1_quantity_asc'

      await driver.buildDriver()
      await driver.makeOrders(url)

      await driver.quit()

      return res.status(200).end()
    } catch (error) {
      console.log(error)
      await driver.quit()
      return res.status(500).json({ message: 'Internal Server Error', error })
    }
  }
)

export default router
