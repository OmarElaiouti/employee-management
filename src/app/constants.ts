import { environment } from "./environments/environment";

export const API_ENDPOINTS = {
    CRUD_EMPLOYEES: `${environment.apiUrl}/api/employee`,
    LOGIN: `${environment.apiUrl}/auth/login`,
    REFRESH_TOKEN: `${environment.apiUrl}/auth/refresh-token`


  };