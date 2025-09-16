// frontend/src/components/DataCard.tsx
import React from "react";

type Props = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  onClick: () => void;
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 10,
  padding: 16,
  boxShadow: "0 6px 18px rgba(13, 20, 30, 0.08)",
  cursor: "pointer",
  transition: "transform 150ms ease, box-shadow 150ms ease",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  minHeight: 140,
};

const DataCard: React.FC<Props> = ({ title, description = "", icon = null, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={cardStyle}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 30px rgba(13,20,30,0.12)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 18px rgba(13,20,30,0.08)";
      }}
    >
      <div style={{ fontSize: 36, marginBottom: 10 }}>{icon}</div>
      <h3 style={{ margin: "6px 0", fontSize: 16 }}>{title}</h3>
      <p style={{ color: "#666", fontSize: 13 }}>{description}</p>
    </div>
  );
};

export default DataCard;
