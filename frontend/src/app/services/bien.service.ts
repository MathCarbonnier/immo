import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bien } from '../models/bien.model';

@Injectable({
  providedIn: 'root'
})
export class BienService {
  private apiUrl = '/api/biens';

  constructor(private http: HttpClient) { }

  /**
   * Get all properties
   */
  getAllBiens(): Observable<Bien[]> {
    return this.http.get<Bien[]>(this.apiUrl);
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
    // Process the image if it exists
    let imageToSend = bien.image;

    // If the image is a data URL, extract just the base64 part
    if (imageToSend && imageToSend.startsWith('data:')) {
      // Extract the base64 part (after the comma)
      const commaIndex = imageToSend.indexOf(',');
      if (commaIndex !== -1) {
        imageToSend = imageToSend.substring(commaIndex + 1);
        console.log('Extracted base64 data from data URL');
      }
    }

    // Create a clean copy of the bien object to avoid any potential issues
    const cleanBien = {
      titre: bien.titre,
      surface: bien.surface,
      prix: bien.prix,
      description: bien.description,
      image: imageToSend
    };

    console.log('Sending bien object:', {
      titre: cleanBien.titre,
      surface: cleanBien.surface,
      prix: cleanBien.prix,
      description: cleanBien.description,
      imageLength: cleanBien.image ? cleanBien.image.length : 0
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
    // Process the image if it exists
    let imageToSend = bien.image;

    // If the image is a data URL, extract just the base64 part
    if (imageToSend && imageToSend.startsWith('data:')) {
      // Extract the base64 part (after the comma)
      const commaIndex = imageToSend.indexOf(',');
      if (commaIndex !== -1) {
        imageToSend = imageToSend.substring(commaIndex + 1);
        console.log('Extracted base64 data from data URL for update');
      }
    }

    // Create a clean copy of the bien object to avoid any potential issues
    const cleanBien = {
      titre: bien.titre,
      surface: bien.surface,
      prix: bien.prix,
      description: bien.description,
      image: imageToSend
    };

    console.log('Sending bien object for update:', {
      titre: cleanBien.titre,
      surface: cleanBien.surface,
      prix: cleanBien.prix,
      description: cleanBien.description,
      imageLength: cleanBien.image ? cleanBien.image.length : 0
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
