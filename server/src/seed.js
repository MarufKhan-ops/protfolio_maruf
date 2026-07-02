import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./db.js";
import Admin from "./models/Admin.js";
import Certificate from "./models/Certificate.js";
import Project from "./models/Project.js";
import mongoose from "mongoose";

const certificates = [
  {
    title: "Full Stack Web Development with JavaScript (MERN)",
    issuer: "Ostad",
    category: "Course",
    issueDate: "January 2024",
    credentialId: "C22360",
    description: "6-month intensive course covering React, Node.js, Express and MongoDB.",
    image: "/uploads/certificates/fullstack-ostad.jpg",
    featured: true,
    order: 1
  },
  {
    title: "Industrial Training — Networking (CCNA)",
    issuer: "Bogura IT Training Center",
    category: "Training",
    issueDate: "Dec 2021 – Mar 2022",
    description: "Hands-on industrial training in Cisco networking fundamentals.",
    image: "/uploads/certificates/ccna-networking.jpg",
    featured: true,
    order: 2
  },
  {
    title: "National Skill Certificate-I in Graphic Design (NTVQF Level-I)",
    issuer: "Bangladesh Technical Education Board (VTTI, Bogra)",
    category: "Certification",
    issueDate: "02 October 2020",
    credentialId: "SL 2373106",
    description: "National competency certification covering design fundamentals and industry-standard tools.",
    image: "/uploads/certificates/graphic-design-ntvqf.jpg",
    featured: true,
    order: 3
  },
  {
    title: "Ambassador — 4th Intl. Congress on Recent Trends in Computer Science (ICRCS-2025)",
    issuer: "IEEE CS BDC / ICRCS",
    category: "Appreciation",
    issueDate: "17–18 April 2025",
    description: "Recognized for outstanding contribution as Ambassador of ICRCS-2025.",
    image: "/uploads/certificates/icrcs-ambassador.jpg",
    featured: true,
    order: 4
  },
  {
    title: "IEEE Volunteering — Chair, BUBT Student Branch (NPS05)",
    issuer: "IEEE",
    category: "IEEE",
    issueDate: "Jan 2023 – May 2024",
    description: "Official IEEE recognition of service to the mission and members of IEEE.",
    image: "/uploads/certificates/ieee-volunteering-chair.jpg",
    order: 5
  },
  {
    title: "General Secretary — IEEE BUBT Student Branch Executive Committee",
    issuer: "IEEE BUBT Student Branch",
    category: "IEEE",
    issueDate: "2024 – 2025",
    description: "In recognition of valuable service as General Secretary during the 2024–2025 tenure.",
    image: "/uploads/certificates/ieee-general-secretary.jpg",
    order: 6
  },
  {
    title: "IEEE Young Professionals — Certificate of Membership",
    issuer: "IEEE Young Professionals",
    category: "Membership",
    issueDate: "2026",
    description: "Member in good standing, denoting commitment to the advancement of technology.",
    image: "/uploads/certificates/ieee-young-professionals.jpg",
    order: 7
  },
  {
    title: "Workshop Volunteer — Android-Controlled Robotics",
    issuer: "IEEE Computer Society BUBT Student Branch Chapter",
    category: "Volunteering",
    issueDate: "6 May 2024",
    description: "Volunteered in a one-day robotics workshop organized by IEEE CS BUBT SB Chapter.",
    image: "/uploads/certificates/robotics-workshop-volunteer.jpg",
    order: 8
  },
  {
    title: "Crew Facilitator — Rocket Adventure Day",
    issuer: "Space Innovation Camp",
    category: "Volunteering",
    issueDate: "05 July 2025",
    description: "Facilitated crews during Rocket Adventure Day by Space Innovation Camp.",
    image: "/uploads/certificates/rocket-adventure-day.jpg",
    order: 9
  },
  {
    title: "Outstanding Contribution — Campus Art & Wall Painting",
    issuer: "IEEE BUBT Student Branch",
    category: "Appreciation",
    issueDate: "2024",
    description: "Awarded for exceptional dedication and creative talent in painting and beautifying the campus.",
    image: "/uploads/certificates/campus-art-contribution.jpg",
    order: 10
  }
];

const projects = [
  {
    title: "A Hierarchical Multi-View Graph Learning Framework for Malicious URL Detection",
    period: "Jan – Apr 2026",
    description: "2-stage graph learning framework to detect and classify cyber threats — 98.91% binary and 93.00% multiclass accuracy. Publication ongoing (IEEE).",
    tags: ["Graph Learning", "Cybersecurity", "Deep Learning"],
    order: 1
  },
  {
    title: "Explainable Early Sepsis Prediction in ICU using Self-Attention LSTM & Focal Loss",
    period: "Jan – Apr 2026",
    description: "Deep Attention-LSTM model predicting ICU sepsis 6 hours before clinical onset using the PhysioNet 2019 dataset.",
    tags: ["LSTM", "Healthcare AI", "Explainable AI"],
    order: 2
  },
  {
    title: "Deep Learning Based Network Intrusion Detection System",
    period: "Jul 2025 – Present",
    description: "System using deep learning to detect network threats and prevent unauthorized access accurately.",
    tags: ["Deep Learning", "Network Security"],
    order: 3
  },
  {
    title: "Smart E-Commerce User Platform (Full-Stack)",
    period: "2025",
    description: "Full-stack e-commerce system with JWT & OTP auth, product management, reviews, cart, wishlist, invoices and SSLCommerz (bKash & card) payment integration.",
    tags: ["React", "Express.js", "MongoDB", "SSLCommerz"],
    order: 4
  },
  {
    title: "Pharmacy Data Analytics Dashboard",
    period: "Jan – May 2025",
    description: "Analytics dashboard for pharmacy sales and inventory insight.",
    tags: ["Data Analytics", "Dashboard"],
    link: "https://github.com/TeamPentagon5/Pharmacy-Data-Analytics-Dashboard",
    order: 5
  },
  {
    title: "Li-Fi Data Transfer System for Sound Pollution Control",
    period: "December 2024",
    description: "Li-Fi–based vehicle communication system using LDR sensors and Arduino to reduce noise pollution.",
    tags: ["Li-Fi", "Arduino", "IoT"],
    order: 6
  }
];

async function seed() {
  await connectDB();

  // Admin
  const email = (process.env.ADMIN_EMAIL || "maruf333444@gmail.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "maruf@1234";
  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.findOneAndUpdate(
    { email },
    { email, passwordHash, name: "Istiyak Hasan Maruf" },
    { upsert: true, new: true }
  );
  console.log(`👤 Admin ready → ${email}`);

  // Certificates & projects (reset then insert)
  await Certificate.deleteMany({});
  await Certificate.insertMany(certificates);
  console.log(`📜 Seeded ${certificates.length} certificates`);

  await Project.deleteMany({});
  await Project.insertMany(projects);
  console.log(`🧩 Seeded ${projects.length} projects`);

  await mongoose.disconnect();
  console.log("✅ Seeding complete");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
