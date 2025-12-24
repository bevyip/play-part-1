import React, { useState } from "react";
import SphericalCanvas from "./components/SphericalCanvas";
import ItemModal from "./components/ItemModal";
import { FashionItem } from "./types";

const App: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<FashionItem | null>(null);

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden">
      {/* Main Content (3D Spherical Canvas) */}
      <SphericalCanvas
        onItemClick={setSelectedItem}
        isModalOpen={!!selectedItem}
      />

      {/* Overlay Modal */}
      {selectedItem && (
        <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}

      {/* Fixed Footer hint */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="bg-white/5 backdrop-blur-md px-3 py-1.5 sm:px-6 sm:py-2 rounded-full text-white/40 text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] border border-white/10 shadow-sm whitespace-nowrap">
          Drag to rotate • Tap to view
        </div>
      </div>
    </div>
  );
};

export default App;
