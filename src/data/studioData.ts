import { ServiceItem, ReviewItem, BentoItem, PartnerItem } from '../types';
import kenyanHouseLandscapeImg from '../assets/images/kenyan_house_landscape_1780570586379.png';
import kenyanHousePortraitImg from '../assets/images/kenyan_house_portrait_1780570605897.png';
import englishPointLandscapeImg from '../assets/images/english_point_user_landscape_1780571382886.png';
import englishPointPortraitImg from '../assets/images/english_point_user_portrait_1780571401782.png';

export const STUDIO_SERVICES: ServiceItem[] = [
  {
    id: "residential-atelier",
    title: "Atelier Residential",
    subtitle: "Architecting Environments for High-Performance Living",
    shortDescription: "Bespoke residential estates designed around quiet luxury, physical flow, and uncompromised craftsmanship. Made for coastal villas and private high-end sanctuaries.",
    image: kenyanHouseLandscapeImg,
    filmstripImage: kenyanHousePortraitImg,
    subServices: [
      { name: "Spatially Optimized Interior Architecture", description: "Re-engineering internal load-bearing structures to maximize visual sightlines and marine air flow paths." },
      { name: "Custom Millwork & Material Craft", description: "Bespoke cabinetry, architectural timber columns, and premium imported Italian marble integration." },
      { name: "Curated Lighting & Circadian Layouts", description: "Precision light levels crafted to transition smoothly across diurnal coastal Cycles." }
    ],
    solutionStory: {
      heading: "Evolving the Coastline Villa: From Structure to Living Sculpture",
      paragraphs: [
        "In the realm of high-end private residential design along the Kenyan Coast, a home is far more than shelter — it is an extension of psychological and physical well-being. We collaborate with clients to re-architect existing geometries, sculpting spaces that evoke immediate tranquility upon entry.",
        "By utilizing raw earth tones, monolithic limestone blocks, and fine sand-textured plaster, we create custom spaces that stay cool, respond elegantly to natural sea lighting, and celebrate absolute purity of form."
      ]
    },
    processSteps: [
      { number: "01", title: "Spatial Audit & Visioning", description: "An exhaustive analysis of your physical site, studying light orientation, local coastal wind paths, and your lifestyle rhythm." },
      { number: "02", title: "Schematic Hand-Drafting", description: "We avoid generic building software early on. Handdrawn sketches isolate pure form, tactile textures, and spatial flows." },
      { number: "03", title: "Global Sourcing Curations", description: "Direct procurement loops with premium stone, fabric, and handblown light ateliers across Italy, France, and local Kenyan master carvers." },
      { number: "04", title: "Elite Site Manifestation", description: "Our workers supervise every millimeter of execution, guaranteeing matching tolerances and a perfect editorial handover." }
    ]
  },
  {
    id: "commercial-hospitality",
    title: "Commercial & Hospitality",
    subtitle: "Environments Structured for Strategic Enterprise Success",
    shortDescription: "Translating corporate authority and elite hospitality into highly-tailored physical space, fostering brand alignment and optimized team productivity.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=90&w=900&h=1600",
    filmstripImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=90&w=900&h=1600",
    subServices: [
      { name: "Strategic Workplace Blueprinting", description: "Acoustical isolation, ergonomic planning, and hybrid layouts designed to maximize high-level focus and seamless interactions." },
      { name: "Boutique Hospitality Lounges", description: "Translating luxury brand values into welcoming hotel common spaces, exclusive bars, and premier retail spaces." },
      { name: "Acoustic and Sensory Engineering", description: "Active control over sound reflections, tactile materials, and signature brand scents to curate guest responses." }
    ],
    solutionStory: {
      heading: "Architecting the Corporate Sanctuary",
      paragraphs: [
        "The modern office is not merely about density; it is about cognitive clarity and quiet authority. Our commercial practice strips away clutter, creating boardroom suites and collaborative lounges that represent strength and forward vision.",
        "We combine state-of-the-art materials like acoustic felt paneling with premium local basalt and mahogany detailing. The result is a series of workspaces that command professional respect while encouraging open intellectual collaboration."
      ]
    },
    processSteps: [
      { number: "01", title: "Operational Audit", description: "Understanding client journey touchpoints, employee work behaviors, and the specific brand narrative requiring expression." },
      { number: "02", title: "Sensory Workspace Prototyping", description: "Acoustic modeling and custom light maps ensure that executive suites achieve sound secrecy and visual comfort." },
      { number: "03", title: "Toleranced Material Specification", description: "Selecting heavy commercial-grade textiles and structural finishes that withstand high-load use without losing elegant visual prestige." },
      { number: "04", title: "Constructive Integration", description: "Working alongside engineering firms to seamlessly overlay security, HVAC, and wiring behind gorgeous custom cladding." }
    ]
  },
  {
    id: "yacht-exterior-styling",
    title: "Curated Yacht & Exterior",
    subtitle: "Systemic Coastal Elegance & Marine Yacht Styling",
    shortDescription: "Marine-grade luxury appointments engineered to withstand coastal elements. We craft exceptional outdoor pool pavilions, private yacht cabins, and oceanfront bars.",
    image: englishPointLandscapeImg,
    filmstripImage: englishPointPortraitImg,
    subServices: [
      { name: "Marine-Grade Structural Detailing", description: "Atmospheric weatherproofing, anti-corrosive metals, and UV-reflective luxury fabrics." },
      { name: "Private Yacht & Deck Interiors", description: "Translating space restrictions inside megayachts into expansive, breathtaking suites." },
      { name: "Oceanfront Outdoor Pavilions", description: "Infinity pool decks and sheltered coastal dining clusters that transition seamlessly with the beach horizon." }
    ],
    solutionStory: {
      heading: "Unrestricted Horizon Views, Weather-Proofed Elegance",
      paragraphs: [
        "Designing for sea atmospheres demands deep mechanical comprehension of maritime elements. Wood must expand safely; steel must remain completely passive against saltwater; and layouts must survive changes in ocean motion.",
        "We rely on ancient premium Burmese Teak and custom marine-grade aluminum alloys to sculpt outdoor furnishings and yacht decks that hold their editorial form for decades."
      ]
    },
    processSteps: [
      { number: "01", title: "Atmospheric Assessment", description: "Studying salt mist intensity, UV indices, and microclimates of your open yacht deck or seaside location." },
      { number: "02", title: "Maritime Material Analysis", description: "Double-testing fabric performance and selecting high-performance timber blocks resistant to maritime elements." },
      { number: "03", title: "Ergonomic Balance CADs", description: "Perfecting custom weight distribution on ship decks and ensuring seating profiles adjust to ocean-grade dynamics smoothly." },
      { number: "04", title: "Precision Dockside Handover", description: "Marine fitting completed by specialized dockside craftsmen, delivering a smooth, high-sheen editorial finish." }
    ]
  },
  {
    id: "botanical-landscape",
    title: "Bespoke Landscaping",
    subtitle: "The Sacred Symmetry of Organic Natural Forms",
    shortDescription: "Blending mineral structures, water dynamics, and curated tropical botanical compositions to establish architectural modern sanctuaries.",
    image: englishPointLandscapeImg,
    filmstripImage: englishPointPortraitImg,
    subServices: [
      { name: "Modern Courtyard & Mineral Paths", description: "Symmetrical stone blocks, sand raking fields, and architectural gravel pathways." },
      { name: "Architectural Pool & Water Feats", description: "Subtle stone-face waterfalls, silent flow channels, and integrated infinity-edge swimming spaces." },
      { name: "Arid-Modern Coastal Floristics", description: "Curating hardy local succulents, dramatic frangipani trees, and structural palms." }
    ],
    solutionStory: {
      heading: "Sculpting the Living Interface",
      paragraphs: [
        "A landscape is the gateway that bridges high-end structural architecture with the vastness of the Kenyan coast. We treat gardens as living galleries, placing monumental volcanic boulders alongside pure reflecting pools.",
        "Light, shadow, and moisture are designed to construct rich botanical zones that are low in water consumption but exceptionally rich in deep-contrast shadow-casting forms."
      ]
    },
    processSteps: [
      { number: "01", title: "Floristic & Soil Audits", description: "Studying local sandy soil salt levels, groundwater availability, and solar radiation hours." },
      { number: "02", title: "Botanical Layer Charting", description: "Drafting micro-climatic clusters of plants based on varying shadows cast by the main building wings." },
      { number: "03", title: "Quarry Monolithic Hunt", description: "Hand-picking specific structural stones and pristine frangipani wood shapes directly from central and coastal quarries." },
      { number: "04", title: "Landscape Sculpting", description: "Supervising soil grading, premium water flow systems, and precise stone alignments for perfect natural reflections." }
    ]
  }
];

