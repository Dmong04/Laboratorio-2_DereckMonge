import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/category';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-new-category',
  imports: [FormsModule],
  templateUrl: './new-category.component.html',
  styleUrl: './new-category.component.css'
})
export class NewCategoryComponent {
  public status:number
  public category:Category
  private token:any

  constructor(
    private userService:UserService,
    private categoryService:CategoryService
  ){
    this.status=-1
    this.category=new Category(1,"")
  }
  onSubmit(form:any){
    this.token=this.userService.getToken()
    this.categoryService.createCategory(this.category,this.token).subscribe({
      next:(response:any)=>{
        console.log(response)
      },
      error:(err:Error)=>{
        console.log(err)
      }
    })
  
  }
}
