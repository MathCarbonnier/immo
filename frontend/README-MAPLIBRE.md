# MapLibre GL JS Integration Guide

Ce guide explique comment utiliser l'intégration de MapLibre GL JS dans l'application Immo.

## Présentation

L'application utilise [MapLibre GL JS](https://maplibre.org/maplibre-gl-js-docs/api/), une bibliothèque open source de cartographie, avec les tuiles d'[OpenStreetMap](https://www.openstreetmap.org/) pour afficher des cartes interactives. Le géocodage inverse est effectué via l'API [Nominatim](https://nominatim.org/release-docs/latest/api/Reverse/).

## Fonctionnalités

Le composant de carte (`MapComponent`) offre les fonctionnalités suivantes :

- Affichage d'une carte interactive avec les tuiles OpenStreetMap
- Navigation sur la carte (zoom, déplacement)
- Placement d'un marqueur par clic sur la carte
- Récupération des coordonnées (latitude/longitude) du marqueur
- Géocodage inverse pour obtenir l'adresse correspondant aux coordonnées
- Mise à jour des champs d'adresse dans un formulaire

## Utilisation du composant

### Dans un template HTML

```html
<app-map
  [latitude]="votreLatitude"
  [longitude]="votreLongitude"
  (positionChanged)="gererChangementPosition($event)"
  (addressChanged)="gererChangementAdresse($event)">
</app-map>
```

### Propriétés d'entrée (Inputs)

- `latitude`: La latitude initiale (nombre)
- `longitude`: La longitude initiale (nombre)

### Événements de sortie (Outputs)

- `positionChanged`: Émis lorsque la position du marqueur change, avec les nouvelles latitude et longitude
- `addressChanged`: Émis lorsque les informations d'adresse sont récupérées à partir de la nouvelle position

### Interface AddressInfo

```typescript
interface AddressInfo {
  street: string;      // Rue
  city: string;        // Ville
  postalCode: string;  // Code postal
  country: string;     // Pays
  latitude: number;    // Latitude
  longitude: number;   // Longitude
}
```

## Exemple d'utilisation dans un composant

```typescript
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AddressInfo } from '../../components/map/map.component';

@Component({
  selector: 'app-exemple',
  templateUrl: './exemple.component.html'
})
export class ExempleComponent {
  adresseForm: FormGroup;
  
  // Coordonnées initiales (Paris, France)
  latitude = 48.856614;
  longitude = 2.3522219;

  constructor(private fb: FormBuilder) {
    this.adresseForm = this.fb.group({
      street: [''],
      city: [''],
      postalCode: [''],
      country: [''],
      latitude: [null],
      longitude: [null]
    });
  }

  // Gestion du changement de position
  gererChangementPosition(position: { latitude: number, longitude: number }): void {
    this.latitude = position.latitude;
    this.longitude = position.longitude;
    
    // Mise à jour des coordonnées dans le formulaire
    this.adresseForm.patchValue({
      latitude: position.latitude,
      longitude: position.longitude
    });
  }

  // Gestion du changement d'adresse
  gererChangementAdresse(adresse: AddressInfo): void {
    // Mise à jour de tous les champs d'adresse dans le formulaire
    this.adresseForm.patchValue({
      street: adresse.street,
      city: adresse.city,
      postalCode: adresse.postalCode,
      country: adresse.country,
      latitude: adresse.latitude,
      longitude: adresse.longitude
    });
  }
}
```

## Personnalisation

### Style de la carte

Le style de la carte peut être personnalisé en modifiant le fichier `map.component.css`. Vous pouvez ajuster :

- La taille de la carte (hauteur, largeur)
- Les bordures et ombres
- L'apparence des popups et des contrôles

### Tuiles de carte alternatives

Par défaut, le composant utilise les tuiles d'OpenStreetMap. Vous pouvez utiliser d'autres fournisseurs de tuiles en modifiant la configuration dans la méthode `initializeMap()` du fichier `map.component.ts`.

## Considérations de performance

- Le service de géocodage Nominatim a des limites d'utilisation. Pour une utilisation intensive, envisagez d'héberger votre propre instance Nominatim.
- Respectez la [politique d'utilisation](https://operations.osmfoundation.org/policies/nominatim/) de Nominatim en incluant un User-Agent approprié et en limitant le nombre de requêtes.

## Dépannage

Si la carte ne s'affiche pas correctement :

1. Vérifiez que les styles CSS de MapLibre GL JS sont correctement importés
2. Assurez-vous que le conteneur de la carte a une hauteur définie
3. Vérifiez les erreurs dans la console du navigateur