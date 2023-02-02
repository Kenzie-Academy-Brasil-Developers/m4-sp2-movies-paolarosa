import { Client } from "pg";

const client: Client = new Client({
  user: "paola",
  password: "bella501",
  host: "localhost",
  database: "movies",
  port: 5432,
});

const startDatabase = async (): Promise<void> => {
  //faz a conexão com o banco de dados
  await client.connect();
  console.log("Database connected");
};

/* client.end() conexão encerrada */
export { client, startDatabase };
