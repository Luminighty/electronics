import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MenuComponent } from './menu/menu.component';
import { AppRoutingModule } from './app-routing.module';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { ChipsComponent } from './chips/chips.component';
import { MatTableModule } from '@angular/material/table';
import { HomeComponent } from './home/home.component';
import { ProjectsComponent } from './projects/projects.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component'
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorsPipe } from './core/errors.pipe';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/auth.interceptor';
import { ChipDetailsComponent } from './chip-details/chip-details.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChipSvgComponent } from './chip-svg/chip-svg.component';
import { MatInputModule } from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ChipEditorComponent } from './chip-editor/chip-editor.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectEditorComponent } from './project-editor/project-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ChipsComponent,
    HomeComponent,
    ProjectsComponent,
    LoginComponent,
    RegisterComponent,
    ErrorsPipe,
    ChipDetailsComponent,
    ChipSvgComponent,
    ChipEditorComponent,
    ProjectDetailsComponent,
    ProjectEditorComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
  ],
  exports: [],
  providers: [

    {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
