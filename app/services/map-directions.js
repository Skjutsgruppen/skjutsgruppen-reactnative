/* global fetch */
import { GOOGLE_MAP_API_KEY } from '@config';
/* eslint-disable */
const decode = (t, e) => {
  for (var n, o, u = 0, l = 0, r = 0, d = [], h = 0, i = 0, a = null, c = Math.pow(10, e || 5);
    u < t.length;) {
    a = null, h = 0, i = 0;
    do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32);
    n = 1 & i ? ~(i >> 1) : i >> 1, h = i = 0;
    do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32);
    o = 1 & i ? ~(i >> 1) : i >> 1, l += n, r += o, d.push([l / c, r / c]);
  }

  return d.map(t => ({
    latitude: t[0],
    longitude: t[1],
  }));
};

/* eslint-enable */
const fetchRoute = ({ origin, destination, mode, language, waypoints }) => {
  let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_MAP_API_KEY}&mode=${mode}&language=${language}`;

  if (waypoints) {
    url += `&waypoints=via:${waypoints}`;
  }
  return fetch(url)
    .then(response => response.json())
    .then((json) => {
      if (json.status !== 'OK') {
        const errorMessage = json.error_message || 'Unknown error';
        return Promise.reject(errorMessage);
      }

      if (json.routes.length) {
        const route = json.routes[0];

        return Promise.resolve({
          distance: route.legs.reduce((carry, curr) => carry + curr.distance.value, 0) / 1000,
          duration: route.legs.reduce((carry, curr) => carry + curr.duration.value, 0) / 60,
          coordinates: decode(route.overview_polyline.points),
        });
      }
      return Promise.reject();
    });
};


export const getCoordinates = ({ start, end, stops = '', mode = 'driving', language = 'en' }) => {
  let origin = start;
  let destination = end;

  if (start.latitude && start.longitude) {
    origin = `${start.latitude},${start.longitude}`;
  }

  if (end.latitude && end.longitude) {
    destination = `${end.latitude},${end.longitude}`;
  }

  return fetchRoute({ origin, destination, mode, language, waypoints: stops });
};

const deg2rad = deg => deg * (Math.PI / 180);

export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    (Math.sin(dLat / 2) * Math.sin(dLat / 2)) +
    (Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2));
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

