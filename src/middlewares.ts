import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";

const verifyNameExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {

  const id: number = parseInt(request.params.id)
  const queryString: string = `
        SELECT * FROM movies WHERE id = $1;
    `
    const queryConfig2: QueryConfig = {
        text: queryString,
        values: [id]
    }
    const queryResult2 = await client.query(queryConfig2)
    if(!queryResult2.rowCount){
        return response.status(404).json({
            message: 'Movie not found!'
        })
    }
    const { name } = request.body;

    const queryTemplate: string = `
    SELECT * FROM movies WHERE name = $1;
    `;
  
    const queryConfig: QueryConfig = {text: queryTemplate,
      values: [name],
    };
    const queryResult = await client.query(queryConfig)
    const foundMovie = queryResult.rows[0]
    if(foundMovie){
      return response.status(409).json({ message: `Movie ${name} alredy exists` });
    }

  return next()
};

export { verifyNameExists }