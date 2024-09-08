import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEmployee } from '../../models/employee.model';
import { catchError, map, Observable, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../constants';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  
  constructor(private http: HttpClient) {}

  getEmployees(page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${API_ENDPOINTS.CRUD_EMPLOYEES}?page=${page}&pageSize=${pageSize}`);
  }
  
  getEmployee(id: number): Observable<IEmployee> {
    return this.http.get<IEmployee>(`${API_ENDPOINTS.CRUD_EMPLOYEES}/${id}`);
  }

  addEmployee(employee: IEmployee): Observable<IEmployee> {
    return this.http.post<IEmployee>(API_ENDPOINTS.CRUD_EMPLOYEES, employee);
  }

 
editEmployee(employee: IEmployee): Observable<IEmployee> {
  return this.http.put<IEmployee>(API_ENDPOINTS.CRUD_EMPLOYEES, employee);
}

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.CRUD_EMPLOYEES}/${id}`);
  }

  deleteRange(ids: string[]): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.CRUD_EMPLOYEES}`, { body: ids });
  }
}
