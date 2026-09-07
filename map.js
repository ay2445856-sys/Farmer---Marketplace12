/**
 * FarmDirect - OpenStreetMap Interactive Logistics & Route Engine
 * Smart India Hackathon (SIH)
 */

let mapInstance = null;
let routeLine = null;
let farmerMarker = null;
let buyerMarker = null;
let truckMarker = null;
let animationFrameId = null;
let activeRouteKey = 'bhadohi'; // Default matching prompt example: Bhadohi -> Prayagraj

// Corridors Repository
const LOGISTICS_ROUTES = {
  bhadohi: {
    title: "भदोही ➔ प्रयागराज ग्रीन कॉरिडोर (NH-19 Corridor)",
    originName: "भदोही फार्म गेट (Farmer: रामेश्वर पाटिल)",
    destName: "सिविल लाइंस वेयरहाउस, प्रयागराज (Buyer Hub)",
    originCoords: [25.3957, 82.5694],
    destCoords: [25.4358, 81.8463],
    centerCoords: [25.41, 82.20],
    zoom: 10,
    distanceKm: 68,
    transitTime: "1.8 घंटे",
    deliveryCost: 300,
    co2Saved: "6.2 kg",
    vehicle: "Tata Ace Gold ('छोटा हाथी')",
    driver: "राम सिंह (+91 98390 12345)",
    speed: "45 km/h",
    cargo: "200 kg नासिक/भदोही लाल प्याज (Onion)",
    waypoints: [
      [25.3957, 82.5694], // Bhadohi Farm Gate
      [25.3412, 82.4780], // Suriyawan Road
      [25.2842, 82.4285], // Gopiganj Mandi NH-19 Toll
      [25.3578, 82.1798], // Handia Bypass
      [25.4100, 82.0200], // Saidabad Hub
      [25.4320, 81.9020], // Shastri Bridge / Jhunsi
      [25.4358, 81.8463]  // Prayagraj Civil Lines Warehouse
    ]
  },
  nashik: {
    title: "लासलगांव ➔ वाशी APMC मुंबई कॉरिडोर (NH-160 Corridor)",
    originName: "लासलगांव मंडी, नासिक (Farm Gate)",
    destName: "वाशी APMC मार्केट, नवी मुंबई (Buyer Hub)",
    originCoords: [20.1472, 74.2257],
    destCoords: [19.0760, 72.9986],
    centerCoords: [19.65, 73.65],
    zoom: 8,
    distanceKm: 182,
    transitTime: "4.5 घंटे",
    deliveryCost: 2850,
    co2Saved: "14.8 kg",
    vehicle: "Tata Ace Gold ('छोटा हाथी')",
    driver: "किशोर गायकवाड़ (+91 94220 11223)",
    speed: "48 km/h",
    cargo: "25 क्विंटल नासिक लाल प्याज (Onion)",
    waypoints: [
      [20.1472, 74.2257], // Lasalgaon
      [19.9975, 73.7898], // Nashik City
      [19.8250, 73.6500], // Igatpuri
      [19.6800, 73.4900], // Kasara Ghat Checkpoint
      [19.4500, 73.3000], // Shahapur
      [19.2400, 73.1300], // Kalyan
      [19.0760, 72.9986]  // Vashi APMC Warehouse
    ]
  }
};

function initOpenStreetMap(routeKey = 'bhadohi') {
  activeRouteKey = routeKey;
  const mapElement = document.getElementById('map-container');
  if (!mapElement) return;

  const routeData = LOGISTICS_ROUTES[routeKey] || LOGISTICS_ROUTES.bhadohi;

  // Destroy previous instance if re-initialized
  if (mapInstance) {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    mapInstance.remove();
    mapInstance = null;
  }

  // Initialize Map
  mapInstance = L.map('map-container').setView(routeData.centerCoords, routeData.zoom);

  // OpenStreetMap Tile Layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors | FarmDirect AI Logistics'
  }).addTo(mapInstance);

  plotRoute(routeData);
  updateRouteSpecsUI(routeData);
}

