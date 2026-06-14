import React from "react";
import { deleteOpportunity } from "../services/api";
import { toast } from "react-toastify";
import "./OpportunityCard.css";

const OpportunityCard = ({ opp, isAdmin, onDelete }) => {
  const handleDelete = async () => {
    try {
      await deleteOpportunity(opp.id);
      toast.success("Deleted successfully!");
      if (onDelete) onDelete(opp.id);
    } catch (err) {
      toast.error("Failed to delete!");
    }
  };

  return (
    <div className="opp-card">
      <h4>{opp.title}</h4>
      <p>{opp.description?.slice(0, 150)}...</p>
      <div className="opp-meta">
        <span className="badge">{opp.category}</span>
        {opp.deadline && (
          <span className="deadline">
            Deadline: {new Date(opp.deadline).toLocaleDateString()}
          </span>
        )}
        <a href={opp.link} target="_blank" rel="noreferrer" className="btn-apply">
          Apply Now
        </a>
        {isAdmin && (
          <button className="btn-delete" onClick={handleDelete}>Delete</button>
        )}
      </div>
    </div>
  );
};

export default OpportunityCard;