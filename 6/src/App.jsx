import StickerPeel from "./StickerPeel.jsx";
import "./App.css";

function App() {
  const stickers = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <div className="app-container">
      {stickers.map((num) => (
        <div key={num} className="sticker-wrapper">
          <StickerPeel imageSrc={`/${num}.png`} rotate={0} width={200} />
        </div>
      ))}
    </div>
  );
}

export default App;
