const express = require("express");
const { authenticate } = require("../middleware/auth");
const userService = require("../services/userService");
const { formatUserResponse } = require("../utils/formatters");

const router = express.Router();

// GET /api/users/:id
router.get("/:id", authenticate, async (req, res) => {
  const user = await userService.getById(req.params.id);
  res.json({ user: user.toJSON() });
});

// GET /api/users/me/profile
router.get("/me/profile", authenticate, async (req, res) => {
  try {
    const user = await userService.getById(req.userId);
    const formatted = formatUserResponse(user);
    res.header('Access-Control-Allow-Origin', '*').json({ user: formatted });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// PUT /api/users/me/profile
router.put(
  "/me/profile",
  authenticate,
  [
    body("avatar").optional().isURL().withMessage("Avatar must be a valid URL"),
    body("bio").optional().isString().trim().isLength({ max: 255 }).withMessage("Bio must be a string up to 255 characters"),
    body("phone").optional().isMobilePhone("any").withMessage("Phone number must be a valid mobile number"),
    body("email").optional().custom((value) => { if (value === null) throw new Error("Email cannot be null"); return true; }).isEmail().withMessage("Email must be a valid email address"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updateData = {};
      if (req.body.avatar !== undefined) updateData.avatar = req.body.avatar;
      if (req.body.bio !== undefined) updateData.bio = req.body.bio;
      if (req.body.phone !== undefined) updateData.phone = req.body.phone;
      if (req.body.email !== undefined) updateData.email = req.body.email;

      const user = await userService.updateProfile(req.userId, updateData);
      res.json({
        message: "Profile updated successfully",
        user: user.toJSON(),
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  }
);

module.exports = router;
