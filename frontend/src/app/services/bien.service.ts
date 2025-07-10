import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bien, ImageBien } from '../models/bien.model';

@Injectable({
  providedIn: 'root'
})
export class BienService {
  private apiUrl = '/api/biens';

  constructor(private http: HttpClient) { }

  /**
   * Get all properties
   * @param sortBy Optional field to sort by
   * @param sortOrder Optional sort order ('asc' or 'desc')
   * @param status Optional status filter
   */
  getAllBiens(sortBy?: string, sortOrder?: string, status?: string): Observable<Bien[]> {
    let params = new HttpParams();

    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }

    if (sortOrder) {
      params = params.set('sortOrder', sortOrder);
    }

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<Bien[]>(this.apiUrl, { params });
  }

  /**
   * Get a property by ID
   */
  getBienById(id: number): Observable<Bien> {
    return this.http.get<Bien>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new property
   */
  createBien(bien: Bien): Observable<Bien> {
    // Process images if they exist
    let imagesToSend: ImageBien[] = [];

    if (bien.images && bien.images.length > 0) {
      imagesToSend = bien.images.map(img => {
        let base64Value = img.base64;

        // If the image is a data URL, extract just the base64 part
        if (base64Value && base64Value.startsWith('data:')) {
          // Extract the base64 part (after the comma)
          const commaIndex = base64Value.indexOf(',');
          if (commaIndex !== -1) {
            base64Value = base64Value.substring(commaIndex + 1);
          }
        }

        return {
          base64: base64Value,
          type: img.type
        };
      });

      console.log(`Processed ${imagesToSend.length} images for sending`);
    }

    // Create a clean copy of the bien object to avoid any potential issues
    const cleanBien = {
      titre: bien.titre,
      surface: bien.surface,
      prix: bien.prix,
      description: bien.description,
      rue: bien.rue,
      ville: bien.ville,
      codePostal: bien.codePostal,
      pays: bien.pays,
      status: bien.status,
      images: imagesToSend
    };

    console.log('Sending bien object:', {
      titre: cleanBien.titre,
      surface: cleanBien.surface,
      prix: cleanBien.prix,
      description: cleanBien.description,
      rue: cleanBien.rue,
      ville: cleanBien.ville,
      codePostal: cleanBien.codePostal,
      pays: cleanBien.pays,
      status: cleanBien.status,
      imagesCount: cleanBien.images.length
    });

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<Bien>(this.apiUrl, cleanBien, { 
      headers: headers
    });
  }

  /**
   * Update an existing property
   */
  updateBien(id: number, bien: Bien): Observable<Bien> {
    // Process images if they exist
    let imagesToSend: ImageBien[] = [];

    if (bien.images && bien.images.length > 0) {
      imagesToSend = bien.images.map(img => {
        let base64Value = img.base64;

        // If the image is a data URL, extract just the base64 part
        if (base64Value && base64Value.startsWith('data:')) {
          // Extract the base64 part (after the comma)
          const commaIndex = base64Value.indexOf(',');
          if (commaIndex !== -1) {
            base64Value = base64Value.substring(commaIndex + 1);
          }
        }

        return {
          base64: base64Value,
          type: img.type
        };
      });

      console.log(`Processed ${imagesToSend.length} images for update`);
    }

    // Create a clean copy of the bien object to avoid any potential issues
    const cleanBien = {
      titre: bien.titre,
      surface: bien.surface,
      prix: bien.prix,
      description: bien.description,
      rue: bien.rue,
      ville: bien.ville,
      codePostal: bien.codePostal,
      pays: bien.pays,
      status: bien.status,
      images: imagesToSend
    };

    console.log('Sending bien object for update:', {
      titre: cleanBien.titre,
      surface: cleanBien.surface,
      prix: cleanBien.prix,
      description: cleanBien.description,
      rue: cleanBien.rue,
      ville: cleanBien.ville,
      codePostal: cleanBien.codePostal,
      pays: cleanBien.pays,
      status: cleanBien.status,
      imagesCount: cleanBien.images.length
    });

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put<Bien>(`${this.apiUrl}/${id}`, cleanBien, { 
      headers: headers
    });
  }

  /**
   * Delete a property
   */
  deleteBien(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
