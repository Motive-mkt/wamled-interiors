import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  X,
  Compass,
  Layout,
  Palette,
  Sofa,
  Wrench,
  Network,
  Lightbulb,
  Cpu,
  Layers,
  TrendingUp,
  Columns,
  DoorOpen,
  Grid,
  Square,
  Paintbrush,
  Bath,
  Home,
  Trees,
  HeartPulse,
  MapPin,
  Dumbbell,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  BadgeAlert,
  FolderOpen,
  TrendingDown,
  LineChart,
  Target,
  Globe,
  Waves
} from 'lucide-react';
import kenyanHousePortraitImg from '../assets/images/kenyan_house_portrait_1780570605897.png';
import kenyanHouseLandscapeImg from '../assets/images/kenyan_house_landscape_1780570586379.png';
import englishPointLandscapeImg from '../assets/images/english_point_user_landscape_1780571382886.png';
import englishPointPortraitImg from '../assets/images/english_point_user_portrait_1780571401782.png';
import luxuryYachtMarinaImg from '../assets/images/luxury_yacht_marina_1780574263644.png';

interface SubServiceItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  images: string[]; // 3 high-resolution 9:16 images representing built works
  description: string;
  specifications: string[];
  coastalTolerance: string;
}

interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  focus: string;
  accent: string;
  items: SubServiceItem[];
}

