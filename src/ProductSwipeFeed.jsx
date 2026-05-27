/* eslint-disable react-refresh/only-export-components */
import { useState, useRef, useCallback, useEffect } from "react";

/* ─────────────── Count Helpers ─────────────── */
export function parseCount(val) {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const s = val.toString().toLowerCase().trim();
  if (s.endsWith("k")) {
    return Math.round(parseFloat(s.slice(0, -1)) * 1000);
  }
  return parseInt(s.replace(/[^0-9]/g, ""), 10) || 0;
}

export function formatCount(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

/* ─────────────── Product Data ─────────────── */
export const PRODUCTS = [
  {
    id: 1,
    name: "Fingers Droplets Wired Earphone with Mic",
    seller: "@simply.shopping",
    badge: "HOT",
    badgeColor: "#ff7675",
    rating: "4.8",
    reviews: "2,310",
    oldPrice: "₹899.00",
    price: "₹690.00",
    priceVal: 690,
    bgStart: "#fcd34d",
    bgEnd: "#d97706",
    image: "/products/fingers_droplets.png",
    likes: "48.2k",
    comments: "4321",
    shares: "48.2k",
    desc: "Exclusive Design, Size-defying Sound. High-fidelity audio with built-in microphone for perfect hands-free calling and premium passive noise isolation.",
  },
  {
    id: 2,
    name: "Portronics Harmonics Twins 24 Wireless Bluetooth Earbuds With Type C Charging",
    seller: "@simply.shopping",
    badge: "NEW",
    badgeColor: "#2f3542",
    rating: "4.7",
    reviews: "1,520",
    oldPrice: "₹1999.00",
    price: "₹1345.00",
    priceVal: 1345,
    bgStart: "#9ca3af",
    bgEnd: "#1f2937",
    image: "/products/portronics_twins.png",
    likes: "32.6k",
    comments: "2150",
    shares: "18.4k",
    desc: "Harmonics Twins 24 Wireless Earbuds with advanced Type C charging, high-fidelity deep bass, smart touch controls, Bluetooth 5.0, and 20h total playtime.",
  },
  {
    id: 3,
    name: "Portronics Harmonics Twins 31 Over Ear OWS Smart Wireless Earbuds",
    seller: "@portronics.audio",
    badge: "OWS",
    badgeColor: "#e5cbb3",
    rating: "4.8",
    reviews: "3,110",
    oldPrice: "₹2999.00",
    price: "₹1399.00",
    priceVal: 1399,
    bgStart: "#f3eae1",
    bgEnd: "#c8b9ab",
    image: "/products/portronics_twins_31.png",
    likes: "45.7k",
    comments: "3120",
    shares: "22.5k",
    desc: "Over-Ear OWS Smart Wireless Earbuds with OWS open-ear audio, HD mic, secure & flexible ear hooks, 24 Hrs Playtime, gaming low-latency mode, and feather-light beige design.",
  },
  {
    id: 4,
    name: 'Pebble Regal 1.77" True HD Display',
    seller: "@Invigo.nutri.store",
    badge: "INS",
    badgeColor: "#cc2828",
    rating: "4.8",
    reviews: "5,612",
    oldPrice: "₹2499.0",
    price: "₹324.00",
    priceVal: 324,
    bgStart: "#e8504a",
    bgEnd: "#7a1515",
    image: "/products/cosmetics.png",
    likes: "48.2k",
    comments: "4321",
    shares: "48.2k",
    desc: "Deep nourishing hair care duo loaded with vitalizing keratin & botanicals.",
  },
  {
    id: 5,
    name: "boAt Airdopes 141 ANC Earbuds",
    seller: "@boat.lifestyle",
    badge: "HOT",
    badgeColor: "#7b28d8",
    rating: "4.7",
    reviews: "12,034",
    oldPrice: "₹3990.0",
    price: "₹899.00",
    priceVal: 899,
    bgStart: "#a855f7",
    bgEnd: "#3b0764",
    image: "/products/anc_earbuds.png",
    likes: "63.1k",
    comments: "8120",
    shares: "55.4k",
    desc: "32dB Active Noise Cancellation, Beast Mode low latency, and 42h runtime.",
  },
  {
    id: 6,
    name: "Noise ColorFit Pro 4 Max Watch",
    seller: "@noise.official",
    badge: "NEW",
    badgeColor: "#0d8a6a",
    rating: "4.6",
    reviews: "3,210",
    oldPrice: "₹5999.0",
    price: "₹1,499.00",
    priceVal: 1499,
    bgStart: "#20c997",
    bgEnd: "#073b2e",
    image: "/products/fitness_watch.png",
    likes: "29.8k",
    comments: "2341",
    shares: "31.2k",
    desc: 'Large 1.8" AMOLED display, Bluetooth Calling, and 100+ multi-sports modes.',
  },
];

/* ─────────────── Default Comments ─────────────── */
export const DEFAULT_COMMENTS = {
  1: [
    { id: 1, user: "rohit_sharma", text: "Bass is super punchy! Worth every rupee 🔥", time: "2h ago" },
    { id: 2, user: "neha.verma", text: "Fits perfectly in ears, doesn't fall off during gym sessions.", time: "4h ago" },
    { id: 3, user: "tech_guru", text: "For this price point, the mic quality is outstanding.", time: "1d ago" }
  ],
  2: [
    { id: 1, user: "priya_travels", text: "The battery lasts forever. Charging case is so compact!", time: "3h ago" },
    { id: 2, user: "arjun_m", text: "Seamless connection with my iPhone. Audio is crystal clear.", time: "5h ago" }
  ],
  3: [
    { id: 1, user: "openear_fan", text: "Open ear design is a lifesaver. No pain even after hours of work!", time: "1h ago" },
    { id: 2, user: "karan_audiophile", text: "Love that I can stay aware of my surroundings while running. Highly recommended!", time: "3h ago" }
  ],
  4: [
    { id: 1, user: "glow_girl", text: "This display and performance is stellar for the price point!", time: "1h ago" },
    { id: 2, user: "sunny_d", text: "Bought this for my dad, he absolutely loves it.", time: "8h ago" }
  ],
  5: [
    { id: 1, user: "music_lover", text: "The ANC works like magic in noisy office environments!", time: "15m ago" },
    { id: 2, user: "gaming_pro", text: "Zero lag in Beast Mode while playing BGMI. Best earbuds under 1k!", time: "2h ago" }
  ],
  6: [
    { id: 1, user: "fitness_freak", text: "AMOLED screen is super bright even under direct sunlight. Step tracker is highly accurate.", time: "30m ago" },
    { id: 2, user: "shreya_k", text: "Calling function works flawlessly. Stylish design!", time: "4h ago" }
  ]
};

/* ─────────────── SVG Icons ─────────────── */
const HeartIcon = ({ filled }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "#ef4444" : "none"} stroke={filled ? "#ef4444" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CommentIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ShareIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#e74c3c" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

/* ─────────────── Action Button ─────────────── */
function ActionBtn({ children, count, onClick, onTouchStart: ots, onMouseDown: omd }) {
  return (
    <button
      className="reel-action-btn"
      onClick={onClick}
      onTouchStart={ots}
      onMouseDown={omd}
    >
      <div className="reel-action-circle">{children}</div>
      <span className="reel-action-count">{count}</span>
    </button>
  );
}

/* ─────────────── Product Slide (Instagram – vertical scroll only) ─────────────── */
function ProductSlide({ 
  product, 
  onAddToCart, 
  onShowDetails, 
  liked, 
  onToggleLike,
  onCommentClick,
  onShareClick,
  displayLikes,
  displayComments,
  displayShares
}) {
  const [heartPop, setHeartPop] = useState(false);

  /* Double-tap like */
  const lastTap = useRef(0);
  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!liked) onToggleLike(product.id);
      setHeartPop(true);
      setTimeout(() => setHeartPop(false), 800);
    }
    lastTap.current = now;
  }, [liked, onToggleLike, product.id]);

  return (
    <div className="reel-slide" onClick={handleDoubleTap}>
      {/* ── Dynamic Background ── */}
      <div className="reel-bg" style={{
        background: `linear-gradient(160deg, ${product.bgStart} 0%, ${product.bgEnd} 100%)`,
      }} />
      <div className="reel-glow" style={{
        background: `radial-gradient(ellipse 70% 50% at 50% 42%, ${product.bgStart}aa 0%, transparent 70%)`,
      }} />

      {/* ── Product Hero Image ── */}
      <div className="reel-image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="reel-image"
          draggable={false}
        />
      </div>

      {/* ── Double-tap heart animation ── */}
      {heartPop && (
        <div className="reel-heart-pop">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="#ef4444" stroke="none">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
      )}

      {/* ── Right-side Action Bar ── */}
      <div className="reel-sidebar">
        <ActionBtn
          count={formatCount(displayLikes)}
          onClick={(e) => { e.stopPropagation(); onToggleLike(product.id); }}
          onTouchStart={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <HeartIcon filled={liked} />
        </ActionBtn>
        <ActionBtn
          count={formatCount(displayComments)}
          onClick={(e) => { e.stopPropagation(); onCommentClick(product); }}
          onTouchStart={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <CommentIcon />
        </ActionBtn>
        <ActionBtn
          count={formatCount(displayShares)}
          onClick={(e) => { e.stopPropagation(); onShareClick(product); }}
          onTouchStart={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <ShareIcon />
        </ActionBtn>
      </div>

      {/* ── Product Info Overlay ── */}
      <div className="reel-product-info">
        <div className="reel-seller-row">
          <span className="reel-seller">{product.seller}</span>
        </div>
        <h2 className="reel-product-name">{product.name}</h2>
        <div className="reel-rating-row">
          <StarIcon />
          <span className="reel-rating-text" style={{ marginLeft: "2px" }}>
            {product.rating} &nbsp;({product.reviews})
          </span>
        </div>
      </div>

      {/* ── Floating Bottom CTA Pill ── */}
      <div className="reel-cta-bar">
        <div className="reel-cta-prices">
          <span className="reel-old-price">{product.oldPrice}</span>
          <span className="reel-cur-price">{product.price}</span>
        </div>
        <div className="reel-cta-buttons">
          <button
            className="reel-btn-details"
            onClick={(e) => { e.stopPropagation(); onShowDetails(product); }}
            onTouchStart={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            Details
          </button>
          <button
            className="reel-btn-buy"
            onClick={(e) => { e.stopPropagation(); onAddToCart(product, true); }}
            onTouchStart={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Cart Sheet ─────────────── */
function CartSheet({ cart, open, onClose, onRemove, onUpdateQty }) {
  const total = cart.reduce((s, i) => s + i.priceVal * (i.qty || 1), 0);
  const itemCount = cart.reduce((s, i) => s + (i.qty || 1), 0);

  return (
    <>
      {open && (
        <div className="cart-backdrop" onClick={onClose} />
      )}
      <div className="cart-sheet" style={{ transform: open ? "translateY(0)" : "translateY(100%)" }}>
        <div className="cart-handle" />
        <button className="cart-close" onClick={onClose}>✕</button>

        <div className="cart-header">
          <h2 className="cart-title">Cart</h2>
          {itemCount > 0 && (
            <span className="cart-count">{itemCount} {itemCount === 1 ? "item" : "items"}</span>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon"><CartIcon /></div>
            <p className="cart-empty-text">Your cart is empty</p>
            <p className="cart-empty-hint">Swipe right on a product to add it!</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-thumb" style={{ background: `linear-gradient(135deg, ${item.bgStart}, ${item.bgEnd})` }}>
                    <img src={item.image} alt="" />
                  </div>
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-price">{item.price}</p>
                  </div>
                  <div className="cart-item-qty">
                    <button onClick={() => onUpdateQty(item.id, -1)}>−</button>
                    <span>{item.qty || 1}</span>
                    <button onClick={() => onUpdateQty(item.id, 1)}>+</button>
                  </div>
                  <button className="cart-item-remove" onClick={() => onRemove(item.id)}>✕</button>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-total-row">
                <span className="cart-total-label">Total</span>
                <span className="cart-total-value">₹{total.toLocaleString("en-IN")}</span>
              </div>
              <button className="cart-checkout-btn">Checkout →</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* ─────────────── Details Sheet ─────────────── */
function DetailsSheet({ product, open, onClose, onBuy }) {
  const [detailsExpanded, setDetailsExpanded] = useState(true);
  const [aboutExpanded, setAboutExpanded] = useState(false);

  if (!product) return null;

  // Dynamically calculate discount percentage
  const getDiscount = () => {
    try {
      const oldVal = parseFloat(product.oldPrice.replace(/[^\d.]/g, ''));
      const newVal = parseFloat(product.price.replace(/[^\d.]/g, ''));
      if (oldVal && newVal && oldVal > newVal) {
        return Math.round(((oldVal - newVal) / oldVal) * 100);
      }
    } catch {
      return 23;
    }
    return 23; // fallback
  };

  const discount = getDiscount();

  return (
    <>
      {open && (
        <div className="cart-backdrop" onClick={onClose} />
      )}
      <div className="cart-sheet" style={{ transform: open ? "translateY(0)" : "translateY(100%)", paddingBottom: "32px", background: "#f8f9fa" }}>
        <div className="cart-handle" />
        <button 
          className="cart-close" 
          onClick={onClose} 
          style={{ 
            top: "16px", 
            right: "16px", 
            zIndex: 10,
            marginBottom: "16px"
          }}
          title="Close details"
        >
          ✕
        </button>

        {/* Hero image preview at the top with margin spacing to clear close button */}
        <div style={{
          width: "100%",
          height: "160px",
          borderRadius: "20px",
          background: `linear-gradient(135deg, ${product.bgStart}, ${product.bgEnd})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          marginTop: "34px",
          marginBottom: "16px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
        }}>
          <img src={product.image} alt={product.name} style={{ height: "120px", objectFit: "contain", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.15))" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto", maxHeight: "45vh", paddingRight: "4px" }}>
          
          {/* ── Title, Price, & Cancel/Return Policy Box ── */}
          <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #eef0f2",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
          }}>
            {/* Top Area: Title & Prices */}
            <div style={{ padding: "16px" }}>
              <h3 style={{ color: "#111", fontSize: "14px", fontWeight: "600", lineHeight: "1.4", marginBottom: "8px", fontFamily: "'Inter', sans-serif" }}>
                {product.name}
              </h3>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ fontSize: "18px", fontWeight: "800", color: "#111" }}>{product.price}</span>
                <span style={{ fontSize: "12px", color: "#999", textDecoration: "line-through" }}>{product.oldPrice}</span>
                <span style={{ fontSize: "12px", color: "#22c55e", fontWeight: "700" }}>{discount}% off</span>
              </div>
            </div>

            {/* Bottom Area: Policies */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              background: "#f1f3f6",
              padding: "10px 16px",
              fontSize: "11px",
              fontWeight: "600",
              color: "#555",
              borderTop: "1px solid #eef0f2"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ opacity: 0.6 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                non-cancellable
              </div>
              <div style={{ borderLeft: "1px solid #dcdde1", height: "12px" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ opacity: 0.6 }}>
                  <circle cx="12" cy="12" r="10"/><polyline points="9 11 12 14 22 4"/>
                </svg>
                non-returnable
              </div>
            </div>
          </div>

          {/* ── Collapsible Details & About Product ── */}
          <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #eef0f2",
            padding: "0 16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
          }}>
            {/* Header: Product Details Accordion */}
            <div 
              onClick={() => setDetailsExpanded(!detailsExpanded)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 0",
                cursor: "pointer",
                borderBottom: detailsExpanded ? "1px solid #f1f3f6" : "none"
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#111" }}>Product Details</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: detailsExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            
            {/* Body: Product Details */}
            {detailsExpanded && (
              <div style={{ padding: "12px 0 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "#777" }}>Rating</span>
                  <span style={{ fontWeight: "600", color: "#111", display: "flex", alignItems: "center", gap: "3px" }}>
                    <StarIcon /> {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "#777" }}>Brand Tag</span>
                  <span className="reel-badge" style={{ backgroundColor: product.badgeColor, color: "#fff", padding: "2px 8px", fontSize: "9px", borderRadius: "4px" }}>
                    {product.badge}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "#777" }}>Seller</span>
                  <span style={{ fontWeight: "600", color: "#111" }}>{product.seller}</span>
                </div>
              </div>
            )}

            {/* Header: About Product Accordion */}
            <div 
              onClick={() => setAboutExpanded(!aboutExpanded)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 0",
                cursor: "pointer",
                borderTop: "1px solid #f1f3f6",
                borderBottom: aboutExpanded ? "1px solid #f1f3f6" : "none"
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#111" }}>About Product</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: aboutExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            
            {/* Body: About Product */}
            {aboutExpanded && (
              <div style={{ padding: "12px 0 16px" }}>
                <p style={{ fontSize: "12px", color: "#555", lineHeight: "1.6" }}>{product.desc}</p>
              </div>
            )}
          </div>

          {/* ── Seller Information Box ── */}
          <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #eef0f2",
            padding: "14px 16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#111", letterSpacing: "0.2px" }}>
                {product.seller.toUpperCase().replace('@', '').replace('.', ' ')} PRIVATE LIMITED &gt;
              </span>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                background: "#f1f3f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: "700",
                color: "#777"
              }}>
                {product.badge}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "11px", color: "#666" }}>Vendor: <strong style={{ color: "#333" }}>nLincs</strong></span>
                <span style={{ fontSize: "10px", color: "#999" }}>view more products from this seller</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Sticky Bottom CTA Action Button ── */}
        <div style={{ marginTop: "16px" }}>
          <button 
            className="cart-checkout-btn" 
            onClick={() => onBuy(product)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "16px",
              background: "#ff7675", // Soft red/pink matching the screenshot
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "700",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(255, 118, 117, 0.3)",
              letterSpacing: "0.5px"
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}

/* ─────────────── Comment Sheet ─────────────── */
function CommentSheet({ open, onClose, product, comments = [], onAddComment, onToggleLikeComment }) {
  const [newComment, setNewComment] = useState("");

  if (!product) return null;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(product.id, newComment.trim());
    setNewComment("");
  };

  const handleQuickEmoji = (emoji) => {
    onAddComment(product.id, emoji);
  };

  return (
    <>
      {open && (
        <div className="cart-backdrop" onClick={onClose} style={{ zIndex: 70 }} />
      )}
      <div 
        className="cart-sheet" 
        style={{ 
          transform: open ? "translateY(0)" : "translateY(100%)", 
          zIndex: 75,
          background: "#ffffff",
          maxHeight: "75vh",
          display: "flex",
          flexDirection: "column",
          padding: "16px 20px 24px"
        }}
      >
        <div className="cart-handle" />
        <button className="cart-close" onClick={onClose} style={{ top: "16px", right: "20px" }}>✕</button>

        <div style={{ marginBottom: "16px" }}>
          <h2 className="cart-title" style={{ fontSize: "18px", fontWeight: "800", color: "#111" }}>Comments</h2>
          <span style={{ fontSize: "12px", color: "#888", display: "block", marginTop: "2px" }}>
            Discussing: {product.name.slice(0, 40)}…
          </span>
        </div>

        {/* Scrollable list of comments */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          paddingRight: "4px",
          minHeight: "220px",
          maxHeight: "35vh"
        }}>
          {comments.length === 0 ? (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 0",
              color: "#aaa",
              textAlign: "center"
            }}>
              <span style={{ fontSize: "36px", marginBottom: "8px" }}>💬</span>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#777" }}>No comments yet</p>
              <p style={{ fontSize: "12px", color: "#999" }}>Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((c, index) => {
              // Create a consistent avatar color based on username
              const colors = ["#ff7675", "#74b9ff", "#55efc4", "#ffeaa7", "#a29bfe", "#fd79a8"];
              const charSum = c.user.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
              const avatarBg = colors[charSum % colors.length];
              const initials = c.user.slice(0, 2).toUpperCase();

              return (
                <div key={c.id || index} style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  animation: "fadeInComment 0.3s ease-out both"
                }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", flex: 1 }}>
                    {/* Avatar */}
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: avatarBg,
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "800",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                      flexShrink: 0
                    }}>
                      {initials}
                    </div>
                    {/* Comment Info */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#111" }}>{c.user}</span>
                        <span style={{ fontSize: "10px", color: "#999" }}>{c.time}</span>
                      </div>
                      <p style={{ fontSize: "13px", color: "#444", lineHeight: "1.4", wordBreak: "break-word" }}>
                        {c.text}
                      </p>
                    </div>
                  </div>

                  {/* Comment Like Heart */}
                  <div 
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "2px",
                      alignSelf: "center",
                      paddingLeft: "8px",
                      cursor: "pointer"
                    }}
                    onClick={() => onToggleLikeComment(product.id, c.id)}
                  >
                    <svg 
                      width="12" 
                      height="12" 
                      viewBox="0 0 24 24" 
                      fill={c.likedByMe ? "#ef4444" : "none"} 
                      stroke={c.likedByMe ? "#ef4444" : "#888888"} 
                      strokeWidth="2.5" 
                      style={{
                        transition: "transform 0.15s ease",
                        transform: c.likedByMe ? "scale(1.2)" : "scale(1)"
                      }}
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    {c.likesCount > 0 && (
                      <span style={{ fontSize: "9px", color: "#888", fontWeight: "600" }}>{c.likesCount}</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sticky Input container with quick emojis */}
        <div style={{
          borderTop: "1px solid #f1f3f5",
          paddingTop: "12px"
        }}>
          {/* Quick Emojis list */}
          <div style={{
            display: "flex",
            gap: "12px",
            justifyContent: "space-between",
            marginBottom: "12px",
            padding: "0 4px"
          }}>
            {["❤️", "🙌", "🔥", "😂", "😮", "😍", "👍"].map(emoji => (
              <button 
                type="button"
                key={emoji}
                onClick={() => handleQuickEmoji(emoji)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  transition: "transform 0.1s"
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                {emoji}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            background: "#f8f9fa",
            borderRadius: "24px",
            padding: "6px 14px",
            border: "1px solid #eef0f2"
          }}>
            <input 
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                background: "none",
                outline: "none",
                fontSize: "13px",
                color: "#111",
                padding: "8px 0"
              }}
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              style={{
                background: "none",
                border: "none",
                color: newComment.trim() ? "#0095f6" : "#b2dffc",
                fontWeight: "700",
                fontSize: "13px",
                cursor: newComment.trim() ? "pointer" : "default",
                padding: "4px 8px",
                transition: "color 0.2s"
              }}
            >
              Post
            </button>
          </form>
        </div>

        <style>{`
          @keyframes fadeInComment {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </>
  );
}

/* ─────────────── Main Feed ─────────────── */
export default function ProductSwipeFeed() {
  const [productsList, setProductsList] = useState(() => 
    PRODUCTS.map(p => ({
      ...p,
      likesNum: parseCount(p.likes),
      commentsNum: parseCount(p.comments),
      sharesNum: parseCount(p.shares)
    }))
  );
  const [commentsMap, setCommentsMap] = useState(DEFAULT_COMMENTS);
  const [commentOpenProduct, setCommentOpenProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [likedProducts, setLikedProducts] = useState(new Set());
  const [activeIndex, setActiveIndex] = useState(0);
  const [detailsProduct, setDetailsProduct] = useState(null);
  const scrollRef = useRef(null);
  const toastTimerRef = useRef(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMsg(null), 2400);
  };

  const addToCart = useCallback((product, shouldOpenCart = false) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: (i.qty || 1) + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`🛒 ${product.name.slice(0, 24)}… added!`);
    if (shouldOpenCart) {
      setTimeout(() => setCartOpen(true), 350);
    }
  }, []);

  const showDetails = useCallback((product) => {
    setDetailsProduct(product);
  }, []);



  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((i) => i.id === id ? { ...i, qty: Math.max(0, (i.qty || 1) + delta) } : i).filter((i) => (i.qty || 1) > 0)
    );
  };

  const toggleLike = useCallback((id) => {
    let wasLiked = false;
    setLikedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        wasLiked = true;
      }
      return next;
    });

    setProductsList((prev) => 
      prev.map((p) => {
        if (p.id === id) {
          const delta = wasLiked ? 1 : -1;
          return { ...p, likesNum: p.likesNum + delta };
        }
        return p;
      })
    );
  }, []);

  const handleCommentClick = useCallback((product) => {
    setCommentOpenProduct(product);
  }, []);

  const addComment = useCallback((productId, commentText) => {
    setCommentsMap((prev) => {
      const currentComments = prev[productId] || [];
      const newCommentObj = {
        id: currentComments.length + 1,
        user: "you_shop",
        text: commentText,
        time: "Just now",
        likesCount: 0,
        likedByMe: false
      };
      return {
        ...prev,
        [productId]: [...currentComments, newCommentObj]
      };
    });

    setProductsList((prev) => 
      prev.map((p) => p.id === productId ? { ...p, commentsNum: p.commentsNum + 1 } : p)
    );

    showToast("💬 Comment posted!");
  }, []);

  const toggleLikeComment = useCallback((productId, commentId) => {
    setCommentsMap((prev) => {
      const productComments = prev[productId] || [];
      const updatedComments = productComments.map((c) => {
        if (c.id === commentId) {
          const liked = !c.likedByMe;
          return {
            ...c,
            likedByMe: liked,
            likesCount: c.likesCount + (liked ? 1 : -1)
          };
        }
        return c;
      });
      return {
        ...prev,
        [productId]: updatedComments
      };
    });
  }, []);

  const handleShareClick = useCallback((product) => {
    const shareUrl = window.location.href + "?product=" + product.id;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.desc,
        url: shareUrl
      }).then(() => {
        setProductsList((prev) => 
          prev.map((p) => p.id === product.id ? { ...p, sharesNum: p.sharesNum + 1 } : p)
        );
        showToast("✨ Shared successfully!");
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setProductsList((prev) => 
          prev.map((p) => p.id === product.id ? { ...p, sharesNum: p.sharesNum + 1 } : p)
        );
        showToast("🔗 Link copied to clipboard!");
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => setActiveIndex(Math.round(el.scrollTop / el.clientHeight));
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const cartTotal = cart.reduce((s, i) => s + (i.qty || 1), 0);

  return (
    <div className="reel-root">
      {/* ── Global Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Syne:wght@700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        * { -webkit-tap-highlight-color: transparent; }

        .reel-root {
          min-height: 100vh; min-height: 100dvh;
          background: #000;
          display: flex; align-items: flex-start; justify-content: center;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow: hidden;
        }

        /* ── Phone Frame ── */
        .reel-phone {
          position: relative; width: 100%; max-width: 430px;
          height: 100vh; height: 100dvh;
          background: #000; overflow: hidden;
          display: flex; flex-direction: column;
        }
        @media (min-width: 431px) {
          .reel-phone {
            border-radius: 0px;
            border: 5px solid #1a1a1a;
            box-shadow: 0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.8);
            margin-top: 0;
          }
        }

        /* ── Header ── */
        .reel-header {
          position: absolute; top: 0; left: 0; right: 0;
          z-index: 40; padding: 16px 16px 0;
          display: flex; align-items: center; justify-content: space-between;
          height: 60px; pointer-events: none;
          background: linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 100%);
        }
        .reel-logo {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 22px; color: #fff; pointer-events: auto;
          letter-spacing: -0.5px;
        }
        .reel-logo span { color: #b5f23d; }
        .reel-cart-btn {
          position: relative; width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 1.5px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          color: #fff; cursor: pointer; pointer-events: auto;
          transition: transform 0.2s, background 0.2s;
        }
        .reel-cart-btn:active { transform: scale(0.9); background: rgba(255,255,255,0.2); }
        .reel-cart-badge {
          position: absolute; top: -4px; right: -4px;
          width: 18px; height: 18px; border-radius: 50%;
          background: #e74c3c; color: #fff;
          font-size: 10px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          box-shadow: 0 2px 8px rgba(231,76,60,0.5);
        }

        /* ── Scroll Container ── */
        .reel-scroll {
          flex: 1; overflow-y: auto;
          scroll-snap-type: y mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .reel-scroll::-webkit-scrollbar { display: none; }

        /* ── Slide (handles Instagram vertical scroll snap only) ── */
        .reel-slide {
          position: relative; width: 100%; flex-shrink: 0;
          height: 100vh; height: 100dvh;
          scroll-snap-align: start;
          user-select: none; overflow: hidden;
        }

        /* Background */
        .reel-bg {
          position: absolute; inset: 0;
        }
        .reel-glow {
          position: absolute; inset: 0; z-index: 0;
          pointer-events: none;
        }

        /* ── Product Image ── */
        .reel-image-wrap {
          position: absolute; top: 50px; bottom: 220px;
          left: 0; right: 0;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none; z-index: 1;
        }
        .reel-image {
          max-width: 100%; max-height: 100%;
          width: auto; height: auto;
          object-fit: contain;
          filter: drop-shadow(0 30px 60px rgba(0,0,0,0.35));
        }

        /* ── Double-tap heart ── */
        .reel-heart-pop {
          position: absolute; inset: 0; z-index: 35;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none;
          animation: heart-burst 0.8s ease-out forwards;
        }
        @keyframes heart-burst {
          0% { opacity: 0; transform: scale(0); }
          15% { opacity: 1; transform: scale(1.3); }
          30% { transform: scale(0.95); }
          45% { transform: scale(1.05); }
          100% { opacity: 0; transform: scale(1.4); }
        }

        /* ── Sidebar Actions ── */
        .reel-sidebar {
          position: absolute; right: 10px; z-index: 10;
          display: flex; flex-direction: column; gap: 16px;
          align-items: center; bottom: 220px;
        }
        .reel-action-btn {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          border: none; background: none; padding: 0; cursor: pointer;
          transition: transform 0.2s;
        }
        .reel-action-btn:active { transform: scale(0.85); }
        .reel-action-circle {
          width: 44px; height: 44px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          transition: background 0.2s;
        }
        .reel-action-circle:hover { background: rgba(255,255,255,0.25); }
        .reel-action-count {
          color: #fff; font-size: 11px; font-weight: 700;
          text-shadow: 0 1px 4px rgba(0,0,0,0.4);
          letter-spacing: 0.2px;
        }

        /* ── Swipe Feedback ── */
        .reel-feedback {
          position: absolute; inset: 0; z-index: 30;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none;
        }
        .reel-feedback-inner {
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          transition: all 0.12s;
        }
        .reel-feedback-icon {
          width: 80px; height: 80px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.15);
          border: 2.5px solid;
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        }
        .reel-feedback-label {
          font-size: 12px; font-weight: 800; letter-spacing: 3px;
          padding: 6px 18px; border-radius: 99px;
          background: rgba(255,255,255,0.92);
          font-family: 'Syne', sans-serif;
        }

        /* ── Product Info (over gradient) ── */
        .reel-product-info {
          position: absolute; left: 20px; z-index: 10;
          bottom: 100px; max-width: calc(100% - 80px);
          pointer-events: none;
        }
        .reel-seller-row {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 8px; pointer-events: auto;
        }
        .reel-badge {
          padding: 4px 12px; border-radius: 99px;
          font-size: 11px; font-weight: 800; color: #fff;
          font-family: 'Syne', sans-serif;
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        .reel-seller {
          color: #fff; font-size: 13px; font-weight: 600;
          text-shadow: 0 1px 6px rgba(0,0,0,0.25);
          letter-spacing: 0.2px;
        }
        .reel-product-name {
          color: #fff; font-size: 16px; font-weight: 700;
          line-height: 1.35; margin-bottom: 6px;
          text-shadow: 0 1px 8px rgba(0,0,0,0.2);
          max-width: 320px;
        }
        .reel-rating-row {
          display: flex; align-items: center; gap: 6px;
        }
        .reel-rating-text {
          color: rgba(255,255,255,0.9); font-size: 12px; font-weight: 500;
          text-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }

        /* ── Bottom CTA Bar ── */
        .reel-cta-bar {
          position: absolute; left: 12px; right: 12px;
          bottom: 16px; z-index: 10;
          background: #fff;
          border-radius: 24px;
          padding: 12px 16px;
          display: flex; align-items: center; justify-content: space-between;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08);
          pointer-events: auto;
          animation: cta-slide-up 0.5s cubic-bezier(.25,.8,.25,1) both;
          animation-delay: 0.2s;
        }
        @keyframes cta-slide-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .reel-cta-prices {
          display: flex; flex-direction: column; padding-left: 4px;
        }
        .reel-old-price {
          color: #999; font-size: 11px; font-weight: 500;
          text-decoration: line-through; line-height: 1;
        }
        .reel-cur-price {
          color: #111; font-size: 20px; font-weight: 800;
          line-height: 1.2; letter-spacing: -0.5px;
          font-family: 'Inter', sans-serif;
        }
        .reel-cta-buttons {
          display: flex; gap: 8px;
        }
        .reel-btn-details {
          padding: 10px 18px; border-radius: 99px;
          background: #fff; color: #111;
          font-size: 12px; font-weight: 700;
          border: 1.5px solid #ddd; cursor: pointer;
          transition: all 0.2s;
        }
        .reel-btn-details:active { transform: scale(0.95); background: #f5f5f5; }
        .reel-btn-buy {
          padding: 10px 20px; border-radius: 99px;
          background: #e74c3c; color: #fff;
          font-size: 12px; font-weight: 800;
          border: none; cursor: pointer;
          box-shadow: 0 4px 14px rgba(231,76,60,0.35);
          transition: all 0.2s;
        }
        .reel-btn-buy:active { transform: scale(0.95); background: #d63031; }

        /* ── Scroll Hint ── */
        .reel-scroll-hint {
          position: absolute; bottom: 90px; left: 50%;
          transform: translateX(-50%);
          z-index: 20; pointer-events: none;
          animation: bounce-hint 1.8s ease infinite;
        }
        @keyframes bounce-hint {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.5; }
          50% { transform: translateX(-50%) translateY(6px); opacity: 0.8; }
        }

        /* ── Toast ── */
        .reel-toast {
          position: absolute; top: 100px; left: 50%;
          transform: translateX(-50%); z-index: 55;
          background: rgba(0,0,0,0.88);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff; font-size: 12px; font-weight: 500;
          padding: 8px 18px; border-radius: 99px;
          white-space: nowrap; pointer-events: none;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
          animation: toast-in 0.35s cubic-bezier(.25,.8,.25,1);
          max-width: 90%;
          overflow: hidden; text-overflow: ellipsis;
        }
        @keyframes toast-in {
          0% { transform: translateX(-50%) translateY(-12px) scale(0.9); opacity: 0; }
          100% { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
        }

        /* ── Cart Sheet ── */
        .cart-backdrop {
          position: absolute; inset: 0; z-index: 60;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
          animation: fadeIn 0.25s ease;
        }
        .cart-sheet {
          position: absolute; bottom: 0; left: 0; right: 0; z-index: 65;
          background: #ffffff; border-radius: 28px 28px 0 0;
          border-top: 1px solid rgba(0,0,0,0.05);
          max-height: 78vh; overflow-y: auto;
          padding: 12px 16px 28px;
          transition: transform 0.45s cubic-bezier(.25,.8,.25,1);
          scrollbar-width: none;
        }
        .cart-sheet::-webkit-scrollbar { display: none; }
        .cart-handle {
          width: 36px; height: 4px; border-radius: 99px;
          background: rgba(0,0,0,0.1);
          margin: 0 auto 14px;
        }
        .cart-close {
          position: absolute; right: 16px; top: 12px;
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(0,0,0,0.05);
          color: rgba(0,0,0,0.4); border: none;
          font-size: 12px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .cart-close:hover { background: rgba(0,0,0,0.08); }
        .cart-header {
          display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
        }
        .cart-title {
          color: #111111; font-size: 20px; font-weight: 800;
        }
        .cart-count {
          font-size: 11px; font-weight: 700;
          padding: 3px 10px; border-radius: 99px;
          background: rgba(231,76,60,0.12); color: #e74c3c;
        }

        /* Cart Empty */
        .cart-empty {
          display: flex; flex-direction: column; align-items: center;
          padding: 40px 0; gap: 6px;
        }
        .cart-empty-icon {
          width: 56px; height: 56px; border-radius: 50%;
          background: rgba(0,0,0,0.03);
          display: flex; align-items: center; justify-content: center;
          color: rgba(0,0,0,0.25); margin-bottom: 4px;
        }
        .cart-empty-text { color: rgba(0,0,0,0.5); font-size: 14px; font-weight: 500; }
        .cart-empty-hint { color: rgba(0,0,0,0.3); font-size: 12px; }

        /* Cart Items */
        .cart-items { display: flex; flex-direction: column; gap: 8px; margin-bottom: 4px; }
        .cart-item {
          display: flex; gap: 10px; align-items: center;
          padding: 10px; border-radius: 16px;
          background: rgba(0,0,0,0.02);
          border: 1px solid rgba(0,0,0,0.04);
        }
        .cart-item-thumb {
          width: 48px; height: 48px; border-radius: 12px;
          flex-shrink: 0; display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }
        .cart-item-thumb img { width: 36px; height: 36px; object-fit: contain; }
        .cart-item-info { flex: 1; min-width: 0; }
        .cart-item-name {
          color: #111111; font-size: 12px; font-weight: 600;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .cart-item-price {
          color: #e74c3c; font-size: 14px; font-weight: 800; margin-top: 2px;
        }
        .cart-item-qty {
          display: flex; align-items: center; gap: 4px;
        }
        .cart-item-qty button {
          width: 26px; height: 26px; border-radius: 8px;
          background: rgba(0,0,0,0.05);
          color: rgba(0,0,0,0.6); border: none;
          font-size: 15px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .cart-item-qty button:hover { background: rgba(0,0,0,0.08); }
        .cart-item-qty span {
          color: #111111; font-size: 13px; font-weight: 600;
          width: 20px; text-align: center;
        }
        .cart-item-remove {
          color: rgba(0,0,0,0.2); font-size: 14px;
          background: none; border: none; cursor: pointer;
          padding: 0 2px 0 6px; transition: color 0.15s;
        }
        .cart-item-remove:hover { color: rgba(0,0,0,0.4); }

        /* Cart Footer */
        .cart-footer { margin-top: 4px; }
        .cart-total-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 0 0; margin-top: 4px;
          border-top: 1px solid rgba(0,0,0,0.06);
        }
        .cart-total-label { color: rgba(0,0,0,0.4); font-size: 13px; }
        .cart-total-value {
          color: #111111; font-size: 24px; font-weight: 800;
        }
        .cart-checkout-btn {
          width: 100%; margin-top: 14px; padding: 16px;
          border-radius: 18px; background: #e74c3c;
          color: #fff; font-size: 15px; font-weight: 800;
          border: none; cursor: pointer;
          box-shadow: 0 6px 24px rgba(231,76,60,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .cart-checkout-btn:active { transform: scale(0.98); }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* ── Phone Container ── */}
      <div className="reel-phone">



        {/* Header */}
        <div className="reel-header">
          <button 
            className="reel-cart-btn" 
            onClick={() => {
              window.history.pushState({}, "", "/");
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            title="Back to Dashboard"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <button className="reel-cart-btn" onClick={() => setCartOpen(true)}>
            <CartIcon />
            {cartTotal > 0 && <span className="reel-cart-badge">{cartTotal}</span>}
          </button>
        </div>

        {/* Reel Feed */}
        <div className="reel-scroll" ref={scrollRef}>
          {productsList.map((product, index) => (
            <ProductSlide
              key={product.id}
              product={product}
              isActive={index === activeIndex}
              onAddToCart={addToCart}
              onShowDetails={showDetails}
              liked={likedProducts.has(product.id)}
              onToggleLike={toggleLike}
              onCommentClick={handleCommentClick}
              onShareClick={handleShareClick}
              displayLikes={product.likesNum}
              displayComments={product.commentsNum}
              displayShares={product.sharesNum}
            />
          ))}
        </div>

        {/* Scroll Hint */}
        {activeIndex === 0 && (
          <div className="reel-scroll-hint">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        )}

        {/* Toast */}
        {toastMsg && <div className="reel-toast">{toastMsg}</div>}

        {/* Cart */}
        <CartSheet
          cart={cart}
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onUpdateQty={updateQty}
        />

        {/* Details Sheet */}
        <DetailsSheet
          product={detailsProduct}
          open={!!detailsProduct}
          onClose={() => setDetailsProduct(null)}
          onBuy={(prod) => {
            setDetailsProduct(null);
            addToCart(prod, true);
          }}
        />

        {/* Comments Sheet */}
        <CommentSheet
          open={!!commentOpenProduct}
          onClose={() => setCommentOpenProduct(null)}
          product={commentOpenProduct}
          comments={commentOpenProduct ? commentsMap[commentOpenProduct.id] : []}
          onAddComment={addComment}
          onToggleLikeComment={toggleLikeComment}
        />
      </div>
    </div>
  );
}
