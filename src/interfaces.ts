import { QueryResult } from "pg";


interface iMoviesRequest {
  name: string;
  description?: string;
  duration: number;
  price: number;
}

interface iMoviesResponse extends iMoviesRequest {
  id: number;
}

type ListResult = QueryResult<iMoviesRequest>;
type listCreate = Omit<iMoviesResponse, "id">;

export { iMoviesRequest, iMoviesResponse, ListResult, listCreate };
