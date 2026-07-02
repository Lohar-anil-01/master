import { useState } from "react";
import axios from "axios";
import companyLogo from "../../assets/SAS_Logo_PNG.png";
import "./RegisterForm.css";

// ── Stepper ──
function Stepper({ current }) {
  return (
    <div className="stepper">
      <div className="step-wrap">
        <div className={`step-circle ${current > 1 ? "done" : "active"}`}>
          {current > 1 ? "✓" : "1"}
        </div>
        <span className={`step-label ${current === 1 ? "active" : ""}`}>
          Account
        </span>
      </div>
      <div className="step-divider">
        <div className={`step-divider-fill ${current > 1 ? "filled" : ""}`} />
      </div>

      <div className="step-wrap">
        <div
          className={`step-circle ${current > 2 ? "done" : current === 2 ? "active" : ""}`}
        >
          {current > 2 ? "✓" : "2"}
        </div>
        <span className={`step-label ${current === 2 ? "active" : ""}`}>
          Project Info
        </span>
      </div>
      <div className="step-divider">
        <div className={`step-divider-fill ${current > 2 ? "filled" : ""}`} />
      </div>

      <div className="step-wrap">
        <div className={`step-circle ${current === 3 ? "active" : ""}`}>3</div>
        <span className={`step-label ${current === 3 ? "active" : ""}`}>
          Database
        </span>
      </div>
    </div>
  );
}

// ── Step 0 ──

function StepZero({ data, onChange, onNext }) {
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!data.username.trim()) e.username = "Username is required";
    if (!data.email.trim()) {
      e.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      e.email = "Enter a valid email";
    }
    if (!data.password.trim()) {
      e.password = "Password is required";
    } else if (data.password.length < 6) {
      e.password = "Password must be at least 6 characters";
    }
    return e;
  }

  function handleNext() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    onNext();
  }

  return (
    <div>
      <p className="form-title">Create Your Account</p>
      <p className="form-subtitle">Let's start with your basic details.</p>

      <div className="field">
        <label htmlFor="username">Username</label>
        <div className="input-wrap">
          <span className="input-icon">👤</span>
          <input
            id="username"
            name="username"
            autoComplete="username"
            type="text"
            placeholder="e.g. Anil Kumar"
            value={data.username}
            className={errors.username ? "error-input" : ""}
            onChange={(e) => {
              onChange("username", e.target.value);
              setErrors((p) => ({ ...p, username: null }));
            }}
          />
        </div>
        {errors.username && <p className="error-msg">⚠ {errors.username}</p>}
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <div className="input-wrap">
          <span className="input-icon">✉️</span>
          <input
            id="email"
            name="email"
            autoComplete="email"
            type="email"
            placeholder="e.g. person@company.com"
            value={data.email}
            className={errors.email ? "error-input" : ""}
            onChange={(e) => {
              onChange("email", e.target.value);
              setErrors((p) => ({ ...p, email: null }));
            }}
          />
        </div>
        {errors.email && <p className="error-msg">⚠ {errors.email}</p>}
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <div className="input-wrap">
          <span className="input-icon">🔒</span>
          <input
            id="password"
            name="password"
            autoComplete="new-password"
            type="password"
            placeholder="Min 6 characters"
            value={data.password}
            className={errors.password ? "error-input" : ""}
            onChange={(e) => {
              onChange("password", e.target.value);
              setErrors((p) => ({ ...p, password: null }));
            }}
          />
        </div>
        {errors.password && <p className="error-msg">⚠ {errors.password}</p>}
      </div>

      <div className="btn-row">
        <button className="btn-primary" onClick={handleNext}>
          Continue →
        </button>
      </div>
    </div>
  );
}

// ── Step 1 ──
function StepOne({ data, onChange, onBack, onNext }) {
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!data.projectName.trim()) e.projectName = "Project name is required";
    if (!data.logo) e.logo = "Please upload a project logo";
    return e;
  }

  function handleNext() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    onNext();
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    onChange("logo", {
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    });
    setErrors((p) => ({ ...p, logo: null }));
  }

  return (
    <div>
      <p className="form-title">Project Details</p>
      <p className="form-subtitle">
        Tell us about your project — this will appear on your dashboard.
      </p>

      <div className="field">
        <label>Project Name</label>
        <div className="input-wrap">
          <span className="input-icon">📋</span>
          <input
            type="text"
            placeholder="e.g. Sensor Monitoring"
            value={data.projectName}
            className={errors.projectName ? "error-input" : ""}
            onChange={(e) => {
              onChange("projectName", e.target.value);
              setErrors((p) => ({ ...p, projectName: null }));
            }}
          />
        </div>
        {errors.projectName && (
          <p className="error-msg">⚠ {errors.projectName}</p>
        )}
      </div>

      <div className="field">
        <label>Project/Company Logo</label>
        <div className={`logo-upload-area ${data.logo ? "has-image" : ""}`}>
          <input type="file" accept="image/*" onChange={handleFile} />
          {data.logo ? (
            <div className="logo-preview">
              <img src={data.logo.preview} alt="preview" />
              <div>
                <p className="logo-preview-name">{data.logo.name}</p>
                <p className="logo-change-hint">Click to change</p>
              </div>
            </div>
          ) : (
            <>
              <div className="upload-icon">🖼️</div>
              <p className="upload-text">
                <span>Click to upload</span> your logo
              </p>
              <p className="upload-text" style={{ marginTop: 4, fontSize: 12 }}>
                PNG, JPG, SVG — max 2MB
              </p>
            </>
          )}
        </div>
        {errors.logo && <p className="error-msg">⚠ {errors.logo}</p>}
      </div>

      <div className="btn-row">
        <button className="btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <button className="btn-primary" onClick={handleNext}>
          Continue →
        </button>
      </div>
    </div>
  );
}

