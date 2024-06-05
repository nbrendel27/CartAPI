import express from "express";
import { cartItems } from "../db";
import CartItem from "../models/CartItem";


const cartItemsRouter = express.Router();

cartItemsRouter.get("/cart-items", (req, res) => {
    const {maxPrice, prefix, pageSize} = req.query
    let ret = cartItems;
    if(maxPrice) {
        ret = ret.filter(
            (item) => item.price <= +(maxPrice as string)
        );
    } 
    if(prefix) {
        ret = ret.filter(
            (item) => item.product.toLowerCase().startsWith((prefix as string).toLowerCase())
        );
    }
    if (pageSize){
        ret = ret.slice(0, +(pageSize as string));
    }
    res.status(200).json(ret);   
})

cartItemsRouter.get("/cart-items/:id", (req, res) => {
    const id = +req.params.id;
    // console.log(id);

    const payload = cartItems.find((prod) => prod.id === id)
    if(payload) {
        res.json(payload);
        res.status(200);
    }else {
        res.status(404);
        res.json({message: "ID Not Found"});
    }
})

cartItemsRouter.post("/cart-items", (req, res) => {
    const newCartItem: CartItem = req.body;
    // console.log(newCartItem);
    

    if (newCartItem.product !== "" && newCartItem.price >= 0 && newCartItem.quantity >= 0) {
        newCartItem.id = Math.floor(Math.random() * 1000); // DONT DO IT THIS WAY

        cartItems.push(newCartItem)
        res.status(201).json(newCartItem)
    }else {
        res.status(400).json({message: "either product was empty or price or quantity was negative"});
    }
})

cartItemsRouter.put("/cart-items/:id", (req, res) => {
    const idToReplace: number = +req.params.id;
    const updatedObj: CartItem = req.body;

    const someIndex: number = cartItems.findIndex(
        (item) => item.id === idToReplace
    );
    if (someIndex !== -1) {
        cartItems[someIndex] = updatedObj
        res.status(200).json(updatedObj)
    } else {
        res.status(404);
        res.json({message: `Cannot find a cart item with id: ${idToReplace}`});
    }
})

cartItemsRouter.delete("/cart-tems/:id", (req, res) => {
    const idToDelete: number = +req.params.id;
    const someIndex: number = cartItems.findIndex(
        (item) => item.id === idToDelete
    );
    if (someIndex !== -1) {
        cartItems.splice(someIndex, 1);
        res.sendStatus(204); //204 - no content
        // a successful delete is the only time we don't send a body,
        //... so we have to use sendStatus
    }else {
        res.status(404);
        res.json({ message: `Cannot find a cart item with ID: ${idToDelete}`})
    }
})

export default cartItemsRouter;