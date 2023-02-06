import { Request, Response } from "express";
import { ClientBase, QueryConfig } from "pg";
import { client } from "./database";
import format from "pg-format";
import {
  iMoviesRequest,
  iMoviesResponse,
  listCreate,
  ListResult,
} from "./interfaces";


const createList = async (request: Request, response: Response): Promise<Response> => {
  const dataRequest: iMoviesRequest = request.body;
  const queryAlredyExists: string = `
  SELECT * FROM movies;`;

  const queryResult2: ListResult = await client.query(queryAlredyExists);

  const validate = queryResult2.rows.find((el) => {
    return el.name === request.body.name;
  });
  if (validate) {
    return response.status(409).json({ message: `Movie already exists` });
  }
  const createColumns: any[] = Object.keys(request.body);
  const createValues: any[] = Object.values(request.body);

  const queryString: string = format ( `
  INSERT INTO movies (%I)
  VALUES (%L)
  RETURNING *;
  `, createColumns, createValues)

  const queryConfig: QueryConfig = {
    text: queryString,
  };
  
  const queryResult: ListResult = await client.query(queryConfig);
  const newList: listCreate = queryResult.rows[0];
  if(!request.body.description){
    return response.status(201).json(newList);
  }
  return response.status(201).json(newList);
};


const getList = async (request: Request, response: Response): Promise<Response> => {
  let perPage: any =
    request.query.perPage === undefined ? 5 : request.query.perPage;
  let page: any = request.query.page === undefined ? 1 : +request.query.page;
   if(!+page){
    return response.status(400).json({message: "Page must to be a number"});
  } 
  if (page <= 0 || perPage <= 0) {
    page = 1;
    perPage = 5;
  }
  if (perPage > 5) {
    perPage = 5;
  }
  let sort: any = request.query.sort === undefined ? "id" : request.query.sort;
  let order: any =
    request.query.order === undefined ? "ASC" : request.query.order;

  const queryString: string = `
    SELECT * FROM movies
    ORDER BY ${sort} ${order}
    OFFSET $1 LIMIT $2;`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [perPage * (page - 1), perPage],
  };
  const queryResult: ListResult = await client.query(queryConfig);

  const queryTotal: string = `
  SELECT COUNT(*) FROM movies;`

  const queryResultTotal = await client.query(queryTotal);

  let previousPage: any = `http://localhost:3000/movies?page=${page - 1}&perPage=${perPage}`;
  if (page - 1 <= 0) {
    previousPage = null;
  }

  let nextPage: any = `http://localhost:3000/movies?page=${+page + 1}&perPage=${perPage}`;
  const count = queryResultTotal.rows[0].count
  const pages = count / 5
  if(count % 5 === 0 && pages === +page || queryResult.rows.length < 5){
    nextPage = null;
  }
  const returningData = {
    previousPage,
    nextPage,
    count: 5,
    data: [queryResult.rows],
  };
  return response.status(200).json(returningData);
};

const updateList = async (request: Request,response: Response): Promise<Response> => {
  const { body, params } = request;
  const updateColumns: any[] = Object.keys(body);
  const updateValues: any[] = Object.values(body);

  const queryTemplate: string = `
  UPDATE movies
  SET (%I) = ROW(%L)
  WHERE id = $1
  RETURNING *;
  `;
  const queryFormat: string = format(
    queryTemplate,
    updateColumns,
    updateValues
  );
  const queryConfig: QueryConfig = {
    text: queryFormat,
    values: [params.id],
  };

  const queryResult: ListResult = await client.query(queryConfig);
  const searchId = queryResult.rows.find((el: any) => {
    return el.id === request.params.id;
  });
  const updateMovies = queryResult.rows[0];
  return response.status(200).json(updateMovies);
};


const deleteList = async (request: Request, response: Response): Promise<Response> => {

  const id: number = parseInt(request.params.id);
  const queryString: string = `
  DELETE FROM movies
  WHERE id = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult = await client.query(queryConfig);
  if (!queryResult.rowCount) {
    return response.status(404).json({message: "Movie not found"});
  }
  return response.status(204).send();
};

export { createList, getList, updateList, deleteList };
