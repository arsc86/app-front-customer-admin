import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable } from 'rxjs';
import { throwError} from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Region } from './region';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint : string = 'http://localhost:8080/api/clientes'; 
  private httpHeaders          = new HttpHeaders({'Content-Type':'application/json'});

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint+"/regiones");
  }

  getClientes(page : number) : Observable<any>{
    return this.http.get(this.urlEndPoint + '/page/'+ page).pipe(
      tap( (response: any ) => {
       
        (response.content as Cliente[]).forEach( cliente => {
          // console.log(cliente.nombre); 
        });
      }),
      map( (response:any) => {
          (response.content as Cliente[]).map( cliente => {
                    return cliente;
            });
          return response;
        }),
      tap(response => {
        (response.content as Cliente[]).forEach(
          cliente => {
            //console.log(cliente.nombre);
          }
        );
      })
    );
  }

  create(cliente:Cliente) : Observable<any>{
    return this.http.post<any>(this.urlEndPoint,cliente).pipe(
      catchError(e => {
       
        if(e.status == 400)
        {
           return throwError(e);
        }
       
        return throwError(e);
      })
    );;
  }

  getCliente(id: number) : Observable<any>{
    return this.http.get<any>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if(e.status != 401 && e.error.mensaje)
          this.router.navigate(['/clientes']);       
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente) : Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`,cliente).pipe(
      catchError(e => {
        if(e.status != 401 && e.error.mensaje)
        this.router.navigate(['/clientes']);   
        if(e.status == 400)
        {
           return throwError(e);
        }
        return throwError(e);
      })
    );
  }

  delete(id : number) : Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`);
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>>
  {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);
    
    const request = new HttpRequest('POST',`${this.urlEndPoint}/upload/`,formData,{
      reportProgress: true
    })

    return this.http.request(request);
     
  }
}
