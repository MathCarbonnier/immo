import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface AddressInfo {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface NominatimResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
  boundingbox: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private readonly NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

  constructor(private http: HttpClient) { }

  /**
   * Performs reverse geocoding using Nominatim API
   * @param lat Latitude
   * @param lon Longitude
   * @returns Observable with address information
   */
  reverseGeocode(lat: number, lon: number): Observable<AddressInfo> {
    const url = `${this.NOMINATIM_BASE_URL}/reverse`;

    // Nominatim API parameters
    const params = {
      format: 'json',
      lat: lat.toString(),
      lon: lon.toString(),
      zoom: '18',
      addressdetails: '1'
    };

    // Headers for the request
    // Note: 'User-Agent' header is removed as browsers don't allow it to be set via JavaScript
    // For production, consider implementing a proxy server to add this header server-side
    const headers = {
      'Accept-Language': 'fr,en' // Prefer French, then English
    };

    return this.http.get<NominatimResponse>(url, { params, headers })
      .pipe(
        map(response => this.extractAddressInfo(response, lat, lon))
      );
  }

  /**
   * Extracts address components from Nominatim response
   */
  private extractAddressInfo(response: NominatimResponse, lat: number, lon: number): AddressInfo {
    const address = response.address;

    // Build street address from house number and road
    let street = '';
    if (address.house_number) {
      street += address.house_number;
    }
    if (address.road) {
      street = street ? `${street} ${address.road}` : address.road;
    }

    // Get city (try different fields as Nominatim returns different structures)
    const city = address.city || address.town || address.village || address.municipality || '';

    return {
      street,
      city,
      postalCode: address.postcode || '',
      country: address.country || '',
      latitude: lat,
      longitude: lon
    };
  }
}
