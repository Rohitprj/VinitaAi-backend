import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { sendEmail } from "../utils/nodemailer.js";

const register = async (req, res) => {
  try {
    const { username, email, phone, booksRead, city, country, gender, age } =
      req.body;

    if (!username || !email || !phone || !gender || !age) {
      return res.status(400).json({ message: "These fields are required" });
    }

    const existingUserByEmail = await User.findOne({ email });
    const existingUserByPhone = await User.findOne({ phone });

    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ message: "User already existed with this email" });
    }
    if (existingUserByPhone) {
      return res
        .status(400)
        .json({ message: "User already existed with this phone" });
    }

    if (existingUserByEmail || existingUserByPhone) {
      const verifyToken = jwt.sign(
        { userId: existingUserByEmail._id },
        process.env.EMAIL_VERIFY_SECRET,
        { expiresIn: process.env.EMAIL_TOKEN_EXPIRY }
      );
      const verifyLink = `${process.env.CLIENT_URL}/verify/${verifyToken}`;

      await sendEmail({
        to: email,
        subject: "Verify your email to visit Vinita AI chatbot",
        html: `<p>Hi ${existingUserByEmail.username},</p>
               <p>Click the link to verify your email and continue:</p>
               <a href="${verifyLink}">${verifyLink}</a>
               <p>This link expires in 24 hours.</p>`,
      });

      return res.status(200).json({
        success: true,
        message: "User already exists. Verification email sent again.",
      });
    }

    const user = await User.create({
      username,
      email,
      phone,
      booksRead,
      city,
      country,
      gender,
      age,
    });

    const verifyToken = jwt.sign(
      { userId: user._id },
      process.env.EMAIL_VERIFY_SECRET,
      { expiresIn: process.env.EMAIL_TOKEN_EXPIRY }
    );

    const verifyLink = `${process.env.CLIENT_URL}/verify/${verifyToken}`;

    await sendEmail({
      to: email,
      subject: "Verify your email to visit Vinita AI chatbot",
      html: `<p>Hi ${username},</p>
             <p>Click the link to verify your email and continue:</p>
             <a href="${verifyLink}">${verifyLink}</a>
             <p>This link expires in 24 hours.</p>`,
    });

    return res
      .status(200)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decode = jwt.verify(token, process.env.EMAIL_VERIFY_SECRET);
    const user = await User.findById(decode.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.verified)
      return res.json({ message: "Already verified go Login" });

    user.verified = true;
    await user.save();

    res
      .status(200)
      .json({ message: "Email verified. Now your login via app." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email }).select("+authToken");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.verified) {
      return res
        .status(403)
        .json({ message: "Please verify your email first" });
    }

    // Check if the user already has a valid token
    if (user.authToken) {
      return res.json({
        success: true,
        message: "Login successful",
        token: user.authToken, // Return the existing token
        user: {
          id: user._id,
          name: user.username,
          email: user.email,
          phone: user.phone,
          booksRead: user.booksRead,
          city: user.city,
          country: user.country,
          gender: user.gender,
          age: user.age,
        },
      });
    }

    // if (!user.password) {
    //   const hashed = await bcrypt.hash(password, 10);
    //   user.password = hashed;
    // } else {
    //   const isMatch = await bcrypt.compare(password, user.password);
    //   console.log("Compare Hashed", isMatch);
    //   if (!isMatch) {
    //     return res.status(401).json({ message: "Invalid credentials" });
    //   }
    // }

    const token = jwt.sign(
      { userId: user._id },
      process.env.AUTH_TOKEN_SECRET,
      { expiresIn: process.env.AUTH_TOKEN_EXPIRY }
    );

    user.authToken = token;
    await user.save();

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        phone: user.phone,
        booksRead: user.booksRead,
        city: user.city,
        country: user.country,
        gender: user.gender,
        age: user.age,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.json({ message: "No active session" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.json({ message: "No active session" });

    const user = await User.findOne({ authToken: token });
    if (user) {
      user.authToken = undefined;
      await user.save();
    }

    return res.json({ message: "Logged out" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export { register, verifyEmail, login, logout };
