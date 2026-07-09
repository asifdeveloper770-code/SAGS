export type Category = "food-handler" | "alcohol" | "additional";

export interface Course {
  id: string;
  title: string;
  category: Category;
  state: string; // state code or "US"
  stateLabel: string;
  authority: string; // TABC, BASSET, ANSI, etc.
  price: number;
  hours: number;
  description: string;
  modules: Module[];
  requiresIdVerify?: boolean;
}

export interface Module {
  id: string;
  title: string;
  minMinutes: number;
  lessons: Lesson[];
  quiz: QuizQuestion[];
}

export interface Lesson {
  id: string;
  title: string;
  type: "video" | "reading";
  body: string;
  duration: number; // minutes
}

export interface QuizQuestion {
  id: string;
  q: string;
  options: string[];
  answer: number;
}

const foodModules = (prefix: string): Module[] => [
  {
    id: `${prefix}-m1`,
    title: "Foodborne Illness & Contamination",
    minMinutes: 15,
    lessons: [
      { id: "l1", type: "video", title: "The Big Six Pathogens", duration: 8, body: "An overview of the six pathogens the FDA highlights as most commonly transmitted through food, including Salmonella, Shigella, and Norovirus. Employees who work while contagious remain the leading vector for outbreaks in the United States." },
      { id: "l2", type: "reading", title: "Cross-Contamination Pathways", duration: 6, body: "Cross-contamination occurs when microorganisms are transferred from one surface, food, or person to another. This lesson covers separation, dedicated utensils, and color-coded cutting boards as primary controls." },
    ],
    quiz: [
      { id: "q1", q: "Which pathogen is most commonly transmitted by an infected food worker?", options: ["E. coli O157:H7", "Norovirus", "Clostridium botulinum", "Listeria"], answer: 1 },
      { id: "q2", q: "The most reliable indicator that food has reached a safe internal temperature is:", options: ["Color of the meat", "A calibrated food thermometer", "Cooking time", "Steam rising"], answer: 1 },
    ],
  },
  {
    id: `${prefix}-m2`,
    title: "Personal Hygiene & Handwashing",
    minMinutes: 10,
    lessons: [
      { id: "l1", type: "video", title: "The 20-Second Rule", duration: 5, body: "Proper handwashing requires warm running water, soap, and a full 20 seconds of scrubbing before rinsing and drying with single-use towels." },
      { id: "l2", type: "reading", title: "When to Wash", duration: 5, body: "Handwashing is required after using the restroom, handling raw proteins, touching the face or hair, eating, smoking, or handling any potentially contaminated surface." },
    ],
    quiz: [
      { id: "q1", q: "Minimum hand scrubbing time with soap is:", options: ["5 seconds", "10 seconds", "20 seconds", "60 seconds"], answer: 2 },
    ],
  },
  {
    id: `${prefix}-m3`,
    title: "Time & Temperature Control",
    minMinutes: 15,
    lessons: [
      { id: "l1", type: "video", title: "The Temperature Danger Zone", duration: 7, body: "TCS foods held between 41°F and 135°F are in the temperature danger zone. Total exposure must not exceed 4 hours cumulatively." },
      { id: "l2", type: "reading", title: "Cooling Procedures", duration: 8, body: "Two-stage cooling: from 135°F to 70°F within 2 hours, then to 41°F or below within an additional 4 hours." },
    ],
    quiz: [
      { id: "q1", q: "The temperature danger zone is:", options: ["32°F to 100°F", "41°F to 135°F", "50°F to 150°F", "0°F to 41°F"], answer: 1 },
    ],
  },
];

const alcoholModules = (prefix: string): Module[] => [
  {
    id: `${prefix}-m1`,
    title: "Legal Responsibilities of a Server",
    minMinutes: 20,
    lessons: [
      { id: "l1", type: "video", title: "Dram Shop Liability", duration: 10, body: "Establishments and individual servers can be held civilly liable for damages caused by an intoxicated patron they served. This module reviews state-specific liability thresholds." },
      { id: "l2", type: "reading", title: "Refusing Service", duration: 10, body: "You have both the right and the legal duty to refuse service to any patron who appears intoxicated or who cannot produce valid identification." },
    ],
    quiz: [
      { id: "q1", q: "A dram shop law primarily governs:", options: ["Bar hours", "Server civil liability for over-service", "Alcohol pricing", "Cocktail recipes"], answer: 1 },
    ],
  },
  {
    id: `${prefix}-m2`,
    title: "Checking Identification",
    minMinutes: 15,
    lessons: [
      { id: "l1", type: "video", title: "Detecting Fake IDs", duration: 8, body: "Compare the photo, height, and eye color to the person. Bend the card slightly to check for lamination separation. Verify holograms under angled light." },
      { id: "l2", type: "reading", title: "Valid Forms of ID", duration: 7, body: "Acceptable ID includes an unexpired state driver license, state ID, US passport, or military ID. Vertical licenses under 21 must always be scrutinized." },
    ],
    quiz: [
      { id: "q1", q: "When bending an ID, what indicates it may be fake?", options: ["Slight flex", "Lamination separation", "Warm to the touch", "It bends easily"], answer: 1 },
    ],
  },
  {
    id: `${prefix}-m3`,
    title: "Recognizing Intoxication",
    minMinutes: 15,
    lessons: [
      { id: "l1", type: "video", title: "Behavioral Cues", duration: 8, body: "Slurred speech, delayed reactions, loss of coordination, aggressive or overly familiar behavior, and inability to focus are all signs to stop service." },
      { id: "l2", type: "reading", title: "BAC & Absorption", duration: 7, body: "A single standard drink raises BAC roughly 0.02%. Food, body weight, and drinking pace affect absorption rate but do not eliminate impairment." },
    ],
    quiz: [
      { id: "q1", q: "Which is NOT a reliable sign of intoxication?", options: ["Slurred speech", "Loss of coordination", "Confidence in conversation", "Delayed reactions"], answer: 2 },
    ],
  },
];

