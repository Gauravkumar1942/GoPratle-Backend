const mongoose = require("mongoose");

const RequirementSchema = new mongoose.Schema(
  {
    referenceId: {
      type: String,
      unique: true,
    },
    // Step 1: Event Basics
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    dateType: {
      type: String,
      enum: ["single", "range"],
      default: "single",
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    venue: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: String,
      required: true,
      enum: ["planner", "performer", "crew"],
    },

    categoryDetails: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },

    contact: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      organization: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

// Auto-generate GoPratle reference code
// RequirementSchema.pre("save", function (next) {
//   if (!this.referenceId) {
//     const code = this.category
//       ? this.category.slice(0, 3).toUpperCase()
//       : "EVT";
//     const num = Math.floor(1000 + Math.random() * 9000);
//     this.referenceId = `GP-${code}-${num}`;
//   }
//   next();
// });

module.exports = mongoose.model("Requirement", RequirementSchema);
