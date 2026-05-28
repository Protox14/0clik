import { useState, useRef, useEffect, useCallback } from "react";
import { PRODUCTS as STATIC_PRODUCTS } from "./ProductSwipeFeed.jsx";

// Map static products to quick commerce structure
const products = STATIC_PRODUCTS.map(p => {
  let tag = "3.5 mm Jack";
  let tags = null;
  let delivery = "11 mins";
  let isAd = false;
  let soldBadge = null;
  let left = null;
  let connectorType = "3.5 mm Jack";
  let warranty = "6 Months";
  let brand = "Other";
  let brandSub = "Explore all products";

  if (p.id === 1) {
    tag = "3.5 mm Jack";
    delivery = "11 mins";
    isAd = true;
    brand = "Fingers";
    connectorType = "3.5 mm Jack";
    warranty = "12 Months";
  } else if (p.id === 2) {
    tag = "Bluetooth 5.0";
    delivery = "8 mins";
    soldBadge = "3k+ sold last week";
    left = "3 left";
    brand = "Portronics";
    connectorType = "Bluetooth 5.0";
    warranty = "12 Months";
  } else if (p.id === 3) {
    tag = "OWS Design";
    delivery = "11 mins";
    isAd = true;
    brand = "Portronics";
    connectorType = "Bluetooth 5.0";
    warranty = "12 Months";
  } else if (p.id === 4) {
    tag = null;
    tags = ["IPX4", "Active Tracker"];
    delivery = "8 mins";
    brand = "Pebble";
    connectorType = "Bluetooth";
    warranty = "6 Months";
  } else if (p.id === 5) {
    tag = null;
    tags = ["ENC", "IPX4", "Bluetooth"];
    delivery = "11 mins";
    isAd = true;
    brand = "boAt";
    connectorType = "Bluetooth";
    warranty = "12 Months";
  } else if (p.id === 6) {
    tag = "AMOLED Screen";
    delivery = "8 mins";
    left = "1 left";
    brand = "Noise";
    connectorType = "Bluetooth";
    warranty = "12 Months";
  }

  const priceVal = p.priceVal;
  const mrpVal = parseInt(p.oldPrice.replace(/[^0-9]/g, ''), 10) || p.priceVal;

  let discount = null;
  if (mrpVal > priceVal) {
    const pct = Math.round(((mrpVal - priceVal) / mrpVal) * 100);
    discount = p.id === 3 ? "₹1,600 OFF" : `${pct}% OFF on MRP`;
  }

  return {
    id: p.id,
    name: p.name,
    price: priceVal,
    mrp: mrpVal,
    discount,
    discountColor: "#0c831f",
    tag,
    tags,
    connectorType,
    warranty,
    brand,
    brandSub,
    rating: parseFloat(p.rating),
    reviews: parseInt(p.reviews.replace(/[^0-9]/g, ''), 10) || 500,
    delivery,
    isAd,
    soldBadge,
    left,
    image: p.image
  };
});

function StarRating({ rating, size = 12 }) {
  return (
    <div style={{ display: "flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((s) => {
        const filled = rating >= s;
        const half = !filled && rating >= s - 0.5;
        const id = `half-${s}-${size}`;
        return (
          <svg key={s} width={size} height={size} viewBox="0 0 12 12">
            {half && (
              <defs>
                <linearGradient id={id}>
                  <stop offset="50%" stopColor="#f5a623" />
                  <stop offset="50%" stopColor="#ddd" />
                </linearGradient>
              </defs>
            )}
            <polygon
              points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5"
              fill={filled ? "#f5a623" : half ? `url(#${id})` : "#ddd"}
              stroke="#f5a623"
              strokeWidth="0.5"
            />
          </svg>
        );
      })}
    </div>
  );
}

