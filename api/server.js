import "dotenv/config";
import express from "express";
import cors from "cors";
import transcribeRoutes from "./routes/transcribe.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS }));
app.use(express.json());

app.use("/api", transcribeRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    message: "Server is running smoothly",
    timestamp: new Date().toISOString(),
  });
});

export default app;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}