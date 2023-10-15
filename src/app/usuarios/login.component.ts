import { Component, OnInit } from '@angular/core';
import { Usuario } from '../cliente/usuarios/usuario';
import Swal from 'sweetalert2';
import { AuthService } from '../cliente/usuarios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit{

  titulo:string = 'Por favor Sign In!';
  usuario:Usuario;

  constructor(private authService: AuthService,
              private router: Router){
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if(!this.authService.isAuthenticated)
    {
      this.router.navigate(['/clientes']);
    }
  }

  login():void{
    if(this.usuario.username==null || this.usuario.password==null){
      Swal.fire({
        title: 'Error de Login',
        text:  'Username o password vacios',
        confirmButtonText: 'OK',
        icon: 'error'   
      });
      return;
    }
    this.authService.login(this.usuario).subscribe(
      response => {
        //let payload = JSON.parse(atob(response.access_token.split(".")[1]));
        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token)
        let usuario = this.authService.usuario;
        this.router.navigate(['/clientes']);
        Swal.fire({
          title: 'Login',
          text:  `Hola ${usuario.username}, has iniciado sesion correctamente...`,
          confirmButtonText: 'OK',
          icon: 'success'   
        });
      }, err => {
        if(err.status == 400){
          Swal.fire({
            title: 'Error de Login',
            text:  'Usuario o Password incorrectos',
            confirmButtonText: 'OK',
            icon: 'error'   
          });
        }
      }
    )
  }

}
