import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lang } from "../environments/environment";
export const LANG = 'lang';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  setUserLanguage(langPar: string) {
    localStorage.setItem(LANG, langPar);
    lang.userLang = langPar;
  }
  getUserLanguage() {
    return localStorage.getItem(LANG);
  }
}