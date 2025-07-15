import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { GeocodingService, AddressInfo } from '../../services/geocoding.service';
import { Map, Marker, NavigationControl } from 'maplibre-gl';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() latitude?: number;
  @Input() longitude?: number;
  @Output() positionChanged = new EventEmitter<{ latitude: number, longitude: number }>();
  @Output() addressChanged = new EventEmitter<AddressInfo>();
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  // MapLibre GL JS map and marker
  private map!: Map;
  private marker!: Marker;

  // Default map settings
  private defaultLatitude = 48.856614; // Paris, France
  private defaultLongitude = 2.3522219;
  private defaultZoom = 13;
  private mapInitialized = false;

  constructor(private geocodingService: GeocodingService) {}

  ngOnInit(): void {
    // No initialization in ngOnInit, we'll initialize the map in ngAfterViewInit
    // when the DOM element is available
  }

  ngAfterViewInit(): void {
    // Initialize the map after the view is initialized
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If latitude/longitude inputs change and map is initialized
    if ((changes['latitude'] || changes['longitude']) && this.mapInitialized) {
      this.updateMarkerPosition();
    }
  }

  ngOnDestroy(): void {
    // Clean up MapLibre GL JS resources
    if (this.map) {
      this.map.remove();
    }
    this.mapInitialized = false;
  }

  /**
   * Initialize the MapLibre GL JS map
   */
  private initializeMap(): void {
    if (!this.mapContainer) {
      console.error('Map container not found');
      return;
    }

    // Get initial coordinates
    const lat = this.latitude || this.defaultLatitude;
    const lng = this.longitude || this.defaultLongitude;

    // Initialize the map
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: [lng, lat],
      zoom: this.defaultZoom
    });

    // Add navigation controls (zoom in/out)
    this.map.addControl(new NavigationControl(), 'top-right');

    // Add click event listener to the map
    this.map.on('click', (event) => {
      const { lng, lat } = event.lngLat;
      this.updateMarker(lat, lng);
      this.positionChanged.emit({ latitude: lat, longitude: lng });
      this.getAddressFromLatLng(lat, lng);
    });

    // Mark map as initialized and add marker after map is loaded
    this.map.on('load', () => {
      this.mapInitialized = true;

      // Add initial marker if coordinates are provided
      const initialLat = this.latitude || this.defaultLatitude;
      const initialLng = this.longitude || this.defaultLongitude;
      this.addMarker(initialLat, initialLng);
    });
  }

  /**
   * Add a marker to the map at the specified coordinates
   */
  private addMarker(lat: number, lng: number): void {
    // Remove existing marker if it exists
    if (this.marker) {
      this.marker.remove();
    }

    // Create a new marker
    this.marker = new Marker({
      draggable: true,
    })
      .setLngLat([lng, lat])
      .addTo(this.map);

    // Add drag end event listener to the marker
    this.marker.on('dragend', () => {
      const lngLat = this.marker.getLngLat();
      this.positionChanged.emit({ latitude: lngLat.lat, longitude: lngLat.lng });
      this.getAddressFromLatLng(lngLat.lat, lngLat.lng);
    });
  }

  /**
   * Get address information from latitude and longitude using reverse geocoding
   */
  private getAddressFromLatLng(lat: number, lng: number): void {
    this.geocodingService.reverseGeocode(lat, lng)
      .subscribe({
        next: (addressInfo: AddressInfo) => {
          this.addressChanged.emit(addressInfo);
        },
        error: (error) => {
          console.error('Geocoding failed:', error);
        }
      });
  }

  /**
   * Update the marker position
   */
  private updateMarker(lat: number, lng: number): void {
    if (this.marker) {
      this.marker.setLngLat([lng, lat]);
    } else {
      this.addMarker(lat, lng);
    }

    // Center the map on the marker while preserving the current zoom level
    this.map.flyTo({
      center: [lng, lat],
      zoom: this.map.getZoom()
    });
  }

  /**
   * Update marker position based on input coordinates
   */
  private updateMarkerPosition(): void {
    const lat = this.latitude || this.defaultLatitude;
    const lng = this.longitude || this.defaultLongitude;

    // If the map is already initialized, update the marker and view
    if (this.mapInitialized && this.map) {
      // Update marker position without changing the zoom level
      if (this.marker) {
        this.marker.setLngLat([lng, lat]);
      } else {
        this.addMarker(lat, lng);
      }

      // Center the map on the marker while preserving the current zoom level
      this.map.flyTo({
        center: [lng, lat],
        zoom: this.map.getZoom()
      });
    }
  }
}
