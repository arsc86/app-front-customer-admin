import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable, flatMap, map, startWith } from 'rxjs';
import { FacturasService } from './services/facturas.service';
import { Producto } from './models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ItemFactura } from './models/item-factura';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit{
[x: string]: any;

titulo: string = 'Nueva Factura';
factura: Factura = new Factura();

autocompleteControl = new FormControl();

productosFiltrados: Observable<Producto[]>;

constructor(public clienteService: ClienteService,
  private facturaService: FacturasService,
  private router: Router,
  private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
    });

    this.productosFiltrados = this.autocompleteControl.valueChanges
      .pipe(
        map(value => typeof value === 'string' ? value : value.nombre),
        flatMap(value => value ? this._filter(value) : [])
      );
  }
  
  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?:Producto):string|undefined{
    return producto?producto.nombre: undefined;
  }
  
  seleccionarProducto(event: MatAutocompleteSelectedEvent): void{
    let producto = event.option.value as Producto;

    if(this.existeItem(producto.id)){
      this.incrementaItem(producto.id);
    }
    else{
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }
    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizarCantidad(id:number, event:any):void{
    let cantidad:number = event.target.value as  number;
    if(cantidad==0){
      this.eliminarItemFactura(id);
      return;
    }
    this.factura.items = this.factura.items.map((item:ItemFactura) => {
      if(id === item.producto.id){
        item.cantidad = cantidad;
      }
      return item;
    })
  }

  existeItem(id:number):boolean{
    let existe = false;
    this.factura.items.forEach((item: ItemFactura)=>{
      if(id === item.producto.id){
        existe = true;
      }
    });
    return existe;
  }

  incrementaItem(id:number):void{
    this.factura.items = this.factura.items.map((item:ItemFactura) =>{
      if(id === item.producto.id){
        ++item.cantidad;
      }
      return item;
    })
  }

  eliminarItemFactura(id:number):void{
    this.factura.items = this.factura.items.filter((item:ItemFactura)=> id!=item.producto.id);
  }

  create(): void {
    
      this.facturaService.create(this.factura).subscribe(factura => {
        Swal.fire({
          title: 'Crear Factura',
          text:  `Factura ${factura.descripcion} crearda correctamente`,
          confirmButtonText: 'OK',
          icon:'success'
        })
        this.router.navigate(['/clientes']);
      });
  }
}