export const WHY_US_METRICS = [
  {
    id: "m-01",
    value: 70000,
    prefix: "OVER ",
    suffix: " +",
    label: "Materials Sourced",
    vision: "70,000+ Materials: Unrestricted by local supply limits, we source the exceptional globally."
  },
  {
    id: "m-02",
    value: 145,
    prefix: "",
    suffix: "",
    label: "Coastal Villas Realized",
    vision: "145 Coastal Sanctuaries: High-performance structural layouts built to survive maritime elements."
  },
  {
    id: "m-03",
    value: 12,
    prefix: "TOP ",
    suffix: "",
    label: "Design Accolades",
    vision: "12 Architectural Awards: Validating our commitment to monochrome luxury, proportion, and weight."
  }
];

export const KENYAN_PARTNERS: PartnerItem[] = [
  { name: "Rubis", logoText: "RUBIS ENERGY KENYA", originalColor: "#E21B23" },
  { name: "Refinery", logoText: "REFINERY GROOMING", originalColor: "#1A1A1A" },
  { name: "Roche", logoText: "ROCHE", originalColor: "#0066CC" },
  { name: "Rabobank", logoText: "RABOBANK", originalColor: "#FF5F00" },
  { name: "HassConsult", logoText: "HASSCONSULT REAL ESTATE", originalColor: "#8C7B5D" },
  { name: "KenolKobil", logoText: "KENOLKOBIL", originalColor: "#2563EB" },
  { name: "Executive Healthcare", logoText: "EXECUTIVE HEALTHCARE", originalColor: "#0284C7" },
  { name: "AstraZeneca", logoText: "ASTRAZENECA", originalColor: "#81007F" }
];

