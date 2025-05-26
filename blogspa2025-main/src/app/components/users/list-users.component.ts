import { identity } from 'rxjs';
import { Component, OnInit } from "@angular/core";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'app-list-users',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './list-users.component.html',
    styleUrl: './list-users.component.css'
})
export class ListUsersComponent {
    public status: number
    public users: User[]
    public user: User
    public identity: any
    public searchEmail: string = ''
    private token: any

    constructor(
        private userService: UserService
    ) {
        this.status = -1
        this.users = []
        this.user = new User(1, "", "", "", "", "", "")
    }

    ngOnInit(): void {
        this.token = this.userService.getToken()
        this.identity = this.userService.getIdentity()
        this.loadUsers()
    }

    loadUsers() {
        this.token = this.userService.getToken()
        this.userService.getUsers().subscribe({
            next: (response: any) => {
                console.log(response)
                this.users = response
            },
            error: (err: Error) => {
                console.log(err)
            }
        })
    }

    onSearch() {
        if (!this.searchEmail.trim()) {
            this.loadUsers()
            return
        }
        this.userService.searchUser(this.searchEmail).subscribe({
            next: (response: any) => {
                console.log(response)
                this.users = [response]
            },
            error: (err:Error) => {
                console.log(err)
                this.users = []
            }
        })
    }

    changeRole(id: number) {
        this.token = this.userService.getToken()
        this.userService.updateRoles(id).subscribe({
            next: (response: any) => {
                console.log(response)
                this.loadUsers()
            },
            error: (err: Error) => {
                console.log(err)
            }
        })
    }
}