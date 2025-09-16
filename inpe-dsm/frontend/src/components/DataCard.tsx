import React from "react";

interface Props {
  category: string;
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}

const DataCard: React.FC<Props> = ({ category, title, description, icon, onClick }) => (
  <div className="data-card" data-category={category} onClick={onClick}>
    <div className="card-icon">{icon}</div>
    <h3 className="card-title">{title}</h3>
    <p className="card-description">{description}</p>
    <div className="card-stats">
      <span>+1000 registros</span>
      <span>Última atualização: 2025</span>
    </div>
  </div>
);

export default DataCard;
