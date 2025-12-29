import { CategoryResponse } from "./category.model";

export interface TypeResponse {
  id: number;
  name: string;
  slug: string;
  total: number;
  categories: CategoryResponse[];
  specialProduct?: any[];
}