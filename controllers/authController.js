const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utility/TokenGenerate");

const registerUser = async (req, res) => {
  const {name, email, password} = req.body;

  try {
    // check user already register or not
    const userExists = await User.findOne({ email });
    if (userExists){
      return res.status(400).json({message: "User already exists"});
    }

    //psw hashed
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
//new user create
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
});

// Return success response with token
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch(err) {
    res.status(500).json({message: "Server error", error: err.message});
  }
};


//Login
const loginUser = async (req, res) => {
    const {email, password} = req.body;
  
    try {
      const user = await User.findOne({ email });
      if(!user){
        return res.status(401).json({message: "Invalid email or psw"});
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch){
        return res.status(401).json({message: "Invalid email or password"});
      }
  
      // Successful login
      res.status(200).json({
        message: "Login successful",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        token: generateToken(user._id),
      });
    } catch(err){
      res.status(500).json({message: "Server error", error: err.message});
    }
  };
  


  module.exports = {
    registerUser,
    loginUser,
  };