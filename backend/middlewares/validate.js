const validateProject = (req, res, next) => {
  const { username, email, password, projectName, dbUrl } = req.body;

  if (!username || username.trim() === "") {
    return res.status(400).json({ error: "Username is required" });
  }

  if (!email || email.trim() === "") {
    return res.status(400).json({ error: "Email is required" });
  }

  if (!password || password.trim() === "") {
    return res.status(400).json({ error: "Password is required" });
  }

  if (!projectName || projectName.trim() === "") {
    return res.status(400).json({ error: "Project name is required" });
  }

  if (!dbUrl || dbUrl.trim() === "") {
    return res.status(400).json({ error: "Database URL is required" });
  }

  if (!req.file) {
    return res.status(400).json({ error: "Logo image is required" });
  }

  next();
};

export default validateProject;
