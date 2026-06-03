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
  FolderOpen
} from 'lucide-react';

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
    id: "architectural-interior",
    title: "Category A: Architectural & Interior Design",
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
        description: "Mapping the spatial choreography, visual vistas, and elegant flow of air and people within premium high-wall seaside estates.",
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
        id: "ffe-curation",
        name: "Furniture, Fixtures & Equipment (FF&E)",
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
    id: "technical-systems-mepf",
    title: "Category B: Technical Systems & MEPF",
    focus: "The \"brains\" of the building.",
    accent: "gold",
    description: "Engineering and automated climate solutions engineered to survive active marine environments.",
    items: [
      {
        id: "mepf-solutions",
        name: "One-stop MEPF Solutions",
        icon: Wrench,
        images: [
          "https://images.unsplash.com/photo-1558224494-ef18a4573b2c?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Fully engineered multi-system mechanical, electrical, plumbing, and fire safety systems designed for beachfront conditions.",
        specifications: [
          "Corrosion-resistant copper piping and condensation containment",
          "Premium low-harmonic Variable Refrigerant Flow (A/C) technology",
          "Triple-stage automated seawater sediment filtration integration",
          "Integrated marine storm drain pumps"
        ],
        coastalTolerance: "Corrosion-armored condensing units with anti-microbial sea spray coating."
      },
      {
        id: "elv-it-systems",
        name: "Integrated ELV & IT Systems",
        icon: Network,
        images: [
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Extra Low Voltage networks, high-security CCTV perimeter matrices, and luxury high-speed fiber-optic linkages.",
        specifications: [
          "Seaside IP67 weather-hardened outdoor camera mounts",
          "Smart-home centralized server rack integration with redundant thermal control",
          "Custom biometrics and long-range gate sensors",
          "Premium unified Wi-Fi 7 beach coverage blankets"
        ],
        coastalTolerance: "Hermetically sealed fiber-node enclosures shielding against ocean salinity."
      },
      {
        id: "lighting-systems",
        name: "Lighting Systems",
        icon: Lightbulb,
        images: [
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1565538810844-1e119faf1117?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Bespoke architectural illumination highlighting structural lines, coastal gardens, and soft interior scenes.",
        specifications: [
          "Warm-dim LED chips representing golden hours (2400K - 1800K)",
          "Fully integrated DALI-control automated systems",
          "Low-glare glare-shielded recess fixtures",
          "Scenic sea-wall wash dynamic program sequences"
        ],
        coastalTolerance: "Marine-grade powder-coated cast aluminum with solid IP66 water protection."
      },
      {
        id: "kitchen-laundry-equipment",
        name: "Kitchen & Laundry Equipment",
        icon: Cpu,
        images: [
          "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1565183997392-2f6f122e5912?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Chef-grade culinary stations and clean commercial-grade laundry infrastructure with high moisture control.",
        specifications: [
          "High-grade AISI 316 brushed stainless steel prep tables",
          "Under-counter low-noise commercial exhaust extraction hoods",
          "Heavy-duty smart washers with quick-spin lint moisture extraction",
          "Integrated prep sink waste disposers"
        ],
        coastalTolerance: "Full mechanical grade stainless steel housing resisting moisture rust."
      }
    ]
  },
  {
    id: "exterior-structural",
    title: "Category C: Exterior & Structural Details",
    focus: "The building's skin and bones.",
    accent: "gold",
    description: "Advanced glass structural envelopes and customized steel structural solutions.",
    items: [
      {
        id: "curtain-wall-facades",
        name: "Curtain Wall & Facades",
        icon: Layers,
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Double-glazed structural curtain systems protecting against ocean wind pressures while keeping interior views unobstructed.",
        specifications: [
          "Tempered low-E double-insulated structural safety panes",
          "High thermal break profiles to support oceanward cooling loads",
          "EPDM heavy weatherproofing gasket joints",
          "Structural silicone butt glazing"
        ],
        coastalTolerance: "Engineered to withstand coastal wind gusts up to 180 km/h."
      },
      {
        id: "steel-structures",
        name: "Steel Structures",
        icon: Cpu,
        images: [
          "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Structural steel frameworks, custom pavilion beams, and architectural canopy framing engineered for extreme coastal security.",
        specifications: [
          "Hot-dip galvanized structural profiles (min 85 microns coating thickness)",
          "Marine grade double-layer epoxy anti-corrosion paint system",
          "Hidden connection joints with stainless steel SS316 bolts",
          "High-load cantilever frame calculations"
        ],
        coastalTolerance: "Seismic class C3/C5 level severe marine corrosion protection."
      },
      {
        id: "balustrades-staircases",
        name: "Balustrades & Staircases",
        icon: TrendingUp,
        images: [
          "https://images.unsplash.com/photo-1562438668-bcf32c77934c?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Custom staircase structures, glass balustrade railings, and hand-forged metallic detail ribbons.",
        specifications: [
          "Laminated structurally-reinforced glass balustrades (15mm+ thickness)",
          "Marine-grade satin finished solid SS316 handrail rods",
          "Concealed heavy anchor base-plates in concrete",
          "Solid timber tread integrations with non-slip flush brass inlays"
        ],
        coastalTolerance: "Sweat, spray and hand oil proof satin finishes designed for marine settings."
      },
      {
        id: "canopies-partitions",
        name: "Canopies & Partitions",
        icon: Columns,
        images: [
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "External shading overhang structures and internal architectural room dividers crafted with custom rhythmic louvres.",
        specifications: [
          "Adjustable motorized louvered aluminium shading canopy shields",
          "Hardwood iroko or mvule screen lattice walls",
          "Pre-stressed architectural shade sail sailcloth hooks",
          "Sliding glass acoustically-insulated room dividers"
        ],
        coastalTolerance: "UV-stabilized resin polymers and saltwater-safe powder coatings."
      },
      {
        id: "window-door-systems",
        name: "Window & Door Systems",
        icon: DoorOpen,
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Massive floor-to-ceiling multi-track sliding doors that collapse completely, blending indoor and outdoor coastal living.",
        specifications: [
          "Slim-line structural aluminum frames with integrated insect screen tracks",
          "Marine Grade Class 2 window profiles",
          "Waterproof weep drain threshold channels",
          "Heavy-duty multi-point security locking bolts"
        ],
        coastalTolerance: "Wind-load and saltwater tested heavy rollers with self-cleaning nylon wheels."
      }
    ]
  },
  {
    id: "interior-finishing-furnishing",
    title: "Category D: Interior Finishes & Furniture",
    focus: "The tactile experience of the space.",
    accent: "gold",
    description: "Immersive surface treatments, bespoke bathroom layouts, and fine interior furnishings.",
    items: [
      {
        id: "wall-floor-covering",
        name: "Wall & Floor Covering",
        icon: Grid,
        images: [
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Selection of solid marble slabs, local coastal Galana stone slabs, and customized warm terrazzo flooring styles.",
        specifications: [
          "Honed slip-resistant matte marble finishes",
          "High stability micro-cement continuous surfaces",
          "Authentic unpolished natural coral-stone block wall claddings",
          "Premium low-porosity sealants shielding against dampness"
        ],
        coastalTolerance: "Highly durable stone surfaces sealed against salt crystal penetration."
      },
      {
        id: "ceiling-systems",
        name: "Ceiling Systems",
        icon: Square,
        images: [
          "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Architectural ceiling designs, floating gypsum structures, and integrated warm multi-media sound and projection spaces.",
        specifications: [
          "Moisture-resistant gypsum board ceiling cores",
          "Concealed linear warm LED accent cove lighting",
          "Bespoke tropical cedar wood ceiling inlays",
          "Flush architectural speaker and AC vents integration"
        ],
        coastalTolerance: "High-grade anti-sagging gypsum boards with specialized anti-humidity paints."
      },
      {
        id: "decoration-artwork",
        name: "Decoration & Artwork",
        icon: Paintbrush,
        images: [
          "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Sourcing and curating local coastal stone carvings, handmade ceramics, and high-value modern artwork.",
        specifications: [
          "Custom hand-made coastal clay pottery accessories",
          "Framed archival premium photography series on maritime life",
          "Curated sculptural installation elements on marble foundations",
          "Woven natural fiber architectural hanging fixtures"
        ],
        coastalTolerance: "Acid-free museum glazing on art prints shielding against extreme sea air humidity."
      },
      {
        id: "bathroom-solutions",
        name: "Bathroom Solutions",
        icon: Bath,
        images: [
          "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1600566752239-1718f0752881?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Bespoke spa-grade resort bathrooms featuring walk-in monolithic rain showers and freestanding stone bathtubs.",
        specifications: [
          "Solid carved natural river stone custom soaking tubs",
          "Waterproof continuous micro-cement walls and wet areas",
          "Thin-line brushed gold or copper thermostatic faucets",
          "Concealed floor drains with integrated odor backflow valves"
        ],
        coastalTolerance: "Heavy solid brass faucet cartridges protecting against highly mineralized coastal water lines."
      },
      {
        id: "furniture-decor",
        name: "Furniture & Decor",
        icon: Home,
        images: [
          "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Warm, luxury lounge arrangements carrying clean silhouettes and natural neutral textures.",
        specifications: [
          "Modular bespoke sofas with down-blend cushions",
          "Solid local hardwood credenzas paired with brass inlays",
          "Linen-blend breathable slipcovers in cream hues",
          "Woven sea-grass rugs with heavy jute backing"
        ],
        coastalTolerance: "Highly breathable linen textiles resisting mildew accumulation."
      }
    ]
  },
  {
    id: "specialized-outdoor",
    title: "Category E: Specialized & Outdoor Environments",
    focus: "Holistic project completion.",
    accent: "gold",
    description: "Holistic completion elements that frame the coastal luxury lifestyle.",
    items: [
      {
        id: "outdoor-landscape-solutions",
        name: "Outdoor & Landscape Solutions",
        icon: Trees,
        images: [
          "/src/assets/images/modern_kenyan_house_1780516497487.png",
          "/src/assets/images/premium_yacht_marina_1780516542006.png",
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Seashore landscape arrangements integrating salt-tolerant native flora, modern stone burners, and private sunlounger pavilions.",
        specifications: [
          "Custom local coral-rag boundary walls with lime mortars",
          "Salt-tolerant coconut palms and coastal landscape arrangements",
          "Monolithic natural stone fire feature setups",
          "Subsurface localized drip irrigation systems"
        ],
        coastalTolerance: "High salt-resistance landscape and flora selection withstanding high coastal summer seasons."
      },
      {
        id: "hospitality-medical-supplies",
        name: "Hospitality & Medical Supplies",
        icon: HeartPulse,
        images: [
          "/src/assets/images/premium_yacht_marina_1780516542006.png",
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Bespoke specifications, sanitary supplies, and medical grade wellness treatment beds built for elite seaside spa-hotels.",
        specifications: [
          "Commercial grade antimicrobial synthetic leather materials",
          "Fully adjustable heavy aluminum therapy tables",
          "High thermal insulation wellness sauna setups",
          "Premium guest-room wellness accessories"
        ],
        coastalTolerance: "Hypo-allergenic moisture-resistant materials designed for warm seaside environments."
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
        description: "Clean, architectural resort signage boards, luxury directional markers, and bespoke entrance gate typography.",
        specifications: [
          "Matte solid brass lettering with defensive marine clear coatings",
          "Hand-carved organic stone milestone directional guides",
          "Concealed dynamic LED edge backlighting matrices",
          "Aesthetic low-profile ground mounted markers"
        ],
        coastalTolerance: "Extreme maritime weather-tight lighting pods and UV-shielded engravings."
      },
      {
        id: "fitness-equipment",
        name: "Fitness Equipment",
        icon: Dumbbell,
        images: [
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=95&w=640&h=1140",
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=95&w=640&h=1140"
        ],
        description: "Elite level oceanside gym equipment layout setups with active humidity drainage and solid luxury materials.",
        specifications: [
          "Water-resistance customized wood-framed rowers",
          "Anti-slip polyurethane specialized gym mats",
          "Solid custom weights with rustproof rubber guards",
          "Fully integrated custom vertical mirror walls"
        ],
        coastalTolerance: "Sweat-acid and salty air proof mechanics protecting machinery wires."
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
      `Hello Wamled Atelier, I would like to inquire about your ${serviceString} for my oceanside project.`
    );
    window.open(`https://wa.me/254700000000?text=${cleanText}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1A1A1A] pt-32 pb-24 relative overflow-x-hidden">
      {/* Background elegant lighting blur grid */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand/3 rounded-full blur-[140px] pointer-events-none" />
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
          From the initial strokes of master planning and architectural circulation design to the selection & curation of custom furnishings, we orchestrate every layer of premium oceanside real estate. Our integration system seamlessly delivers advanced MEPF networks, climate-tolerant structural framing, and soft tactile finishes, resulting in highly unified, luxury high-art environments.
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

            {/* Minimalist 4-Column responsive grid layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => openServiceModal(item, category.title)}
                    className="group relative bg-white border border-[#F0F0F0] p-8 rounded-2xl text-left flex flex-col justify-between items-start gap-8 hover:border-[#C5A059]/35 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01]"
                  >
                    {/* Hover Glow & Icon Glow effect */}
                    <div className="absolute inset-0 bg-radial-gradient(circle_at_center,rgba(197,160,89,0.01),transparent_70%) opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />

                    <div className="w-12 h-12 rounded-xl bg-[#F0F0F0]/50 group-hover:bg-[#C5A059]/5 text-[#1A1A1A]/90 group-hover:text-[#C5A059] flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-xs border border-[#F0F0F0]">
                      <IconComponent size={22} className="stroke-[1.25]" />
                    </div>

                    <div className="space-y-2 pointer-events-none">
                      <h3 className="font-serif text-xl font-normal text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors duration-300">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-[#333333] leading-relaxed font-light line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    {/* Dynamic Label transition on Hover */}
                    <div className="w-full flex justify-between items-center pointer-events-none border-t border-[#F0F0F0] pt-4">
                      <span className="text-[9px] font-mono tracking-widest text-[#C5A059] group-hover:text-[#C5A059] font-bold uppercase transition-colors">
                        VIEW PROJECTS
                      </span>
                      <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 transform text-[#C5A059]">
                        <ArrowRight size={12} />
                      </span>
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
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 md:p-6">
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
                    Coastal Blueprints
                  </h3>
                  <p className="text-[11px] text-[#333333]/70 leading-relaxed font-sans">
                    Scroll down to explore vertical 9:16 portrait frames captured directly from finished private beachfront structures, demonstrating elite architectural configurations.
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
                        <span className="text-[9px] font-mono text-brand tracking-widest block font-bold uppercase">
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
                    <h2 className="text-3xl font-serif font-light text-[#1A1A1A] tracking-tight leading-tight">
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

                  {/* Coastal safety tolerance warnings (highly tailored to Kenya coastal region specs) */}
                  <div className="flex gap-3 bg-[#C5A059]/3 border border-[#C5A059]/10 p-4 rounded-xl items-start">
                    <BadgeAlert size={16} className="text-[#C5A059] shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono tracking-wider font-extrabold text-[#C5A059] uppercase block">Seawater Spray & Climatic Tolerance Spec</span>
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
                      Transmit a blueprint or system specification consultation request directly to our principal director.
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
                          Blueprint Inquiry Received
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
                            className="w-full sm:w-1/2 bg-[#C5A059] hover:bg-[#1A1A1A] text-white font-mono text-[10px] uppercase tracking-wider py-3 px-4 rounded-lg font-bold transition-all duration-300 disabled:opacity-50 select-none shadow-xs cursor-pointer"
                          >
                            {formStatus === 'submitting' ? 'PROBING NETWORK...' : 'TRANSMIT BLUEPRINT REQ'}
                          </button>
                          
                          <button
                            type="button"
                            onClick={triggerWhatsAppInquiry}
                            className="w-full sm:w-1/2 bg-transparent hover:bg-[#F0F0F0]/50 text-[#1A1A1A] border border-[#F0F0F0] font-mono text-[10px] uppercase tracking-wider py-3 px-4 rounded-lg font-bold transition-all duration-300 select-none cursor-pointer"
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
              Connect with Wamled Atelier to translate master concepts and specialized technical architectural files safely into reality on oceanside landscapes.
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
                      placeholder="Brief description of your coastal property location, land specs or timeline..."
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      className="bg-[#F0F0F0]/30 border border-[#F0F0F0] rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-[#C5A059] w-full resize-none text-[#1A1A1A]"
                    />
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={formStatus === 'submitting'}
                        className="w-full bg-[#C5A059] hover:bg-[#1A1A1A] text-white font-mono text-[10px] uppercase font-bold tracking-widest py-3 rounded-xl transition-all shadow-xs cursor-pointer"
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
