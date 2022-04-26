import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Chip } from '../domain/chip';

@Injectable({
  providedIn: 'root'
})
export class ChipService {

  constructor(private httpClient: HttpClient) { }

  getChips(): Observable<Chip[]> {
    return this.httpClient.get<Chip[]>("/api/chip");
  }

  getChip(chipId: string): Observable<Chip> {
    return this.httpClient.get<Chip>(`/api/chip/${chipId}`);
  }

  createChip(chip: Chip): Observable<Chip> {
    return this.httpClient.post<Chip>(`/api/chip`, chip);
  }

  editChip(chipId: string, chip: Chip): Observable<Chip> {
    return this.httpClient.put<Chip>(`/api/chip/${chipId}`, chip);
  }

  deleteChip(chip: Chip): Observable<unknown> {
    return this.httpClient.delete(`/api/chip/${chip._id}`);
  }
}
