"use client";

import { useState, useCallback, memo, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { MapPin, Navigation, ExternalLink, Loader2, LocateFixed, X, Car, Clock, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Coordonnées de Jacqueville - Sassako-Bégnini, Côte d'Ivoire (Akwa Luxury Lodge)
const DEFAULT_CENTER = {
  lat: 5.1667,  // Latitude de Sassako-Bégnini
  lng: -4.8833, // Longitude de Sassako-Bégnini
};

// Lien Google Maps direct
const GOOGLE_MAPS_LINK = "https://maps.app.goo.gl/dH8eh6wv36RHmGoM9";

const DEFAULT_ZOOM = 14;

// Style de la carte (optionnel - style luxe/élégant)
const mapStyles = [
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#193341" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#2c5a71" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#29768a" }, { lightness: -37 }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#406d80" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#406d80" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ visibility: "on" }, { color: "#3e606f" }, { weight: 2 }, { gamma: 0.84 }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ weight: 0.6 }, { color: "#1a3541" }],
  },
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#2c5a71" }],
  },
];

// Options de la carte
const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: true,
  fullscreenControl: true,
  styles: mapStyles,
  gestureHandling: "cooperative",
};

interface GoogleMapComponentProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markerTitle?: string;
  showInfoWindow?: boolean;
  className?: string;
  height?: string;
  showDirections?: boolean;
}

