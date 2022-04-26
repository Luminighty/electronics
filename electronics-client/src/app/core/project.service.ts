import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../domain/projects';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private httpClient: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.httpClient.get<Project[]>("/api/project");
  }

  getProject(projectId: string): Observable<Project> {
    return this.httpClient.get<Project>(`/api/project/${projectId}`);
  }

  createProject(project: Project): Observable<Project> {
    return this.httpClient.post<Project>(`/api/project`, project);
  }

  editProject(chipId: string, project: Project): Observable<Project> {
    return this.httpClient.put<Project>(`/api/project/${chipId}`, project);
  }

  deleteProject(project: Project): Observable<unknown> {
    return this.httpClient.delete(`/api/project/${project._id}`);
  }
}
