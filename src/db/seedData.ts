/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Service, BlogPost, FAQ, Testimonial, StoreSettings, MediaPhoto } from '../types.js';
import { ecommerceAssets } from '../assets.js';

export const initialProducts: Product[] = [
  {
    id: 'prod-cctv-outdoor',
    name: 'SmartTech 4K Ultra-HD CCTV Dome Camera',
    description: 'Weatherproof IP67 security camera set with clear 4K night vision, advanced motion detection filters, and smart dual audio feedback.',
    category: 'CCTV',
    price: 18500,
    originalPrice: 24000,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    tags: ['CCTV', 'Security', '4K HD', 'IP Camera']
  },
  {
    id: 'prod-cctv-wifi',
    name: 'SmartTech 360° Wireless PTZ Camera',
    description: 'Smart home outdoor wireless security camera with 360-degree pan-tilt, two-way talk, color night vision, auto-tracking, and cloud/SD card recording support.',
    category: 'CCTV',
    price: 4500,
    originalPrice: 6000,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    tags: ['CCTV', 'Wireless', 'Smart Home', 'Security']
  },
  {
    id: 'prod-tv-55',
    name: 'Vitron 55" Smart 4K UHD LED TV',
    description: 'Frameless 55-inch Ultra-HD smart television running Android TV OS. Built-in Netflix, YouTube, Prime Video, Wi-Fi, Dolby Audio, and multiple HDMI/USB ports.',
    category: 'TV',
    price: 42000,
    originalPrice: 48000,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    tags: ['TV', 'Smart TV', '4K UHD', 'Vitron']
  },
  {
    id: 'prod-tv-43',
    name: 'Syinix 43" Smart Full HD Frameless TV',
    description: 'Energy-efficient 43-inch smart television featuring HDR display tech, built-in free-to-air decoder, digital tuner, and stereo surround sound speakers.',
    category: 'TV',
    price: 26500,
    originalPrice: 30000,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&q=80&w=800',
    rating: 4.5,
    tags: ['TV', 'Syinix', 'Frameless', 'FHD']
  },
  {
    id: 'prod-solar-inv',
    name: 'Premium Solar Power Inverter Pack 1.5KVA',
    description: 'Complete high-efficiency solar setup featuring a 1500VA hybrid solar inverter, automatic transfer switch, surge protection, and dual intelligent battery monitoring. Power your house or shop smoothly.',
    category: 'Solar',
    price: 48000,
    originalPrice: 55000,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    tags: ['Solar', 'Inverter', 'Energy Saving', 'Backup']
  },
  {
    id: 'prod-solar-panel',
    name: 'SmartTech 300W Monocrystalline Solar Panel',
    description: 'Premium grade high-efficiency 300-watt monocrystalline PV module designed for long life, rich solar output in low-light, and robust anti-shatter tempered glass.',
    category: 'Solar',
    price: 12500,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    tags: ['Solar', 'Panel', 'Monocrystalline', 'Clean Energy']
  },
  {
    id: 'prod-ac-12000',
    name: 'Ramtons 12,000 BTU Split Air Conditioner',
    description: 'Eco-friendly split-system air conditioner featuring fast cooling, active air filtration, silent sleep mode, self-cleaning mode, and premium digital wireless remote.',
    category: 'Air Condition',
    price: 48500,
    originalPrice: 54000,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    tags: ['Air Conditioner', 'AC', 'Cooling', 'Ramtons']
  },
  {
    id: 'prod-ac-9000',
    name: 'Bruhm 9,000 BTU Inverter Air Conditioner',
    description: 'Smart energy-saver inverter split AC. Regulates compressor speed dynamically to cut down power consumption by 40% while maintaining absolute room temperature.',
    category: 'Air Condition',
    price: 38000,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    tags: ['Air Conditioner', 'AC', 'Inverter', 'Bruhm']
  },
  {
    id: 'prod-fridge-double',
    name: 'Samsung 250L Double-Door Inverter Refrigerator',
    description: 'Frost-free double-door refrigerator featuring smart digital inverter compressor, all-around cooling vents, deodorizing carbon filter, and large vegetable crisper box.',
    category: 'Fridge',
    price: 68000,
    originalPrice: 75000,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    tags: ['Refrigerator', 'Fridge', 'Samsung', 'Inverter']
  },
  {
    id: 'prod-fridge-single',
    name: 'Ramtons 90L Single-Door Compact Fridge',
    description: 'Space-saving elegant mini fridge with chiller compartment, adjustable glass shelves, energy-star rating, and robust mechanical temperature control switch.',
    category: 'Fridge',
    price: 18900,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=800',
    rating: 4.4,
    tags: ['Refrigerator', 'Fridge', 'Mini Fridge', 'Ramtons']
  },
  {
    id: 'prod-phone-s23',
    name: 'Samsung Galaxy S23 Ultra 5G (256GB)',
    description: 'Ultra premium Samsung smartphone with built-in S-Pen, gorgeous 120Hz AMOLED display, 200MP camera system, Snapdragon 8 Gen 2, and long-lasting 5000mAh battery.',
    category: 'Phone',
    price: 115000,
    originalPrice: 125000,
    stock: 9,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    tags: ['Smartphone', 'Samsung', 'Galaxy', 'Flagship']
  },
  {
    id: 'prod-phone-iphone15',
    name: 'Apple iPhone 15 Pro Max (256GB)',
    description: 'Apple flagship featuring premium aerospace titanium build, A17 Pro game-changing chip, advanced 48MP main camera system, dynamic island, and USB-C speed support.',
    category: 'Phone',
    price: 165000,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    tags: ['Smartphone', 'iPhone', 'Apple', 'Flagship']
  }
];

