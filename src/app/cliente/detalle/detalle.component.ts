import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { AuthService } from '../usuarios/auth.service';
import { FacturasService } from '../facturas/services/facturas.service';
import { Factura } from '../facturas/models/factura';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  titulo: string = "Detalle del cliente";
  fotoSeleccionada: File;
  progreso: number=0;

  constructor(
    private clienteService : ClienteService ,
    public modalService : ModalService,
    public authService : AuthService,
    private facturaService: FacturasService

    ){}

  ngOnInit(): void {
  }

  seleccionarFoto(event){
    this.fotoSeleccionada=event.target.files[0];
    this.progreso=0;
    if(this.fotoSeleccionada.type.indexOf("image") < 0)
    {
      Swal.fire({
        title: 'Subida de archivo',
        text:  `Debe seleccionar un archivo con formato de imagen valido`,
        confirmButtonText: 'OK',
        icon:'error'
      });
      this.fotoSeleccionada=null;
    }
  }

  subirFoto()
  {
    if(!this.fotoSeleccionada)
    {
      Swal.fire({
        title: 'Subida de archivo',
        text:  `Debe seleccionar un archivo de foto`,
        confirmButtonText: 'OK',
        icon:'error'
      })
    }
    else{
      this.clienteService.subirFoto(this.fotoSeleccionada,this.cliente.id).subscribe(
        event => {

          if(event.type === HttpEventType.UploadProgress)
          {
            this.progreso = Math.round((event.loaded/event.total)*100);
          }
          else if(event.type === HttpEventType.Response)
          {
            let response:any = event.body;
            this.cliente = response.cliente as Cliente;
          
            this.modalService.notificarUpload.emit(this.cliente);
            Swal.fire({
              title: 'Subida de archivo',
             // text:  `Archivo ${this.cliente.foto} cargado correctamente`,
             text: response.mensaje,
              confirmButtonText: 'OK',
              icon:'success'
            })
          }
         // this.cliente = cliente;
         
        }
      );
    }
   
  }

  cerrarModal()
  {
    this.modalService.cerrarModal();
    this.fotoSeleccionada=null;
    this.progreso=0;
  }

  delete(factura: Factura): void{
    Swal.fire({
      title: 'Eliminar Factura',
      text: `Seguro que desea eliminar la factura ${factura.descripcion} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) 
      {
        this.facturaService.delete(factura.id).subscribe(
          response => {
         
            this.cliente.facturas = this.cliente.facturas.filter(f => f !== factura)
            Swal.fire({
              title: 'Eliminar Factura',
              text:  `Factura ${factura.descripcion} eliminada correctamente`,
              confirmButtonText: 'OK',
              icon:'success'
            })
          }
        )
      }
    })
  }

}
