export default function getDistance(lat1, lng1, lat2, lng2) {
  const earthRadius = 6371000; // meters

  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;

  const latDiffRad = ((lat2 - lat1) * Math.PI) / 180;
  const lngDiffRad = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(latDiffRad / 2) * Math.sin(latDiffRad / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(lngDiffRad / 2) *
      Math.sin(lngDiffRad / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c; // distance in meters
}