export const initialServices: Service[] = [
  {
    id: 'serv-cctv',
    name: 'CCTV Installation & Custom Layout Design',
    description: 'Premium high-definition CCTV security camera planning, wiring, dome/bullet placement, remote mobile viewing configuration, and backup setup for ultimate commercial and domestic security.',
    priceRange: 'KES 15,000 - KES 120,000+',
    estimatedTime: '4 - 8 Hours',
    icon: 'Shield',
    keyBenefits: [
      'Crystal-clear 4K Ultra-HD security cameras with high-fidelity night vision',
      'Real-time automated alerts directly on your smartphone',
      'Secure offline hard-drive video recording (no monthly subscriptions)',
      'Premium internal/external cable hiding and weather protection'
    ],
    process: [
      'Site Survey & Camera Layout Planning',
      'Premium Coaxial or Cat6 Cabling deployment',
      'Camera mounting, focus tuning, and angle optimization',
      'DVR/NVR configuration and mobile viewing setup'
    ],
    image: 'https://images.unsplash.com/photo-1551806235-6629bc2415fc?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'serv-tv',
    name: 'Smart & LED TV Repair Services',
    description: 'Accurate, hardware-level motherboard diagnostic, replacement of damaged backlights, power supply restoration, HDMI/port repairs, and display panel troubleshooting.',
    priceRange: 'KES 2,500 - KES 12,000',
    estimatedTime: '2 - 24 Hours',
    icon: 'Tv',
    keyBenefits: [
      'Genuine, warranty-backed replacement screen backlights and mainboards',
      'Fix for common problems: No audio, half-lit screen, looping restart, no power',
      'Fast turnaround time (most repairs done on the same day)',
      'Affordable repair versus buying a whole brand new television set'
    ],
    process: [
      'Full voltage and power board diagnostic',
      'Micro-soldering repair of chip-level controllers',
      'Pre-assembly rigorous component stress testing',
      'Clean assembly with dust/static isolation checks'
    ],
    image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'serv-solar',
    name: 'Solar Panel & Inverter Power Installation',
    description: 'Full off-grid or hybrid residential solar system engineering. Includes high-efficiency monocrystalline panels, inverter installation, automatic load transfers, and secure battery bank wiring.',
    priceRange: 'KES 35,000 - KES 350,000+',
    estimatedTime: '1 - 2 Days',
    icon: 'Sun',
    keyBenefits: [
      'Say goodbye to annoying blackout power outages permanently',
      'Slash your electricity bills down to 0% with natural solar energy',
      'Eco-friendly green power backup for essential household items',
      'Long-lasting panels with up to 10-25 years performance warranties'
    ],
    process: [
      'Power load calculation (measuring lights, fridge, TV consumption)',
      'Solar mounting frames securely locked on roof tiles',
      'Inverter and deep cycle gel/lithium battery bank installation',
      'Safe transfer switch activation and user demonstration'
    ],
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'serv-testing',
    name: 'Commission Testing & Electrical Audits',
    description: 'Rigorous certified safety, performance, load, and earthing testing of electrical machines, generators, inverters, and heavy-duty compound backup systems before full commercial activation.',
    priceRange: 'KES 8,000 - KES 45,000',
    estimatedTime: '3 - 6 Hours',
    icon: 'Gauge',
    keyBenefits: [
      'Prevent massive electrical fires and device burnouts',
      'Ensure absolute safety compliance with industrial earthing standards',
      'Comprehensive performance reports tracking voltage stability',
      'Identify secret energy leakages that are inflating electric bills'
    ],
    process: [
      'Earthing loop resistance measurement',
      'Voltage spikes, harmonic distortions and wave tracking',
      'Overload shutdown simulation to verify emergency breakers',
      'Signing off on certified commission safety document'
    ],
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'serv-phone',
    name: 'Smart Phone & Tablet Advanced Repair',
    description: 'Precision physical hardware diagnostics, micro-soldering, touch screen & LCD screen glass replacements, battery replacements, and logic board repair for iOS and Android devices.',
    priceRange: 'KES 1,200 - KES 8,500',
    estimatedTime: '1 - 3 Hours',
    icon: 'Smartphone',
    keyBenefits: [
      'Premium high-brightness LCD display components with rich touch response',
      'Precision water-damage treatment using sonic bath cleaner boards',
      'Immediate port replacements to fix slow or intermittent charging',
      'Secure data isolation: your photos and files remain fully private'
    ],
    process: [
      'Anti-static grounding and heat-plate screen decoupling',
      'Battery safety extraction and chassis adhesive cleaning',
      'Original screen/flex-cable fitting and motherboard seating',
      'Rigorous touch grid calibration and display pressure testing'
    ],
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'serv-fridge',
    name: 'Fridge, Freezer & AC Pro Servicing',
    description: 'Comprehensive cooling diagnostics. Fixing gas leaks, recharging R134a/R600a refrigerant, repairing non-starting compressors, thermostat calibration, and fan motor replacement for fridges, freezers, and ACs.',
    priceRange: 'KES 3,000 - KES 15,000',
    estimatedTime: '2 - 5 Hours',
    icon: 'Wind',
    keyBenefits: [
      'Fix common issues: Fridge not freezing, clicking sounds, ice buildup, AC blowing warm air',
      'Certified environment-friendly low-pressure refrigerant refills',
      'Prolong the life of your food stock and reduce freezer electricity waste',
      'Complete, clean service directly inside your house or business premises'
    ],
    process: [
      'Vacuum pump testing to locate hidden system micro-leaks',
      'Refrigerant gas recovery, copper piping welding, and seal verification',
      'Compressor motor current draw diagnostics',
      'Final thermometer tracking to ensure optimal food-safe temperatures'
    ],
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=800'
  }
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Top 5 Crucial Tips to Avoid TV Screen Backlight Failures',
    excerpt: 'Is your TV screen flashing or going completely dark while audio still plays? Discover how backlight settings could be slowly damaging your flat screen LED display.',
    content: `LED backlight failure is the number one cause of television breakdowns worldwide. Many owners are unaware that their factory television settings are actually destroying their hardware.\n\n### Why Backlights Fail\nBy default, manufacturers set the TV "Backlight Level" to 100% to compete with fluorescent shop lighting. On a typical living room wall, this extreme brightness creates excessive heat on the tiny LED strip lights. Over 1-2 years, this continuous thermal strain cracks the micro-solder connections, causing some of the LEDs to burn out, which breaks the electrical chain and plunges the whole screen into darkness.\n\n### Actionable Prevention Tips\n1. **Lower Backlight Settings**: Manually reduce the TV Backlight setting to 70-80%. It is still incredibly bright and will double the lifespan of your LED strips.\n2. **Enable Dynamic Contrast**: Setting this to 'Medium' or 'Low' allows the TV to throttle down backlight intensity dynamically when dark scenes are playing.\n3. **Avoid Hot Walls**: Never mount your TV directly adjacent to hot windows or above open fire structures or radiators.\n4. **Use a High-Quality Surge Guard**: Power spikes can also blast the LEDs through the LED Driver circuit on the power board. Install an electronic surge guard specifically for TVs.\n5. **Let it Sleep**: Turn off the TV if you are only listening to music or are out of the room. Don't leave it playing in the background all day.\n\nAt SmartTech Electronics, we replace damaged LED backlights with genuine aluminum-backed heat-dissipating LED strips that last much longer than factory originals. Contact us at 0708776967 for rapid, affordable repair.`,
    category: 'TV Maintenance',
    author: 'Chief Tech Gathoni',
    date: '2026-07-01',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=800',
    readTime: '4 min read'
  },
  {
    id: 'blog-2',
    title: 'How to Correctly Calculate What Solar System Size You Need',
    excerpt: 'Going off-grid? Learn the step-by-step formula to measure your home appliances so you purchase the perfect solar panels, battery capacity, and inverter size.',
    content: `Solar energy is a marvelous way to enjoy silent, zero-bill power. However, sizing a solar array incorrectly can lead to either wasted money or overloaded system shutoffs when your fridge and TV try to kick on together. Let's walk through the exact calculations our expert team at SmartTech Electronics performs.\n\n### Step 1: Calculate Your Daily Energy Consumption (Watt-Hours)\nMake a list of every item you want to power, their individual wattages, and how many hours they run each day:\n*   **LED Bulbs (5 units)**: 5 x 10 Watts x 5 hours = 250 Wh\n*   **LED Smart TV**: 1 x 80 Watts x 6 hours = 480 Wh\n*   **Double-Door Fridge**: 1 x 150 Watts x 24 hours (comp. cycles 10 hours active) = 1,500 Wh\n*   **Total daily energy required** = 2,230 Wh (or 2.23 kWh).\n\n### Step 2: Size the Battery Storage Bank\nTo run appliances at night, you need storage. To avoid draining lead-acid or gel batteries to 0% (which destroys them), we design for a 50% Depth of Discharge (DoD):\n*   Required usable storage: 2,230 Wh x 2 = 4,460 Wh of battery capacity.\n*   If using standard 12V batteries: 4,460 Wh / 12V = 371 Ah battery bank.\n*   This means you would need four 100Ah gel batteries wired in a series-parallel setup, or a single modular 24V Lithium-Ion pack.\n\n### Step 3: Determine Solar Panel Quantities\nIn Kenya, we average about 5 peak sun hours of rich solar harvest daily:\n*   Required total solar panel wattage: 2,230 Wh / 5 hours = 446W of solar generation.\n*   With system inefficiencies (wire resistance, dirty panels), we multiply by 1.3 as a safety buffer: 446W x 1.3 = 580W of panel array.\n*   You could buy three 200W Monocrystalline solar panels.\n\n### Step 4: Choose the Hybrid Inverter Rating\nYour inverter rating is based on the maximum *simultaneous* load. If your fridge (150W), TV (80W), and lights (50W) are running, the nominal load is 280W. But wait! The fridge has an induction motor which draws a 3x peak spike (450W) for 2 seconds when starting.\n*   Continuous peak load = 450W + 80W + 50W = 580W.\n*   A 1,000VA (1KVA) or 1,500VA (1.5KVA) hybrid inverter is perfectly suited and gives you generous breathing room.\n\nSizing can feel complicated, but getting it right ensures power security. Our expert engineers at SmartTech Electronics handle full load evaluations, high-quality material sourcing, and certified secure installations. Give us a call at 0708776967 or stop by our store!`,
    category: 'Solar Guide',
    author: 'Solar Eng. Peter',
    date: '2026-07-10',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=800',
    readTime: '6 min read'
  }
];