const CATEGORIES_DATA: ServiceCategory[] = [
  {
    id: "project-positioning",
    title: "1. Project Positioning",
    focus: "Strategic alignment and market placement.",
    accent: "gold",
    description: "Aligning architectural visions with commercial values, regional cultures, and operational requirements.",
    items: [
      {
        id: "consumer-positioning",
        name: "Consumer Positioning",
        icon: Target,
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=95&w=640&h=1140",
          kenyanHousePortraitImg
        ],
        description: "Designing specifically for elite target demographics, understanding user journeys, and structuring spaces for ultimate custom comfort.",
        specifications: [
          "Detailed target audience user flow planning",
          "Demographic lifestyle and spatial sync matrices",
          "Acoustic and kinetic envelope privacy design",
          "High-end bespoke wellness zoning mapping"
        ],
        coastalTolerance: "High air circulation paths specifically integrated for coastal tropical heat adaptation."
      },
      {
        id: "cultural-positioning",
        name: "Cultural Positioning",
        icon: Globe,
        images: [
          "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=95&w=640&h=1140",
          englishPointPortraitImg
        ],
        description: "Fusing Swahili-modern accents, local hand-carved heritage details, and global minimalist styles seamlessly.",
        specifications: [
          "Native timber lattices and structural carvings research",
          "Local materials sourcing (such as authentic Kenyan Galana stone)",
          "Spatially-integrated traditional Swahili stucco techniques",
          "Contemporary international layout structural frameworks"
        ],
        coastalTolerance: "Saltwater-safe mineral lime plasters protecting structures against salty humidity."
      },
      {
        id: "investment-positioning",
        name: "Investment Positioning",
        icon: LineChart,
        images: [
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Strategic real estate asset optimization, framing luxury value components, and minimizing long-term weather degradation costs.",
        specifications: [
          "Premium finish lifecycle analysis",
          "High durability structural investment calculations",
          "Passive solar warming and natural cooling designs",
          "Maintenance exposure architectural evaluations"
        ],
        coastalTolerance: "Corrosion-resistant steel framing design to shield investment from oceanward rust."
      },
      {
        id: "functional-positioning",
        name: "Functional Positioning",
        icon: Layout,
        images: [
          "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Optimizing room hierarchies, planning clean work zones, and ensuring intuitive transit across elite properties.",
        specifications: [
          "Dynamic service-versus-guest movement charts",
          "Custom multi-purpose modular furniture planning",
          "Integrated sound insulation structures design",
          "Discrete service delivery corridors"
        ],
        coastalTolerance: "Moisture-purging horizontal framing layout lines to avoid humid air traps."
      },
      {
        id: "surround-positioning",
        name: "Surround Positioning",
        icon: Compass,
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=95&w=640&h=1140",
          luxuryYachtMarinaImg
        ],
        description: "Mapping beautiful landscape vistas, tracking path views dynamically, and syncing environments with natural sea breeze directions.",
        specifications: [
          "Solar path dynamic alignment calculations",
          "Prevailing trade-winds cross-breeze channelings",
          "Landscape horizon framing structure planning",
          "Adaptive shoreline physical elevation profiles"
        ],
        coastalTolerance: "Double-layered defense structures guarding against coastal storm winds."
      },
      {
        id: "facility-positioning",
        name: "Facility Positioning",
        icon: Grid,
        images: [
          "https://images.unsplash.com/photo-1600334089648-b0a9dc5978f2?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Orchestrating high-end private wellness saunas, advanced gym rooms, pool structures, and luxury multi-car garages.",
        specifications: [
          "Resort-grade thermal systems coordination",
          "Advanced ventilation systems for closed spaces",
          "Structured high load floor foundations",
          "Smart access and lighting control hubs"
        ],
        coastalTolerance: "Hermetically sealed utility nodes keeping saltwater fog completely isolated."
      }
    ]
  },
  {
    id: "architectural-interior",
    title: "2. Architectural & Interior Design",
    focus: "Master planning and the project’s visual soul.",
    accent: "gold",
    description: "Creating comprehensive visual codes and dynamic choreography within seaside residences.",
    items: [
      {
        id: "circulation-design",
        name: "Circulation Design",
        icon: Compass,
        images: [
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Mapping the spatial choreography, visual vistas, and elegant flow of air and people within premium high-wall estates.",
        specifications: [
         "Optimized trade-wind cross-ventilation mapping",
          "Acoustic threshold buffers between public & private wings",
          "Double-height grand portico entrance-ways",
          "Visual horizon framing alignments"
        ],
        coastalTolerance: "High air-flow architectural design engineered to resist moisture traps."
      },
      {
        id: "functional-design",
        name: "Functional Design",
        icon: Layout,
        images: [
          "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Bespoke spatial mapping and modular floor plans designed with high adaptive flexibility and proportional balance.",
        specifications: [
          "Micro-zoned climatic solar path orientation",
          "High load-bearing column placements with hidden shear walls",
          "Wet & dry luxury culinary kitchens separation",
          "Discrete service circulation corridors"
        ],
        coastalTolerance: "Resilient open-pavilion structure layouts engineered for tropical weather shifts."
      },
      {
        id: "style-design",
        name: "Style Design",
        icon: Palette,
        images: [
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Curating a prestigious vocabulary of earth-tone coral rendering, local timber lattice-work, and neutral high-texture palettes.",
        specifications: [
          "Authentic Swahili-moderne accents",
          "Fine hand-pressed lime stucco coatings",
          "Solid premium mahogany and teak styling integration",
          "Reflective polished screed stone floors"
        ],
        coastalTolerance: "Saltwater-safe mineral lime plaster finishes and sun-bleach resistant timber stain."
      },
      {
        id: "ffe-design",
        name: "FF&E Design",
        icon: Sofa,
        images: [
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Procuring and curating solid luxury items, custom metal accessories, and fabrics tailored for severe oceanside humidity.",
        specifications: [
          "Certified Grade-A solid teak frame upholstery",
          "Marine-grade custom coated steel hardware specs",
          "UV-stabilized luxury outdoor textiles",
          "Curated designer lighting & sculpture placement"
        ],
        coastalTolerance: "100% rustproof and mold-resistant chemical thread treatments."
      }
    ]
  },
  {
    id: "specialty-design",
    title: "3. Specialty Design",
    focus: "Highly advanced architectural elements.",
    accent: "gold",
    description: "Integrating technical complexity with elite-level visual execution across resort landscapes.",
    items: [
      {
        id: "mep-solution",
        name: "MEP Solution",
        icon: Wrench,
        images: [
          "https://images.unsplash.com/photo-1558224494-ef18a4573b2c?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Corrosion-armored Mechanical, Electrical, Plumbing and HVAC setups engineered for seaside atmospheric salts.",
        specifications: [
          "High thermal performance variable volume cooling",
          "Double-shielded electrical line conduits",
          "Integrated marine water filtration integration",
          "Bespoke horizontal drainage escape layouts"
        ],
        coastalTolerance: "Specially coated aluminum condenser fins to combat humid salt air oxidation."
      },
      {
        id: "swimming-pool",
        name: "Swimming Pool",
        icon: Waves,
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Infinity edges, monolithic natural stone basin frames, and advanced structural underwater lighting profiles.",
        specifications: [
          "Non-porous solid stone coping finishes",
          "Hidden perimeter overflows and silent channels",
          "Low voltage micro-recessed underwater LEDs",
          "Saltwater chlorination processing equipment"
        ],
        coastalTolerance: "High seismic resistance pool foundation structures withstanding coastal sand drift."
      },
      {
        id: "elv-it-system",
        name: "ELV & IT System",
        icon: Network,
        images: [
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Extra Low Voltage cabling, enterprise-grade unified Wi-Fi 7 covers, and remote biome smart property gates.",
        specifications: [
          "Seaside IP67 weather-hardened camera sensors",
          "Smart unified server rack thermal management",
          "Biometric fingerprint property entrance gates",
          "Low loss fiber-optic connection lines"
        ],
        coastalTolerance: "Hermetically isolated communication conduits guarding nodes against coastal dust."
      },
      {
        id: "lighting-system",
        name: "Lighting System",
        icon: Lightbulb,
        images: [
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1565538810844-1e119faf1117?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Dynamic warm-to-dim automation, low-glare dark-light modules, and integrated outdoor landscape highlights.",
        specifications: [
          "DALI master control dynamic preset programming",
          "Warm-dim chips matching ocean sunset colors",
          "Low-glare deep recessed ceiling mounts",
          "High color fidelity rendering indices (CRI 98+)"
        ],
        coastalTolerance: "Anodized powder-finished architectural housings with IP66 dust & water ratings."
      },
      {
        id: "kitchen-laundry",
        name: "Kitchen & Laundry",
        icon: Cpu,
        images: [
          "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1565183997392-2f6f122e5912?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Bespoke professional cooking zones, heavy grade brushed AISI 316 steel setups, and low moisture noise extraction systems.",
        specifications: [
          "Premium grade brushed stainless steel counter frames",
          "Integrated prep sink disposal blocks",
          "Professional range extraction hoods",
          "High thermal moisture removal laundry enclosures"
        ],
        coastalTolerance: "Corrosion-proof mechanical grade steel hardware protecting electronic relays."
      },
      {
        id: "signage-wayfinding",
        name: "Signage & Wayfinding",
        icon: MapPin,
        images: [
          "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Architectural property directional milestones, solid brass details, and background led signage plaques.",
        specifications: [
          "Matte treated marine brass lettering arrays",
          "Raw carved coral milestone orientation blocks",
          "Dampness-isolated internal LED lighting setups",
          "Architectural entrance gate lettering"
        ],
        coastalTolerance: "UV-shielded outdoor metal lacquers and moisture-impermeable internal modules."
      },
      {
        id: "landscape",
        name: "Landscape",
        icon: Trees,
        images: [
          englishPointPortraitImg,
          englishPointLandscapeImg,
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Lush tropical shoreline architecture featuring salt-tolerant palms, beachfront concrete fire pits, and stone garden rails.",
        specifications: [
          "Locally source limestone dry stone retaining walls",
          "Salt air adapted shoreline palm plant screens",
          "Integrated natural stone beachfront gas fire bowls",
          "Climatic sub-surface drip hydration channels"
        ],
        coastalTolerance: "Highly adapted local organic root system plans protecting coastlines."
      },
      {
        id: "artwork",
        name: "Artwork",
        icon: Paintbrush,
        images: [
          "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Curating elite local limestone installations, authentic clay ceramics, and premium moisture insulated master canvases.",
        specifications: [
          "Solid raw marble foundational sculpture plinths",
          "Original hand-thrown local clay pottery arrays",
          "Architectural woven palm wall art displays",
          "UV-shielded heavy non-reflective museum framing"
        ],
        coastalTolerance: "Acid-free rear framing seals protecting fine artwork against salty sea fog."
      }
    ]
  },
  {
    id: "product-application",
    title: "4. Product & Application Design",
    focus: "Tactile surface solutions & functional products.",
    accent: "gold",
    description: "Pre-engineered structural glass, metal fixtures, and customized products crafted to endure extreme weathering.",
    items: [
      {
        id: "curtain-wall-facade",
        name: "Curtain Wall and Facade",
        icon: Layers,
        images: [
          kenyanHousePortraitImg,
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Structural double-glazed glass skins engineered to withstand severe shorefront wind pressures.",
        specifications: [
          "Low-emissivity double-insulated laminated glass",
          "High thermal separation support profiles",
          "Melt-resistant heavy polymer structural seals",
          "Slick frameless seamless glass junctions"
        ],
        coastalTolerance: "Grade C5 severe marine wind pressure profile tolerance calculations."
      },
      {
        id: "steel-structure",
        name: "Steel Structure",
        icon: Columns,
        images: [
          kenyanHousePortraitImg,
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Galvanized heavy steel supporting columns, architectural canopy frameworks, and seamless structural spans.",
        specifications: [
          "Hot-dip galvanized primary metal beams",
          "Corrosion-combating dual composite marine paint layers",
          "Premium SS316 certified connection bolts",
          "Pre-stressed architectural cantilever geometry codes"
        ],
        coastalTolerance: "High seismic resistance and anti-chemical saltwater structural paint specs."
      },
      {
        id: "balustrade-staircase",
        name: "Balustrade & Staircase",
        icon: TrendingUp,
        images: [
          "https://images.unsplash.com/photo-1562438668-bcf32c77934c?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Laminated glass safety railings, solid satin SS316 hand rail pipes, and integrated stair treads.",
        specifications: [
          "Laminated structurally-reinforced glass (15mm+ thickness)",
          "Marine-grade satin finished solid SS316 handrail rods",
          "Concealed heavy anchor base-plates in concrete",
          "Solid timber tread integrations with non-slip flush brass inlays"
        ],
        coastalTolerance: "Fingerprint and salty mist proof satin-brushed raw steel finishing panels."
      },
      {
        id: "canopy-partition",
        name: "Canopy & Partition",
        icon: Columns,
        images: [
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Overhang shade canopies, wooden screening systems, and acoustically isolated internal partitions.",
        specifications: [
          "Anodized louvred solar shading structures",
          "Highly durable oil-finished tropical timber screens",
          "High stability sound attenuation internal dividers",
          "Tempered matte satin glass separating partitions"
        ],
        coastalTolerance: "UV-protected organic coatings resisting sun-bleaching and mold."
      },
      {
        id: "furniture",
        name: "Furniture",
        icon: Sofa,
        images: [
          "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Bespoke couches, custom solid local timber credenzas, and high-performance weather-safe poolside outdoor loungers.",
        specifications: [
          "Double-density inner structural foam inserts",
          "Fine loose weave linen linen upholstery fabric slots",
          "Hand-rubbed organic natural teak oil wood treatments",
          "Custom matching metal accents in marine brass"
        ],
        coastalTolerance: "Saltwater-and-rainwater safe breathable structures avoiding damp build-up."
      },
      {
        id: "lights",
        name: "Lights",
        icon: Lightbulb,
        images: [
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1565538810844-1e119faf1117?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Bespoke structural light columns, decorative brass lanterns, and dimmable interior spotlight modules.",
        specifications: [
          "Solid cast marine brass light structures",
          "IP65 waterproof outdoor spotlights and pillars",
          "Integrated warm LED dim-to-glow fixtures",
          "Anti-glare structure rings to support raw optics"
        ],
        coastalTolerance: "100% saltwater non-oxidizing solid brass and glass light frameworks."
      },
      {
        id: "window-door",
        name: "Window & Door",
        icon: DoorOpen,
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Heavy multi-lock sliding glass panes that collapse completely, blending outdoor living with dry home sanctuaries.",
        specifications: [
          "Structural grade custom aluminum frames",
          "Secluded double gaskets avoiding sea storm drafts",
          "Sub-level integrated water run-off drain pathways",
          "Heavy-duty multi-point frame lock systems"
        ],
        coastalTolerance: "Self-cleaning nylon frame track slides designed to clear sea sand."
      },
      {
        id: "sanitary-ware",
        name: "Sanitary Ware",
        icon: Bath,
        images: [
          luxuryYachtMarinaImg,
          "https://images.unsplash.com/photo-1600566752239-1718f0752881?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Bespoke river-stone carved soaking tubs, brushed gold water mixers, and continuous stone basin countertops.",
        specifications: [
          "Carved natural stone freestanding tubs",
          "Brushed precious gold double thermostatic mixer sets",
          "Seamless micro-cement bathroom floor contours",
          "High drainage speed integrated odor blocks"
        ],
        coastalTolerance: "Severe scale resistance interior cartridges resistant to high mineral ground wells."
      }
    ]
  }
];

export const BespokeServices: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<SubServiceItem | null>(null);
  const [parentCategoryTitle, setParentCategoryTitle] = useState<string>('');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [contactOpen, setContactOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  const openServiceModal = (item: SubServiceItem, catTitle: string) => {
    setSelectedItem(item);
    setParentCategoryTitle(catTitle);
    setFormStatus('idle');
    setFormData({
      name: '',
      phone: '',
      email: '',
      notes: ''
    });
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      await addDoc(collection(db, 'leads'), {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        details: selectedItem 
          ? `Inquiry on Bespoke Service: ${selectedItem.name} under ${parentCategoryTitle}. Notes: ${formData.notes}`
          : `General consultation from Bespoke page. Notes: ${formData.notes}`,
        projectType: parentCategoryTitle || 'General Bespoke Consultation',
        status: 'New',
        source: 'bespoke-services-catalog-page',
        createdAt: new Date().toISOString()
      });
      setFormStatus('success');
      setFormData({ name: '', phone: '', email: '', notes: '' });
    } catch (err) {
      console.error("Error writing leads document:", err);
      setFormStatus('idle');
    }
  };

  const triggerWhatsAppInquiry = () => {
    const serviceString = selectedItem ? `[${selectedItem.name}]` : "Bespoke Services Ecosystem";
    const cleanText = encodeURIComponent(
      `Hello Wamled Atelier, I would like to inquire about your ${serviceString} for my elite architectural project.`
    );
    window.open(`https://wa.me/254723758595?text=${cleanText}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1A1A1A] pt-32 pb-24 relative overflow-x-hidden">
      {/* Background elegant lighting blur grid */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#A83F1B]/3 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#C5A059]/3 rounded-full blur-[160px] pointer-events-none" />

      {/* 1. The Header: Authority & Context */}
      <div className="max-w-4xl mx-auto px-6 mb-24 text-center space-y-8">
        <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-white border border-[#F0F0F0] backdrop-blur-md rounded-full shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-[pulse_2s_infinite]" />
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#1A1A1A]/70 font-mono font-semibold">
            Bespoke Architecture Catalog
          </span>
        </div>
        
        {/* Large, elegant Serif headline */}
        <h1 className="text-4xl md:text-6xl font-serif font-light tracking-tight text-[#1A1A1A] leading-tight">
          Our Expertise: <span className="italic block mt-1">A Comprehensive Design Ecosystem</span>
        </h1>
        
        {/* Small, justified paragraph explaining holistic design capabilities */}
        <p className="max-w-2xl mx-auto text-xs md:text-sm text-[#333333] font-sans tracking-wide leading-relaxed text-justify md:text-center pt-2">
          From strategic consumer and investment positioning to custom architectural layouts, advanced MEP engineering, and resilient product applications, we orchestrate every layer of premium real estate. Our synchronized workflow ensures absolute design excellence at both micro and macro levels.
        </p>

        <div className="flex justify-center items-center gap-6 pt-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#C5A059] hover:text-[#1A1A1A] transition-colors uppercase font-bold"
          >
            <ArrowLeft size={11} />
            STUDIO HOMEPAGE
          </Link>
          <span className="text-[#1A1A1A]/20 font-light">//</span>
          <Link 
            to="/filmstrip" 
            className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#C5A059] hover:text-[#1A1A1A] transition-colors uppercase font-bold"
          >
            DISCOVERY GALLERY
            <ArrowRight size={11} />
          </Link>
        </div>
      </div>

      {/* 2. The Grid Structure (Categorized by Pillar) */}
      <div className="max-w-7xl mx-auto px-6 space-y-28 relative z-10">
        {CATEGORIES_DATA.map((category, catIdx) => (
          <div key={category.id} className="space-y-10 border-b border-[#F0F0F0] pb-20 last:border-0 last:pb-0">
            
            {/* Category Title in Large Serif & Subtext */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-[#F0F0F0]">
              <div className="space-y-1.5 text-left max-w-2xl">
                <span className="font-mono text-xs text-[#C5A059] font-bold tracking-widest block uppercase">
                  Pillar 0{catIdx + 1}
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-[#1A1A1A] tracking-tight">
                  {category.title}
                </h2>
                <p className="text-xs text-[#333333]/70 font-sans tracking-wide leading-relaxed">
                  {category.description}
                </p>
              </div>
              <div className="text-left md:text-right hidden sm:block shrink-0">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold block">
                  FOCUS AREA
                </span>
                <span className="text-xs font-sans text-[#333333] font-medium italic block">
                  {category.focus}
                </span>
              </div>
            </div>

            {/* ServiceGrid Component Realization: 9:16 portrait images with typography styled over the bottom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => openServiceModal(item, category.title)}
                    className="group relative overflow-hidden aspect-[9/16] rounded-2xl w-full text-left flex flex-col justify-end p-6 border border-[#222222]/10 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.01] cursor-pointer"
                  >
                    {/* Clear image inside */}
                    <img 
                      src={item.images[0]} 
                      alt={item.name} 
                      className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none filter brightness-[0.80] group-hover:brightness-[0.90] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Dark gradient mask - clear at top, rich and legible at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10 pointer-events-none z-10" />

                    {/* Left Icon badge overlay */}
                    <div className="absolute top-4 left-4 w-9 h-9 rounded-lg bg-black/45 backdrop-blur-md text-white/90 flex items-center justify-center border border-white/10 z-20 group-hover:bg-[#C5A059] group-hover:text-white transition-colors duration-300">
                      <IconComponent size={16} className="stroke-[1.5]" />
                    </div>

                    {/* Text overlays - Helvetica Neue styling, 13px, uppercase, 0.15em spacing */}
                    <div className="relative z-20 space-y-2 pointer-events-none">
                      <h3 className="font-['Helvetica_Neue',Arial,sans-serif] text-[13px] tracking-[0.15em] uppercase font-bold text-white group-hover:text-[#C5A059] transition-colors duration-300 drop-shadow-md">
                        {item.name}
                      </h3>
                      
                      <p className="text-[10px] text-gray-300 font-light leading-relaxed font-sans line-clamp-2">
                        {item.description}
                      </p>

                      {/* View details prompt */}
                      <div className="pt-2 border-t border-white/10 w-full flex justify-between items-center text-[9px] font-mono tracking-[0.12em] text-[#C5A059] font-bold uppercase transition-colors">
                        <span>LEARN MORE</span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300 text-[#C5A059]">
                          →
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 3. The "Deep-Dive" Interaction Popup Modal with 9:16 Vertical Gallery */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 md:p-6 animate-fade-in animate-duration-300">
            {/* Dark glass backdrop layout */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-6xl bg-white text-[#1A1A1A] rounded-3xl border border-[#F0F0F0] overflow-hidden shadow-2xl flex flex-col md:flex-row h-full max-h-[92vh] md:h-[82vh] z-10"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/95 hover:bg-[#C5A059] text-[#1A1A1A] hover:text-white p-2.5 rounded-full z-30 transition-all duration-300 border border-[#F0F0F0] shadow-lg hover:scale-105"
              >
                <X size={16} />
              </button>

              {/* Left Column: 9:16 Portrait Gallery of specific works */}
              <div className="w-full md:w-[48%] bg-[#F0F0F0] border-r border-[#F0F0F0] p-6 md:p-8 flex flex-col justify-between overflow-y-auto h-96 md:h-auto">
                <div className="space-y-4 text-left">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-[9px] font-mono tracking-[0.3em] text-[#C5A059] uppercase font-bold">
                      VERIFIED PROJECTS
                    </span>
                    <span className="h-2 w-2 rounded-full bg-[#C5A059] animate-[pulse_1.5s_infinite]" />
                  </div>
                  <h3 className="font-serif text-2xl font-light text-[#1A1A1A]">
                    Design Blueprints
                  </h3>
                  <p className="text-[11px] text-[#333333]/70 leading-relaxed font-sans">
                    Scroll down to explore vertical 9:16 portrait frames captured directly from finished structures, proving uncompromised spatial execution.
                  </p>
                </div>

                {/* Vertical Gallery Scroll wrapper */}
                <div className="space-y-6 mt-6 md:mt-8 overflow-y-visible">
                  {selectedItem.images.map((imgUrl, imgIdx) => (
                    <div 
                      key={imgIdx}
                      className="group/gallery relative aspect-[9/16] w-full rounded-2xl overflow-hidden border border-[#F0F0F0] shadow-md transform hover:scale-[1.01] transition-transform duration-300"
                    >
                      <img 
                        src={imgUrl} 
                        alt={`Past completed work for ${selectedItem.name} frame ${imgIdx + 1}`}
                        className="w-full h-full object-cover select-none pointer-events-none filter brightness-95"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-5 text-left pointer-events-none">
                        <span className="text-[9px] font-mono text-[#C5A059] tracking-widest block font-bold uppercase animate-pulse">
                          ARCHIVE SCENE {imgIdx + 1}
                        </span>
                        <p className="font-serif text-sm text-white italic font-light">
                          {selectedItem.name} Custom Installation
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Custom Description & Blueprints Reservation inquiry form */}
              <div className="w-full md:w-[52%] p-6 md:p-10 lg:p-12 overflow-y-auto flex flex-col justify-between space-y-8">
                <div className="space-y-6 text-left">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono tracking-[0.25em] text-[#C5A059] font-bold block uppercase">
                      {parentCategoryTitle}
                    </span>
                    <h2 className="text-3xl font-serif font-light text-[#1A1A1A] tracking-tight leading-tight uppercase">
                      {selectedItem.name}
                    </h2>
                  </div>

                  <p className="text-xs md:text-sm text-[#333333] font-light leading-relaxed">
                    {selectedItem.description}
                  </p>

                  {/* Technical specifications panel */}
                  <div className="bg-[#FAF9F7] p-6 rounded-2xl border border-[#F0F0F0] space-y-4">
                    <div className="flex items-center gap-2">
                      <FolderOpen size={14} className="text-[#C5A059]" />
                      <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase font-bold block">
                        Material & Technical System Layouts
                      </span>
                    </div>
                    <ul className="grid grid-cols-1 gap-3 text-xs text-[#333333]/80 font-light">
                      {selectedItem.specifications.map((spec, sidx) => (
                        <li key={sidx} className="flex gap-2.5 items-start">
                          <span className="text-[#C5A059] font-extrabold mt-0.5">•</span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Coastal safety tolerance warnings (highly tailored to Kenya region specs) */}
                  <div className="flex gap-3 bg-[#C5A059]/3 border border-[#C5A059]/10 p-4 rounded-xl items-start">
                    <BadgeAlert size={16} className="text-[#C5A059] shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono tracking-wider font-extrabold text-[#C5A059] uppercase block">Material and Environmental Safety Spec</span>
                      <p className="text-[11px] text-[#333333] leading-relaxed font-sans">{selectedItem.coastalTolerance}</p>
                    </div>
                  </div>
                </div>

                {/* Form System integration */}
                <div className="border-t border-[#F0F0F0] pt-6 space-y-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-wider text-[#1A1A1A]/40 uppercase block font-semibold">
                      Inquire About {selectedItem.name}
                    </span>
                    <p className="text-[11px] text-[#333333]/80 font-sans leading-relaxed">
                      Transmit an inquiry on dynamic layouts or bespoke technical specifications.
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {formStatus === 'success' ? (
                      <motion.div 
                        key="form-success"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-5 bg-[#C5A059]/5 border border-[#C5A059]/15 rounded-xl text-center flex flex-col items-center gap-2"
                      >
                        <CheckCircle size={24} className="text-[#C5A059]" />
                        <p className="text-sm font-serif font-light text-[#1A1A1A]">
                          Inquiry Received Successfully
                        </p>
                        <p className="text-[10px] text-[#333333] leading-relaxed font-sans">
                          A detailed system technical layout portfolio will be delivered directly inside 12 hours.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.form 
                        key="form-inputs"
                        onSubmit={handleInquirySubmit}
                        className="space-y-3"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input 
                            required
                            type="text"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="bg-[#F0F0F0]/30 border border-[#F0F0F0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059] w-full text-[#1A1A1A]"
                          />
                          <input 
                            required
                            type="tel"
                            placeholder="Mobile / WhatsApp"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="bg-[#F0F0F0]/30 border border-[#F0F0F0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059] w-full text-[#1A1A1A]"
                          />
                          <input 
                            required
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="bg-[#F0F0F0]/30 border border-[#F0F0F0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059] w-full text-[#1A1A1A]"
                          />
                        </div>
                        
                        <div className="relative">
                          <textarea 
                            rows={1}
                            placeholder="Plot size, land boundaries, or dynamic structural notes..."
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            className="bg-[#F0F0F0]/30 border border-[#F0F0F0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#C5A059] w-full resize-none placeholder-[#1A1A1A]/30 text-[#1A1A1A]"
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            type="submit"
                            disabled={formStatus === 'submitting'}
                            className="w-full sm:w-1/2 bg-[#C5A059] hover:bg-[#1A1A1A] text-white font-mono text-[10px] uppercase tracking-wider py-3 px-4 rounded-lg font-bold transition-all duration-300 disabled:opacity-50 select-none shadow-xs cursor-pointer text-center"
                          >
                            {formStatus === 'submitting' ? 'PROBING NETWORK...' : 'TRANSMIT BLUEPRINT REQ'}
                          </button>
                          
                          <button
                            type="button"
                            onClick={triggerWhatsAppInquiry}
                            className="w-full sm:w-1/2 bg-transparent hover:bg-[#F0F0F0]/50 text-[#1A1A1A] border border-[#F0F0F0] font-mono text-[10px] uppercase tracking-wider py-3 px-4 rounded-lg font-bold transition-all duration-300 select-none cursor-pointer text-center"
                          >
                            CONTACT VIA WHATSAPP
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. The "Final Touch" CTA */}
      <div className="max-w-4xl mx-auto px-6 mt-28 relative z-10 text-center">
        <div className="bg-white border border-[#F0F0F0] rounded-3xl p-8 md:p-16 space-y-8 shadow-xl relative overflow-hidden">
          {/* Subtle design grid lines background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(26,26,26,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,26,26,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <span className="text-[10px] font-mono tracking-[0.4em] text-[#C5A059] font-bold uppercase block">
              COLLABORATIVE COMMISSION
            </span>
            {/* Exact Copy */}
            <h2 className="text-3xl md:text-5xl font-serif font-light text-[#1A1A1A] leading-tight max-w-2xl mx-auto">
              Unparalleled Precision for Every Detail.<br />
              <span className="italic">Start Your Project Today.</span>
            </h2>
            <p className="text-xs text-[#333333] max-w-lg mx-auto leading-relaxed">
              Connect with Wamled Atelier to translate master concepts and specialized technical architectural files safely into reality.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {contactOpen ? (
              <motion.div 
                key="contact-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl mx-auto space-y-4 font-sans text-left"
              >
                {formStatus === 'success' ? (
                  <div className="p-6 bg-[#C5A059]/5 border border-[#C5A059]/10 rounded-2xl flex flex-col items-center gap-2">
                    <CheckCircle className="text-[#C5A059]" size={20} />
                    <p className="text-sm font-serif text-[#1A1A1A]">Consultation Placed!</p>
                    <p className="text-[10px] text-[#333333]">Our Lead Architect will be in touch shortly to align variables.</p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3 bg-white p-6 rounded-2xl border border-[#F0F0F0] shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input 
                        required
                        type="text"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="bg-[#F0F0F0]/30 border border-[#F0F0F0] rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-[#C5A059] w-full text-[#1A1A1A]"
                      />
                      <input 
                        required
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="bg-[#F0F0F0]/30 border border-[#F0F0F0] rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-[#C5A059] w-full text-[#1A1A1A]"
                      />
                    </div>
                    <input 
                      required
                      type="tel"
                      placeholder="WhatsApp or Mobile Phone Number"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-[#F0F0F0]/30 border border-[#F0F0F0] rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-[#C5A059] w-full text-[#1A1A1A]"
                    />
                    <textarea 
                      rows={2}
                      placeholder="Brief description of your property location, land specs or timeline..."
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      className="bg-[#F0F0F0]/30 border border-[#F0F0F0] rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-[#C5A059] w-full resize-none text-[#1A1A1A]"
                    />
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={formStatus === 'submitting'}
                        className="w-full bg-[#C5A059] hover:bg-[#1A1A1A] text-white font-mono text-[10px] uppercase font-bold tracking-widest py-3 rounded-xl transition-all shadow-xs cursor-pointer text-center"
                      >
                        {formStatus === 'submitting' ? 'PROCESSING...' : 'REQUEST BRIEFING SESSION'}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setContactOpen(false)}
                        className="px-4 border border-[#F0F0F0] text-xs font-mono text-[#1A1A1A] cursor-pointer"
                      >
                        CANCEL
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="cta-buttons"
                className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10"
              >
                {/* Wide minimalist CTA button */}
                <button
                  onClick={() => setContactOpen(true)}
                  className="w-full sm:w-auto min-w-[280px] bg-[#C5A059] hover:bg-[#1A1A1A] text-white px-8 py-4 rounded-xl font-mono text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-300 hover:scale-[1.03] shadow-md select-none cursor-pointer"
                >
                  SCHEDULE BRIEFING SESSION
                </button>
                <button
                  onClick={triggerWhatsAppInquiry}
                  className="w-full sm:w-auto min-w-[280px] bg-transparent hover:bg-[#F0F0F0]/20 text-[#1A1A1A] border border-[#F0F0F0] px-8 py-4 rounded-xl font-mono text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-300 select-none cursor-pointer"
                >
                  CONSULT ON WHATSAPP
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default BespokeServices;
