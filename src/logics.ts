import { Request, Response } from "express";
import { ICleaningProduct, IFoodProduct } from "./interfaces"
import market from './database';

let getNextId = 1
let value = 0

const createProduct = (request: Request, response: Response): Response => {
  const newProducts = request.body as (ICleaningProduct | IFoodProduct)[]
  newProducts.forEach((object: ICleaningProduct | IFoodProduct) => {
    object.id = getNextId
    getNextId++
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + 365)
    object.expirationDate = expirationDate
    value += object.price
    market.push(object)
  })
  const marketProducts = market.map(product => {
    const { id, name, price, weight, section, expirationDate } = product
    if (product.section === "food") {
      const foodProduct = product as IFoodProduct
      const { calories } = foodProduct
      return { id, name, price, weight, calories, section, expirationDate }
    } else {
      const cleaningProduct = product as ICleaningProduct
      return { id, name, price, weight, section, expirationDate }
    }
  })
  return response.status(201).json({
    total: value,
    marketProducts
  })
}

const readProducts = (request: Request, response: Response): Response => {
  const marketProducts = market.map(product => {
    const { id, name, price, weight, section, expirationDate } = product
    if (product.section === "food") {
      const foodProduct = product as IFoodProduct
      const { calories } = foodProduct
      return { id, name, price, weight, calories, section, expirationDate }
    } else {
      const cleaningProduct = product as ICleaningProduct
      return { id, name, price, weight, section, expirationDate }
    }
  })
  return response.status(200).json({
    total: value,
    marketProducts
  })
}

const retrieveProduct = (request: Request, response: Response): Response => {
  const index = response.locals.market.productIndex
  return response.status(200).json(market[index])
}

const updateProduct = (request: Request, response: Response): Response => {
  const index = response.locals.market.productIndex
  const updateProductData = request.body
  const { id, section, expirationDate, ...updatedFields } = updateProductData
  market[index] = {
    ...market[index],
    ...updatedFields
  }
  return response.json(market[index])
}

const deleteProduct = (request: Request, response: Response): Response => {
  const index = response.locals.market.productIndex
  value -= market[index].price
  market.splice(index, 1)
  return response.status(204).send()
}

export { createProduct, readProducts, retrieveProduct, updateProduct,deleteProduct }