/* ─── PRODUCT DETAIL MODAL ─── */
function ProductDetailModal({ product, allProducts, onClose, initialIndex }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [addedToCart, setAddedToCart] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [slideDir, setSlideDir] = useState(null); // 'left' | 'right' | null — exit phase
  const [enterDir, setEnterDir] = useState(null); // 'left' | 'right' | null — enter phase
  const [isFirstOpen, setIsFirstOpen] = useState(true); // track initial open for slideUp
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const dragStartX = useRef(null);
  const isHorizDrag = useRef(false);

  const p = allProducts[currentIndex];

  const goTo = useCallback((dir) => {
    const next = currentIndex + dir;
    if (next < 0 || next >= allProducts.length) return;
    setIsFirstOpen(false);
    // Phase 1: exit — slide current product out
    setSlideDir(dir > 0 ? "left" : "right");
    setTimeout(() => {
      // Phase 2: enter — position new product off-screen on opposite side, then animate in
      const enterFrom = dir > 0 ? "right" : "left";
      setEnterDir(enterFrom);
      setCurrentIndex(next);
      setSlideDir(null);
      setTranslateX(0);
      setAddedToCart(false);
      // Use rAF to ensure the off-screen position is painted before transitioning in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnterDir(null);
        });
      });
    }, 220);
  }, [currentIndex, allProducts.length]);

  // Touch / mouse handlers on the whole popup
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    dragStartX.current = e.touches[0].clientX;
    isHorizDrag.current = false;
  };
  const onTouchMove = (e) => {
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (!isHorizDrag.current && Math.abs(dx) > Math.abs(dy) + 4) {
      isHorizDrag.current = true;
    }
    if (isHorizDrag.current) {
      e.preventDefault();
      setIsDragging(true);
      setTranslateX(dx);
    }
  };
  const onTouchEnd = () => {
    const threshold = 60;
    if (translateX < -threshold) {
      goTo(1); // Swipe left -> next
    } else if (translateX > threshold) {
      goTo(-1); // Swipe right -> previous
    } else {
      setTranslateX(0);
    }
    setIsDragging(false);
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const tagList = p.tags || (p.tag ? [p.tag] : []);

  // Compute the transform style for the modal sheet
  let slideStyle;
  if (slideDir) {
    // Phase 1: exit animation — slide out in swipe direction
    slideStyle = {
      transform: `translateX(${slideDir === "left" ? "-100%" : "100%"})`,
      opacity: 0,
      transition: "transform 0.22s ease, opacity 0.22s ease",
    };
  } else if (enterDir) {
    // Phase 2a: position new product off-screen (no transition, instant jump)
    slideStyle = {
      transform: `translateX(${enterDir === "right" ? "100%" : "-100%"})`,
      opacity: 0,
      transition: "none",
    };
  } else if (isDragging) {
    slideStyle = { transform: `translateX(${translateX}px)` };
  } else {
    // Resting or entering — animate to center
    slideStyle = {
      transform: "translateX(0)",
      opacity: 1,
      transition: "transform 0.25s ease, opacity 0.25s ease",
    };
  }

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "flex-end",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          width: "100%", maxWidth: 430, margin: "0 auto",
          background: "#fff",
          borderRadius: "20px 20px 0 0",
          maxHeight: "92vh",
          overflowY: isDragging ? "hidden" : "auto",
          overflowX: "hidden",
          animation: isFirstOpen ? "slideUp 0.28s cubic-bezier(0.32,0.72,0,1)" : undefined,
          ...slideStyle,
        }}
      >
        <style>{`
          @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
          ::-webkit-scrollbar { display: none; }
        `}</style>

        {/* Top bar */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "14px 18px 0", position: "sticky", top: 0, background: "#fff", zIndex: 2,
        }}>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.2">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
              </svg>
            </button>
          </div>
        </div>

        {/* Product image area */}
        <div
          style={{ overflow: "hidden", position: "relative" }}
        >
          <div style={{ padding: "10px 0 0" }}>
            <div style={{
              display: "flex", justifyContent: "center", alignItems: "center",
              height: 260, padding: "0 24px",
            }}>
              <img
                src={p.image} alt={p.name}
                style={{ maxHeight: 240, maxWidth: "100%", objectFit: "contain" }}
              />
            </div>
            {/* Dot indicators */}
            <div style={{ display: "flex", justifyContent: "center", gap: 5, padding: "8px 0 12px" }}>
              {allProducts.map((_, i) => (
                <div key={i} style={{
                  width: i === currentIndex ? 16 : 6,
                  height: 6, borderRadius: 3,
                  background: i === currentIndex ? "#555" : "#ddd",
                  transition: "width 0.2s",
                }} />
              ))}
            </div>
          </div>

          {/* Swipe arrows (desktop hint) */}
          {currentIndex > 0 && (
            <button onClick={() => goTo(-1)} style={{
              position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.9)", border: "1px solid #eee",
              borderRadius: "50%", width: 32, height: 32,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}
          {currentIndex < allProducts.length - 1 && (
            <button onClick={() => goTo(1)} style={{
              position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.9)", border: "1px solid #eee",
              borderRadius: "50%", width: 32, height: 32,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>

        {/* Specs row */}
        <div style={{ display: "flex", gap: 8, padding: "0 14px 12px" }}>
          <div style={{
            flex: 1, background: "#f5f5f5", borderRadius: 10, padding: "8px 12px",
          }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>Connector Type</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{p.connectorType}</div>
          </div>
          <div style={{
            flex: 1, background: "#f5f5f5", borderRadius: 10, padding: "8px 12px",
          }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>Brand Warranty</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{p.warranty}</div>
          </div>
          <button style={{
            background: "#fff", border: "1.5px solid #0c831f", borderRadius: 10,
            color: "#0c831f", fontSize: 12, fontWeight: 700,
            padding: "8px 12px", cursor: "pointer", minWidth: 68, lineHeight: 1.3,
            fontFamily: "inherit",
          }}>
            View<br />details
          </button>
        </div>

        {/* Info row */}
        <div style={{ padding: "0 16px 12px", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#666" strokeWidth="2" />
                <polyline points="12 6 12 12 16 14" stroke="#666" strokeWidth="2" fill="none" />
              </svg>
              <span style={{ fontSize: 13, color: "#444" }}>{p.delivery}</span>
            </div>
            <div style={{ width: 1, height: 14, background: "#ddd" }} />
            <StarRating rating={p.rating} size={14} />
            <span style={{ fontSize: 13, color: "#666" }}>{p.reviews.toLocaleString()}</span>
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1a1a1a", margin: "0 0 8px", lineHeight: 1.3 }}>
            {p.name}
          </h2>

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: "#555" }}>1 unit</span>
            <div style={{ width: 1, height: 14, background: "#ddd" }} />
            {p.left && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{
                    width: 22, height: 12, borderRadius: 3,
                    border: "1px solid #aaa", overflow: "hidden", display: "flex",
                  }}>
                    <div style={{ width: "30%", background: "#666", height: "100%" }} />
                  </div>
                  <span style={{ fontSize: 13, color: "#555" }}>{p.left}</span>
                </div>
                <div style={{ width: 1, height: 14, background: "#ddd" }} />
              </>
            )}
            {p.soldBadge && (
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1a73e8" }} />
                <span style={{ fontSize: 13, color: "#1a73e8", fontWeight: 600 }}>{p.soldBadge}</span>
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a" }}>₹{p.price}</span>
            <span style={{ fontSize: 14, color: "#888" }}>MRP</span>
            <span style={{ fontSize: 14, color: "#aaa", textDecoration: "line-through" }}>₹{p.mrp}</span>
            {p.discount && (
              <span style={{ fontSize: 12, color: "#0c831f", fontWeight: 700 }}>{p.discount}</span>
            )}
          </div>
          {tagList.length > 0 && (
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 8 }}>
              {tagList.map(t => (
                <span key={t} style={{
                  border: "1px solid #c8a84b", color: "#7a5c00",
                  fontSize: 11, padding: "2px 8px", borderRadius: 5,
                  fontWeight: 600, background: "#fffbee",
                }}>{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* Brand row */}
        <div style={{ margin: "10px 14px", background: "#f9f9f9", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10, border: "1px solid #e8e8e8",
            background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700, color: "#555",
          }}>
            {p.brand.slice(0, 4)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{p.brand}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{p.brandSub}</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>

        {/* Policies row */}
        <div style={{ display: "flex", gap: 10, padding: "0 14px 14px" }}>
          <div style={{
            flex: 1, background: "#f9f9f9", borderRadius: 12, padding: "12px 14px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              <line x1="12" y1="12" x2="12" y2="16" />
              <line x1="10" y1="14" x2="14" y2="14" />
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>7 days only</div>
              <div style={{ fontSize: 12, color: "#888" }}>replacement</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
          <div style={{
            flex: 1, background: "#f9f9f9", borderRadius: 12, padding: "12px 14px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" stroke="#555" strokeWidth="1.5" fill="none" />
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{p.warranty}</div>
              <div style={{ fontSize: 12, color: "#888" }}>Warranty</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>

        {/* Similar products heading */}
        <div style={{ padding: "0 16px 80px" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", margin: "0 0 12px" }}>
            Similar products
          </h3>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none" }}>
            {allProducts.filter((_, i) => i !== currentIndex).slice(0, 4).map((sp) => (
              <div
                key={sp.id}
                onClick={() => { setCurrentIndex(allProducts.indexOf(sp)); setAddedToCart(false); }}
                style={{
                  minWidth: 110, background: "#f9f9f9", borderRadius: 10,
                  border: "1px solid #eee", padding: "8px", cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <img src={sp.image} alt={sp.name} style={{ width: "100%", height: 80, objectFit: "contain", borderRadius: 6 }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1a1a1a", marginTop: 5, lineHeight: 1.3 }}>
                  ₹{sp.price}
                </div>
                <div style={{ fontSize: 10, color: "#888", marginTop: 2, lineHeight: 1.3,
                  overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}>
                  {sp.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          position: "sticky", bottom: 0, background: "#fff",
          borderTop: "1px solid #f0f0f0", padding: "10px 16px 12px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 12, color: "#888" }}>1 unit</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>₹{p.price}</span>
              <span style={{ fontSize: 12, color: "#aaa", textDecoration: "line-through" }}>MRP ₹{p.mrp}</span>
            </div>
            <div style={{ fontSize: 11, color: "#888" }}>Inclusive of all taxes</div>
          </div>
          <button
            onClick={() => { setAddedToCart(true); setTimeout(() => setAddedToCart(false), 2000); }}
            style={{
              background: addedToCart ? "#0a6e18" : "#0c831f",
              border: "none", borderRadius: 12,
              color: "#fff", fontSize: 15, fontWeight: 700,
              padding: "13px 28px", cursor: "pointer",
              fontFamily: "inherit", transition: "background 0.2s",
              display: "flex", alignItems: "center", gap: 8,
            }}
          >
            {addedToCart ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Added!
              </>
            ) : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── PRODUCT CARD ─── */
function ProductCard({ product, onOpen }) {
  const [added, setAdded] = useState(false);
  const tagList = product.tags || (product.tag ? [product.tag] : []);

  return (
    <div
      onClick={onOpen}
      style={{
        background: "#fff", borderRadius: 12, border: "1px solid #e8e8e8",
        overflow: "hidden", display: "flex", flexDirection: "column",
        position: "relative", fontFamily: "'Nunito', sans-serif", cursor: "pointer",
      }}
    >
      {product.isAd && (
        <div style={{
          position: "absolute", top: 8, left: 8,
          background: "#555", color: "#fff", fontSize: 10,
          padding: "1px 5px", borderRadius: 4, fontWeight: 600, zIndex: 2,
        }}>Ad</div>
      )}
      <div style={{
        position: "relative", background: "#f7f7f7",
        display: "flex", alignItems: "center", justifyContent: "center",
        height: 130, padding: 8,
      }}>
        <img src={product.image} alt={product.name}
          style={{ maxHeight: 110, maxWidth: "100%", objectFit: "contain" }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "4px 8px",
        }}>
          <div style={{ display: "flex", gap: 3 }}>
            {[0, 1, 2, 3].map(d => (
              <div key={d} style={{
                width: 6, height: 6, borderRadius: "50%",
                background: d === 0 ? "#555" : "#ccc",
              }} />
            ))}
          </div>
          <div style={{
            width: 24, height: 24, borderRadius: "50%",
            border: "1.5px solid #ddd", background: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}
            onClick={e => e.stopPropagation()}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px 0" }}>
        <span style={{ fontSize: 11, color: "#666" }}>1 unit</span>
        <button
          onClick={e => { e.stopPropagation(); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
          style={{
            background: "#fff", border: "1.5px solid #0c831f", color: "#0c831f",
            fontWeight: 700, fontSize: 13, borderRadius: 8, padding: "3px 18px",
            cursor: "pointer", letterSpacing: 0.5,
          }}
        >{added ? "✓" : "ADD"}</button>
      </div>

      <div style={{ padding: "6px 8px 10px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>₹{product.price}</span>
          <span style={{ fontSize: 12, color: "#999", textDecoration: "line-through" }}>₹{product.mrp}</span>
        </div>
        {product.discount && (
          <div style={{ fontSize: 11, color: "#0c831f", fontWeight: 600, marginBottom: 2 }}>{product.discount}</div>
        )}
        <p style={{ fontSize: 12, color: "#1a1a1a", margin: "2px 0 5px", lineHeight: 1.35, fontWeight: 500, minHeight: 32 }}>
          {product.name}
        </p>
        {tagList.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 5 }}>
            {tagList.map(t => (
              <span key={t} style={{
                border: "1px solid #c8a84b", color: "#7a5c00", fontSize: 10,
                padding: "1px 6px", borderRadius: 4, fontWeight: 500, background: "#fffbee",
              }}>{t}</span>
            ))}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
          <StarRating rating={product.rating} />
          <span style={{ fontSize: 11, color: "#666" }}>{product.reviews.toLocaleString()}</span>
        </div>
        {product.soldBadge && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1a73e8" }} />
            <span style={{ fontSize: 11, color: "#1a73e8", fontWeight: 500 }}>{product.soldBadge}</span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#666" strokeWidth="2" />
              <polyline points="12 6 12 12 16 14" stroke="#666" strokeWidth="2" />
            </svg>
            <span style={{ fontSize: 11, color: "#444" }}>{product.delivery}</span>
          </div>
          {product.left && (
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <div style={{ width: 18, height: 10, borderRadius: 3, border: "1px solid #aaa", overflow: "hidden", display: "flex" }}>
                <div style={{ width: "30%", background: "#666", height: "100%" }} />
              </div>
              <span style={{ fontSize: 11, color: "#444" }}>{product.left}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function BlinkitIOSView() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const filters = ["Filters", "Sort", "Brand", "Connector Type"];

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.tags && p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))) ||
    (p.tag && p.tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = selectedIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedIndex]);

  return (
    <div style={{
      background: "#f9f9f9", minHeight: "100vh",
      fontFamily: "'Nunito', 'Segoe UI', sans-serif",
      maxWidth: 430, margin: "0 auto",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: "#fff", padding: "12px 14px 0",
        position: "sticky", top: 0, zIndex: 10,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <button 
            onClick={() => {
              window.history.pushState({}, "", "/");
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              color: "#333",
              display: "flex",
              alignItems: "center",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div style={{
            flex: 1, display: "flex", alignItems: "center",
            background: "#f4f4f4", borderRadius: 24, padding: "8px 14px", gap: 8,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search earphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                background: "none",
                outline: "none",
                fontSize: 14,
                color: "#333",
                padding: 0,
                width: "100%"
              }}
            />
            {searchQuery && (
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="#aaa"
                onClick={() => setSearchQuery("")}
                style={{ cursor: "pointer" }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" stroke="#fff" strokeWidth="2" />
                <line x1="9" y1="9" x2="15" y2="15" stroke="#fff" strokeWidth="2" />
              </svg>
            )}
          </div>
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
            </svg>
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10, scrollbarWidth: "none" }}>
          {filters.map((f, i) => (
            <button key={f}
              onClick={() => setActiveFilter(activeFilter === f ? null : f)}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                background: activeFilter === f ? "#e8f5e9" : "#fff",
                border: `1px solid ${activeFilter === f ? "#0c831f" : "#ddd"}`,
                borderRadius: 20, padding: "5px 12px",
                fontSize: 12, fontWeight: 500,
                color: activeFilter === f ? "#0c831f" : "#444",
                cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit",
              }}
            >
              {i === 0 && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>}
              {i === 1 && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="5 12 12 5 19 12"/><polyline points="5 15 12 19 19 15"/></svg>}
              {f}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, padding: 12 }}>
        {filteredProducts.length === 0 ? (
          <div style={{ gridColumn: "span 2", textAlign: "center", padding: "40px 10px", color: "#888" }}>
            <span style={{ fontSize: "36px" }}>🔍</span>
            <p style={{ fontSize: "14px", fontWeight: "700", marginTop: "8px" }}>No products found</p>
            <p style={{ fontSize: "12px" }}>Try searching another term like "boat", "earphone" or "watch"</p>
          </div>
        ) : (
          filteredProducts.map((p) => {
            const originalIndex = products.indexOf(p);
            return (
              <ProductCard key={p.id} product={p} onOpen={() => setSelectedIndex(originalIndex)} />
            );
          })
        )}
      </div>

      {/* Modal */}
      {selectedIndex !== null && (
        <ProductDetailModal
          product={products[selectedIndex]}
          allProducts={products}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </div>
  );
}