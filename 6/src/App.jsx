import StickerPeel from "./StickerPeel.jsx";

function App() {
  const stickers = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
        gap: "40px",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        padding: "40px",
        background: "#0f0f0f",
      }}
    >
      {stickers.map((num) => (
        <div
          key={num}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <StickerPeel imageSrc={`/${num}.png`} rotate={0} width={200} />
        </div>
      ))}
    </div>
  );
}

export default App;
