import { Injectable } from "@angular/core"
import { server } from "./global"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from "rxjs"
import { User } from "../models/user"

@Injectable({ providedIn: 'root' }) export class UserService {
    private url: string
    constructor(private _http: HttpClient) {
        this.url = server.url
    }

    getUsers(): Observable<any> {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
        const options = {
            headers
        }
        return this._http.get(this.url + 'user', options)
    }

    searchUser(email: string): Observable<any> {
        const token = sessionStorage.getItem("token")
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
        let options = {
            headers
        }
        return this._http.get(`${this.url}user/email/${email}`, options)
    }

    updateRoles(id: number): Observable<any> {
        const token = sessionStorage.getItem("token")
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
        let options = {
            headers
        }
        this.getUsers()
        return this._http.put(this.url + 'user/update-role/${id}', { id }, options)
    }

    login(user: User): Observable<any> {
        let userJSON = JSON.stringify(user)
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        let options = {
            headers
        }
        return this._http.post(this.url + 'login', userJSON, options)
    }
    getIdentity() {
        let identity = sessionStorage.getItem('identity')
        if (identity) {
            return JSON.parse(identity)
        }
        return null
    }
    getToken() {
        return sessionStorage.getItem('token')
    }
}