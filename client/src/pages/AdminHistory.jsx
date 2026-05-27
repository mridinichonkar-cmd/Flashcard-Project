import { useState, useEffect } from 'react'
import "../index.css";
import { Link, useNavigate } from "react-router-dom";
import {Input} from "antd";
import {UserOutlined, SearchOutlined} from "@ant-design/icons";

import { FaBolt } from 'react-icons/fa';

function AdminHistory() {

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterDeck, setFilterDeck] = useState("All");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [error, setError] = useState(null);   

    useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch user data");
        return res.json();

      })
      .then(data => {
        if (!data?.user || data.user.role !== "admin") {
          navigate("/");  // redirect non-admins
        } else {
          setUser(data.user);
        }
      })
      .catch(err => {
          console.error(err);
          navigate("/");
        });
  }, []);

    useEffect(() => {
      if (!user) return; 
    fetch("http://localhost:5000/api/history/view_history", { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch history data");
        return res.json();
      })
      .then(data => {
        setRecords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setError(error.message);
        setLoading(false);
        
      });
  }, [user]);

    const decks = ["All", ...new Set(records.map(r => r.deck || "General"))];
    const filtered = records
        .filter(r => filterDeck === "All" || (r.deck || "General") === filterDeck)
        .filter(r => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            r.question?.toLowerCase().includes(q) ||
            r.answer?.toLowerCase().includes(q) ||
            r.user?.username?.toLowerCase().includes(q) ||
            r.user?.email?.toLowerCase().includes(q)
        );
    });
    
    const handleLogout = async () => {
      try{
        await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
        });
        navigate("/login");
  } catch (err) {
      setError("Logout failed");
  }
    };

    if (loading){
      return (
        <div className="app">
          <header className="app-header">
            <div className="logo">
              <FaBolt color="orange" size="2em" />
              <h1>Flash Learning</h1>
            </div>
          </header>
          <div className="status-page">
            <i className="ti ti-loader" aria-hidden="true" />
            <p>Loading history...</p>
          </div>
        </div>
      )
    }

    if (error && records.length === 0) {
      return (
        <div className="app">
          <header className="app-header">
            <div className="logo">
              <FaBolt color="orange" size="2em" />
              <h1>Flash Learning</h1>
            </div>
          </header>
          <div className="status-page status-page--error">
            <i className="ti ti-wifi-off" aria-hidden="true" />
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try again</button>
          </div>
        </div>
      );
    }


    return (
        <div className="app">
      <header className="app-header">
        <div className="logo">
          <FaBolt color="orange" size="2em" />
          <h1>Flash Learning</h1>
        </div>
        <nav className="navbar">
          <Link to="/">Home</Link>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      <div className="admin-page">


        {error && (
          <div className="admin-error">
            <i className="ti ti-alert-triangle" aria-hidden="true" />
            <p>{error}</p>
          </div>
        )}

        <div className="admin-header">
          <div>
            <h2>Learning History</h2>
            <p>{records.length} total flashcards across all users</p>
          </div>

          <Input
            className="search-bar"
            placeholder="Search by user, question, answer..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
          />
        </div>

        <div className="deck-filter" style={{ padding: "0 0 1rem" }}>
          {decks.map(d => (
            <button
              key={d}
              className={`filter-btn ${filterDeck === d ? "filter-btn--active" : ""}`}
              onClick={() => setFilterDeck(d)}
            >
              {d}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <i className="ti ti-cards" aria-hidden="true" />
            <p>No records found</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Deck</th>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(record => (
                  <tr key={record._id}>
                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-avatar">
                          {record.user?.username?.[0]?.toUpperCase() || "?"}
                        </div>
                        {record.user?.username || "Unknown"}
                      </div>
                    </td>
                    <td>{record.user?.email || "—"}</td>
                    <td>
                      <span className="admin-deck-badge">
                        {record.deck || "General"}
                      </span>
                    </td>
                    <td>{record.question}</td>
                    <td>{record.answer}</td>
                    <td>
                      {record.createdAt
                        ? new Date(record.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <footer className="app-footer">
        <p>© 2026 Flash Learning</p>
      </footer>
    </div>
    );
}
export default AdminHistory;