import { Component } from '@angular/core';
import { AuthService } from '../cliente/usuarios/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  title:string = 'AppAngular';
  constructor(public authService:AuthService, private router:Router){

  }

  logout():void{
    let username = this.authService.usuario.username;
    this.authService.logout();
    Swal.fire({
      title: 'Logout',
      text:  `Hola ${username},ha cerrado sesion con exito...`,
      confirmButtonText: 'OK',
      icon: 'info'   
    });
    this.router.navigate(['/login']);
  }
}
