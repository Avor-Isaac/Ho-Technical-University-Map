// =====================
// STATE VARIABLES
// =====================
let scale = 1;
let x = 0;
let y = 0;

let isPanning = false;
let isDragging = false;
let startX, startY;

let active = null;


// =====================
// DOM ELEMENTS
// =====================
const wrapper = document.getElementById("mapWrapper");
const tooltip = document.getElementById("tooltip");

const zoomIn = document.getElementById("zoomIn");
const zoomOut = document.getElementById("zoomOut");
const resetZoom = document.getElementById("resetZoom");
const panBtn = document.getElementById("panBtn");

const searchBox = document.getElementById("searchBox");


const locationDescription = document.getElementById("locationDesc");


// =====================
// TRANSFORM FUNCTION
// =====================
function updateTransform() {
  // transform-origin is "0 0" (set in CSS on .map-wrapper)
  // translate first, then scale — keeps zoom anchor exactly at the cursor/pinch point
  wrapper.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
}


// =====================
// ZOOM FUNCTION (MOUSE / PINCH CENTERED)
// =====================
function zoom(factor, clientX, clientY) {
  // Use the wrapper's PARENT (the .main div) as the stable reference rect —
  // the wrapper itself moves so its rect shifts, causing the leftward drift
  const container = wrapper.parentElement.getBoundingClientRect();

  // Cursor/pinch position relative to the stable container
  const offsetX = clientX - container.left;
  const offsetY = clientY - container.top;

  // Which point on the unscaled SVG is under the cursor right now
  const svgX = (offsetX - x) / scale;
  const svgY = (offsetY - y) / scale;

  // Apply new scale with clamp so map can't zoom out to nothing or in too far
  scale = Math.min(Math.max(scale * factor, 0.3), 8);

  // Recalculate translation so that same SVG point stays pinned under the cursor
  x = offsetX - svgX * scale;
  y = offsetY - svgY * scale;

  updateTransform();
}


// =====================
// BUTTON ZOOM (pivots around the visible center of the map area)
// =====================
zoomIn.onclick = () => {
  const c = wrapper.parentElement.getBoundingClientRect();
  zoom(1.2, c.left + c.width / 2, c.top + c.height / 2);
};
zoomOut.onclick = () => {
  const c = wrapper.parentElement.getBoundingClientRect();
  zoom(0.8, c.left + c.width / 2, c.top + c.height / 2);
};
resetZoom.onclick = () => {
  scale = 1;
  x = 0;
  y = 0;
  updateTransform();
};


// =====================
// MOUSE WHEEL ZOOM
// =====================
wrapper.addEventListener("wheel", e => {
  e.preventDefault();
  zoom(e.deltaY < 0 ? 1.1 : 0.9, e.clientX, e.clientY);
});


// =====================
// PAN SYSTEM (DRAG)
// =====================
panBtn.onclick = () => {
  isPanning = !isPanning;
  panBtn.classList.toggle("active");
  wrapper.classList.toggle("pan-active", isPanning);
};

wrapper.addEventListener("mousedown", (e) => {
  if (!isPanning) return;

  isDragging = true;
  startX = e.clientX - x;
  startY = e.clientY - y;
});

wrapper.addEventListener("mousemove", (e) => {
  if (!isDragging || !isPanning) return;

  x = e.clientX - startX;
  y = e.clientY - startY;

  updateTransform();
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});