export const COURSES: Course[] = [
  // Food Handler
  { id: "fh-tx", title: "Texas Food Handler Certification", category: "food-handler", state: "TX", stateLabel: "Texas", authority: "DSHS Accredited", price: 7, hours: 2, description: "Official Texas Department of State Health Services approved food handler certification. Valid statewide for 2 years.", modules: foodModules("fh-tx") },
  { id: "fh-oh", title: "Ohio Food Handler Certification", category: "food-handler", state: "OH", stateLabel: "Ohio", authority: "ANSI Accredited", price: 10, hours: 2, description: "ANSI-accredited food handler certification meeting Ohio Department of Health requirements.", modules: foodModules("fh-oh") },
  { id: "fh-il", title: "Illinois Food Handler Certification", category: "food-handler", state: "IL", stateLabel: "Illinois", authority: "IDPH Approved", price: 10, hours: 2, description: "State-approved Illinois food handler course meeting IDPH standards.", modules: foodModules("fh-il") },
  { id: "fh-ut", title: "Utah Food Handler Permit", category: "food-handler", state: "UT", stateLabel: "Utah", authority: "State Approved", price: 15, hours: 3, description: "Utah state-approved food handler permit training.", modules: foodModules("fh-ut") },
  { id: "fh-nd", title: "North Dakota Food Handler", category: "food-handler", state: "ND", stateLabel: "North Dakota", authority: "State Approved", price: 10, hours: 2, description: "North Dakota approved food handler certification.", modules: foodModules("fh-nd") },
  { id: "fh-bs", title: "Bahamas Food Handler Certification", category: "food-handler", state: "BS", stateLabel: "Bahamas", authority: "MOH Approved", price: 25, hours: 4, description: "Bahamas Ministry of Health approved food handler training for hospitality workers.", modules: foodModules("fh-bs") },

  // Alcohol Server
  { id: "al-tabc", title: "Texas TABC Seller-Server", category: "alcohol", state: "TX", stateLabel: "Texas", authority: "TABC Certified", price: 12, hours: 2, description: "Official TABC-certified seller-server training. Required for all Texas alcohol servers.", modules: alcoholModules("al-tabc"), requiresIdVerify: true },
  { id: "al-basset", title: "Illinois BASSET Training", category: "alcohol", state: "IL", stateLabel: "Illinois", authority: "BASSET Approved", price: 15, hours: 4, description: "State-mandated BASSET certification for alcohol servers and sellers in Illinois.", modules: alcoholModules("al-basset"), requiresIdVerify: true },
  { id: "al-oh", title: "Ohio Responsible Vendor", category: "alcohol", state: "OH", stateLabel: "Ohio", authority: "Ohio Dept. of Commerce", price: 20, hours: 3, description: "Ohio Responsible Vendor Program certification.", modules: alcoholModules("al-oh"), requiresIdVerify: true },
  { id: "al-ok", title: "Oklahoma ABLE Certification", category: "alcohol", state: "OK", stateLabel: "Oklahoma", authority: "ABLE Commission", price: 18, hours: 3, description: "Oklahoma ABLE Commission approved alcohol server training.", modules: alcoholModules("al-ok"), requiresIdVerify: true },
  { id: "al-ut", title: "Utah DABS Alcohol Training", category: "alcohol", state: "UT", stateLabel: "Utah", authority: "DABS Approved", price: 22, hours: 4, description: "Utah Department of Alcoholic Beverage Services approved training.", modules: alcoholModules("al-ut"), requiresIdVerify: true },
  { id: "al-rbs", title: "California RBS Certification", category: "alcohol", state: "CA", stateLabel: "California", authority: "ABC RBS Program", price: 20, hours: 3, description: "California Responsible Beverage Service certification (mandatory).", modules: alcoholModules("al-rbs"), requiresIdVerify: true },
  { id: "al-fl", title: "Florida Responsible Vendor", category: "alcohol", state: "FL", stateLabel: "Florida", authority: "DBPR Approved", price: 15, hours: 3, description: "Florida Responsible Vendor Act compliant training.", modules: alcoholModules("al-fl"), requiresIdVerify: true },
  { id: "al-ny", title: "New York Alcohol Training Awareness (ATAP)", category: "alcohol", state: "NY", stateLabel: "New York", authority: "SLA Approved", price: 20, hours: 4, description: "New York State Liquor Authority approved ATAP program.", modules: alcoholModules("al-ny"), requiresIdVerify: true },
  { id: "al-nj", title: "New Jersey Alcohol Server", category: "alcohol", state: "NJ", stateLabel: "New Jersey", authority: "ABC Approved", price: 18, hours: 3, description: "New Jersey approved alcohol server training.", modules: alcoholModules("al-nj"), requiresIdVerify: true },
  { id: "al-nc", title: "North Carolina ABC Server Training", category: "alcohol", state: "NC", stateLabel: "North Carolina", authority: "NC ABC Approved", price: 15, hours: 3, description: "North Carolina ABC Commission approved training.", modules: alcoholModules("al-nc"), requiresIdVerify: true },

  // Additional
  { id: "ad-mgr", title: "Food Protection Manager (ANSI)", category: "additional", state: "US", stateLabel: "Nationwide", authority: "ANSI Accredited", price: 85, hours: 8, description: "ANSI-CFP accredited Certified Food Protection Manager exam prep.", modules: foodModules("ad-mgr") },
  { id: "ad-alrg", title: "Food Allergen Awareness", category: "additional", state: "US", stateLabel: "Nationwide", authority: "ANSI Recognized", price: 15, hours: 1, description: "Comprehensive allergen awareness training for food service workers.", modules: foodModules("ad-alrg") },
  { id: "ad-haccp", title: "HACCP Certification", category: "additional", state: "US", stateLabel: "Nationwide", authority: "IHA Recognized", price: 120, hours: 12, description: "Hazard Analysis Critical Control Point certification.", modules: foodModules("ad-haccp") },
  { id: "ad-sushi", title: "Sushi Safety & HACCP", category: "additional", state: "US", stateLabel: "Nationwide", authority: "IHA Recognized", price: 60, hours: 4, description: "Specialized food safety training for sushi and raw seafood preparation.", modules: foodModules("ad-sushi") },
  { id: "ad-cosm", title: "Cosmetology Continuing Education", category: "additional", state: "US", stateLabel: "Nationwide", authority: "State Board Approved", price: 40, hours: 6, description: "Continuing education units for licensed cosmetologists.", modules: foodModules("ad-cosm") },
  { id: "ad-pool", title: "Certified Pool Operator", category: "additional", state: "US", stateLabel: "Nationwide", authority: "NSPF Recognized", price: 250, hours: 16, description: "Nationally recognized pool and spa operator certification.", modules: foodModules("ad-pool") },
  { id: "ad-hic", title: "Health Inspection Consulting", category: "additional", state: "US", stateLabel: "Nationwide", authority: "Professional", price: 350, hours: 20, description: "Advanced training for health inspection consultants and auditors.", modules: foodModules("ad-hic") },
];

