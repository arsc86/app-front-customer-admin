import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';
import { AuthService } from './usuarios/auth.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html'
})
export class ClienteComponent implements OnInit {

  clientes : Cliente[];
  paginador: any;
  clienteSeleccionado:Cliente;

  //inyeccion de dependencia
  constructor
  (
    private clienteService: ClienteService,
    private activatedRoute : ActivatedRoute,
    public modalService : ModalService,
    public authService : AuthService
  )
  {}

  ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe( params => {
        let page:number = +params.get('page');
        if(!page)
        {
          page = 0;
        }
          this.clienteService.getClientes(page)
          .pipe(
            tap(response =>{
              (response.content as Cliente[]).forEach(cliente => {
               
              })
            }))
          .subscribe(response =>
            {
               this.clientes  = response.content as Cliente[];
               this.paginador = response;
            }
          )
     });
     this.modalService.notificarUpload.subscribe(
      cliente => {
        this.clientes = this.clientes.map(clienteOriginal => {
          if(cliente.id == clienteOriginal.id)
          {
            clienteOriginal.foto = cliente.foto;
          }
          return clienteOriginal;
        })
      }
     )
  } 

  delete(cliente : Cliente) : void{
    Swal.fire({
      title: 'Eliminar registro',
      text: `Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) 
      {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            //se filtra para q no muestre los clientes eliminados
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            Swal.fire({
              title: 'Eliminar Cliente',
              text:  `Cliente ${cliente.nombre} eliminado correctamente`,
              confirmButtonText: 'OK',
              icon:'success'
            })
          }
        )
      }
    })
  }

  abrirModal(cliente : Cliente)
  {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }


}
