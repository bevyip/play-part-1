import LiquidEther from "./LiquidEther.jsx";

export default function App() {
  return (
    <LiquidEther
      style={{ width: "100vw", height: "100vh" }}
      colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
      autoDemo={true}
      autoSpeed={0.5}
      autoIntensity={2.2}
      isViscous={true}
      viscous={30}
    />
  );
}
