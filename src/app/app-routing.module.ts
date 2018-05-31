import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicalRegistersViewComponent } from './medical-registers-view/medical-registers-view.component';
import { MedicalConsultationViewComponent } from './medical-consultation-view/medical-consultation-view.component';
import { MedicalAnalysisViewComponent } from './medical-analysis-view/medical-analysis-view.component';
import { MedicalSelfObservationViewComponent } from './medical-self-observation-view/medical-self-observation-view.component';
import { MedicalConsultationCreateComponent } from './medical-consultation-create/medical-consultation-create.component';
import { MedicalConsultationEditComponent } from './medical-consultation-edit/medical-consultation-edit.component';
import { MedicalAnalysisCreateComponent } from './medical-analysis-create/medical-analysis-create.component';
import { MedicalAnalysisEditComponent } from './medical-analysis-edit/medical-analysis-edit.component';
import { MedicalSelfObservationCreateComponent } from './medical-self-observation-create/medical-self-observation-create.component';
import { MedicalSelfObservationEditComponent } from './medical-self-observation-edit/medical-self-observation-edit.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { RegisterAccountComponent } from './register-account/register-account.component';
import { UsersViewComponent } from './users-view/users-view.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { CreateEditUserComponent } from './create-edit-user/create-edit-user.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/registers', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterAccountComponent },
  { path: 'users', component: UsersViewComponent },
  { path: 'account', component: ManageAccountComponent },
  { path: 'viewUser/:id', component: UserDetailsComponent },
  { path: 'user/:action/:id', component: CreateEditUserComponent },
  { path: 'registers', component: MedicalRegistersViewComponent, canActivate: [AuthGuard] },
  { path: 'medicalConsultation/:id', component: MedicalConsultationViewComponent, canActivate: [AuthGuard] },
  { path: 'medicalAnalysis/:id', component: MedicalAnalysisViewComponent, canActivate: [AuthGuard] },
  { path: 'medicalSelfObservation/:id', component: MedicalSelfObservationViewComponent, canActivate: [AuthGuard] },
  { path: 'medicalConsultation/crud/create', component: MedicalConsultationCreateComponent, canActivate: [AuthGuard] },
  { path: 'medicalConsultation/crud/edit/:id', component: MedicalConsultationEditComponent, canActivate: [AuthGuard] },
  { path: 'medicalAnalysis/crud/create', component: MedicalAnalysisCreateComponent, canActivate: [AuthGuard] },
  { path: 'medicalAnalysis/crud/edit/:id', component: MedicalAnalysisEditComponent, canActivate: [AuthGuard] },
  { path: 'medicalSelfObservation/crud/create', component: MedicalSelfObservationCreateComponent, canActivate: [AuthGuard] },
  { path: 'medicalSelfObservation/crud/edit/:id', component: MedicalSelfObservationEditComponent, canActivate: [AuthGuard] },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }