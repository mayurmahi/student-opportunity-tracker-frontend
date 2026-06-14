import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import OpportunityCard from "../components/OpportunityCard";
import { getMe, getOpportunities, createOpportunity } from "../services/api";
import { toast } from "react-toastify";
import "./Opportunities.css";

const CATEGORIES = ["internship", "hackathon", "scholarship", "job", "certification"];

const Opportunities = () => {
  const [user, setUser] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "internship", deadline: "", link: ""
  });

  useEffect(() => {
    fetchUser();
    fetchOpportunities();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await getMe();
      setUser(res.data);
    } catch (err) {
      console.log("Error fetching user");
    }
  };

  const fetchOpportunities = async (cat, s) => {
    setLoading(true);
    try {
      const res = await getOpportunities(cat || "", s || "");
      setOpportunities(res.data);
    } catch (err) {
      toast.error("Failed to load opportunities");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchOpportunities(category, search);
  };

  const handleDelete = (id) => {
    setOpportunities(prev => prev.filter(o => o.id !== id));
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOpportunity = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (!payload.deadline) delete payload.deadline;
      await createOpportunity(payload);
      toast.success("Opportunity added!");
      setForm({ title: "", description: "", category: "internship", deadline: "", link: "" });
      fetchOpportunities();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to add opportunity");
    }
  };

  return (
    <div className="opportunities-container">
      <Navbar user={user} />
      <div className="opportunities-content">
        <h2>All Opportunities</h2>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          <button className="btn-search" onClick={handleSearch}>Search</button>
        </div>

        {user?.role === "admin" && (
          <div className="add-opportunity-box">
            <h3>Add New Opportunity</h3>
            <form onSubmit={handleAddOpportunity}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" name="title" value={form.title} onChange={handleFormChange} required placeholder="Opportunity title" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleFormChange} required placeholder="Description" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleFormChange}>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Deadline (Optional)</label>
                <input type="datetime-local" name="deadline" value={form.deadline} onChange={handleFormChange} />
              </div>
              <div className="form-group">
                <label>Link</label>
                <input type="url" name="link" value={form.link} onChange={handleFormChange} required placeholder="https://..." />
              </div>
              <button className="btn-add" type="submit">Add Opportunity</button>
            </form>
          </div>
        )}

        {loading ? (
          <p className="no-data">Loading...</p>
        ) : opportunities.length === 0 ? (
          <p className="no-data">No opportunities found.</p>
        ) : (
          opportunities.map(opp => (
            <OpportunityCard
              key={opp.id}
              opp={opp}
              isAdmin={user?.role === "admin"}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Opportunities;