import express, { Application } from "express";
import { startDatabase } from "./database";
import { createList, deleteList, getList, updateList } from "./logic";
import { verifyNameExists } from "./middlewares";

const app: Application = express();
app.use(express.json());

app.post("/movies", createList);

app.get("/movies", getList);

app.patch("/movies/:id", verifyNameExists, updateList);

app.delete("/movies/:id", deleteList);

app.listen(3000, async () => {
  await startDatabase(); //express conecta no banco assim que o servidor começar
  console.log("Server is running!");
});
