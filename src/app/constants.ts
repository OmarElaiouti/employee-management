import { environment } from "./environments/environment";

export const API_ENDPOINTS = {
    CRUD_EMPLOYEES: `${environment.apiUrl}/api/employee`,
    LOGIN: `${environment.apiUrl}/auth/login`,
    REFRESH_TOKEN: `${environment.apiUrl}/auth/refresh-token`

  };

  export const PATTERNS = {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  };