import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── MySQL connection
const localDbConfig = {
  host: "localhost",
  user: "root",
  password: "Sas@1234",
  database: "master_db",
};

const registerProject = async (req, res) => {
  console.log(req.body);

  const { username, email, password, projectName, dbUrl } = req.body;

  let localConnection;

  try {
    // 1. Local DB connection
    localConnection = await mysql.createConnection(localDbConfig);

    // 2. Email already exist
    const [existing] = await localConnection.execute(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existing.length > 0) {
      fs.unlinkSync(req.file.path);
      await localConnection.end();
      return res.status(400).json({ error: "Email already registered" });
    }

    // 3. Customer
    try {
      const customerConnection = await mysql.createConnection(dbUrl);
      await customerConnection.end();
    } catch (dbErr) {
      fs.unlinkSync(req.file.path);
      await localConnection.end();
      return res.status(400).json({
        error: "Database connection failed. Check your connection string.",
        detail: dbErr.message,
      });
    }

    // 4. Password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Logo path
    const logoPath = `/uploads/${req.file.filename}`;

    // 6. User ko local DB mein save karo
    await localConnection.execute(
      `INSERT INTO users (username, email, password, projectName, logo, dbUrl) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, email, hashedPassword, projectName, logoPath, dbUrl],
    );

    await localConnection.end();

    // 7. Config file for white-label
    const projectId = projectName.toLowerCase().replace(/\s+/g, "-");

    const config = {
      project: {
        id: projectId,
        name: projectName,
        logo: logoPath,
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
      `${projectId}.config.json`,
    );
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    // 8. Success response
    return res.status(201).json({
      message: "User and project registered successfully!",
      projectId,
    });
  } catch (err) {
    console.error("Register error:", err);
    if (localConnection) await localConnection.end();
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default registerProject;