// =====================
// LOCATIONS DATA
// =====================
const locations = {
  "Main Gate": {
    name: "Main Gate",
    image: "maingate.jpg",
    description: "Main entrance to the school"
  },
  
  "F.O Kwame Block (Main Administration)": {
    name: "F.O Kwame Block (Main Administration)",
    image: "fo.jpeg",
    description: "This is the main Administration of the University. It is about 1 minute walk from the main Gate."
  },
   
  "G.M Afeti Auditorium": {
    name: "G.M Afeti Auditorium",
    image: "auditorium.jpeg",
    description: "It is located at the east of the main Gate or the main entrance to the School. It ia about 30s walk from the Main Gate"
  },

  "Asogli Block (V Block)": {
    name: "Asogli Block (V Block)",
    image: "vblock.jpeg",
    description: "This is where most of the lecture halls are located, it is made up of about 34 lecture halls and this is also where the main security unit is. It is about 1:30s walk from the main Gate."
  },

  "GCB & ZENITH BANKS": {
    name: "GCB & ZENITH BANKS",
    image: "gbc.jpg",
    description: "These are the two banks at Ho Technical University. From the Main Gate to the Banks is about 2 minutes walk. "
  },

  "Nunya Library": {
    name: "Nunya Library",
    image: "nunya.jpg",
    description: "This is the School's Library, it is located between AR Block and the Banks. It is about 2:30s walk from the Main Gate."
  },

  "A.R Block": {
    name: "A.R Block",
    image: "ar.jpg",
    description: "This Block is about 3minutes walk from the Main Gate, this is about 0.30 km as estimated based on average walking speed of 5 km/h."
  },

   "Octagon": {
    name: "Octagon",
    image: "octagon.jpeg",
    description: "This the the Department of Computer Science, it is located about 3:58s which is approximately 0.33 km walk from the Main Gate as estimated based on average walking speed of 5 km/h."
  },

  "Auto Bay": {
    name: "Auto Bay",
    image: "autobay.jpg",
    description: "This is the Automobile Engineering Department, it is about 4:40s which is 0.39 km walk from the Main Gate as estimated based on average walking speed of 5 km/h."
  },

  "Amatron Laboratory": {
    name: "Amatron Laboratory",
    image: "amature-lab.jpg",
    description: "This Lab is about 5:00s walk, thus about 0.45 km from the Main Gate as estimated based on average walking speed of 5 km/h."
  },

  "Mechanical Bay": {
    name: "Mechanical Bay",
    image: "engeneering.jpg",
    description: "It is about 3:58s walk which is approximately 0.33 km from the Main Gate as estimated based on average walking speed of 5 km/h"
  },

  "Solar Technology Application Resource Centre": {
    name: "Solar Technology Application Resource Centre",
    image: "star c.jpg",
    description: "It is about 5:03s walk from the Main Gate, which is 0.45 km as estimated based on average walking speed of 5 km/h."
  },

  "Agric Mechanical Shop": {
    name: "Agric Mechanical Shop",
    image: "fablab.jpg",
    description: "It is about 5:00s walk from the Main Gate, which is 0.43 km as estimated based on average walking speed of 5 km/h."
  },

  "Afese Block (Old Administration)": {
    name: "Afese Block (Old Administration)",
    image: "Afese.jpg",
    description: "This block contains the office of the Dean of students, Indusstrial Art Department, Civil Engineering Department, etc. It is about 6:19s walk from the Main Gate, which is 0.54 km as estimated based on average walking speed of 5 km/h."
  },

  "Executive Restaurant": {
    name: "Executive Restaurant",
    image: "Executive rest.jpg",
    description: "It is about 6:55s walk from the Main Gate, which is 0.57 km as estimated based on average walking speed of 5 km/h."
  },

  "Building Technology Lab": {
    name: "Building Technology Lab",
    image: "achictec.jpg",
    description: "It is about 7:00s walk from the Main Gate, which is 0.60 km as estimated based on average walking speed of 5 km/h."
  },  
  
  "Cafeteria": {
    name: "Cafeteria",
    image: "cafetaria.jpg",
    description: "It is about 7:03s walk from the Main Gate, which is 0.61 km as estimated based on average walking speed of 5 km/h."
  },  

  "Graduate School": {
    name: "Graduate School",
    image: "graduateschool.jpg",
    description: "It is about 7:30s walk from the Main Gate, which is 0.67 km as estimated based on average walking speed of 5 km/h."
  },

  "Esther Nukulenu Demonstration Restaurant": {
    name: "Esther Nukulenu Demonstration Restaurant",
    image: "nukulenu.jpg",
    description: "It is about 7:37s walk from the Main Gate, which is 0.69 km as estimated based on average walking speed of 5 km/h."
  },    

   "HTM Resource Centre": {
    name: "HTM Resource Centre",
    image: "HTMResourcesCentre.jpg",
    description: "It is about 7:59s walk from the Main Gate, which is 0.71 km as estimated based on average walking speed of 5 km/h."
  },    

  "Beauty Saloon": {
    name: "Beauty Saloon",
    image: "HTMResourcesCentre.jpg",
    description: "It is about 8:03s walk from the Main Gate, which is 0.74 km as estimated based on average walking speed of 5 km/h."
  },

  "Fashion Block & HTM Practical Room": {
    name: "Fashion Block & HTM Practical Room",
    image: "fashion.jpg",
    description: "It is about 9:00s walk from the Main Gate, which is 0.80 km as estimated based on average walking speed of 5 km/h."
  },        

  "Welding Workshop": {
    name: "Welding Workshop",
    image: "weldingsection.jpg",
    description: "It is about 7:04s walk from the Main Gate, which is 0.46 km as estimated based on average walking speed of 5 km/h."
  },        

   "Carpentary Workshop": {
    name: "Carpentary Workshop",
    image: "capentary.jpeg",
    description: "It is about 7:45s walk from the Main Gate, which is 0.50 km as estimated based on average walking speed of 5 km/h."
  },        

   "Electrical Engineering Block": {
    name: "Electrical Engineering Block",
    image: "capentary.jpeg",
    description: "It is about 9:21s walk from the Main Gate, which is 0.78 km as estimated based on average walking speed of 5 km/h."
  },        

  "Vodzi Hall (Central Male Hall)": {
    name: "Vodzi Hall (Central Male Hall)",
    image: "vodzi.jpg",
    description: "This is the Male Hostel. It is about 10:15s walk from the Main Gate, which is 0.85 km as estimated based on average walking speed of 5 km/h."
  },        

  "Volta Premier FM": {
    name: "Volta Premier FM",
    image: "voltapremeire.jpg",
    description: "This is Ho Technical University Radio Broadcast Station. It is about 10:10s walk from the Main Gate, which is 0.85 km as estimated based on average walking speed of 5 km/h."
  },       

  "SRC JCR": {
    name: "SRC JCR",
    image: "src.jpg",
    description: "It is about 11:04s walk from the Main Gate, which is 0.90 km as estimated based on average walking speed of 5 km/h."
  },    

  "Acorlatse Hall(Central Female Hall)": {
    name: "Acorlatse Hall(Central Female Hall)",
    image: "accolatse.jpg",
    description: "This is the Female hostel. It is about 11:49s walk from the Main Gate, which is 0.95 km as estimated based on average walking speed of 5 km/h."
  },    

  "Demonstration Farm": {
    name: "Demonstration Farm",
    image: "demonstrationfarm.jpg",
    description: "It is about 18:05s walk from the Main Gate, which is 1.51 km as estimated based on average walking speed of 5 km/h."
  },        

  "Staff Bangalows": {
    name: "Staff Bangalows",
    image: ".jpg",
    description: "These are the Staff Bangalows, their color is yellow on the map and their label or Legend is 31."
  },     

  "SRC Restaurant": {
    name: "SRC Restaurant",
    image: "srcrestaurant.jpg",
    description: "It is about 11:04s walk from the Main Gate, which is 0.92 km as estimated based on average walking speed of 5 km/h."
  },           

  "Sports Field": {
    name: "Sports Field",
    image: "field.jpeg",
    description: "It is about 11:47s walk from the Main Gate, which is 0.96 km as estimated based on average walking speed of 5 km/h."
  },           

  

  "Faculty of Art & Design": {
    name: "Faculty of Art & Design (FAD)",
    image: "fad.jpg",
    description: "This is the Faculty of Art & Design, It is Made up of Industrial Art Department and Fashion Design & Textile Department. It is about 15:25s walk from the Main Gate, which is 1.28 km as estimated based on average walking speed of 5 km/h."
  },    

   "V.C's Residence": {
    name: "V.C's Residence",
    image: "vc.jpg",
    description: "It is about 13:52s walk from the Main Gate, which is 1.12 km as estimated based on average walking speed of 5 km/h."
  },               

  "HTU Basic School": {
    name: "HTU Basic School",
    image: "htubasic.jpg",
    description: "It is about 13:56s walk from the Main Gate, which is 1.14 km as estimated based on average walking speed of 5 km/h."
  },

  "School of Business": {
    name: "School of Business",
    image: "busineessch.jpg",
    description: "It is about 18:27s walk from the Main Gate, which is 1.54 km as estimated based on average walking speed of 5 km/h."
  },  

  "Adaklu Hall (GETFUND HOSTEL)": {
    name: "Adaklu Hall (GETFUND HOSTEL)",
    image: "adaklu-hostel.jpg",
    description: "It is about 21:04s walk from the Main Gate, which is 1.76 km as estimated based on average walking speed of 5 km/h."
  },     

  "Basket / Volleyball Court": {
    name: "Basket / Volleyball Court",
    image: "bball.jpg",
    description: "It is about 23:03s walk from the Main Gate, which is 1.80 km as estimated based on average walking speed of 5 km/h."
  },       

  "HTU Clinic": {
    name: "HTU Clinic ",
    image: "clinic.jpeg",
    description: "This is HTU health facility. It is about 10:09s walk from the Main Gate, which is 0.45 km as estimated based on average walking speed of 5 km/h."
  },                                                      
};