function plotRoute(routeData) {
  if (!mapInstance) return;

  // Clear existing layers
  if (routeLine) mapInstance.removeLayer(routeLine);
  if (farmerMarker) mapInstance.removeLayer(farmerMarker);
  if (buyerMarker) mapInstance.removeLayer(buyerMarker);
  if (truckMarker) mapInstance.removeLayer(truckMarker);

  // 1. Farmer Pickup Pin (Green)
  const farmerIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color:#16A34A; width:34px; height:34px; border-radius:50%; border:3px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 8px rgba(0,0,0,0.3); color:white; font-size:16px;">🌾</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });

  farmerMarker = L.marker(routeData.originCoords, { icon: farmerIcon })
    .addTo(mapInstance)
    .bindPopup(`<b>पिकअप: ${routeData.originName}</b><br>कार्गो: ${routeData.cargo}`)
    .openPopup();

  // 2. Buyer Destination Pin (Red)
  const buyerIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color:#DC2626; width:34px; height:34px; border-radius:50%; border:3px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 8px rgba(0,0,0,0.3); color:white; font-size:16px;">🏢</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });

  buyerMarker = L.marker(routeData.destCoords, { icon: buyerIcon })
    .addTo(mapInstance)
    .bindPopup(`<b>गंतव्य: ${routeData.destName}</b><br>थोक खरीदार डिलीवरी केंद्र`);

  // 3. Draw AI Route Polyline
  routeLine = L.polyline(routeData.waypoints, {
    color: '#1E6F3D',
    weight: 5,
    opacity: 0.88,
    dashArray: '8, 6'
  }).addTo(mapInstance);

  mapInstance.fitBounds(routeLine.getBounds(), { padding: [40, 40] });

  // 4. Animated Moving Delivery Truck Marker (Yellow Pulse)
  const truckIcon = L.divIcon({
    className: 'custom-truck-icon',
    html: `<div style="background-color:#F59E0B; width:36px; height:36px; border-radius:50%; border:3px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.35); font-size:18px;">🚚</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });

  const startPt = routeData.waypoints[Math.floor(routeData.waypoints.length / 3)];
  truckMarker = L.marker(startPt, { icon: truckIcon })
    .addTo(mapInstance)
    .bindPopup(`<b>लाइव वाहन: ${routeData.vehicle}</b><br>चालक: ${routeData.driver}<br>गति: ${routeData.speed}`);

  startTruckAnimation(routeData.waypoints);
}

function startTruckAnimation(waypoints) {
  if (!truckMarker || !waypoints || waypoints.length < 2) return;
  let progress = 0;
  const speed = 0.0035;

  function animate() {
    progress += speed;
    if (progress > 1) progress = 0;

    const totalSegments = waypoints.length - 1;
    const currentSegmentIndex = Math.floor(progress * totalSegments);
    const segmentProgress = (progress * totalSegments) - currentSegmentIndex;

    const p1 = waypoints[currentSegmentIndex];
    const p2 = waypoints[Math.min(currentSegmentIndex + 1, totalSegments)];

    const curLat = p1[0] + (p2[0] - p1[0]) * segmentProgress;
    const curLng = p1[1] + (p2[1] - p1[1]) * segmentProgress;

    truckMarker.setLatLng([curLat, curLng]);
    animationFrameId = requestAnimationFrame(animate);
  }

  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animate();
}

function updateRouteSpecsUI(routeData) {
  const distEl = document.getElementById('mapRouteDistance');
  if (distEl) distEl.innerText = `${routeData.distanceKm} km`;

  const timeEl = document.getElementById('mapRouteTransit');
  if (timeEl) timeEl.innerText = routeData.transitTime;

  const co2El = document.getElementById('mapRouteCo2');
  if (co2El) co2El.innerText = routeData.co2Saved;

  const costEl = document.getElementById('mapRouteCost');
  if (costEl) costEl.innerText = `₹${routeData.deliveryCost}`;

  const descEl = document.getElementById('mapRouteDesc');
  if (descEl) {
    descEl.innerHTML = `<strong>${routeData.title}</strong><br>📍 ${routeData.originName} ➔ ${routeData.destName}`;
  }
}

// Window hooks for global access
window.updateMapRoute = function(routeKey) {
  initOpenStreetMap(routeKey);
};

window.initOpenStreetMap = initOpenStreetMap;
