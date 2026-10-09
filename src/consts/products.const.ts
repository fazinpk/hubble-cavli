import type { Product } from "@app-types/product.type";

const CDN = "https://d8wojkg2185gh.cloudfront.net/strapi";
const SITE = "https://www.cavliwireless.com/iot-modules";

export const PRODUCTS: readonly Product[] = [
  {
    slug: "c41qs",
    name: "C41QS",
    family: "LPWA",
    category: "LTE Cat NB2",
    tagline: "Ultra-low-power NB-IoT for metering, parking and sensors.",
    summary:
      "C41QS is Cavli's NB-IoT module, compatible with 3GPP Release 14 (Cat NB1/NB2) and a wide set of global bands. Power-saving modes suit battery-powered devices, and its 17.7 × 15.8 mm footprint fits where space is tight. Optional GNSS and an optional integrated eSIM connect it to the Hubble platform.",
    highlights: [
      "Global band support",
      "Optional integrated eSIM",
      "Optional integrated GNSS",
      "Small form factor design",
      "Hubble ready",
    ],
    specs: [
      { label: "Network", value: "LTE Cat NB1/NB2, 3GPP Release 14" },
      { label: "Peak speed", value: "127 kbps DL / 158.5 kbps UL" },
      { label: "Bands", value: "Global: 19 LTE bands (B1–B85)" },
      { label: "Location", value: "GPS, BeiDou (optional)" },
      { label: "Operating system", value: "FreeRTOS" },
      { label: "Dimensions", value: "17.7 × 15.8 × 2.0 mm" },
      { label: "Form factor", value: "LGA" },
    ],
    useCases: [
      "Health Care & E-Health",
      "Smart City",
      "Safety & Security",
      "Energy & Utilities",
    ],
    imageUrl: `${CDN}/C41_QS_83014f2f2d.webp`,
    model: { path: "/models/C41_QS_a3f9c78cdb.glb", sizeMb: 3 },
    sourceUrl: `${SITE}/c-series/c41qs`,
  },
  {
    slug: "c16qs",
    name: "C16QS",
    family: "LTE Cat 1bis",
    category: "LTE Cat 1bis",
    tagline: "Reliable LTE for tracking, POS and 2G/3G migration.",
    summary:
      "C16QS is a series of LTE Cat 1bis modules built to 3GPP Release 14 for asset tracking, POS terminals, smart metering and industrial IoT. It offers a practical migration path from legacy 2G and 3G networks, with DFOTA, low-power modes and independent LTE and GNSS power control. Optional GNSS and eSIM variants are managed through Cavli Hubble.",
    highlights: [
      "Arm Cortex-M3 up to 204 MHz",
      "Optional integrated GNSS",
      "DFOTA firmware updates",
      "Integrated eSIM option",
      "LGA and Mini PCIe form factors",
    ],
    specs: [
      { label: "Network", value: "LTE Cat 1bis, 3GPP Release 14" },
      { label: "Peak speed", value: "10 Mbps DL / 5 Mbps UL" },
      {
        label: "Bands",
        value: "Regional variants: EAJ, EU, NA, AN, LA, IN, WW",
      },
      { label: "Location", value: "GPS, BeiDou (optional)" },
      { label: "Operating system", value: "FreeRTOS" },
      { label: "Dimensions", value: "26.5 × 22.5 × 2.3 mm" },
      { label: "Form factor", value: "LGA, Mini PCIe" },
    ],
    useCases: [
      "Health Care & E-Health",
      "Retail",
      "Energy & Utilities",
      "Manufacturing",
      "Smart City",
      "Safety & Security",
      "Automotive Logistics",
    ],
    imageUrl: `${CDN}/C16_QS_iot_module_dc159dab41.webp`,
    model: { path: "/models/C16_QS_5970177be8.glb", sizeMb: 20 },
    sourceUrl: `${SITE}/c-series/c16qs`,
  },
  {
    slug: "c10qm",
    name: "C10QM",
    family: "LTE Cat 1",
    category: "LTE Cat 1",
    tagline: "LTE Cat 1 with VoLTE, built-in GNSS and 2G fallback.",
    summary:
      "C10QM is an LTE Cat 1 module to 3GPP Release 10 with 2G fallback, VoLTE and SMS over IMS. Built-in multi-constellation GNSS gives dependable positioning, and its LGA footprint is pin compatible with Cavli's C10GS and C20QM modules for easy migration. It suits asset tracking, e-mobility, data loggers and fleet management.",
    highlights: [
      "VoLTE and SMS over IMS/SG/CS",
      "Built-in multi-constellation GNSS",
      "2G fallback",
      "DFOTA and deep sleep mode",
      "Integrated eSIM option",
    ],
    specs: [
      { label: "Network", value: "LTE Cat 1, 3GPP Release 10, 2G fallback" },
      {
        label: "Peak speed",
        value: "10 Mbps DL / 5 Mbps UL (2G: 236.8 kbps)",
      },
      { label: "Bands", value: "Regional variants: EAJ, NA, EU, IN, AN" },
      { label: "Location", value: "GPS, GLONASS, BeiDou, Galileo, QZSS" },
      { label: "Operating system", value: "Yocto Linux (kernel 4.14)" },
      { label: "Dimensions", value: "37 × 21.8 × 2.8 mm" },
      { label: "Form factor", value: "LGA" },
    ],
    useCases: [
      "Retail",
      "Energy & Utilities",
      "Automotive & Logistics",
      "Smart City",
      "Manufacturing",
      "Safety & Security",
    ],
    imageUrl: `${CDN}/C10_QM_LGA_png_54e5fcb7e8.webp`,
    model: { path: "/models/C10_QM_62d9a57b1b.glb", sizeMb: 7.5 },
    sourceUrl: `${SITE}/c-series/c10qm`,
  },
  {
    slug: "cqm220",
    name: "CQM220",
    family: "5G RedCap",
    category: "5G RedCap",
    tagline: "5G RedCap throughput for tracking and telemetry.",
    summary:
      "CQM220 is a 5G RedCap module to 3GPP Release 17, delivering up to 220 Mbps downlink and 120 Mbps uplink with LTE Cat 4 fallback. Its OpenWrt-based OpenSDK runs application code on the module without an external host MCU. Optional built-in GNSS makes it a fit for asset tracking, vehicle telemetry and Industry 4.0.",
    highlights: [
      "5G RedCap, 3GPP Release 17",
      "LTE Cat 4 fallback",
      "OpenWrt OpenSDK, no host MCU needed",
      "USB 2.0 with OTG support",
      "LGA and M.2 form factors",
    ],
    specs: [
      { label: "Network", value: "5G RedCap, 3GPP Release 17" },
      {
        label: "Peak speed",
        value: "220 Mbps DL / 120 Mbps UL (LTE: 150 / 50 Mbps)",
      },
      { label: "Bands", value: "24 5G NR bands, 27 LTE bands" },
      {
        label: "Location",
        value: "L1+L5: GPS, GLONASS, NavIC, BeiDou, Galileo, SBAS, QZSS",
      },
      { label: "Operating system", value: "Linux / OpenWrt" },
      { label: "Dimensions", value: "25.0 × 28.0 × 2.4 mm" },
      { label: "Form factor", value: "LGA, M.2" },
    ],
    useCases: [
      "Energy & Utilities",
      "Manufacturing",
      "Safety & Security",
      "Smart City",
      "Automotive Logistics",
    ],
    imageUrl: `${CDN}/CQM_220_c95a02c113.webp`,
    model: { path: "/models/CQM_220_4c2ab10a7c.glb", sizeMb: 7 },
    sourceUrl: `${SITE}/c-series/cqm220`,
  },
  {
    slug: "aq62",
    name: "AQ62",
    family: "Automotive",
    category: "Automotive 5G NR",
    tagline: "Automotive-grade 5G NR with on-board compute.",
    summary:
      "AQ62 is an automotive-grade 5G NR Sub-6 GHz module for telematics and connected vehicles, based on 3GPP Release 16 with LTE Cat 18 fallback. A quad-core Arm Cortex-A55 handles in-vehicle compute alongside the modem. It targets automotive clusters, vehicle telematics, ADAS systems and OBD solutions.",
    highlights: [
      "Automotive grade",
      "5G NR Sub-6 GHz, LTE Cat 18 fallback",
      "Quad-core Arm Cortex-A55 up to 2 GHz",
      "NG-eCall support (optional)",
      "VoLTE and VoNR",
    ],
    specs: [
      {
        label: "Network",
        value: "5G NR Sub-6 GHz, 3GPP Release 16, LTE Cat 18",
      },
      { label: "Peak speed", value: "4.4 Gbps DL / 900 Mbps UL (2T4R)" },
      { label: "Bands", value: "Regional variants: WW, NA, EAJ, IN, EA" },
      {
        label: "Location",
        value: "L1+L5: GPS, GLONASS, Galileo, BeiDou, NavIC, QZSS",
      },
      { label: "Operating system", value: "Linux / TelSDK" },
      { label: "Dimensions", value: "54.5 × 53.0 mm" },
      { label: "Form factor", value: "LGA" },
    ],
    useCases: [
      "Automotive Logistics",
      "Health Care & E-Health",
      "Smart City",
      "Safety & Security",
      "Energy & Utilities",
    ],
    imageUrl: `${CDN}/AQ_62_25fa43dfc4.png`,
    model: { path: "/models/AQ_62_GLB_Web_abbb11bf0b.glb", sizeMb: 9.7 },
    sourceUrl: `${SITE}/a-series/aq62`,
  },
];

export const getProductBySlug = (slug: string): Product | undefined =>
  PRODUCTS.find((product) => product.slug === slug);