// =====================
// ACTIVE + AUTO ZOOM
// =====================
function setActive(el, id)
 { if (active) active.classList.remove("active"); 
active = el; 
el.classList.add("active"); 

}


// =====================
// EVENTS FOR LOCATIONS
// =====================
Object.keys(locations).forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;

  // CLICK
 el.addEventListener("click", () => {
  triggerLocation(id);
});


  // TOOLTIP
  el.addEventListener("mousemove", e => {
    tooltip.style.display = "block";
    tooltip.style.left = e.pageX + 10 + "px";
    tooltip.style.top = e.pageY + 10 + "px";
    tooltip.innerText = locations[id].name;
  });

  el.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
  });
});


// =====================
// SEARCH SYSTEM
// =====================
searchBox.addEventListener("input", e => {
  const val = e.target.value.toLowerCase();

  Object.keys(locations).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    if (locations[id].name.toLowerCase().includes(val)) {
      el.style.opacity = "1";
    } else {
      el.style.opacity = "0.2";
    }
  });
});


// =====================
// NAVIGATION SYSTEM
// =====================
const homeBtn = document.getElementById("homeBtn");
const aboutBtn = document.getElementById("aboutBtn");
const modal = document.getElementById("aboutModal");
const closeModal = document.getElementById("closeModal");

