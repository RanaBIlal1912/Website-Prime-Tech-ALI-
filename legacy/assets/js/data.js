/* ====== CENTRAL DATA STORE (localStorage based) ====== */

const DEFAULT_DATA = {
  settings: {
    // GENERAL
    logo: "assets/img/logo.png",
    favicon: "assets/img/logo.png",
    siteTitle: "SecureNet IT & CCTV Solutions",
    footerText: "© 2026 SecureNet IT Solutions. All Rights Reserved.",
    companyDesc: "We deliver professional CCTV, networking, server and security solutions for homes and businesses across Pakistan.",

    // CONTACT
    whatsapp: "923001234567",
    phone: "+92 300 1234567",
    callNumber: "+923001234567",
    email: "info@securenet.com",
    address: "Office #12, IT Plaza, Bahawalpur, Punjab, Pakistan",
    mapEmbed: "https://www.google.com/maps?q=Bahawalpur&output=embed",

    // SOCIAL MEDIA
    social: {
      facebook: "",
      instagram: "",
      linkedin: "",
      youtube: "",
      tiktok: ""
    },

    // SEO
    seo: {
      metaTitle: "SecureNet IT & CCTV Solutions | Premium Security & Networking",
      metaDescription: "Professional CCTV installation, networking, server setup and IT security solutions for homes and businesses.",
      keywords: "CCTV installation, networking, server setup, security systems, IT solutions, Bahawalpur"
    },

    // THEME
    primaryColor: "#00aaff",
    secondaryColor: "#7b2ff7",
    accentColor: "#00ffc8",
    fontFamily: "'Segoe UI', sans-serif",
    buttonStyle: "rounded", // rounded | square | pill

    // HERO
    heroTitle: "Smart Security & IT Solutions for Your Business",
    heroSubtitle: "CCTV Installation • Networking • Server Setup • Hardware Sales & Support",
    heroBtnText: "Get Free Quote on WhatsApp",
    heroBtn2Text: "Request Site Survey",
    heroBgType: "video", // image | video | none
    heroBgImage: "assets/img/hero-poster.jpg",
    heroBgVideo: "assets/img/hero-bg.mp4",
    heroVideoEnabled: true,

    // HOMEPAGE TOGGLES
    showCounters: true,
    showBanner: true,
    showPopup: true
  },

  // TOP PROMO BANNER STRIP
  banners: [
    { id: 1, text: "🔥 Limited Offer: Free Site Survey for new CCTV installations this month!", btnText: "Claim Now", btnUrl: "contact.html", enabled: true }
  ],

  // POPUP / ANNOUNCEMENT SYSTEM
  popups: [
    {
      id: 1,
      title: "Get a Free Consultation!",
      desc: "Book a free site survey & consultation for CCTV, networking or server setup. Limited slots available this month.",
      image: "https://placehold.co/500x300/0a0a0f/00aaff?text=Free+Consultation",
      video: "",
      btnText: "Chat on WhatsApp",
      btnUrl: "whatsapp",
      startDate: "",
      endDate: "",
      enabled: true
    }
  ],

  // STATISTICS / COUNTERS
  statistics: [
    { id: 1, icon: "📹", value: 500, suffix: "+", label: "Projects Completed" },
    { id: 2, icon: "😀", value: 300, suffix: "+", label: "Happy Clients" },
    { id: 3, icon: "🏆", value: 8, suffix: "+", label: "Years Experience" },
    { id: 4, icon: "🛠️", value: 24, suffix: "/7", label: "Support Available" }
  ],

  services: [
    { id: 1, icon: "📹", image: "https://placehold.co/500x320/0a0a0f/00aaff?text=CCTV+Installation", title: "CCTV Camera Installation", desc: "Complete CCTV setup for homes, offices, shops & warehouses with night vision & remote viewing." },
    { id: 2, icon: "🌐", image: "https://placehold.co/500x320/0a0a0f/00aaff?text=Networking", title: "Networking & IT Infrastructure", desc: "Structured cabling, LAN/WAN setup, WiFi networks and enterprise-grade networking solutions." },
    { id: 3, icon: "🖥️", image: "https://placehold.co/500x320/0a0a0f/00aaff?text=Server+Setup", title: "Server Setup & Maintenance", desc: "Server installation, configuration, backup systems and ongoing maintenance support." },
    { id: 4, icon: "🔐", image: "https://placehold.co/500x320/0a0a0f/00aaff?text=Security+Systems", title: "Security Solutions", desc: "Biometric access control, alarm systems and integrated security solutions for your premises." },
    { id: 5, icon: "🛒", image: "https://placehold.co/500x320/0a0a0f/00aaff?text=Hardware+Sales", title: "Hardware Sales & Support", desc: "Genuine routers, switches, DVRs, cameras and IT hardware with after-sales support." },
    { id: 6, icon: "🛠️", image: "https://placehold.co/500x320/0a0a0f/00aaff?text=Maintenance", title: "Maintenance & AMC", desc: "Annual maintenance contracts for CCTV & networking systems with quick response time." }
  ],

  products: [
    {
      id: 1, name: "4MP Dome CCTV Camera", category: "CCTV Camera", price: "Rs. 5,500",
      img: "https://placehold.co/400x300/0a0a0f/00aaff?text=Dome+Camera",
      gallery: ["https://placehold.co/400x300/0a0a0f/00aaff?text=Dome+Camera+1", "https://placehold.co/400x300/0a0a0f/00aaff?text=Dome+Camera+2"],
      video: "",
      desc: "High resolution night vision dome camera, indoor/outdoor use.",
      specs: [ {key:"Resolution", value:"4MP / 2560x1440"}, {key:"Night Vision", value:"30m IR Range"}, {key:"Mount", value:"Indoor / Outdoor"} ],
      badge: "Best Seller",
      featured: true
    },
    {
      id: 2, name: "8 Channel DVR", category: "DVR", price: "Rs. 12,000",
      img: "https://placehold.co/400x300/0a0a0f/00aaff?text=DVR",
      gallery: ["https://placehold.co/400x300/0a0a0f/00aaff?text=DVR+1"],
      video: "",
      desc: "8 channel HD DVR with mobile app remote viewing support.",
      specs: [ {key:"Channels", value:"8"}, {key:"Resolution Support", value:"Up to 5MP"}, {key:"Storage", value:"Up to 10TB HDD"} ],
      badge: "New",
      featured: true
    },
    {
      id: 3, name: "Gigabit Network Switch", category: "Networking", price: "Rs. 7,000",
      img: "https://placehold.co/400x300/0a0a0f/00aaff?text=Switch",
      gallery: ["https://placehold.co/400x300/0a0a0f/00aaff?text=Switch+1"],
      video: "",
      desc: "24 port gigabit switch for enterprise networking setups.",
      specs: [ {key:"Ports", value:"24 x Gigabit"}, {key:"Throughput", value:"48 Gbps"}, {key:"Mounting", value:"Rack Mountable"} ],
      badge: "",
      featured: false
    },
    {
      id: 4, name: "Wireless Router AC1200", category: "Router", price: "Rs. 4,500",
      img: "https://placehold.co/400x300/0a0a0f/00aaff?text=Router",
      gallery: ["https://placehold.co/400x300/0a0a0f/00aaff?text=Router+1"],
      video: "",
      desc: "Dual band wireless router with strong coverage range.",
      specs: [ {key:"Speed", value:"AC1200 Dual Band"}, {key:"Antennas", value:"4 External"}, {key:"Ports", value:"4 LAN + 1 WAN"} ],
      badge: "Popular",
      featured: true
    }
  ],

  portfolio: [
    {
      id: 1, title: "Office CCTV Installation Project", desc: "Complete 16-camera CCTV setup with central monitoring for a corporate office.",
      img: "https://placehold.co/500x300/0a0a0f/00aaff?text=Project+1",
      gallery: ["https://placehold.co/500x300/0a0a0f/00aaff?text=Office+1", "https://placehold.co/500x300/0a0a0f/00aaff?text=Office+2"],
      youtube: "dQw4w9WgXcQ",
      beforeImg: "https://placehold.co/500x300/1a1a24/9a9aab?text=Before",
      afterImg: "https://placehold.co/500x300/0a0a0f/00aaff?text=After",
      client: "ABC Corporate Office",
      location: "Bahawalpur, Punjab"
    },
    {
      id: 2, title: "Warehouse Networking Setup", desc: "Structured cabling and enterprise networking for a logistics warehouse.",
      img: "https://placehold.co/500x300/0a0a0f/00aaff?text=Project+2",
      gallery: ["https://placehold.co/500x300/0a0a0f/00aaff?text=Warehouse+1"],
      youtube: "dQw4w9WgXcQ",
      beforeImg: "https://placehold.co/500x300/1a1a24/9a9aab?text=Before",
      afterImg: "https://placehold.co/500x300/0a0a0f/00aaff?text=After",
      client: "XYZ Logistics",
      location: "Multan, Punjab"
    },
    {
      id: 3, title: "School Security System", desc: "Full perimeter CCTV coverage and biometric access control for a school campus.",
      img: "https://placehold.co/500x300/0a0a0f/00aaff?text=Project+3",
      gallery: ["https://placehold.co/500x300/0a0a0f/00aaff?text=School+1"],
      youtube: "dQw4w9WgXcQ",
      beforeImg: "https://placehold.co/500x300/1a1a24/9a9aab?text=Before",
      afterImg: "https://placehold.co/500x300/0a0a0f/00aaff?text=After",
      client: "Greenfield School",
      location: "Bahawalpur, Punjab"
    }
  ],

  testimonials: [
    { id: 1, type: "text", name: "Ahmed Raza", image: "https://placehold.co/100x100/0a0a0f/00aaff?text=AR", video: "", text: "Excellent CCTV installation service. Very professional team and quick response." },
    { id: 2, type: "text", name: "Bilal Khan", image: "https://placehold.co/100x100/0a0a0f/00aaff?text=BK", video: "", text: "They set up our entire office network. Great quality work and fair pricing." },
    { id: 3, type: "video", name: "Sara Malik", image: "https://placehold.co/100x100/0a0a0f/00aaff?text=SM", video: "dQw4w9WgXcQ", text: "Highly recommended for security solutions. Very reliable after-sales support." }
  ],

  // MEDIA LIBRARY
  media: []
};

const STORE_KEY = "itsec_site_data";

/* Deep merge: fills missing keys from default into existing data, recursively for plain objects */
function deepMerge(target, source) {
  for (const key in source) {
    if (!(key in target)) {
      target[key] = JSON.parse(JSON.stringify(source[key]));
    } else if (
      typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key]) &&
      typeof target[key] === 'object' && target[key] !== null && !Array.isArray(target[key])
    ) {
      deepMerge(target[key], source[key]);
    }
  }
  return target;
}

function getData() {
  let data = localStorage.getItem(STORE_KEY);
  if (!data) {
    localStorage.setItem(STORE_KEY, JSON.stringify(DEFAULT_DATA));
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
  let parsed = JSON.parse(data);
  parsed = deepMerge(parsed, DEFAULT_DATA);
  return parsed;
}

function saveData(data) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    alert("Storage full! Please delete some media files from Media Library to free up space.");
    return false;
  }
}

function resetData() {
  localStorage.setItem(STORE_KEY, JSON.stringify(DEFAULT_DATA));
}
