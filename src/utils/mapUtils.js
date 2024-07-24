import mapboxgl from 'mapbox-gl'
import * as THREE from 'three'

export const lnglatsToWorld = (geometry) => {
  const vertices = geometry.map(([lng, lat, height]) => {
    const coords = mapboxgl.MercatorCoordinate.fromLngLat({ lng: lng, lat: lat }, height);
    return coords
  })
  console.log("lnglatsToWorld:", vertices);
  return vertices;
}


export const normalizeVertices = (mercatorCoordinates) => {
  let minX = Math.min(...mercatorCoordinates.map(coord => coord.x));
  let maxX = Math.max(...mercatorCoordinates.map(coord => coord.x));
  let minY = Math.min(...mercatorCoordinates.map(coord => coord.y));
  let maxY = Math.max(...mercatorCoordinates.map(coord => coord.y));

  let normalizedCoordinates = mercatorCoordinates.map(coord => ({
    x: (coord.x - minX) / (maxX - minX),
    y: (coord.y - minY) / (maxY - minY),
    z: coord.z // Assuming you don't need to normalize z since it's very small and close to zero
  }));
  
  console.log("Normalized Coordinates:", normalizedCoordinates);
  return normalizedCoordinates;
}

export function flattenVectors(vertices) {
  const flattenedArray = [];
  vertices.forEach(vertex => {
    flattenedArray.push(vertex.x, vertex.y, vertex.z);
  });
  console.log(flattenedArray)
  return flattenedArray;
}