import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Course", "Training", "Certification", "IEEE", "Volunteering", "Appreciation", "Membership", "Other"],
      default: "Other"
    },
    issueDate: { type: String, default: "" },
    credentialId: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Certificate", certificateSchema);
