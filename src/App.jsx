import { useEffect, useState } from "react";
import ProductSwipeFeed from "./ProductSwipeFeed.jsx";
import TinderSwipeFeed from "./TinderSwipeFeed.jsx";
import AIShoppingAssistant from "./AIShoppingAssistant.jsx";

export function navigate(to) {
  window.history.pushState({}, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function RouteButton({ to, title, subtitle, accent }) {
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      style={{
        width: "100%",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "18px",
        background: "rgba(255,255,255,0.04)",
        color: "#fff",
        padding: "18px",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          marginBottom: "10px",
          borderRadius: "999px",
          background: accent,
          color: "#111",
          padding: "4px 10px",
          fontSize: "11px",
          fontWeight: 800,
          textTransform: "uppercase",
        }}
      >
        {to}
      </span>
      <h2 style={{ margin: "0 0 6px", fontSize: "20px", fontWeight: 800 }}>{title}</h2>
      <p style={{ margin: 0, color: "#a5acb8", fontSize: "13px", lineHeight: 1.5 }}>
        {subtitle}
      </p>
    </button>
  );
}

function Home() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "#0b0d10",
        color: "#fff",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <section style={{ width: "100%", maxWidth: "430px" }}>
        <h1 style={{ margin: "0 0 10px", fontSize: "32px", fontWeight: 900 }}>0Clik Routes</h1>
        <p style={{ margin: "0 0 24px", color: "#a5acb8", lineHeight: 1.6 }}>
          Choose which shopping experience to preview.
        </p>
        <div style={{ display: "grid", gap: "14px" }}>
          <RouteButton
            to="/instagram"
            title="Reels E-Commerce"
            subtitle="Full-screen vertical product feed."
            accent="#b5f23d"
          />
          <RouteButton
            to="/tinder"
            title="Card Swipe Commerce"
            subtitle="Tinder-style swipe cards for products."
            accent="#ff7675"
          />
          <RouteButton
            to="/ai-assistant"
            title="AI Shopping Assistant"
            subtitle="Chat with AI to find products, compare prices & get details."
            accent="#a78bfa"
          />
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const syncPath = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", syncPath);
    return () => window.removeEventListener("popstate", syncPath);
  }, []);

  if (currentPath === "/instagram") return <ProductSwipeFeed />;
  if (currentPath === "/tinder") return <TinderSwipeFeed />;
  if (currentPath === "/ai-assistant") return <AIShoppingAssistant />;
  return <Home />;
}
