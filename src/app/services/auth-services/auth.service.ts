import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from 'src/app/constants';
import { ILogin, ILoginResult } from 'src/app/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(model: ILogin): Observable<ILoginResult> {
    return this.http.post<ILoginResult>(API_ENDPOINTS.LOGIN, model);
  }

  refreshToken(refreshToken: string): Observable<string> {
    return this.http.post<string>(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken: this.refreshToken });
  }

  saveTokens(result: ILoginResult): void {
    sessionStorage.setItem('accessToken', result.accessToken);
    sessionStorage.setItem('refreshToken', result.refreshToken);
  }

  clearTokens(): void {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
  }

  saveNewAccessToken(newAccessToken:string): void {
    sessionStorage.setItem('accessToken', newAccessToken);
  }
}
