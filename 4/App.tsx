
import React, { useState, useRef } from 'react';
import PixelTrail from './components/PixelTrail';

const App: React.FC = () => {
  const [accentColor, setAccentColor] = useState('#00f2ff');
  const colorInputRef = useRef<HTMLInputElement>(null);
  
  // Adjusted fadeSpeed to make the trail longer in terms of duration
  const cellSize = 20;
  const fadeSpeed = 0.018; 

  const handleButtonClick = () => {
    colorInputRef.current?.click();
  };

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-[#050505] flex items-center justify-center">
      {/* Interactive Pixel Grid */}
      <PixelTrail 
        accentColor={accentColor}
        cellSize={cellSize}
        fadeSpeed={fadeSpeed}
      />

      {/* Vignette Overlay for Depth */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

      {/* Hero Overlay Text */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
        <p 
          className="google-sans-code text-white text-center lowercase opacity-80"
          style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            fontWeight: 300,
            letterSpacing: '0.06em'
          }}
        >
          don't be shy — move your cursor
        </p>
      </div>

      {/* Single Color Picker Button */}
      <div className="fixed top-8 right-8 z-50">
        <button
          onClick={handleButtonClick}
          className="w-10 h-10 rounded-full border-2 transition-all duration-300 shadow-2xl flex items-center justify-center bg-black/40 backdrop-blur-md overflow-hidden hover:scale-110 active:scale-95"
          style={{ 
            borderColor: accentColor, 
            boxShadow: `0 0 20px ${accentColor}44` 
          }}
          title="Pick custom color"
        >
          <div 
            className="w-6 h-6 rounded-full shadow-inner" 
            style={{ backgroundColor: accentColor }}
          />
        </button>

        {/* Standard Color Picker (Hidden Input) */}
        <input
          ref={colorInputRef}
          type="color"
          value={accentColor}
          onChange={(e) => setAccentColor(e.target.value)}
          className="absolute inset-0 w-0 h-0 opacity-0 pointer-events-none"
        />
      </div>
    </div>
  );
};

export default App;
