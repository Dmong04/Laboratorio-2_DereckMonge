import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CategoryService } from "./services/category.service"
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'blog-spa';
  public categories: any;
  public users: any;
  private checkCategories;
  private checkUsers;
  private checkIdentity;
  public identity: any;
  private token: any;

  constructor(
    private categoryService: CategoryService,
    private userService: UserService
  ) {
    this.loadCategories()
    this.checkCategories = setInterval(() => {
      this.loadCategories()
    }, 5000)
    this.loadUsers()
    this.checkUsers = setInterval (() => {
      this.loadUsers()
    }, 2500)
    this.checkIdentity = setInterval(() => {
      this.identity = userService.getIdentity()
      this.token = userService.getToken()
    }, 500)
  }
  public loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        console.log(response)
        this.categories = response
      },
      error: (err: Error) => {
        console.log(err)
        this.categories = null
      }
    })
  }
  public loadUsers() {
    this.userService.getUsers().subscribe({
      next: (response: any) => {
        console.log(response)
        this.users = response
      },
      error: (err: Error) => {
        console.log(err)
        this.users = null
      }
    })
  }
}
