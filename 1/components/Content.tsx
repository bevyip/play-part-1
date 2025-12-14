import React from "react";

const Content: React.FC = () => {
  return (
    <main className="w-full h-screen flex flex-col font-sans overflow-hidden">
      {/* Top Half: White Background, Black Text */}
      <section className="top-section flex-1 w-full relative select-none overflow-hidden">
        <div className="text-container">
          <h1>Delightful</h1>
          <p className="dictionary-definition">
            <span className="pronunciation">/dəˈlītf(ə)l/</span> causing
            delight; charming
          </p>
        </div>
      </section>

      {/* Bottom Half: Cream Background, Blue Text */}
      <section className="bottom-section flex-1 w-full relative select-none overflow-hidden">
        <div className="text-container">
          <h1>DESIGN</h1>
          <p className="dictionary-definition">
            <span className="pronunciation">/dəˈzīn/</span> an arrangement of
            lines or shapes created to form a pattern or decoration
          </p>
        </div>
      </section>
    </main>
  );
};

export default Content;
