import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy, ViewChild } from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() latitude: number | null = null;
  @Input() longitude: number | null = null;
  @Output() positionChanged = new EventEmitter<{ latitude: number, longitude: number }>();
  @ViewChild(GoogleMap) googleMap!: GoogleMap;

  // Google Maps options
  mapOptions: google.maps.MapOptions = {};
  center: google.maps.LatLngLiteral = { lat: 48.856614, lng: 2.3522219 }; // Paris, France
  zoom = 13;
  markerOptions: google.maps.MarkerOptions = { draggable: true };
  markerPosition: google.maps.LatLngLiteral = { lat: 48.856614, lng: 2.3522219 };

  private defaultLatitude = 48.856614; // Paris, France
  private defaultLongitude = 2.3522219;
  private mapInitialized = false;

  constructor() { }

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
    }
  }

  // Handle marker drag events
  onMarkerDragEnd(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.positionChanged.emit({ latitude: lat, longitude: lng });
    }
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