homeBtn.onclick = () => {
  document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
  homeBtn.classList.add('active');
  document.getElementById("locationTitle").innerText = "Select a location";
  locationDescription.innerText = "Description will appear here.";
};

aboutBtn.onclick = () => {
  modal.style.display = "flex";
};

closeModal.onclick = () => modal.style.display = "none";

window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

function load360(imagePath) {
  pannellum.viewer('panorama', {
    type: 'equirectangular',
    panorama: imagePath,
    autoLoad: true
  });
}




// =====================
// LEGEND → LOCATION KEY MAP
// Maps each legend <li> text to the exact key used in the locations object
// and the SVG element ID
// =====================
const legendMap = [
  "Main Gate",
  "F.O Kwame Block (Main Administration)",
  "G.M Afeti Auditorium",
  "Asogli Block (V Block)",
  "GCB & ZENITH BANKS",
  "Nunya Library",
  "A.R Block",
  "Octagon",
  "Auto Bay",
  "Amatron Laboratory",
  "Mechanical Bay",
  "Solar Technology Application Resource Centre",
  "Agric Mechanical Shop",
  "Afese Block (Old Administration)",
  "Executive Restaurant",
  "Building Technology Lab",
  "Esther Nukulenu Demonstration Restaurant",
  "Graduate School",
  "Cafeteria",
  "HTM Resource Centre",
  "Beauty Saloon",
  "Fashion Block & HTM Practical Room",
  "Welding Workshop",
  "Carpentary Workshop",
  "Electrical Engineering Block",
  "Vodzi Hall (Central Male Hall)",
  "Volta Premier FM",
  "SRC JCR",
  "Acorlatse Hall(Central Female Hall)",
  "Demonstration Farm",
  "Staff Bangalows",
  "SRC Restaurant",
  "Sports Field",
  "Faculty of Art & Design",
  "V.C's Residence",
  "HTU Basic School",
  "School of Business",
  "Adaklu Hall (GETFUND HOSTEL)",
  "Basket / Volleyball Court",
  "HTU Clinic"
];