// ── Step 2 ──
function StepTwo({ data, onChange, onBack, onSubmit, loading }) {
  const [errors, setErrors] = useState({});
  const [showInfo, setShowInfo] = useState(false);

  function validate() {
    const e = {};
    if (!data.dbUrl.trim()) {
      e.dbUrl = "Database connection string is required";
    } else if (!data.dbUrl.toLowerCase().startsWith("mysql://")) {
      e.dbUrl = 'Must start with "mysql://"';
    }
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    onSubmit();
  }

  return (
    <div>
      <p className="form-title">Database Setup</p>
      <p className="form-subtitle">
        Your data stays on your server. We only use this to connect securely.
      </p>

      <div className="field">
        <label>
          Provide your data URL from PcVue
          <button
            type="button"
            className="info-btn"
            onClick={() => setShowInfo(true)}
          >
            ⓘ
          </button>
        </label>
        <div className="input-wrap">
          <span className="input-icon">🗄️</span>
          <input
            type="text"
            placeholder="Server=192.168.1.10,1433;Database=ScadaDB;User Id=sa;Password=****;"
            value={data.dbUrl}
            className={errors.dbUrl ? "error-input" : ""}
            onChange={(e) => {
              onChange("dbUrl", e.target.value);
              setErrors((p) => ({ ...p, dbUrl: null }));
            }}
          />
        </div>
        {errors.dbUrl && <p className="error-msg">⚠ {errors.dbUrl}</p>}

        <div className="db-hint">
          <p className="db-hint-label">Expected format</p>
          <p className="db-hint-value">
            Server=host,port;Database=db_name;User
            Id=username;Password=your_password;
          </p>
        </div>
      </div>

      {showInfo && (
        <div className="info-overlay" onClick={() => setShowInfo(false)}>
          <div className="info-popup" onClick={(e) => e.stopPropagation()}>
            <p className="info-popup-title">Where do I find this in PcVue?</p>
            <ol className="info-popup-steps">
              <li>
                Open <strong>SQL Server Management Studio (SSMS)</strong> and
                connect to your PcVue database server
              </li>
              <li>
                Right-click your server → Properties, note the{" "}
                <strong>Server name</strong> (host, port)
              </li>
              <li>
                In PcVue project settings, find the{" "}
                <strong>Database name</strong> your project logs to
              </li>
              <li>
                Use the SQL login <strong>User Id</strong> and{" "}
                <strong>Password</strong> your admin created
              </li>
              <li>
                Combine:{" "}
                <code>
                  Server=host,1433;Database=db;User Id=user;Password=pass;
                </code>
              </li>
            </ol>
            <button className="btn-primary" onClick={() => setShowInfo(false)}>
              Got it
            </button>
          </div>
        </div>
      )}

      <div className="btn-row">
        <button className="btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register Project ✓"}
        </button>
      </div>
    </div>
  );
}

// ── Success ──
function SuccessScreen({ data }) {
  return (
    <div className="success-screen">
      <div className="success-icon">✓</div>
      <p className="success-title">You're all set!</p>
      <p className="success-sub">
        Your project has been registered.
        <br />
        Your SCADA dashboard is being configured.
      </p>
      <div className="success-summary">
        <div className="summary-row">
          <span className="summary-key">Project</span>
          <span className="summary-val">{data.projectName}</span>
        </div>
        <div className="summary-row">
          <span className="summary-key">Logo</span>
          <img className="summary-logo" src={data.logo?.preview} alt="logo" />
        </div>
        <div className="summary-row">
          <span className="summary-key">Database</span>
          <span className="summary-val">
            {data.dbUrl.replace(/Password=[^;]+/i, "Password=••••••")}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main ──
export default function RegisterForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    projectName: "",
    logo: null,
    dbUrl: "",
  });

  function handleChange(key, value) {
    setFormData((p) => ({ ...p, [key]: value }));
  }

  async function handleSubmit() {
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("username", formData.username);
      payload.append("email", formData.email);
      payload.append("password", formData.password);
      payload.append("projectName", formData.projectName);
      payload.append("dbUrl", formData.dbUrl);
      payload.append("logo", formData.logo.file);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/projects/register`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      console.log("Success:", response.data);
      setSubmitted(true);
    } catch (err) {
      console.error("Error:", err);
      alert(err.response?.data?.error || "Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="page">
        <div className="card">
          <div className="brand-header">
            <div className="brand-logo-circle">
              <img src={companyLogo} alt="Company Logo" />
            </div>
            <div>
              <p className="brand-name">SAS Automation</p>
              <p className="brand-sub">Project Registration</p>
            </div>
          </div>

          {!submitted && <Stepper current={step} />}

          {submitted ? (
            <SuccessScreen data={formData} />
          ) : step === 1 ? (
            <StepZero
              data={formData}
              onChange={handleChange}
              onNext={() => setStep(2)}
            />
          ) : step === 2 ? (
            <StepOne
              data={formData}
              onChange={handleChange}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          ) : (
            <StepTwo
              data={formData}
              onChange={handleChange}
              onBack={() => setStep(2)}
              onSubmit={handleSubmit}
              loading={loading}
            />
          )}

          <p className="footer-credit">
            Designed & Developed by <span>SAS Automation Pvt. Ltd.</span>
          </p>
        </div>
      </div>
    </>
  );
}
