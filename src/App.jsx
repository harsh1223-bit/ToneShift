import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

/* ===================== LOGIN ===================== */

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("https://toneshift-backend.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const token = await response.text();

      if (!response.ok) {
        setMessage("Invalid credentials ❌");
        return;
      }

      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (error) {
      setMessage("Something went wrong ❌");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "10px" }}>
  🔁 ToneShift
</div>
        <h2>ToneShift AI</h2>
<p style={{ fontSize: "13px", color: "#666" }}>
  Professional Email Tone Rewriter
</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>

        <p style={styles.message}>{message}</p>
      </div>
    </div>
  );
}

/* ===================== DASHBOARD ===================== */
function Dashboard() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [tone, setTone] = useState("Professional");
  const [outputText, setOutputText] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRewrite = async () => {
    const token = localStorage.getItem("token");

    if (!inputText.trim()) {
      alert("Please enter a message.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://toneshift-backend.onrender.com/ai/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: inputText,
          tone: tone,
        }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }
        throw new Error("Rewrite failed");
      }

      const result = await response.json();

      setOutputText(result.rewrittenContent);

      setHistory([
        {
          original: inputText,
          rewritten: result.rewrittenContent,
          tone: tone,
          date: new Date().toLocaleString(),
        },
        ...history,
      ]);

      setInputText("");
    } catch (error) {
      alert("Something went wrong while rewriting.");
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.card, width: "700px" }}>

        {/* Header */}
        <div style={{ marginBottom: "25px", textAlign: "center" }}>
          <div style={{ fontSize: "28px", fontWeight: "bold" }}>
            🔁 ToneShift
          </div>
          <div style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
            Instantly transform your emails with AI-powered tone control.
          </div>
        </div>

        {/* Tone Selector */}
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          style={styles.select}
        >
          <option>Professional</option>
          <option>Formal</option>
          <option>Casual</option>
          <option>Friendly</option>
        </select>

        {/* Textarea */}
        <textarea
          placeholder="Enter your message here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={styles.textarea}
        />

        {/* Rewrite Button */}
        <button onClick={handleRewrite} style={styles.button}>
          {loading ? "Rewriting..." : "Rewrite Message"}
        </button>

        {/* Output */}
        {outputText && (
          <>
            <h3 style={{ marginTop: "20px" }}>Rewritten Message</h3>
            <div style={styles.outputBox}>{outputText}</div>
          </>
        )}

        {/* History */}
        {history.length > 0 && (
          <>
            <h3 style={{ marginTop: "25px" }}>Previous Rewrites</h3>
            <div style={styles.historyContainer}>
              {history.map((item, index) => (
                <div key={index} style={styles.historyItem}>
                  <p><strong>Tone:</strong> {item.tone}</p>
                  <p><strong>Original:</strong> {item.original}</p>
                  <p><strong>Rewritten:</strong> {item.rewritten}</p>
                  <small>{item.date}</small>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Logout */}
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>

      </div>
    </div>
  );
}

/* ===================== PRIVATE ROUTE ===================== */

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

/* ===================== ROUTER ===================== */

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

/* ===================== STYLES ===================== */

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  card: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    textAlign: "center",
    overflowY: "auto",
    maxHeight: "90vh",
  },
  title: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    resize: "vertical",
  },
  select: {
    width: "100%",
    padding: "8px",
    marginBottom: "15px",
    borderRadius: "6px",
  },
  button: {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "linear-gradient(90deg, #4e73df, #6f42c1)",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px",
  transition: "all 0.3s ease",
  transform: "scale(1)",
},
  logoutButton: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#e74a3b",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "20px",
  },
  message: {
    marginTop: "10px",
    color: "red",
  },
  outputBox: {
    backgroundColor: "#f8f9fc",
    padding: "15px",
    borderRadius: "6px",
    marginTop: "10px",
    textAlign: "left",
    whiteSpace: "pre-wrap",
  },
  historyContainer: {
    marginTop: "15px",
    textAlign: "left",
  },
  historyItem: {
    background: "#eef1ff",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "10px",
  },
};

export default App;