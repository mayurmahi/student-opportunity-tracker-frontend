import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import OpportunityCard from "../components/OpportunityCard";
import { getMe, updateInterests, getRecommended } from "../services/api";
import { toast } from "react-toastify";
import "./Dashboard.css";

const CATEGORIES = ["internship", "hackathon", "scholarship", "job", "certification"];

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [selected, setSelected] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchRecommended();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await getMe();
      setUser(res.data);
      if (res.data.interests) {
        setSelected(res.data.interests.split(",").map(i => i.trim()).filter(Boolean));
      }
    } catch (err) {
      toast.error("Failed to load user data");
    }
  };

  const fetchRecommended = async () => {
    try {
      const res = await getRecommended();
      setRecommended(res.data);
    } catch (err) {
      console.log("No recommended yet");
    }
  };

  const handleCheckbox = (category) => {
    setSelected(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleSaveInterests = async () => {
    setLoading(true);
    try {
      await updateInterests({ interests: selected.join(",") });
      toast.success("Interests saved!");
      fetchRecommended();
    } catch (err) {
      toast.error("Failed to save interests");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar user={user} />
      <div className="dashboard-content">
        <h2>Welcome back, {user?.name} 👋</h2>

        <div className="interests-box">
          <h3>Your Interests</h3>
          <div className="checkbox-group">
            {CATEGORIES.map(cat => (
              <label key={cat}>
                <input
                  type="checkbox"
                  checked={selected.includes(cat)}
                  onChange={() => handleCheckbox(cat)}
                />
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </label>
            ))}
          </div>
          <button className="btn-save" onClick={handleSaveInterests} disabled={loading}>
            {loading ? "Saving..." : "Save Interests"}
          </button>
        </div>

        <div className="recommended-box">
          <h3>Recommended For You</h3>
          {recommended.length === 0 ? (
            <p className="no-data">No recommendations yet. Set your interests above!</p>
          ) : (
            recommended.map(opp => <OpportunityCard key={opp.id} opp={opp} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;