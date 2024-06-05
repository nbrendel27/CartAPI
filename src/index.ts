import cors from "cors";
import express from "express";
import cartItemsRouter from "./routes/cartItemsRouter";

const app = express();

app.use(cors());
app.use(express.json());

const port = 3000;

app.use("/", cartItemsRouter)

app.listen(port, ()=>console.log(`listening on port: ${port}`));