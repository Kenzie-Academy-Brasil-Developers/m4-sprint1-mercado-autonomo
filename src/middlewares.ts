import { NextFunction, Request, Response } from "express"
import  market from "./database"
import { IProduct } from "./interfaces"

const verifyId = (request: Request, response: Response, next: NextFunction): Response | void => {
    const Id = parseInt(request.params.id)
    const Index = market.findIndex(object => object.id === Id)
    if (Index === -1) {
      return response.status(404).json({
        error: "Product not found"
      })
    }
    response.locals.market = {
      IdProduct: Id,
      productIndex: Index
    }
    return next()
  }
  
  const verifyProductName = (request: Request, response: Response, next: NextFunction): Response | void => {
    let newProducts: IProduct[] = []
    if (Array.isArray(request.body)) {
      newProducts = request.body
    } else {
      newProducts.push(request.body)
    }
    const Name = market.map(product => product.name)
    for (const product of newProducts) {
      if (Name.includes(product.name)) {
        return response.status(409).json({
          error: "Product already registered"
        })
      }
    }
    return next()
  }
  
  export { verifyId, verifyProductName }