// =====================
// HELPER: TRIGGER A LOCATION (used by legend clicks, search enter)
// Loads 360, updates info panel, highlights SVG, zooms map,
// and on mobile scrolls to the map + panorama
// =====================
function triggerLocation(locationKey) {
  const loc = locations[locationKey];
  if (!loc) return;

  // Find the SVG element
  const el = document.getElementById(locationKey);

  // Highlight on map
  if (el) {
    setActive(el, locationKey);

    // Get the bounding box of the SVG element to zoom to it
    const svgEl = document.getElementById("Layer_1");
    const bbox = el.getBBox(); // SVG coordinates of this location

    // Get the map container dimensions
    const container = wrapper.parentElement.getBoundingClientRect();
    const containerW = container.width;
    const containerH = container.height;

    // Target scale — zoom in close enough to see the location
    const targetScale = 3;

    // Center of the location in SVG coordinates
    const locCenterX = bbox.x + bbox.width / 2;
    const locCenterY = bbox.y + bbox.height / 2;

    // Calculate translation to put that center in the middle of the container
    x = containerW / 2 - locCenterX * targetScale;
    y = containerH / 2 - locCenterY * targetScale;
    scale = targetScale;

    wrapper.style.transition = "transform 0.6s ease";
    updateTransform();
  }

  // Load 360 panorama
  load360(loc.image);

  // Update info panel
  document.getElementById("locationTitle").innerText = loc.name;
  locationDescription.innerHTML = `<p>${loc.description}</p>`;

  // On mobile: scroll to the map area then to the panorama
  if (window.innerWidth <= 768) {
    const mapEl = document.querySelector(".main");
    const panoramaEl = document.getElementById("panorama");
    if (mapEl) {
      setTimeout(() => {
        mapEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      setTimeout(() => {
        panoramaEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 800);
    }
  }
}


// =====================
// LEGEND CLICK HANDLERS
// Make every <li> in the legend clickable
// =====================
const legendItems = document.querySelectorAll("#legendList li");
legendItems.forEach((li, index) => {
  const locationKey = legendMap[index];
  if (!locationKey) return;

  // Style the legend item to look clickable
  li.style.cursor = "pointer";
  li.style.padding = "4px 2px";
  li.style.borderRadius = "4px";
  li.style.transition = "background 0.2s";

  li.addEventListener("mouseenter", () => {
    li.style.background = "rgba(255,255,255,0.15)";
  });
  li.addEventListener("mouseleave", () => {
    li.style.background = "transparent";
  });

  li.addEventListener("click", () => {
    // Highlight active legend item
    legendItems.forEach(item => item.style.fontWeight = "300");
    li.style.fontWeight = "700";

    triggerLocation(locationKey);
  });
});


// =====================
// SEARCH: ENTER KEY → AUTO ZOOM + DISMISS KEYBOARD
// =====================
searchBox.addEventListener("keydown", e => {
  if (e.key !== "Enter") return;

  // Dismiss mobile keyboard
  searchBox.blur();

  const val = searchBox.value.toLowerCase().trim();
  if (!val) return;

  // Find the first location that matches the search
  const matchedKey = Object.keys(locations).find(key =>
    locations[key].name.toLowerCase().includes(val)
  );

  if (matchedKey) {
    triggerLocation(matchedKey);

    // Reset opacity of all locations
    Object.keys(locations).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.opacity = "1";
    });
  }
});


// =====================
// TOUCH SUPPORT (PAN + PINCH ZOOM)
// =====================
let lastTouchDist = null;
let lastMidX = null;
let lastMidY = null;

wrapper.addEventListener("touchstart", e => {
  wrapper.style.transition = "none";

  if (e.touches.length === 1) {
    isDragging = true;
    lastTouchDist = null;
    startX = e.touches[0].clientX - x;
    startY = e.touches[0].clientY - y;

  } else if (e.touches.length === 2) {
    isDragging = false;
    lastTouchDist = null;
  }
}, { passive: false });

wrapper.addEventListener("touchmove", e => {
  e.preventDefault();

  if (e.touches.length === 1 && isDragging) {
    x = e.touches[0].clientX - startX;
    y = e.touches[0].clientY - startY;
    updateTransform();

  } else if (e.touches.length === 2) {
    const t0 = e.touches[0];
    const t1 = e.touches[1];

    const dx = t1.clientX - t0.clientX;
    const dy = t1.clientY - t0.clientY;
    const dist = Math.hypot(dx, dy);

    const midX = (t0.clientX + t1.clientX) / 2;
    const midY = (t0.clientY + t1.clientY) / 2;

    if (lastTouchDist !== null) {
      zoom(dist / lastTouchDist, midX, midY);
      x += midX - lastMidX;
      y += midY - lastMidY;
      updateTransform();
    }

    lastTouchDist = dist;
    lastMidX = midX;
    lastMidY = midY;
  }
}, { passive: false });

wrapper.addEventListener("touchend", e => {
  wrapper.style.transition = "transform 0.3s ease";

  if (e.touches.length === 0) {
    isDragging = false;
    lastTouchDist = null;

  } else if (e.touches.length === 1) {
    isDragging = true;
    lastTouchDist = null;
    startX = e.touches[0].clientX - x;
    startY = e.touches[0].clientY - y;
  }
});


// Example toggle
function toggleSidebar() {
  document.querySelector('.sidebar-left').classList.toggle('hidden');
}
