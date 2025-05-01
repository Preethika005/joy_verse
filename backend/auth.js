// routes/auth.js
import express from "express";
import User from "./User.js";
import bcrypt from "bcryptjs"; //hashing passwords securely.

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { fullName, email, username, password, role } = req.body;//Extracts user data from the request body.

  try {
    const existingUser = await User.findOne({ username });//check if username is already taken
    if (existingUser) return res.status(400).json({ message: "Username already taken" }); //If taken, return an error.

    const hashedPassword = await bcrypt.hash(password, 10);//Hash the password using bcrypt. 10 is the salt rounds – higher means more secure but slower.

    const newUser = new User({
      fullName,
      email,
      username,
      password: hashedPassword,
      role: role ,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" }); //Save user to the database and respond with success.
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body; //Get login data from the request.

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid username" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    res.status(200).json({ message: "Login successful", username: user.username, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/children", async (req, res) => {
  try {
    const children = await User.find({ role: "child" }).select("username email");
    res.json(children);
  } catch (error) {
    console.error("Error fetching children:", error);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
