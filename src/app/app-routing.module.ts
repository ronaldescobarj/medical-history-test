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
import { AuthAccountGuard } from './guards/authAccount.guard';
import { AuthUserGuard } from './guards/authUser.guard';
import { LoginComponent } from './login/login.component';
import { RegisterAccountComponent } from './register-account/register-account.component';
import { UsersViewComponent } from './users-view/users-view.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { CreateEditUserComponent } from './create-edit-user/create-edit-user.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/registers', pathMatch: 'full', canActivate: [AuthUserGuard, AuthAccountGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterAccountComponent },
  { path: 'users', component: UsersViewComponent, canActivate: [AuthAccountGuard] },
  { path: 'account', component: ManageAccountComponent, canActivate: [AuthAccountGuard] },
  { path: 'viewUser/:id', component: UserDetailsComponent, canActivate: [AuthAccountGuard] },
  { path: 'user/:action/:id', component: CreateEditUserComponent, canActivate: [AuthAccountGuard] },
  { path: 'registers', component: MedicalRegistersViewComponent, canActivate: [AuthUserGuard, AuthAccountGuard] },
  { path: 'medicalConsultation/:id', component: MedicalConsultationViewComponent, canActivate: [AuthUserGuard, AuthAccountGuard] },
  { path: 'medicalAnalysis/:id', component: MedicalAnalysisViewComponent, canActivate: [AuthUserGuard, AuthAccountGuard] },
  { path: 'medicalSelfObservation/:id', component: MedicalSelfObservationViewComponent, canActivate: [AuthUserGuard, AuthAccountGuard] },
  { path: 'medicalConsultation/crud/create', component: MedicalConsultationCreateComponent, canActivate: [AuthUserGuard, AuthAccountGuard] },
  { path: 'medicalConsultation/crud/edit/:id', component: MedicalConsultationEditComponent, canActivate: [AuthUserGuard, AuthAccountGuard] },
  { path: 'medicalAnalysis/crud/create', component: MedicalAnalysisCreateComponent, canActivate: [AuthUserGuard, AuthAccountGuard] },
  { path: 'medicalAnalysis/crud/edit/:id', component: MedicalAnalysisEditComponent, canActivate: [AuthUserGuard, AuthAccountGuard] },
  { path: 'medicalSelfObservation/crud/create', component: MedicalSelfObservationCreateComponent, canActivate: [AuthUserGuard, AuthAccountGuard] },
  { path: 'medicalSelfObservation/crud/edit/:id', component: MedicalSelfObservationEditComponent, canActivate: [AuthUserGuard, AuthAccountGuard] },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }