import {Injectable} from "@angular/core"
import {server} from "./global"
import {HttpClient,HttpHeaders} from "@angular/common/http"
import { Observable } from "rxjs"
import { Category } from "../models/category"


@Injectable({
    providedIn:'root'
})export class CategoryService{
    public url:string
    private accessToken:string
    constructor(private _http:HttpClient){
        this.url=server.url
        this.accessToken=""
    }
    getCategories():Observable<any>{
       const headers=new HttpHeaders().set('Content-Type','application/json')       
        const options={
            headers
        }
        return this._http.get(this.url+'category',options)
    }
    createCategory(category:Category,token:any):Observable<any>{
        this.accessToken="bearer "+token
        let headers=new HttpHeaders().set('Content-Type','application/json').set('Authorization',this.accessToken)
        let options={
            headers
        }
        let data=JSON.stringify(category)
        return this._http.post(this.url+'category',data,options)

    }
}