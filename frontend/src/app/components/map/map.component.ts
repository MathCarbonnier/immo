import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy, ViewChild } from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';

export interface AddressInfo {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() latitude: number | null = null;
  @Input() longitude: number | null = null;
  @Output() positionChanged = new EventEmitter<{ latitude: number, longitude: number }>();
  @Output() addressChanged = new EventEmitter<AddressInfo>();
  @ViewChild(GoogleMap) googleMap!: GoogleMap;

  geocoder: google.maps.Geocoder;

  // Google Maps options
  mapOptions: google.maps.MapOptions = {};
  center: google.maps.LatLngLiteral = { lat: 48.856614, lng: 2.3522219 }; // Paris, France
  zoom = 13;
  markerOptions: google.maps.MarkerOptions = { draggable: true };
  markerPosition: google.maps.LatLngLiteral = { lat: 48.856614, lng: 2.3522219 };

  private defaultLatitude = 48.856614; // Paris, France
  private defaultLongitude = 2.3522219;
  private mapInitialized = false;

  constructor() {
    // Initialize the geocoder
    this.geocoder = new google.maps.Geocoder();
  }

  ngOnInit(): void {
    // Initialize map options
    this.mapOptions = {
      center: this.center,
      zoom: this.zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    };

    // Set initial marker position if coordinates are provided
    this.updateMarkerPosition();
  }

  ngAfterViewInit(): void {
    // Add a small delay before initializing the map to ensure the container is fully rendered
    setTimeout(() => {
      this.mapInitialized = true;
      // Force the map to recalculate its dimensions
      if (this.googleMap && this.googleMap.googleMap) {
        google.maps.event.trigger(this.googleMap.googleMap, 'resize');
      }
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If latitude/longitude inputs change
    if (changes['latitude'] || changes['longitude']) {
      this.updateMarkerPosition();
    }
  }

  ngOnDestroy(): void {
    // No specific cleanup needed for Google Maps
    this.mapInitialized = false;
  }

  // Handle map click events
  onMapClick(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.updateMarker(lat, lng);
      this.positionChanged.emit({ latitude: lat, longitude: lng });
      this.getAddressFromLatLng(lat, lng);
    }
  }

  // Handle marker drag events
  onMarkerDragEnd(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.positionChanged.emit({ latitude: lat, longitude: lng });
      this.getAddressFromLatLng(lat, lng);
    }
  }

  // Get address information from latitude and longitude using reverse geocoding
  private getAddressFromLatLng(lat: number, lng: number): void {
    const latlng = { lat, lng };

    this.geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
        const addressComponents = this.extractAddressComponents(results[0]);

        const addressInfo: AddressInfo = {
          street: addressComponents.street || '',
          city: addressComponents.city || '',
          postalCode: addressComponents.postalCode || '',
          country: addressComponents.country || '',
          latitude: lat,
          longitude: lng
        };

        this.addressChanged.emit(addressInfo);
      } else {
        console.error('Geocoder failed due to: ' + status);
      }
    });
  }

  // Extract address components from geocoder result
  private extractAddressComponents(result: google.maps.GeocoderResult): {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  } {
    const components = {
      street: '',
      city: '',
      postalCode: '',
      country: ''
    };

    if (result.address_components) {
      for (const component of result.address_components) {
        const types = component.types;

        if (types.includes('street_number')) {
          components.street = component.long_name + ' ' + components.street;
        }

        if (types.includes('route')) {
          components.street = components.street + component.long_name;
        }

        if (types.includes('locality')) {
          components.city = component.long_name;
        }

        if (types.includes('postal_code')) {
          components.postalCode = component.long_name;
        }

        if (types.includes('country')) {
          components.country = component.long_name;
        }
      }
    }

    return components;
  }

  private updateMarkerPosition(): void {
    const lat = this.latitude || this.defaultLatitude;
    const lng = this.longitude || this.defaultLongitude;

    // Update center and marker position
    this.center = { lat, lng };
    this.markerPosition = { lat, lng };

    // If the map is already initialized, update the view
    if (this.mapInitialized && this.googleMap) {
      this.googleMap.panTo(this.center);
    }
  }

  private updateMarker(lat: number, lng: number): void {
    this.markerPosition = { lat, lng };
    this.center = { lat, lng };

    // If the map is already initialized, update the view
    if (this.mapInitialized && this.googleMap) {
      this.googleMap.panTo(this.center);
    }
  }
}
