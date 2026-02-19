import { auth, db, user } from "./index.html";

let stops = [];
let maxStops = 10;
let map, markers = [];

async function init() {
  // Load user plan
  const docSnap = await getDoc(doc(db, "users", user.uid));
  if(docSnap.exists()){
    const data = docSnap.data();
    maxStops = data.maxStops || 10;
  }

  // Init Map
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -26.2041, lng: 28.0473 },
    zoom: 11
  });

  // Add Stop button
  document.getElementById("addStop").onclick = async () => {
    if (stops.length >= maxStops) return alert(`Plan limit reached (${maxStops}). Upgrade to continue.`);
    const addr = document.getElementById("newAddress").value;
    if (!addr) return alert("Enter an address");

    // Geocode
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: addr }, (results, status) => {
      if(status === "OK" && results[0]){
        const loc = results[0].geometry.location;
        const stop = { name: addr, lat: loc.lat(), lon: loc.lng(), status: "pending" };
        stops.push(stop);
        renderStops();
      } else alert("Address not found");
    });
  };

  // Optimize Route button
  document.getElementById("optimizeRoute").onclick = async () => {
    if(stops.length < 2) return alert("Add at least 2 stops");
    const waypoints = stops.slice(1, -1).map(s => `${s.lat},${s.lon}`).join("|");
    const origin = `${stops[0].lat},${stops[0].lon}`;
    const dest = `${stops[stops.length-1].lat},${stops[stops.length-1].lon}`;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${dest}&waypoints=optimize:true|${waypoints}&key=YOUR_GOOGLE_MAPS_KEY`;

    const data = await fetch(url).then(r => r.json());
    if(data.routes){
      renderRoute(data.routes[0].overview_polyline.points);
    } else alert("Optimization failed");
  };
}

function renderStops(){
  // Clear markers
  markers.forEach(m => m.setMap(null));
  markers = [];

  // Render list
  const listEl = document.getElementById("stopList");
  listEl.innerHTML = "";
  stops.forEach((s,i)=>{
    const el = document.createElement("div");
    el.className = "border p-2 rounded space-y-1";
    el.innerHTML = `
      <div class="font-semibold">${i+1}. ${s.name}</div>
      <div class="flex gap-2">
        <button class="deliver bg-green-600 text-white px-2 py-1 rounded text-sm">Delivered</button>
        <button class="fail bg-red-600 text-white px-2 py-1 rounded text-sm">Not Delivered</button>
        <button class="navigate bg-indigo-700 text-white px-2 py-1 rounded text-sm">Navigate</button>
      </div>
    `;
    el.querySelector(".deliver").onclick = () => markStop(i,"delivered");
    el.querySelector(".fail").onclick = () => markStop(i,"failed");
    el.querySelector(".navigate").onclick = () => navigateStop(s);
    listEl.appendChild(el);

    const marker = new google.maps.Marker({
      position: { lat: s.lat, lng: s.lon },
      map,
      label: `${i+1}`
    });
    markers.push(marker);
  });

  document.getElementById("progress").textContent = `${stops.filter(s=>s.status!=="pending").length} / ${stops.length} completed`;
}

function markStop(idx,status){
  stops[idx].status = status;
  renderStops();
}

function navigateStop(stop){
  const url = `https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lon}&travelmode=driving`;
  window.open(url, "_blank");
}

function renderRoute(encodedPolyline){
  const path = google.maps.geometry.encoding.decodePath(encodedPolyline);
  const route = new google.maps.Polyline({ path, strokeColor:"#0000FF", strokeWeight:4 });
  route.setMap(map);
}

// Init
init();

