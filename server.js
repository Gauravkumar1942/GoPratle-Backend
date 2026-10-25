const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const Requirement = require("./models/Requirement");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Submit Requirement (categorized under planner, performer, or crew)
app.post("/api/requirements", async (req, res) => {
  try {
    const {
      eventName,
      eventType,
      startDate,
      location,
      category,
      categoryDetails,
      contact,
    } = req.body;

    // Basic validation
    if (!eventName || !eventType || !startDate || !location || !category) {
      return res
        .status(400)
        .json({ error: "Please fill in all required Step 1 event basics." });
    }

    if (!["planner", "performer", "crew"].includes(category)) {
      return res.status(400).json({
        error: "Invalid category. Must be planner, performer, or crew.",
      });
    }

    if (!contact?.name || !contact?.email || !contact?.phone) {
      return res
        .status(400)
        .json({ error: "Contact name, email, and phone are required." });
    }

    const requirement = new Requirement(req.body);
    const saved = await requirement.save();

    res.status(201).json({
      success: true,
      message: `Requirement successfully posted under ${category}!`,
      data: saved,
    });
  } catch (error) {
    console.error("Error saving requirement:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to save requirement" });
  }
});

// 2. Get All Requirements (with optional category filter)
app.get("/api/requirements", async (req, res) => {
  try {
    const { category } = req.query;
    const filter =
      category && ["planner", "performer", "crew"].includes(category)
        ? { category }
        : {};
    const requirements = await Requirement.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requirements.length,
      category: category || "all",
      data: requirements,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get Requirement by ID or Reference
app.get("/api/requirements/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = id.startsWith("GP-") ? { referenceId: id } : { _id: id };
    const requirement = await Requirement.findOne(query);

    if (!requirement) {
      return res.status(404).json({ error: "Requirement not found" });
    }

    res.json({ success: true, data: requirement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server & Connect Database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`GoPratle Backend running on http://localhost:${PORT}`);
  });
});
