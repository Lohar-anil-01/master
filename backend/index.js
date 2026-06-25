import express from "express";
import cors from "cors";
const app = express();
const PORT = 8001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.send("Server working...");
});

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}/health`);
});
