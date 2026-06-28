import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const registerProject = async (req, res) => {
  const { projectName, dbUrl } = req.body;

  // 1. DB Connection Test
  try {
    const connection = await mysql.createConnection(dbUrl);
    await connection.end();
  } catch (dbErr) {
    // Logo delete karo agar DB connect nahi hua
    fs.unlinkSync(req.file.path);
    return res.status(400).json({
      error: "Database connection failed. Check your connection string.",
      detail: dbErr.message,
    });
  }

  // 2. Config file generate karo
  try {
    const projectId = projectName.toLowerCase().replace(/\s+/g, "-");

    const config = {
      project: {
        id: projectId,
        name: projectName,
        logo: `/uploads/${req.file.filename}`,
        theme: {
          primary: "#E8720C",
          background: "#FDF6EE",
          accent: "#F59332",
        },
      },
      database: {
        connectionString: dbUrl,
      },
      createdAt: new Date().toISOString(),
    };

    const configPath = path.join(
      __dirname,
      "../projects",
      `${projectId}.config.json`
    );

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    return res.status(201).json({
      message: "Project registered successfully!",
      projectId,
      config,
    });

  } catch (err) {
    console.error("Config error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default registerProject;