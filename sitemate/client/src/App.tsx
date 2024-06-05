import React from "react";
import ProductList from "./ProductList";

const App: React.FC = () => {
  return (
    <div className="container-fluid">
      <h1>My Product App</h1>
      <ProductList />
    </div>
  );
};

export default App;
