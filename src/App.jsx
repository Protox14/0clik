import { useState, useEffect } from "react";
import ProductSwipeFeed from "./ProductSwipeFeed";

// Custom Link component for SPA routing without page reloads
export function Link({ to, children, style, className }) {
  const handleClick = (e) => {
    e.preventDefault();
    window.history.pushState({}, "", to);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };
  return (
    <a href={to} onClick={handleClick} style={style} className={className}>
      {children}
    </a>
  );
}

// Sleek dashboard to select routes
function NavigationDashboard() {
  return (
    <div style={{
      minHeight: "100vh",
      minHeight: "100dvh",
      background: "#0a0b0d",
      color: "#ffffff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: "24px",
      overflow: "hidden",
      position: "relative"
    }}>
      {/* Background radial glows */}
      <div style={{
        position: "absolute",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(181,242,61,0.08) 0%, transparent 70%)",
        top: "-10%",
        left: "-10%",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute",
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(231,76,60,0.06) 0%, transparent 70%)",
        bottom: "-10%",
        right: "-10%",
        pointerEvents: "none"
      }} />

      <h1 style={{
        fontSize: "36px",
        fontWeight: "900",
        textAlign: "center",
        marginBottom: "12px",
        letterSpacing: "-1px",
        background: "linear-gradient(135deg, #ffffff 0%, #a0a5b5 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }}>
        0Clik Showcase
      </h1>
      <p style={{
        fontSize: "14px",
        color: "#8a8f9d",
        textAlign: "center",
        marginBottom: "40px",
        maxWidth: "400px",
        lineHeight: "1.6"
      }}>
        Explore our premium gesture-commerce interactive layouts and interfaces.
      </p>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
        maxWidth: "400px",
        zIndex: 5
      }}>
        {/* Card 1: Instagram Reels swipe feed */}
        <Link to="/instagram" style={{ textDecoration: "none" }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "24px",
            padding: "24px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden"
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.06)";
              e.currentTarget.style.boxShadow = "none";
            }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px"
            }}>
              <span style={{
                background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                color: "#ffffff",
                padding: "6px 14px",
                borderRadius: "99px",
                fontSize: "11px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Instagram Route
              </span>
              <span style={{ fontSize: "18px" }}>👉</span>
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#ffffff", marginBottom: "6px" }}>Reels E-Commerce</h2>
            <p style={{ fontSize: "12px", color: "#8a8f9d", lineHeight: "1.5" }}>
              Immersive full-screen vertical swipe reels feed with gesture-driven checkout controls.
            </p>
          </div>
        </Link>

        {/* Card 2: Blinkit Quick commerce coming soon */}
        <Link to="/blinkit" style={{ textDecoration: "none" }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "24px",
            padding: "24px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: "pointer"
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.06)";
              e.currentTarget.style.boxShadow = "none";
            }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px"
            }}>
              <span style={{
                background: "linear-gradient(135deg, #fbc531 0%, #f39c12 100%)",
                color: "#111",
                padding: "6px 14px",
                borderRadius: "99px",
                fontSize: "11px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Blinkit Route
              </span>
              <span style={{ fontSize: "11px", color: "#fbc531", fontWeight: "700" }}>STAY TUNED</span>
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#ffffff", marginBottom: "6px" }}>Grocery Commerce</h2>
            <p style={{ fontSize: "12px", color: "#8a8f9d", lineHeight: "1.5" }}>
              Future high-speed, instant delivery interactive checkout page coming soon.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

// Blinkit placeholder page
function BlinkitPlaceholder() {
  return (
    <div style={{
      minHeight: "100vh",
      minHeight: "100dvh",
      background: "#ffffff",
      color: "#111111",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: "24px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        {/* Animated bag / shopping icon */}
        <div style={{
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #fbc531 0%, #f39c12 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "40px",
          marginBottom: "24px",
          boxShadow: "0 10px 24px rgba(243, 156, 18, 0.25)",
          animation: "pulse-bag 2s infinite"
        }}>
          🛒
        </div>

        <h2 style={{
          fontSize: "24px",
          fontWeight: "900",
          letterSpacing: "-0.5px",
          marginBottom: "8px"
        }}>
          blink<span>it</span> Experience
        </h2>
        <p style={{
          fontSize: "13px",
          color: "#666666",
          lineHeight: "1.6",
          marginBottom: "32px",
          maxWidth: "300px"
        }}>
          Get ready for a blazing fast grocery shopping cart checkout interface. We are building this next!
        </p>

        <Link to="/" style={{ textDecoration: "none", width: "100%" }}>
          <button style={{
            width: "100%",
            padding: "16px",
            borderRadius: "18px",
            background: "#111111",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "700",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            transition: "transform 0.2s"
          }}
            onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
            onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}>
            ← Back to Showcase Dashboard
          </button>
        </Link>
      </div>

      <style>{`
        @keyframes pulse-bag {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        h2 span { color: #f39c12; }
      `}</style>
    </div>
  );
}

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  // Expose routing links dynamically
  const renderRoute = () => {
    if (currentPath === "/instagram") {
      return <ProductSwipeFeed />;
    }
    if (currentPath === "/blinkit") {
      return <BlinkitPlaceholder />;
    }
    // Default dashboard selector
    return <NavigationDashboard />;
  };

  return (
    <>
      {renderRoute()}
    </>
  );
}

export default App;
