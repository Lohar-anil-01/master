const validateProject = (req, res, next) => {
    const { projectName, dbUrl } = req.body;

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