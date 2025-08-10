const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const coinsRoutes = require("./routes/coins");
const watchlistRoutes = require("./routes/watchlist");
const followersRoutes = require("./routes/followers");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/coins", coinsRoutes);
app.use("/watchlist", watchlistRoutes);
app.use("/follow", followersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
