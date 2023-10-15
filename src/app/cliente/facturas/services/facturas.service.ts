import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Factura } from '../models/factura';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  private urlEndPoint: string = 'http://localhost:808o/api/facturas';

  constructor(
    private hhtp: HttpClient
  ) { }

  getFactura(id:number):Observable<Factura>{
    return this.hhtp.get<Factura>(`${this.urlEndPoint}/${id}`);
  }

  delete(id:number):Observable<void>{
    return this.hhtp.delete<void>(`${this.urlEndPoint}/${id}`);
  }

  filtrarProductos(term:string):Observable<Producto[]>{
    return this.hhtp.get<Producto[]>(`${this.urlEndPoint}/filtrar-productos/${term}`);
  }

  create(factura: Factura): Observable<Factura> {
    return this.hhtp.post<Factura>(this.urlEndPoint, factura);
  }
}
