import express from "express";
const app = express();

import contactRoute from "./route/contactRoute.js";

app.use(express.json());
app.use("/contact", contactRoute);

app.use((error, req, res, next) => {
  res.status(500).json({
    success: false,
    message: error.message,
  });
});

app.listen(8000, () => console.log(`Server started successfully 🚀`));
