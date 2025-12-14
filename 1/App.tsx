import React from "react";
import CustomCursor from "./components/CustomCursor";
import Content from "./components/Content";

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-white text-black selection:bg-black selection:text-white cursor-none overflow-hidden relative">
      <CustomCursor />
      <Content />
    </div>
  );
};

export default App;