export const STATES = Array.from(new Set(COURSES.map(c => c.stateLabel))).sort();

export const CATEGORIES: { id: Category; label: string; description: string }[] = [
  { id: "food-handler", label: "Food Handler", description: "State-approved food handler certifications covering hygiene, contamination control, and TCS food safety." },
  { id: "alcohol", label: "Alcohol Server", description: "Responsible vendor training including TABC, BASSET, RBS, and jurisdiction-specific programs nationwide." },
  { id: "additional", label: "Additional Programs", description: "Food Manager, HACCP, Allergen, Cosmetology CE, Pool Operator, and specialized professional tracks." },
];

export function courseById(id: string): Course | undefined {
  return COURSES.find(c => c.id === id);
}

// ---- Mock certificate registry ----
export interface Certificate {
  id: string;
  studentName: string;
  courseTitle: string;
  courseId: string;
  issuedAt: string;
  expiresAt: string;
  status: "active" | "expired" | "revoked";
}

export const SAMPLE_CERTS: Certificate[] = [
  { id: "SAGS-TX-000142", studentName: "Marcus J. Rivera", courseTitle: "Texas TABC Seller-Server", courseId: "al-tabc", issuedAt: "2025-02-14", expiresAt: "2027-02-14", status: "active" },
  { id: "SAGS-CA-000091", studentName: "Elena Whitfield", courseTitle: "California RBS Certification", courseId: "al-rbs", issuedAt: "2024-11-03", expiresAt: "2027-11-03", status: "active" },
  { id: "SAGS-OH-000047", studentName: "Aaron Blake", courseTitle: "Ohio Food Handler Certification", courseId: "fh-oh", issuedAt: "2023-06-01", expiresAt: "2025-06-01", status: "expired" },
];