export const CLIENT_REVIEWS: ReviewItem[] = [
  {
    text: "The structural layout Wamled designed for our Diani villa has completely changed our family dynamic. The flow of daylight and continuous coastal breeze feels like a living hotel gallery.",
    author: "Almasi M. G.",
    title: "Oceanfront Villa Owner, Diani",
    rating: 5
  },
  {
    text: "Wamled brought a tier of structural precision to our hotel lounge that we simply had not found elsewhere in East Africa. Every stone seam, timber column, and light level is perfect.",
    author: "Zuri Resorts Ltd.",
    title: "Managing Director, Nyali Marina",
    rating: 5
  },
  {
    text: "Their monochrome concept and raw textures provide an immediate calm. Customers enter our boutique lobby and are instantly captivated by the quiet luxury of the custom marble slab desk.",
    author: "Elena Mwangi",
    title: "Founder, Luxe Living Hub",
    rating: 5
  }
];

export const BENTO_GALLERY: BentoItem[] = [
  {
    id: "b-01",
    title: "Symmetrical Nyali Pavilion",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=85&w=800&h=1000"
  },
  {
    id: "b-02",
    title: "Marine Lounge Deck",
    category: "Exterior",
    image: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&q=85&w=800&h=1000"
  },
  {
    id: "b-03",
    title: "Charcoal Slate Executive Room",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=85&w=800&h=1000"
  },
  {
    id: "b-04",
    title: "English Point Landscape & Boardwalk",
    category: "Landscaping",
    image: englishPointPortraitImg
  }
];
