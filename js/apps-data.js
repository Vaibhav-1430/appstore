/**
 * apps-data.js
 * ============================================================
 * Central data store for all apps.
 * To add a new app, simply push a new object to the `apps` array.
 * The website will automatically generate cards and detail pages.
 * ============================================================
 */

const DEVELOPER = {
    name: "Vaibhav",
    title: "Full-Stack & Mobile Developer",
    bio: "Passionate developer crafting high-quality mobile and web experiences. Specialising in Flutter, Firebase, and modern JavaScript. Every app I build is designed with performance, security, and user delight in mind.",
    location: "India 🇮🇳",
    email: "contact@example.com",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/in/",
    twitter: "https://twitter.com/",
    skills: ["Flutter", "Dart", "Firebase", "Node.js", "JavaScript", "HTML/CSS", "Three.js", "REST APIs", "Figma"],
    avatar: null  // set to an image path if you have one
};

const apps = [
    {
        id: "safepay",
        name: "SafePay",
        tagline: "Secure Escrow Payments",
        description: "SafePay is a cutting-edge fintech application that introduces escrow-based payments to protect both buyers and sellers. Funds are held securely until both parties confirm the transaction, eliminating fraud and giving users complete peace of mind.",
        longDescription: `SafePay revolutionises digital payments by putting security first. Traditional payment apps transfer money immediately — leaving buyers vulnerable if a seller doesn't deliver. SafePay holds funds in a secure escrow vault until both parties are satisfied.\n\nBuilt on Firebase with end-to-end encryption, every rupee is traceable and protected. The app supports instant KYC, real-time notifications, and a built-in dispute resolution system.`,
        category: "Finance",
        icon: "images/safepay.png",
        android: "download/SafePay.apk",
        version: "1.0.1",
        size: "67 MB",
        minOS: "Android 6.0+",
        rating: 4.8,
        downloads: "500+",
        screenshots: [],   // add screenshot paths here e.g. "images/safepay-ss1.png"
        features: [
            "Escrow-based secure payments",
            "Real-time transaction tracking",
            "Built-in dispute resolution",
            "Trusted contacts list",
            "Instant KYC verification",
            "End-to-end encryption",
            "QR code payments",
            "Multi-currency support"
        ],
        tags: ["Finance", "Payments", "Security", "Fintech"],
        color: "#00d4ff",   // accent colour for cards/details
        gradient: "linear-gradient(135deg, #0a0a2e 0%, #001f4d 50%, #003380 100%)"
    },
    {
        id: "civildpr",
        name: "Civil DPR",
        tagline: "Construction Management System",
        description: "Civil DPR & Attendance Management is an all-in-one platform for construction companies. Manage multiple sites, track daily progress reports (DPR), record attendance with geo-fencing, and generate PDF reports — all from your phone.",
        longDescription: `Civil DPR transforms how construction projects are managed on-site. Whether you're a site supervisor or a project manager overseeing multiple locations, Civil DPR gives you real-time visibility into attendance, materials, labour, and daily progress.\n\nWith GPS-based geo-fencing, only personnel physically on-site can mark attendance — preventing proxy entries. Supervisors can submit detailed daily progress reports with photos, and admins get a consolidated dashboard across all projects.`,
        category: "Productivity",
        icon: "images/civildpr.png",
        android: null,
        version: "1.0.1",
        size: "24 MB",
        minOS: "Android 7.0+",
        rating: 4.9,
        downloads: "200+",
        screenshots: [],
        features: [
            "Daily Progress Reports (DPR)",
            "GPS geo-fenced attendance",
            "Multi-site project management",
            "Role-based access (Admin / Supervisor / Engineer)",
            "PDF report generation",
            "Camera-based photo capture",
            "Offline mode support",
            "Analytics dashboard"
        ],
        tags: ["Construction", "Productivity", "Management", "Attendance"],
        color: "#ff8c00",
        gradient: "linear-gradient(135deg, #1a0a00 0%, #3d1f00 50%, #6b3300 100%)"
    }
    // ─────────────────────────────────────────────
    // Add more apps below following the same format
    // ─────────────────────────────────────────────
];

// Derive unique categories for filter chips
const categories = ["All", ...new Set(apps.map(a => a.category))];
