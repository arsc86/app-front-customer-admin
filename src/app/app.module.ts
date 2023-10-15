import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClienteComponent } from './cliente/cliente.component';
import { ClienteService } from './cliente/cliente.service';
import { Routes, RouterModule } from '@angular/router';
import { FormComponent } from './cliente/form.component';
import { PaginatorComponent } from './paginator/paginator.component' ;
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';

//import y definicion de locacion para lenguaje de la aplicacion
import locateES from '@angular/common/locales/es';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//Datepicker
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

import { DetalleComponent } from './cliente/detalle/detalle.component';
import { LoginComponent } from './usuarios/login.component';
import { AuthGuard } from './cliente/usuarios/guards/auth.guard';
import { RoleGuard } from './cliente/usuarios/guards/role.guard';
import { TokenInterceptor } from './cliente/usuarios/interceptors/token.interceptor';
import { AuthInterceptor } from './cliente/usuarios/interceptors/token0.interceptor';
import { DetalleFacturaComponent } from './cliente/facturas/detalle-factura.component';
import { FacturasComponent } from './cliente/facturas/facturas.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

//registro de lenguaje de aplicacion usando internacionalizacion
registerLocaleData(locateES,'es');

const routers : Routes = [
  {path: '', redirectTo: '/clientes' , pathMatch: 'full'},
  {path: 'directivas', component: DirectivaComponent},
  {path: 'clientes', component: ClienteComponent},
  {path: 'clientes/form', component: FormComponent, canActivate:[AuthGuard, RoleGuard], data:{role:'ROLE_ADMIN'}},
  {path: 'clientes/page/:page', component: ClienteComponent},
  {path: 'clientes/form/:id', component: FormComponent, canActivate:[AuthGuard, RoleGuard], data:{role:'ROLE_ADMIN'}},
  {path: 'login', component: LoginComponent},
  {path: 'facturas/:id', component: DetalleFacturaComponent, canActivate:[AuthGuard, RoleGuard], data:{role:'ROLE_ADMIN'}},
  {path: 'facturas/form/:clienteId', component: FacturasComponent, canActivate:[AuthGuard, RoleGuard], data:{role:'ROLE_ADMIN'}},
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClienteComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent,
    LoginComponent,
    DetalleFacturaComponent,
    FacturasComponent
  
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routers),
    BrowserAnimationsModule,
    //Datepicker
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatFormFieldModule,
    MatInputModule,
    //Autocomplete
    MatAutocompleteModule,
    ReactiveFormsModule
  ],
  
  providers: [ClienteService, 
    {provide: LOCALE_ID, useValue: 'es'},
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
