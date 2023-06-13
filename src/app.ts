import express, {Application} from "express";
import { createProduct, deleteProduct, readProducts, retrieveProduct, updateProduct } from "./logics"
import { verifyId, verifyProductName } from "./middlewares"


const app: Application = express()
app.use(express.json())

app.post("/products", verifyProductName, createProduct)
app.get("/products", readProducts)
app.get("/products/:id", verifyId, retrieveProduct)
app.patch("/products/:id", verifyId, verifyProductName, updateProduct)
app.delete("/products/:id", verifyId, deleteProduct)

app.listen(3000, () => console.log("server is running"))