export const initialFAQs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'My fridge/freezer motor is making a clicking sound but is not cooling. What is wrong?',
    answer: 'A repeated clicking sound every few minutes usually indicates that the refrigerator compressor is trying to start but is instantly tripping its electrical safety thermal overload relay. This is typically caused by a blown Compressor Start PTC Relay, a failed run capacitor, or a locked mechanical compressor motor. A relay replacement is a fast, highly affordable fix that we perform daily!',
    category: 'Fridge & AC Repair'
  },
  {
    id: 'faq-2',
    question: 'How many CCTV cameras can be powered by a single coaxial power supply unit?',
    answer: 'For standard setups, a 12V 10A power distribution box can safely supply continuous, clean power to up to 9 bullet/dome surveillance cameras. For longer cable distances (above 50 meters), voltage drop occurs over the wire. We recommend running high-quality pure copper cables or utilizing active PoE baluns over Cat6 cabling to prevent nighttime screen flickering.',
    category: 'CCTV Security'
  },
  {
    id: 'faq-3',
    question: 'Why does my TV screen display a blue or purple tint?',
    answer: 'A blue or purple screen tint on modern LED televisions is caused by the aging fluorescent phosphor coating on the LED backlights deteriorating and flaking away. When this occurs, the underlying raw ultraviolet/blue LED light shines straight through the LCD layer. The only permanent solution is replacing the complete set of internal LED backlight strips, which returns your TV back to pristine white-balance colors.',
    category: 'TV Repair'
  },
  {
    id: 'faq-4',
    question: 'Does cloudy or rainy weather stop solar panel energy generation entirely?',
    answer: 'No, solar panels do not need direct red-hot sunlight to generate power; they operate using light spectrum energy. On heavily overcast or rainy days, modern Monocrystalline panels still capture ambient diffused light, generating about 10% to 25% of their peak rated capacity. Adding adequate backup battery reserve capacity guarantees you remain powered through extended overcast weather.',
    category: 'Solar Power'
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Harrison Murimi',
    role: 'Commercial Supermarket Owner',
    content: 'SmartTech Electronics installed an 8-camera 4K security system in our supermarket. The cable management was perfectly clean, hidden in trunks, and they configured the mobile app on all our managers\' phones. I can now oversee my business remotely anytime with absolute peace of mind!',
    rating: 5,
    avatar: ''
  },
  {
    id: 'test-2',
    name: 'Grace Wambui',
    role: 'Residential Solar Client',
    content: 'Our estate experiences frequent blackouts, especially during rainy seasons. SmartTech designed and deployed a 1.5KVA hybrid solar backup system. Now, our TV, lights, and fridge run seamlessly. My kids can do homework without interruptions. Excellent service and very polite technicians!',
    rating: 5,
    avatar: ''
  },
  {
    id: 'test-3',
    name: 'David Mwangi',
    role: 'Homeowner',
    content: 'My expensive 55" Samsung TV screen suddenly went dark but sound was working. Another technician told me to throw it away. I brought it to SmartTech; they diagnosed failed LED backlights, replaced them in 3 hours at a very fair price, and gave me a 6-month warranty. The screen is now as bright as new!',
    rating: 5,
    avatar: ''
  }
];

export const initialSettings: StoreSettings = {
  shopName: 'SmartTech Electronics',
  phone: '0708776967',
  email: 'gathonimash@gmail.com',
  location: 'Nairobi, Kenya',
  mpesaTillNumber: '4087769',
  seoTitle: 'SmartTech Electronics | CCTV, Solar, & Electronics Repairs Nairobi',
  seoDescription: 'SmartTech Electronics offers premium, affordable CCTV camera installations, home/commercial solar panels & inverters, Smart LED TV backlight repairs, fridge/AC servicing, and certified electrical audits. Visit us or call 0708776967.',
  welcomeMessage: 'Welcome to SmartTech Electronics! Your trusted local expert in high-fidelity CCTV surveillance, eco-friendly solar setups, and premium appliance repairs.'
};

export const initialPhotos: MediaPhoto[] = ecommerceAssets;

