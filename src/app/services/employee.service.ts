import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEmployee } from '../models/employee.model';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<IEmployee[]> {
    return this.http.get<IEmployee[]>(API_ENDPOINTS.GET_EMPLOYEES);
  }

  getEmployee(id: number): Observable<IEmployee> {
    return this.http.get<IEmployee>(`${API_ENDPOINTS.GET_EMPLOYEES}/${id}`);
  }

  addEmployee(employee: IEmployee): Observable<IEmployee> {
    return this.http.post<IEmployee>(API_ENDPOINTS.ADD_EMPLOYEE, employee);
  }

  editEmployee(employee: IEmployee): Observable<IEmployee> {
    return this.http.put<IEmployee>(`${API_ENDPOINTS.EDIT_EMPLOYEE}/${employee.id}`, employee);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.DELETE_EMPLOYEE}/${id}`);
  }

  deleteRange(ids: number[]): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.DELETE_EMPLOYEES}`, { body: ids });
  }
}