function GoogleMapComponent({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  markerTitle = "Akwa Luxury Lodge",
  showInfoWindow = true,
  className,
  height = "aspect-video",
  showDirections = true,
}: GoogleMapComponentProps) {
  const [infoWindowOpen, setInfoWindowOpen] = useState(showInfoWindow);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || "",
    id: "google-map-script",
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMarkerClick = () => {
    setInfoWindowOpen(true);
  };

  const openInGoogleMaps = () => {
    window.open(GOOGLE_MAPS_LINK, "_blank");
  };

  const getDirectionsExternal = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`;
    window.open(url, "_blank");
  };

  // Obtenir la position de l'utilisateur
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(userPos);
        setIsLoadingLocation(false);
      },
      (error) => {
        setIsLoadingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Accès à la localisation refusé");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Position non disponible");
            break;
          case error.TIMEOUT:
            setLocationError("Délai d'attente dépassé");
            break;
          default:
            setLocationError("Erreur de localisation");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // Calculer l'itinéraire quand on a la position de l'utilisateur
  useEffect(() => {
    if (userLocation && isLoaded && window.google) {
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin: userLocation,
          destination: center,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);

            // Extraire les informations de distance et durée
            const route = result.routes[0];
            if (route && route.legs[0]) {
              setRouteInfo({
                distance: route.legs[0].distance?.text || "",
                duration: route.legs[0].duration?.text || "",
              });
            }

            // Ajuster la vue pour montrer tout l'itinéraire
            if (map && result.routes[0]?.bounds) {
              map.fitBounds(result.routes[0].bounds);
            }
          } else {
            console.error("Erreur de calcul d'itinéraire:", status);
            setLocationError("Impossible de calculer l'itinéraire");
          }
        }
      );
    }
  }, [userLocation, isLoaded, center, map]);

  // Annuler l'itinéraire
  const clearDirections = () => {
    setUserLocation(null);
    setDirections(null);
    setRouteInfo(null);
    setLocationError(null);
    if (map) {
      map.setCenter(center);
      map.setZoom(zoom);
    }
  };

  // Si pas de clé API, afficher un fallback avec lien vers Google Maps
  if (!apiKey) {
    return (
      <div
        className={cn(
          "relative bg-muted rounded-lg overflow-hidden",
          height,
          className
        )}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <MapPin className="h-12 w-12 text-primary mb-4" />
          <h3 className="font-serif text-lg font-bold mb-2">
            Akwa Luxury Lodge
          </h3>
          <p className="text-muted-foreground mb-4">
            Jacqueville - Sassako-Bégnini, Côte d&apos;Ivoire
            <br />
            En bord de mer
          </p>
          <div className="flex gap-2">
            <Button variant="default" size="sm" onClick={openInGoogleMaps}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Voir sur Google Maps
            </Button>
            <Button variant="outline" size="sm" onClick={getDirectionsExternal}>
              <Navigation className="mr-2 h-4 w-4" />
              Itinéraire
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Erreur de chargement
  if (loadError) {
    return (
      <div
        className={cn(
          "relative bg-destructive/10 rounded-lg overflow-hidden flex items-center justify-center",
          height,
          className
        )}
      >
        <div className="text-center text-destructive p-4">
          <MapPin className="h-8 w-8 mx-auto mb-2" />
          <p>Erreur de chargement de la carte</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={openInGoogleMaps}
          >
            Ouvrir dans Google Maps
          </Button>
        </div>
      </div>
    );
  }

  // Chargement en cours
  if (!isLoaded) {
    return (
      <div
        className={cn(
          "relative bg-muted rounded-lg overflow-hidden flex items-center justify-center",
          height,
          className
        )}
      >
        <div className="text-center text-muted-foreground">
          <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
          <p>Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative rounded-lg overflow-hidden", height, className)}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={directions ? undefined : center}
        zoom={directions ? undefined : zoom}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Afficher l'itinéraire si disponible */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: "#1a3c34",
                strokeWeight: 5,
                strokeOpacity: 0.8,
              },
            }}
          />
        )}

        {/* Marqueur de l'hôtel (seulement si pas d'itinéraire) */}
        {!directions && (
          <Marker
            position={center}
            title={markerTitle}
            onClick={handleMarkerClick}
            animation={google.maps.Animation.DROP}
          />
        )}

        {/* Fenêtre d'information */}
        {infoWindowOpen && !directions && (
          <InfoWindow
            position={center}
            onCloseClick={() => setInfoWindowOpen(false)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-bold text-gray-900 mb-1">{markerTitle}</h3>
              <p className="text-gray-600 text-sm mb-3">
                Jacqueville - Sassako-Bégnini, Côte d&apos;Ivoire
                <br />
                En bord de mer
              </p>
              <div className="flex gap-2">
                <button
                  onClick={getDirectionsExternal}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Navigation className="h-3 w-3" />
                  Itinéraire
                </button>
                <button
                  onClick={openInGoogleMaps}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Agrandir
                </button>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Panneau d'informations de l'itinéraire */}
      {routeInfo && (
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-2 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 text-primary">
                <Route className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <span className="font-semibold text-xs sm:text-sm md:text-base truncate">Itinéraire vers Akwa Lodge</span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Car className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{routeInfo.distance}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{routeInfo.duration}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 sm:h-8 sm:w-8 absolute top-2 right-2 sm:relative sm:top-auto sm:right-auto"
              onClick={clearDirections}
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Message d'erreur de localisation */}
      {locationError && (
        <div className="absolute top-4 left-4 right-4 bg-destructive/90 text-destructive-foreground rounded-lg shadow-lg p-3 text-sm flex items-center justify-between">
          <span>{locationError}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive-foreground hover:bg-destructive-foreground/20"
            onClick={() => setLocationError(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Boutons de contrôle */}
      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 flex gap-2">
        {showDirections && !directions && (
          <Button
            variant="default"
            size="sm"
            onClick={getUserLocation}
            disabled={isLoadingLocation}
            className="shadow-lg text-xs sm:text-sm px-2 sm:px-3"
          >
            {isLoadingLocation ? (
              <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            ) : (
              <LocateFixed className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            )}
            <span className="hidden sm:inline">{isLoadingLocation ? "Localisation..." : "Itinéraire depuis ma position"}</span>
            <span className="sm:hidden">{isLoadingLocation ? "..." : "Itinéraire"}</span>
          </Button>
        )}

        {directions && (
          <Button
            variant="secondary"
            size="sm"
            onClick={getDirectionsExternal}
            className="shadow-lg text-xs sm:text-sm px-2 sm:px-3"
          >
            <Navigation className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Ouvrir dans Google Maps</span>
            <span className="sm:hidden">Google Maps</span>
          </Button>
        )}
      </div>

      {/* Bouton de zoom vers l'hôtel */}
      {directions && (
        <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={clearDirections}
            className="shadow-lg text-xs sm:text-sm px-2 sm:px-3"
          >
            <MapPin className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Voir l&apos;hôtel</span>
            <span className="sm:hidden">Hôtel</span>
          </Button>
        </div>
      )}
    </div>
  );
}

// Mémoiser le composant pour éviter les re-renders inutiles
export const InteractiveMap = memo(GoogleMapComponent);

// Composant simple avec iframe (alternative sans API key)
interface SimpleMapProps {
  className?: string;
  height?: string;
}

export function SimpleMap({ className, height = "aspect-video" }: SimpleMapProps) {
  // Coordonnées pour l'iframe Google Maps embed
  const embedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15893.847953089655!2d-4.425!3d5.2086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMTInMzEuMCJOIDTCsDI1JzAuMCJX!5e0!3m2!1sfr!2sci!4v1234567890`;

  return (
    <div className={cn("relative rounded-lg overflow-hidden", height, className)}>
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Localisation Akwa Luxury Lodge"
      />
    </div>
  );
}

export default InteractiveMap;
