import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState<number>(-71.61);
  const [lat, setLat] = useState<number>(42.27);
  const [zoom, setZoom] = useState(8);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
    });

    map.current!.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current!.on('load', () => {
      const start = {
        lng: -71.05,
        lat: 42.35,
      };
      const currentLocation = {
        lng: -71.78,
        lat: 42.25,
      };
      const end = {
        lng: -72.63,
        lat: 42.11,
      };

      // Add the route line
      map.current!.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [start.lng, start.lat], // Starting location
              [currentLocation.lng, currentLocation.lat], // Current location
              // ...Array of intermediate waypoints, if any...
              [end.lng, end.lat], // Ending location
            ],
          },
        },
      });

      map.current!.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#1db7dd',
          'line-width': 8,
        },
      });

      // Create a popup for the start location
      const startPopup = new mapboxgl.Popup({ offset: 25 }).setText(
        'Start location'
      );

      // Add markers for the start, end, and current location
      new mapboxgl.Marker({ color: 'green' })
        .setLngLat([start.lng, start.lat])
        .setPopup(startPopup) // sets a popup on this marker
        .addTo(map.current!);

      // Create a popup for the end location
      const endPopup = new mapboxgl.Popup({ offset: 25 }).setText(
        'End location'
      );
      new mapboxgl.Marker({ color: 'red' })
        .setLngLat([end.lng, end.lat])
        .setPopup(endPopup) // sets a popup on this marker
        .addTo(map.current!);

      // Create a popup for the current location
      const currentLocationPopup = new mapboxgl.Popup({ offset: 25 }).setText(
        'Current location'
      );
      new mapboxgl.Marker({ color: 'blue' })
        .setLngLat([currentLocation.lng, currentLocation.lat])
        .setPopup(currentLocationPopup) // sets a popup on this marker
        .addTo(map.current!);
    });

    map.current!.on('move', () => {
      setLng(parseFloat(map.current!.getCenter().lng.toFixed(4)));
      setLat(parseFloat(map.current!.getCenter().lat.toFixed(4)));
      setZoom(parseFloat(map.current!.getZoom().toFixed(2)));
    });
  }, [lat, lng, zoom]);

  return (
    <div>
      <div className='sidebar'>
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className='map-container' />
      <div>
        <p>
          This example shows how to draw a route line between two locations and
          update it as the user's location changes. The route line is drawn
          using a GeoJSON source that contains a LineString feature. The
          coordinates of the LineString are updated whenever the user's location
          changes.
        </p>
        <p>
          The route line is drawn using a GeoJSON source that contains a
          LineString feature. The coordinates of the LineString are updated
          whenever the user's location changes.
        </p>
        <hr />
        <p>
          So I'd imagine this is at least close to what's being asked for the
          frontend. Displays a map, maybe shows the starting location and ending
          location, with a marker showing the driver's current location, which
          is set by the driver himself via...some sort of mechanism of calling a
          phone number? That's about as much as I understand so far, and this is
          just a quick prototype to show off Mapbox and try out its API.
        </p>
      </div>
    </div>
  );
}
