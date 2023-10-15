import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { BrowserModule } from '@angular/platform-browser';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit{

  public cliente : Cliente = new Cliente()
  titulo: string = "Crear Cliente";
  errors : string[] ;
  regiones : Region[];

  constructor(
    public clienteService : ClienteService, 
    private router : Router,
    private activateRoute : ActivatedRoute 
  ){}

  ngOnInit(): void {
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe((regiones)=>this.regiones = regiones);
  }

  public cargarCliente(): void{
    this.activateRoute.params.subscribe(
      params => {
        let id = params['id']
        if(id)
        {
          this.clienteService.getCliente(id).subscribe( (cliente) => this.cliente = cliente)
        }
      }
    )
  }

  public create() : void{
        let keys = Object.keys(this.cliente);
        this.clienteService.create(this.cliente).subscribe(
            json => 
            {
              Swal.fire({
                title: 'Nuevo Cliente',
                text:  `Cliente ${json.cliente.nombre} ${json.cliente.apellido} guardado correctamente`,
                confirmButtonText: 'OK',     
                icon:'success'          
              }).then((result) => {
                  this.router.navigate(['/clientes'])
              })
            },
            err => {
              this.errors = err.error.errors as string[];
            }
        );
  }

  public update() : void{
    this.cliente.facturas=null;
    this.clienteService.update(this.cliente).subscribe(
      json => {
        Swal.fire({
          title: 'Editar Cliente',
          text:  `Cliente ${json.cliente.nombre} actualizado correctamente`,
          icon:'success',
          confirmButtonText: 'OK'
        }).then((result) => {
            this.router.navigate(['/clientes'])
        })
      },
      err => {
        this.errors = err.error.errors as string[];
      }
    );  
  }

  compararRegion(o1:Region, o2:Region)
  {
    if(o1 === undefined && o2 === undefined)return true;
    return o1===null||o2===null||o1===undefined||o2===undefined? false : o1.id===o2.id;
  }

  


}
