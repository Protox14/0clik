import { useState, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import { PRODUCTS, DEFAULT_COMMENTS, parseCount } from "./ProductSwipeFeed";

/* ─────────────── SVG Icons ─────────────── */
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

/* ─────────────── Tinder Card ─────────────── */
const TinderCard = forwardRef(({ product, totalCount, currentIndex, onSwipeRight, onSwipeLeft, onShowDetails, liked, onToggleLike }, ref) => {
  const dragState = useRef({ active: false, startX: 0, startY: 0, currentX: 0, currentY: 0 });
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [flyOut, setFlyOut] = useState(null);
  const [heartPop, setHeartPop] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useImperativeHandle(ref, () => ({
    swipeLeft: () => {
      if (flyOut) return;
      setFeedback("nope");
      setDragX(-120);
      setFlyOut("left");
      setTimeout(() => onSwipeLeft(), 380);
    },
    swipeRight: () => {
      if (flyOut) return;
      setFeedback("like");
      setDragX(120);
      setFlyOut("right");
      setTimeout(() => onSwipeRight(product), 380);
    },
    swipeUp: () => {
      if (flyOut) return;
      setFeedback("super");
      setDragY(-120);
      setFlyOut("up");
      setTimeout(() => {
        onShowDetails(product);
        setFlyOut(null);
        setDragX(0);
        setDragY(0);
        setFeedback(null);
      }, 350);
    }
  }));

  const handleStart = useCallback((clientX, clientY) => {
    dragState.current = { active: true, startX: clientX, startY: clientY, currentX: clientX, currentY: clientY };
    setIsDragging(true);
  }, []);

  const handleMove = useCallback((clientX, clientY) => {
    if (!dragState.current.active) return;
    dragState.current.currentX = clientX;
    dragState.current.currentY = clientY;
    const dx = clientX - dragState.current.startX;
    const dy = clientY - dragState.current.startY;
    setDragX(dx);
    setDragY(dy);

    if (Math.abs(dy) > Math.abs(dx)) {
      if (dy < -55) setFeedback("super");
      else setFeedback(null);
    } else {
      if (dx > 55) setFeedback("like");
      else if (dx < -55) setFeedback("nope");
      else setFeedback(null);
    }
  }, []);

  const handleEnd = useCallback(() => {
    if (!dragState.current.active) return;
    dragState.current.active = false;
    setIsDragging(false);
    const dx = dragState.current.currentX - dragState.current.startX;
    const dy = dragState.current.currentY - dragState.current.startY;
    setFeedback(null);

    if (Math.abs(dy) > Math.abs(dx) && dy < -100) {
      setFlyOut("up");
      setTimeout(() => {
        onShowDetails(product);
        setFlyOut(null);
        setDragX(0);
        setDragY(0);
      }, 350);
    } else if (dx > 110) {
      setFlyOut("right");
      setTimeout(() => onSwipeRight(product), 380);
    } else if (dx < -110) {
      setFlyOut("left");
      setTimeout(() => onSwipeLeft(), 380);
    } else {
      setDragX(0);
      setDragY(0);
    }
  }, [product, onSwipeRight, onSwipeLeft, onShowDetails]);

  const onTouchStart = (e) => handleStart(e.touches[0].clientX, e.touches[0].clientY);
  const onTouchMove = (e) => { e.preventDefault(); handleMove(e.touches[0].clientX, e.touches[0].clientY); };
  const onTouchEnd = () => handleEnd();
  const onMouseDown = (e) => { e.preventDefault(); handleStart(e.clientX, e.clientY); };
  const onMouseMove = (e) => { if (e.buttons === 1) handleMove(e.clientX, e.clientY); };
  const onMouseUp = () => handleEnd();

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

  let cardTransform = "";
  let cardTransition = "transform 0.38s cubic-bezier(.25,.8,.25,1), opacity 0.32s";
  let cardOpacity = 1;

  if (flyOut === "right") { cardTransform = "translateX(120vw) rotate(20deg)"; cardOpacity = 0; }
  else if (flyOut === "left") { cardTransform = "translateX(-120vw) rotate(-20deg)"; cardOpacity = 0; }
  else if (flyOut === "up") { cardTransform = "translateY(-120vh)"; cardOpacity = 0; }
  else if (dragX !== 0 || dragY !== 0) {
    if (Math.abs(dragY) > Math.abs(dragX)) {
      cardTransform = `translateY(${Math.min(dragY, 0)}px)`;
      cardTransition = isDragging ? "none" : "transform 0.38s cubic-bezier(.25,.8,.25,1)";
    } else {
      const rotate = dragX * 0.07;
      cardTransform = `translateX(${dragX}px) rotate(${rotate}deg)`;
      cardTransition = isDragging ? "none" : "transform 0.38s cubic-bezier(.25,.8,.25,1)";
    }
  }

  const feedbackOpacity = feedback
    ? (feedback === "super"
      ? Math.min(Math.abs(dragY) / 140, 1)
      : Math.min(Math.abs(dragX) / 140, 1))
    : 0;

  // Discount calculation
  const getDiscount = () => {
    try {
      const oldVal = parseFloat(product.oldPrice.replace(/[^\d.]/g, ''));
      const newVal = parseFloat(product.price.replace(/[^\d.]/g, ''));
      if (oldVal && newVal && oldVal > newVal) return Math.round(((oldVal - newVal) / oldVal) * 100);
    } catch {
      return 0;
    }
    return 0;
  };
  const discount = getDiscount();

  return (
    <div
      className="tc-card"
      style={{ transform: cardTransform, transition: cardTransition, opacity: cardOpacity }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onClick={handleDoubleTap}
    >
      {/* Full-bleed product image */}
      <div className="tc-card-img" style={{
        backgroundImage: `url(${product.image})`,
        backgroundColor: product.bgEnd,
      }}>
        {/* Gradient bg behind product for better visibility */}
        <div className="tc-card-img-gradient" style={{
          background: `linear-gradient(160deg, ${product.bgStart} 0%, ${product.bgEnd} 100%)`
        }} />
        <img src={product.image} alt={product.name} className="tc-card-product-img" draggable={false} />
      </div>

      {/* Progress bar at top */}
      <div className="tc-progress-bar">
        {Array.from({ length: totalCount }, (_, i) => (
          <div key={i} className={`tc-progress-seg ${i === currentIndex ? "active" : ""} ${i < currentIndex ? "done" : ""}`} />
        ))}
      </div>

      {/* LIKE / NOPE stamp overlays */}
      {feedback === "like" && (
        <div className="tc-stamp tc-stamp-like" style={{ opacity: feedbackOpacity, transform: `rotate(-15deg) scale(${0.8 + feedbackOpacity * 0.2})` }}>
          CHECKOUT
        </div>
      )}
      {feedback === "nope" && (
        <div className="tc-stamp tc-stamp-nope" style={{ opacity: feedbackOpacity, transform: `rotate(15deg) scale(${0.8 + feedbackOpacity * 0.2})` }}>
          NOPE
        </div>
      )}
      {feedback === "super" && (
        <div className="tc-stamp tc-stamp-super" style={{ opacity: feedbackOpacity, transform: `translateX(-50%) rotate(-10deg) scale(${0.8 + feedbackOpacity * 0.2})` }}>
          DETAILS
        </div>
      )}

      {/* Heart pop */}
      {heartPop && (
        <div className="tc-heart-pop">
          <svg width="90" height="90" viewBox="0 0 24 24" fill="#ef4444" stroke="none">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
      )}

      {/* Bottom dark gradient */}
      <div className="tc-bottom-gradient" />

      {/* Product info at bottom */}
      <div className="tc-info">
        {/* Badge */}
        <div className="tc-badge" style={{ background: product.badgeColor }}>{product.badge}</div>

        {/* Name + Price */}
        <div className="tc-name-row">
          <h2 className="tc-name">{product.name}</h2>
        </div>

        {/* Seller line with icon */}
        <div className="tc-info-line">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          <span>{product.seller}</span>
        </div>

        {/* Rating line */}
        <div className="tc-info-line">
          <StarIcon />
          <span>{product.rating} ({product.reviews} reviews)</span>
        </div>

        {/* Price + Discount */}
        <div className="tc-price-row">
          <span className="tc-cur-price">{product.price}</span>
          <span className="tc-old-price">{product.oldPrice}</span>
          {discount > 0 && <span className="tc-discount">{discount}% off</span>}
        </div>

        {/* Description */}
        <p className="tc-desc">{product.desc}</p>
      </div>
    </div>
  );
});

/* ─────────────── Cart Sheet ─────────────── */
function CartSheet({ cart, open, onClose, onRemove, onUpdateQty }) {
  const total = cart.reduce((s, i) => s + i.priceVal * (i.qty || 1), 0);
  const itemCount = cart.reduce((s, i) => s + (i.qty || 1), 0);
  return (
    <>
      {open && <div className="tc-backdrop" onClick={onClose} />}
      <div className="tc-sheet" style={{ transform: open ? "translateY(0)" : "translateY(100%)" }}>
        <div className="tc-sheet-handle" />
        <button className="tc-sheet-close" onClick={onClose}>✕</button>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#111" }}>Cart</h2>
          {itemCount > 0 && <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "99px", background: "rgba(231,76,60,0.12)", color: "#e74c3c" }}>{itemCount} {itemCount === 1 ? "item" : "items"}</span>}
        </div>
        {cart.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 0", gap: "6px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(0,0,0,0.03)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(0,0,0,0.25)", marginBottom: "4px" }}><CartIcon /></div>
            <p style={{ color: "rgba(0,0,0,0.5)", fontSize: "14px", fontWeight: "500" }}>Your cart is empty</p>
            <p style={{ color: "rgba(0,0,0,0.3)", fontSize: "12px" }}>Swipe right on a product to add it!</p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "4px" }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "10px", borderRadius: "16px", background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `linear-gradient(135deg, ${item.bgStart}, ${item.bgEnd})`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    <img src={item.image} alt="" style={{ width: "36px", height: "36px", objectFit: "contain" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: "#111", fontSize: "12px", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                    <p style={{ color: "#e74c3c", fontSize: "14px", fontWeight: "800", marginTop: "2px" }}>{item.price}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <button onClick={() => onUpdateQty(item.id, -1)} style={{ width: "26px", height: "26px", borderRadius: "8px", background: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.6)", border: "none", fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <span style={{ color: "#111", fontSize: "13px", fontWeight: "600", width: "20px", textAlign: "center" }}>{item.qty || 1}</span>
                    <button onClick={() => onUpdateQty(item.id, 1)} style={{ width: "26px", height: "26px", borderRadius: "8px", background: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.6)", border: "none", fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>
                  <button onClick={() => onRemove(item.id)} style={{ color: "rgba(0,0,0,0.2)", fontSize: "14px", background: "none", border: "none", cursor: "pointer", padding: "0 2px 0 6px" }}>✕</button>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0 0", marginTop: "4px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                <span style={{ color: "rgba(0,0,0,0.4)", fontSize: "13px" }}>Total</span>
                <span style={{ color: "#111", fontSize: "24px", fontWeight: "800" }}>₹{total.toLocaleString("en-IN")}</span>
              </div>
              <button style={{ width: "100%", marginTop: "14px", padding: "16px", borderRadius: "18px", background: "#e74c3c", color: "#fff", fontSize: "15px", fontWeight: "800", border: "none", cursor: "pointer", boxShadow: "0 6px 24px rgba(231,76,60,0.35)" }}>Checkout →</button>
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

  const getDiscount = () => {
    try {
      const oldVal = parseFloat(product.oldPrice.replace(/[^\d.]/g, ''));
      const newVal = parseFloat(product.price.replace(/[^\d.]/g, ''));
      if (oldVal && newVal && oldVal > newVal) return Math.round(((oldVal - newVal) / oldVal) * 100);
    } catch {
      return 23;
    }
    return 23;
  };
  const discount = getDiscount();
  return (
    <>
      {open && <div className="tc-backdrop" onClick={onClose} />}
      <div className="tc-sheet" style={{ transform: open ? "translateY(0)" : "translateY(100%)", paddingBottom: "32px", background: "#f8f9fa" }}>
        <div className="tc-sheet-handle" />
        <button className="tc-sheet-close" onClick={onClose} style={{ top: "16px", right: "16px", zIndex: 10, marginBottom: "16px" }}>✕</button>
        <div style={{ width: "100%", height: "160px", borderRadius: "20px", background: `linear-gradient(135deg, ${product.bgStart}, ${product.bgEnd})`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginTop: "34px", marginBottom: "16px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
          <img src={product.image} alt={product.name} style={{ height: "120px", objectFit: "contain", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.15))" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto", maxHeight: "45vh", paddingRight: "4px" }}>
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #eef0f2", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
            <div style={{ padding: "16px" }}>
              <h3 style={{ color: "#111", fontSize: "14px", fontWeight: "600", lineHeight: "1.4", marginBottom: "8px" }}>{product.name}</h3>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ fontSize: "18px", fontWeight: "800", color: "#111" }}>{product.price}</span>
                <span style={{ fontSize: "12px", color: "#999", textDecoration: "line-through" }}>{product.oldPrice}</span>
                <span style={{ fontSize: "12px", color: "#22c55e", fontWeight: "700" }}>{discount}% off</span>
              </div>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #eef0f2", padding: "0 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
            <div onClick={() => setDetailsExpanded(!detailsExpanded)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", cursor: "pointer", borderBottom: detailsExpanded ? "1px solid #f1f3f6" : "none" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#111" }}>Product Details</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: detailsExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}><polyline points="6 9 12 15 18 9" /></svg>
            </div>
            {detailsExpanded && (
              <div style={{ padding: "12px 0 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "#777" }}>Rating</span>
                  <span style={{ fontWeight: "600", color: "#111", display: "flex", alignItems: "center", gap: "3px" }}><StarIcon /> {product.rating} ({product.reviews})</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "#777" }}>Seller</span>
                  <span style={{ fontWeight: "600", color: "#111" }}>{product.seller}</span>
                </div>
              </div>
            )}
            <div onClick={() => setAboutExpanded(!aboutExpanded)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", cursor: "pointer", borderTop: "1px solid #f1f3f6" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#111" }}>About Product</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: aboutExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}><polyline points="6 9 12 15 18 9" /></svg>
            </div>
            {aboutExpanded && (
              <div style={{ padding: "12px 0 16px" }}>
                <p style={{ fontSize: "12px", color: "#555", lineHeight: "1.6" }}>{product.desc}</p>
              </div>
            )}
          </div>
        </div>
        <div style={{ marginTop: "16px" }}>
          <button onClick={() => onBuy(product)} style={{ width: "100%", padding: "14px", borderRadius: "16px", background: "#ff7675", color: "#fff", fontSize: "14px", fontWeight: "700", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(255, 118, 117, 0.3)", letterSpacing: "0.5px" }}>Add to Cart</button>
        </div>
      </div>
    </>
  );
}

/* ─────────────── Comment Sheet ─────────────── */
function CommentSheet({ open, onClose, product, comments = [], onAddComment, onToggleLikeComment }) {
  const [newComment, setNewComment] = useState("");

  if (!product) return null;

  const handleSubmit = (e) => { if (e) e.preventDefault(); if (!newComment.trim()) return; onAddComment(product.id, newComment.trim()); setNewComment(""); };
  const handleQuickEmoji = (emoji) => { onAddComment(product.id, emoji); };
  return (
    <>
      {open && <div className="tc-backdrop" onClick={onClose} style={{ zIndex: 70 }} />}
      <div className="tc-sheet" style={{ transform: open ? "translateY(0)" : "translateY(100%)", zIndex: 75, background: "#fff", maxHeight: "75vh", display: "flex", flexDirection: "column", padding: "16px 20px 24px" }}>
        <div className="tc-sheet-handle" />
        <button className="tc-sheet-close" onClick={onClose} style={{ top: "16px", right: "20px" }}>✕</button>
        <div style={{ marginBottom: "16px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#111" }}>Comments</h2>
          <span style={{ fontSize: "12px", color: "#888", display: "block", marginTop: "2px" }}>Discussing: {product.name.slice(0, 40)}…</span>
        </div>
        <div style={{ flex: 1, overflowY: "auto", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "16px", paddingRight: "4px", minHeight: "160px", maxHeight: "30vh" }}>
          {comments.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", color: "#aaa", textAlign: "center" }}>
              <span style={{ fontSize: "36px", marginBottom: "8px" }}>💬</span>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#777" }}>No comments yet</p>
              <p style={{ fontSize: "12px", color: "#999" }}>Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((c, index) => {
              const colors = ["#ff7675", "#74b9ff", "#55efc4", "#ffeaa7", "#a29bfe", "#fd79a8"];
              const charSum = c.user.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
              const avatarBg = colors[charSum % colors.length];
              const initials = c.user.slice(0, 2).toUpperCase();
              return (
                <div key={c.id || index} style={{ display: "flex", gap: "12px", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", flex: 1 }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: avatarBg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800", flexShrink: 0 }}>{initials}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#111" }}>{c.user}</span>
                        <span style={{ fontSize: "10px", color: "#999" }}>{c.time}</span>
                      </div>
                      <p style={{ fontSize: "13px", color: "#444", lineHeight: "1.4", wordBreak: "break-word" }}>{c.text}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", alignSelf: "center", paddingLeft: "8px", cursor: "pointer" }} onClick={() => onToggleLikeComment(product.id, c.id)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill={c.likedByMe ? "#ef4444" : "none"} stroke={c.likedByMe ? "#ef4444" : "#888"} strokeWidth="2.5" style={{ transition: "transform 0.15s", transform: c.likedByMe ? "scale(1.2)" : "scale(1)" }}>
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    {c.likesCount > 0 && <span style={{ fontSize: "9px", color: "#888", fontWeight: "600" }}>{c.likesCount}</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div style={{ borderTop: "1px solid #f1f3f5", paddingTop: "12px" }}>
          <div style={{ display: "flex", gap: "12px", justifyContent: "space-between", marginBottom: "12px", padding: "0 4px" }}>
            {["❤️", "🙌", "🔥", "😂", "😮", "😍", "👍"].map(emoji => (
              <button type="button" key={emoji} onClick={() => handleQuickEmoji(emoji)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>{emoji}</button>
            ))}
          </div>
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px", alignItems: "center", background: "#f8f9fa", borderRadius: "24px", padding: "6px 14px", border: "1px solid #eef0f2" }}>
            <input type="text" placeholder="Add a comment..." value={newComment} onChange={e => setNewComment(e.target.value)} style={{ flex: 1, border: "none", background: "none", outline: "none", fontSize: "13px", color: "#111", padding: "8px 0" }} />
            <button type="submit" disabled={!newComment.trim()} style={{ background: "none", border: "none", color: newComment.trim() ? "#0095f6" : "#b2dffc", fontWeight: "700", fontSize: "13px", cursor: newComment.trim() ? "pointer" : "default", padding: "4px 8px" }}>Post</button>
          </form>
        </div>
      </div>
    </>
  );
}

/* ─────────────── Main Tinder Feed ─────────────── */
export default function TinderSwipeFeed() {
  const [productsList, setProductsList] = useState(() =>
    PRODUCTS.map(p => ({ ...p, likesNum: parseCount(p.likes), commentsNum: parseCount(p.comments), sharesNum: parseCount(p.shares) }))
  );
  const [commentsMap, setCommentsMap] = useState(DEFAULT_COMMENTS);
  const [commentOpenProduct, setCommentOpenProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [likedProducts, setLikedProducts] = useState(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [detailsProduct, setDetailsProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const toastTimerRef = useRef(null);
  const cardRef = useRef(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMsg(null), 2400);
  };

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: (i.qty || 1) + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`🛒 ${product.name.slice(0, 24)}… added!`);
    setHistory(h => [...h, { index: currentIndex, action: "cart" }]);
    setCurrentIndex(i => i + 1);
  }, [currentIndex]);

  const skipProduct = useCallback(() => {
    showToast("⏭️ Skipped!");
    setHistory(h => [...h, { index: currentIndex, action: "skip" }]);
    setCurrentIndex(i => i + 1);
  }, [currentIndex]);

  const undoLast = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setCurrentIndex(last.index);
    if (last.action === "cart") {
      // remove last added item
      setCart(prev => {
        const lastProduct = productsList[last.index];
        const existing = prev.find(i => i.id === lastProduct.id);
        if (existing && (existing.qty || 1) > 1) {
          return prev.map(i => i.id === lastProduct.id ? { ...i, qty: (i.qty || 1) - 1 } : i);
        }
        return prev.filter(i => i.id !== lastProduct.id);
      });
    }
    showToast("↩️ Undo!");
  }, [history, productsList]);

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id, delta) => {
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: Math.max(0, (i.qty || 1) + delta) } : i).filter((i) => (i.qty || 1) > 0));
  };

  const toggleLike = useCallback((id) => {
    let wasLiked = false;
    setLikedProducts((prev) => { const next = new Set(prev); if (next.has(id)) { next.delete(id); } else { next.add(id); wasLiked = true; } return next; });
    setProductsList((prev) => prev.map((p) => { if (p.id === id) return { ...p, likesNum: p.likesNum + (wasLiked ? 1 : -1) }; return p; }));
  }, []);

  const addComment = useCallback((productId, commentText) => {
    setCommentsMap((prev) => {
      const cur = prev[productId] || [];
      return { ...prev, [productId]: [...cur, { id: cur.length + 1, user: "you_shop", text: commentText, time: "Just now", likesCount: 0, likedByMe: false }] };
    });
    setProductsList((prev) => prev.map((p) => p.id === productId ? { ...p, commentsNum: p.commentsNum + 1 } : p));
    showToast("💬 Comment posted!");
  }, []);
  const toggleLikeComment = useCallback((productId, commentId) => {
    setCommentsMap((prev) => {
      const productComments = prev[productId] || [];
      return { ...prev, [productId]: productComments.map((c) => c.id === commentId ? { ...c, likedByMe: !c.likedByMe, likesCount: c.likesCount + (c.likedByMe ? -1 : 1) } : c) };
    });
  }, []);
  const handleShareClick = useCallback((product) => {
    const shareUrl = window.location.href + "?product=" + product.id;
    if (navigator.share) {
      navigator.share({ title: product.name, text: product.desc, url: shareUrl }).then(() => {
        setProductsList((prev) => prev.map((p) => p.id === product.id ? { ...p, sharesNum: p.sharesNum + 1 } : p));
        showToast("✨ Shared successfully!");
      }).catch(() => { });
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setProductsList((prev) => prev.map((p) => p.id === product.id ? { ...p, sharesNum: p.sharesNum + 1 } : p));
        showToast("🔗 Link copied!");
      }).catch(() => { });
    }
  }, []);

  const cartTotal = cart.reduce((s, i) => s + (i.qty || 1), 0);
  const currentProduct = productsList[currentIndex];
  const isFinished = currentIndex >= productsList.length;

  return (
    <div className="tc-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        * { -webkit-tap-highlight-color: transparent; }

        .tc-root {
          min-height: 100vh; min-height: 100dvh;
          background: #111111;
          display: flex; align-items: flex-start; justify-content: center;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow: hidden;
        }
        .tc-phone {
          position: relative; width: 100%; max-width: 430px;
          height: 100vh; height: 100dvh;
          background: #111111; overflow: hidden;
          display: flex; flex-direction: column;
        }
        @media (min-width: 431px) {
          .tc-phone {
            border: 5px solid #1a1a1a;
            box-shadow: 0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.8);
          }
        }

        /* ── Header ── */
        .tc-header {
          position: absolute; top: 0; left: 0; right: 0;
          z-index: 50; padding: 12px 16px 0;
          display: flex; align-items: center; justify-content: space-between;
          height: 56px; pointer-events: none;
        }
        .tc-header-btn {
          width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: none; background: rgba(0,0,0,0.3);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          color: #fff; cursor: pointer; pointer-events: auto;
          transition: transform 0.2s;
        }
        .tc-header-btn:active { transform: scale(0.9); }
        .tc-cart-badge {
          position: absolute; top: -4px; right: -4px;
          width: 18px; height: 18px; border-radius: 50%;
          background: #e74c3c; color: #fff;
          font-size: 10px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(231,76,60,0.5);
        }

        /* ── Card Stack Area ── */
        .tc-stack {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 8px 8px 0; position: relative; overflow: hidden;
        }

        /* ── The Card ── */
        .tc-card {
          position: absolute;
          width: calc(100% - 16px); max-width: 414px;
          top: 8px; bottom: 8px;
          border-radius: 16px;
          overflow: hidden;
          cursor: grab; user-select: none;
          touch-action: none; will-change: transform;
          z-index: 10;
          box-shadow: 0 10px 40px rgba(0,0,0,0.6);
        }
        .tc-card:active { cursor: grabbing; }

        /* Full-bleed image */
        .tc-card-img {
          position: absolute; inset: 0;
          overflow: hidden;
        }
        .tc-card-img-gradient {
          position: absolute; inset: 0;
        }
        .tc-card-product-img {
          position: absolute;
          top: 37%; left: 50%;
          transform: translate(-50%, -38%);
          max-width: 100%; max-height: 80%;
          object-fit: contain;
          filter: drop-shadow(0 20px 50px rgba(0,0,0,0.5));
          z-index: 1;
        }

        /* ── Progress Bar ── */
        .tc-progress-bar {
          position: absolute; top: 10px; left: 10px; right: 10px;
          z-index: 20; display: flex; gap: 4px;
          pointer-events: none;
        }
        .tc-progress-seg {
          flex: 1; height: 3px; border-radius: 99px;
          background: rgba(255,255,255,0.25);
          transition: background 0.3s;
        }
        .tc-progress-seg.active {
          background: #ffffff;
        }
        .tc-progress-seg.done {
          background: rgba(255,255,255,0.6);
        }

        /* ── LIKE / NOPE stamps ── */
        .tc-stamp {
          position: absolute; top: 80px; z-index: 25;
          padding: 8px 20px; border-radius: 6px;
          font-size: 28px; font-weight: 900;
          letter-spacing: 3px;
          border: 4px solid;
          pointer-events: none;
          font-family: 'Syne', sans-serif;
        }
        .tc-stamp-like {
          left: 24px;
          color: #22c55e; border-color: #22c55e;
        }
        .tc-stamp-nope {
          right: 24px;
          color: #ef4444; border-color: #ef4444;
        }
        .tc-stamp-super {
          left: 50%;
          color: #3b82f6; border-color: #3b82f6;
        }

        /* ── Heart pop ── */
        .tc-heart-pop {
          position: absolute; inset: 0; z-index: 30;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none;
          animation: tc-heart 0.8s ease-out forwards;
        }
        @keyframes tc-heart {
          0% { opacity: 0; transform: scale(0); }
          15% { opacity: 1; transform: scale(1.3); }
          30% { transform: scale(0.95); }
          45% { transform: scale(1.05); }
          100% { opacity: 0; transform: scale(1.4); }
        }

        /* ── Bottom gradient ── */
        .tc-bottom-gradient {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 55%; z-index: 5;
          background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 40%, transparent 100%);
          pointer-events: none;
        }

        /* ── Info area ── */
        .tc-info {
          position: absolute; bottom: 16px; left: 16px; right: 16px;
          z-index: 10; pointer-events: none;
        }
        .tc-badge {
          display: inline-block;
          padding: 5px 14px; border-radius: 6px;
          font-size: 11px; font-weight: 800; color: #fff;
          text-transform: uppercase; letter-spacing: 0.5px;
          margin-bottom: 10px;
        }
        .tc-name-row {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 12px; margin-bottom: 6px;
        }
        .tc-name {
          color: #fff; font-size: 22px; font-weight: 800;
          line-height: 1.25; flex: 1;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .tc-details-arrow {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255,255,255,0.25);
          cursor: pointer; pointer-events: auto;
          flex-shrink: 0; margin-top: 2px;
          transition: background 0.2s;
        }
        .tc-details-arrow:active { background: rgba(255,255,255,0.3); transform: scale(0.9); }

        .tc-info-line {
          display: flex; align-items: center; gap: 6px;
          color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 500;
          margin-bottom: 4px;
        }
        .tc-price-row {
          display: flex; align-items: baseline; gap: 8px;
          margin: 8px 0 8px;
        }
        .tc-cur-price {
          color: #fff; font-size: 24px; font-weight: 900;
          letter-spacing: -0.5px;
        }
        .tc-old-price {
          color: rgba(255,255,255,0.4); font-size: 13px;
          text-decoration: line-through;
        }
        .tc-discount {
          color: #22c55e; font-size: 12px; font-weight: 700;
          background: rgba(34,197,94,0.15); padding: 2px 8px;
          border-radius: 6px;
        }
        .tc-desc {
          color: rgba(255,255,255,0.6); font-size: 13px;
          line-height: 1.5; max-height: 60px; overflow: hidden;
        }

        /* ── Bottom Action Bar (like Tinder) ── */
        .tc-bottom-bar {
          display: flex; align-items: center; justify-content: center;
          gap: 12px; padding: 10px 20px 20px;
          background: #111111;
        }
        .tc-action {
          border-radius: 50%; display: flex;
          align-items: center; justify-content: center;
          border: none; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .tc-action:active { transform: scale(0.88); }

        /* Small buttons */
        .tc-action.sm {
          width: 48px; height: 48px;
          background: transparent;
          border: 2px solid rgba(255,255,255,0.12);
        }
        /* Large buttons */
        .tc-action.lg {
          width: 58px; height: 58px;
          background: transparent;
        }
        .tc-action.undo { border: 2px solid rgba(255,170,0,0.35); }
        .tc-action.skip { border: 2px solid rgba(239,68,68,0.35); }
        .tc-action.star { border: 2px solid rgba(59,130,246,0.35); }
        .tc-action.like { border: 2px solid rgba(34,197,94,0.35); }
        .tc-action.send { border: 2px solid rgba(59,130,246,0.35); }

        /* ── Toast ── */
        .tc-toast {
          position: absolute; top: 70px; left: 50%;
          transform: translateX(-50%); z-index: 55;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.08);
          color: #fff; font-size: 12px; font-weight: 500;
          padding: 8px 18px; border-radius: 99px;
          white-space: nowrap; pointer-events: none;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          animation: tc-toast 0.35s cubic-bezier(.25,.8,.25,1);
          max-width: 90%; overflow: hidden; text-overflow: ellipsis;
        }
        @keyframes tc-toast {
          0% { transform: translateX(-50%) translateY(-12px) scale(0.9); opacity: 0; }
          100% { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
        }

        /* ── Finished state ── */
        .tc-empty {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 12px; text-align: center; padding: 40px;
        }
        .tc-empty-icon { font-size: 60px; margin-bottom: 8px; animation: tc-pulse 2s infinite; }
        .tc-empty h3 { color: #fff; font-size: 22px; font-weight: 800; }
        .tc-empty p { color: rgba(255,255,255,0.4); font-size: 13px; max-width: 260px; line-height: 1.5; }
        .tc-restart-btn {
          margin-top: 16px; padding: 14px 32px; border-radius: 99px;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          color: #fff; font-size: 14px; font-weight: 700;
          border: none; cursor: pointer;
          box-shadow: 0 8px 24px rgba(168,85,247,0.35);
          transition: transform 0.2s;
        }
        .tc-restart-btn:active { transform: scale(0.95); }
        @keyframes tc-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }

        /* ── Sheets ── */
        .tc-backdrop {
          position: absolute; inset: 0; z-index: 60;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(6px);
          animation: tc-fadeIn 0.25s ease;
        }
        .tc-sheet {
          position: absolute; bottom: 0; left: 0; right: 0; z-index: 65;
          background: #ffffff; border-radius: 28px 28px 0 0;
          border-top: 1px solid rgba(0,0,0,0.05);
          max-height: 78vh; overflow-y: auto;
          padding: 12px 16px 28px;
          transition: transform 0.45s cubic-bezier(.25,.8,.25,1);
          scrollbar-width: none;
        }
        .tc-sheet::-webkit-scrollbar { display: none; }
        .tc-sheet-handle {
          width: 36px; height: 4px; border-radius: 99px;
          background: rgba(0,0,0,0.1); margin: 0 auto 14px;
        }
        .tc-sheet-close {
          position: absolute; right: 16px; top: 12px;
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(0,0,0,0.05); color: rgba(0,0,0,0.4);
          border: none; font-size: 12px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        @keyframes tc-fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <div className="tc-phone">
        {/* Header */}
        <div className="tc-header">
          <button className="tc-header-btn" onClick={() => { window.history.pushState({}, "", "/"); window.dispatchEvent(new PopStateEvent("popstate")); }} title="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <button className="tc-header-btn" onClick={() => setCartOpen(true)} style={{ position: "relative" }}>
            <CartIcon />
            {cartTotal > 0 && <span className="tc-cart-badge">{cartTotal}</span>}
          </button>
        </div>

        {/* Card Stack */}
        <div className="tc-stack">
          {isFinished ? (
            <div className="tc-empty">
              <div className="tc-empty-icon">✨</div>
              <h3>All Done!</h3>
              <p>You've swiped through all products. Check your cart or start over!</p>
              <button className="tc-restart-btn" onClick={() => { setCurrentIndex(0); setHistory([]); }}>Start Over</button>
            </div>
          ) : (
            <>
              {/* Next card preview */}
              {currentIndex + 1 < productsList.length && (
                <div className="tc-card" style={{
                  transform: "scale(0.95) translateY(8px)",
                  opacity: 0.4, zIndex: 1, pointerEvents: "none",
                  background: `linear-gradient(160deg, ${productsList[currentIndex + 1].bgStart}, ${productsList[currentIndex + 1].bgEnd})`
                }}>
                  <div className="tc-card-img">
                    <div className="tc-card-img-gradient" style={{ background: `linear-gradient(160deg, ${productsList[currentIndex + 1].bgStart}, ${productsList[currentIndex + 1].bgEnd})` }} />
                    <img src={productsList[currentIndex + 1].image} alt="" className="tc-card-product-img" draggable={false} />
                  </div>
                  <div className="tc-bottom-gradient" />
                </div>
              )}
              {/* Current card */}
              <TinderCard
                ref={cardRef}
                key={currentProduct.id + "-" + currentIndex}
                product={currentProduct}
                totalCount={productsList.length}
                currentIndex={currentIndex}
                onSwipeRight={addToCart}
                onSwipeLeft={skipProduct}
                onShowDetails={(p) => setDetailsProduct(p)}
                liked={likedProducts.has(currentProduct.id)}
                onToggleLike={toggleLike}
                displayLikes={currentProduct.likesNum}
              />
            </>
          )}
        </div>

        {/* ── Bottom Action Bar (5 Tinder-style buttons) ── */}
        {!isFinished && (
          <div className="tc-bottom-bar">
            {/* Undo */}
            <button className="tc-action sm undo" onClick={undoLast} disabled={history.length === 0} style={{ opacity: history.length === 0 ? 0.3 : 1 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffaa00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
            </button>
            {/* Skip / Nope */}
            <button className="tc-action lg skip" onClick={() => {
              if (cardRef.current) {
                cardRef.current.swipeLeft();
              } else {
                skipProduct();
              }
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            {/* Star / Details */}
            <button className="tc-action sm star" onClick={() => {
              if (cardRef.current) {
                cardRef.current.swipeUp();
              } else {
                setDetailsProduct(currentProduct);
              }
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
            {/* Like / Heart (Add to Cart) */}
            <button className="tc-action lg like" onClick={() => {
              if (cardRef.current) {
                cardRef.current.swipeRight();
              } else {
                addToCart(currentProduct);
              }
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            {/* Share / Send */}
            <button className="tc-action sm send" onClick={() => handleShareClick(currentProduct)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        )}

        {/* Toast */}
        {toastMsg && <div className="tc-toast">{toastMsg}</div>}

        {/* Cart */}
        <CartSheet cart={cart} open={cartOpen} onClose={() => setCartOpen(false)} onRemove={removeFromCart} onUpdateQty={updateQty} />

        {/* Details */}
        <DetailsSheet product={detailsProduct} open={!!detailsProduct} onClose={() => setDetailsProduct(null)} onBuy={(prod) => { setDetailsProduct(null); addToCart(prod); }} />

        {/* Comments */}
        <CommentSheet open={!!commentOpenProduct} onClose={() => setCommentOpenProduct(null)} product={commentOpenProduct} comments={commentOpenProduct ? commentsMap[commentOpenProduct.id] : []} onAddComment={addComment} onToggleLikeComment={toggleLikeComment} />
      </div>
    </div>
  );
}
