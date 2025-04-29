const router = require("express").Router()
const User = require("../models/user.model")
const jwt = require("jsonwebtoken")

// JWT Secret - In a real app, this should be in an environment variable
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" })
}

// Register a new user
router.route("/register").post(async (req, res) => {
  try {
    console.log("POST /api/users/register - Registering new user")
    const { username, email, password, firstName, lastName } = req.body

    // Check if email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email ? "Email already in use" : "Username already taken",
      })
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password, // Will be hashed in the pre-save hook
      firstName,
      lastName,
    })

    const savedUser = await newUser.save()
    console.log("User registered successfully with ID:", savedUser._id)

    // Generate token
    const token = generateToken(savedUser._id)

    // Return user profile and token
    res.status(201).json({
      token,
      user: savedUser.getProfile(),
    })
  } catch (err) {
    console.error("Error in POST /api/users/register:", err.message)
    res.status(400).json({ message: err.message })
  }
})

// Login user
router.route("/login").post(async (req, res) => {
  try {
    console.log("POST /api/users/login - User login attempt")
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate token
    const token = generateToken(user._id)

    console.log("User logged in successfully:", user._id)

    // Return user profile and token
    res.json({
      token,
      user: user.getProfile(),
    })
  } catch (err) {
    console.error("Error in POST /api/users/login:", err.message)
    res.status(500).json({ message: err.message })
  }
})

// Get user profile (protected route)
router.route("/profile").get(async (req, res) => {
  try {
    // In a real implementation, you would extract the user ID from a JWT token
    // For now, we'll use a query parameter for demonstration
    const userId = req.query.userId
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ user: user.getProfile() })
  } catch (err) {
    console.error("Error in GET /api/users/profile:", err.message)
    res.status(500).json({ message: err.message })
  }
})

// Update user profile
router.route("/profile").put(async (req, res) => {
  try {
    // In a real implementation, you would extract the user ID from a JWT token
    const userId = req.query.userId
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const { firstName, lastName, preferences } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update fields
    if (firstName) user.firstName = firstName
    if (lastName) user.lastName = lastName
    if (preferences) {
      if (preferences.currency) user.preferences.currency = preferences.currency
      if (preferences.theme) user.preferences.theme = preferences.theme
      if (preferences.notifications) {
        if (preferences.notifications.email !== undefined)
          user.preferences.notifications.email = preferences.notifications.email
        if (preferences.notifications.push !== undefined)
          user.preferences.notifications.push = preferences.notifications.push
      }
    }

    await user.save()

    res.json({ user: user.getProfile() })
  } catch (err) {
    console.error("Error in PUT /api/users/profile:", err.message)
    res.status(500).json({ message: err.message })
  }
})

// Change password
router.route("/change-password").post(async (req, res) => {
  try {
    const userId = req.query.userId
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const { currentPassword, newPassword } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({ message: "Password updated successfully" })
  } catch (err) {
    console.error("Error in POST /api/users/change-password:", err.message)
    res.status(500).json({ message: err.message })
  }
})

module.exports = router