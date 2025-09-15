import React from "react";

const Hero: React.FC = () => (
  <section className="hero-section">
    <h1>Gerenciamento de Dados INPE</h1>
    <p>
      Explore dados científicos interativos sobre água, atmosfera, queimadas,
      satélites e muito mais.
    </p>
    <input type="text" placeholder="Buscar dados..." />
  </section>
);

export default Hero;
