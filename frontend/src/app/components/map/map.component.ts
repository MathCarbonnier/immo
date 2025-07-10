import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';

// Fix for marker icon issues in Angular
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() latitude: number | null = null;
  @Input() longitude: number | null = null;
  @Output() positionChanged = new EventEmitter<{ latitude: number, longitude: number }>();

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;
  private defaultLatitude = 48.856614; // Paris, France
  private defaultLongitude = 2.3522219;

  constructor() { }

  ngOnInit(): void {
    // Set default icon for all markers
    L.Marker.prototype.options.icon = iconDefault;
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If the map is already initialized and latitude/longitude inputs change
    if (this.map && (changes['latitude'] || changes['longitude'])) {
      this.updateMarkerPosition();
    }
  }

  private initMap(): void {
    // Create the map
    this.map = L.map('map').setView(
      [this.latitude || this.defaultLatitude, this.longitude || this.defaultLongitude], 
      13
    );

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Add a marker if coordinates are provided
    this.updateMarkerPosition();

    // Add click event to the map
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.updateMarker(lat, lng);
      this.positionChanged.emit({ latitude: lat, longitude: lng });
    });
  }

  private updateMarkerPosition(): void {
    if (!this.map) return;

    const lat = this.latitude || this.defaultLatitude;
    const lng = this.longitude || this.defaultLongitude;

    if (this.marker) {
      // Update existing marker position
      this.marker.setLatLng([lat, lng]);
    } else {
      // Create a new marker
      this.marker = L.marker([lat, lng], {
        draggable: true
      }).addTo(this.map);

      // Add drag event to the marker
      this.marker.on('dragend', () => {
        const position = this.marker?.getLatLng();
        if (position) {
          this.positionChanged.emit({ latitude: position.lat, longitude: position.lng });
        }
      });
    }

    // Center the map on the marker
    this.map.setView([lat, lng], this.map.getZoom());
  }

  private updateMarker(lat: number, lng: number): void {
    if (!this.map) return;

    if (this.marker) {
      // Update existing marker position
      this.marker.setLatLng([lat, lng]);
    } else {
      // Create a new marker
      this.marker = L.marker([lat, lng], {
        draggable: true
      }).addTo(this.map);

      // Add drag event to the marker
      this.marker.on('dragend', () => {
        const position = this.marker?.getLatLng();
        if (position) {
          this.positionChanged.emit({ latitude: position.lat, longitude: position.lng });
        }
      });
    }
  }
}
