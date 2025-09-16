import React from "react";

const Footer: React.FC = () => (
  <footer className="inpe-footer">
    <p>
      © {new Date().getFullYear()} INPE – Instituto Nacional de Pesquisas
      Espaciais. Todos os direitos reservados.
    </p>
    <div>
      <a href="#">Contato</a> | <a href="#">Política de Privacidade</a>
    </div>
  </footer>
);

export default Footer;
