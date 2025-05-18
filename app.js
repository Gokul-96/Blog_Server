const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const DB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

dotenv.config(); 
const app =express();
DB();

app.use(cors());
app.use(express.json());


app.use("/auth",authRoutes);
app.use("/api/blogs",blogRoutes);

const PORT = process.env.PORT || 8000;

//server start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});