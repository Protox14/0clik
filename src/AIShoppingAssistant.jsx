import { useState, useRef, useEffect, useCallback } from "react";
import { PRODUCTS } from "./ProductSwipeFeed";
import { navigate } from "./App";

/* ─────────────── AI Logic (unchanged) ─────────────── */
const INTENT_KEYWORDS = {
  greeting: ["hi", "hello", "hey", "sup", "yo", "hola", "namaste", "good morning", "good evening", "good afternoon"],
  search: ["show", "find", "search", "looking", "want", "need", "give", "list", "display", "browse", "explore", "suggest", "recommend"],
  details: ["detail", "details", "info", "information", "tell me about", "specs", "specification", "features", "describe", "description", "about"],
  price: ["price", "cost", "how much", "expensive", "cheap", "budget", "affordable", "cheapest", "lowest", "highest"],
  compare: ["compare", "versus", "vs", "difference", "better", "best", "which one"],
  category: {
    earphones: ["earphone", "earphones", "wired", "wired earphone", "earbud", "earbuds", "in-ear"],
    headphones: ["headphone", "headphones", "over-ear", "on-ear", "ows"],
    tws: ["tws", "wireless", "bluetooth", "true wireless", "airpods", "airdopes", "buds"],
    watch: ["watch", "smartwatch", "fitness", "band", "tracker", "wearable"],
    audio: ["audio", "music", "sound", "bass", "speaker"],
    anc: ["anc", "noise cancellation", "noise cancelling", "active noise"],
  },
  help: ["help", "what can you do", "how", "guide", "assist", "support"],
  cart: ["cart", "buy", "purchase", "order", "checkout", "add to cart"],
  rating: ["rating", "rated", "review", "reviews", "popular", "top", "best rated", "highly rated"],
  discount: ["discount", "offer", "sale", "deal", "off", "savings"],
};

function getDiscount(product) {
  try {
    const oldVal = parseFloat(product.oldPrice.replace(/[^\d.]/g, ""));
    const newVal = parseFloat(product.price.replace(/[^\d.]/g, ""));
    if (oldVal && newVal && oldVal > newVal) return Math.round(((oldVal - newVal) / oldVal) * 100);
  } catch (_) {}
  return 0;
}

function detectIntent(message) {
  const lower = message.toLowerCase().trim();
  const intents = [];
  if (INTENT_KEYWORDS.greeting.some((k) => lower.includes(k))) intents.push("greeting");
  if (INTENT_KEYWORDS.help.some((k) => lower.includes(k))) intents.push("help");
  if (INTENT_KEYWORDS.search.some((k) => lower.includes(k))) intents.push("search");
  if (INTENT_KEYWORDS.details.some((k) => lower.includes(k))) intents.push("details");
  if (INTENT_KEYWORDS.price.some((k) => lower.includes(k))) intents.push("price");
  if (INTENT_KEYWORDS.compare.some((k) => lower.includes(k))) intents.push("compare");
  if (INTENT_KEYWORDS.cart.some((k) => lower.includes(k))) intents.push("cart");
  if (INTENT_KEYWORDS.rating.some((k) => lower.includes(k))) intents.push("rating");
  if (INTENT_KEYWORDS.discount.some((k) => lower.includes(k))) intents.push("discount");

  let matchedCategory = null;
  for (const [cat, keywords] of Object.entries(INTENT_KEYWORDS.category)) {
    if (keywords.some((k) => lower.includes(k))) { matchedCategory = cat; break; }
  }

  const words = lower.split(/\s+/).filter((w) => w.length > 2);
  const matchedProducts = PRODUCTS.filter((p) => {
    const pName = p.name.toLowerCase();
    const pDesc = p.desc.toLowerCase();
    const pSeller = p.seller.toLowerCase();
    return words.some((w) => pName.includes(w) || pDesc.includes(w) || pSeller.includes(w));
  });

  let categoryProducts = [];
  if (matchedCategory) {
    categoryProducts = PRODUCTS.filter((p) => {
      const pName = p.name.toLowerCase();
      const pDesc = p.desc.toLowerCase();
      const catKeywords = INTENT_KEYWORDS.category[matchedCategory];
      return catKeywords.some((k) => pName.includes(k) || pDesc.includes(k));
    });
  }

  if (matchedProducts.length === 0 && categoryProducts.length === 0 && intents.includes("search")) {
    categoryProducts = PRODUCTS;
  }

  return { intents, matchedCategory, matchedProducts, categoryProducts };
}

function extractFilters(message) {
  const lower = message.toLowerCase();
  const filters = [];
  for (const [cat] of Object.entries(INTENT_KEYWORDS.category)) {
    const catKeywords = INTENT_KEYWORDS.category[cat];
    if (catKeywords.some((k) => lower.includes(k))) {
      const catLabels = { earphones: "Earphones", headphones: "Headphones", tws: "TWS / Wireless", watch: "Smartwatch", audio: "Audio", anc: "ANC" };
      filters.push({ label: "Category", value: catLabels[cat] || cat });
      break;
    }
  }
  const brands = ["boat", "portronics", "noise", "pebble", "fingers"];
  for (const brand of brands) {
    if (lower.includes(brand)) filters.push({ label: "Brand", value: brand.charAt(0).toUpperCase() + brand.slice(1) });
  }
  const priceMatch = lower.match(/under\s*₹?\s*(\d[\d,]*)/i) || lower.match(/below\s*₹?\s*(\d[\d,]*)/i);
  if (priceMatch) filters.push({ label: "Max Price", value: `₹${priceMatch[1]}` });
  const priceAbove = lower.match(/above\s*₹?\s*(\d[\d,]*)/i) || lower.match(/over\s*₹?\s*(\d[\d,]*)/i);
  if (priceAbove) filters.push({ label: "Min Price", value: `₹${priceAbove[1]}` });
  return filters;
}

function generateResponse(message) {
  const { intents, matchedCategory, matchedProducts, categoryProducts } = detectIntent(message);
  const lower = message.toLowerCase().trim();
  const filters = extractFilters(message);

  if (intents.includes("greeting") && intents.length === 1) {
    return { text: "Hey! What are you shopping for today?", products: [], filters: [], suggestions: ["Show me headphones", "Earphones under 1000", "Best rated products", "Show all products"] };
  }
  if (intents.includes("help")) {
    return { text: "Here's what I can do:\n\n🔍 Search — \"Show me earphones\"\n📋 Details — \"Tell me about boAt Airdopes\"\n💰 Price — \"Cheapest product?\"\n⭐ Ratings — \"Best rated products\"\n🏷️ Deals — \"Show me discounts\"\n🔄 Compare — \"Compare earbuds\"", products: [], filters: [], suggestions: ["Show me earphones", "Best deals today", "Top rated products"] };
  }
  if (intents.includes("discount") && !intents.includes("details")) {
    const sorted = [...PRODUCTS].sort((a, b) => getDiscount(b) - getDiscount(a));
    const topDeals = sorted.filter((p) => getDiscount(p) > 0).slice(0, 4);
    if (topDeals.length > 0) return { text: `${topDeals.length} products with the best deals right now.`, products: topDeals, filters: [{ label: "Filter", value: "Best Deals" }], suggestions: ["Tell me about the cheapest one", "Show all products", "Best rated products"] };
  }
  if (intents.includes("rating")) {
    const sorted = [...PRODUCTS].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    return { text: `Top ${Math.min(4, sorted.length)} rated products.`, products: sorted.slice(0, 4), filters: [{ label: "Sort", value: "Highest Rated" }], suggestions: ["Show me deals", "Tell me about the best one", "Compare top 2"] };
  }
  if (intents.includes("price") && !intents.includes("search")) {
    if (lower.includes("cheapest") || lower.includes("lowest") || lower.includes("budget") || lower.includes("affordable")) {
      const sorted = [...PRODUCTS].sort((a, b) => a.priceVal - b.priceVal);
      return { text: `${Math.min(3, sorted.length)} budget-friendly picks.`, products: sorted.slice(0, 3), filters: [{ label: "Sort", value: "Lowest Price" }], suggestions: ["Show most expensive", "Best deals", "Show all products"] };
    }
    if (lower.includes("expensive") || lower.includes("highest") || lower.includes("premium")) {
      const sorted = [...PRODUCTS].sort((a, b) => b.priceVal - a.priceVal);
      return { text: `${Math.min(3, sorted.length)} premium picks.`, products: sorted.slice(0, 3), filters: [{ label: "Sort", value: "Highest Price" }], suggestions: ["Show cheapest options", "Best deals", "Show all products"] };
    }
    const sorted = [...PRODUCTS].sort((a, b) => a.priceVal - b.priceVal);
    return { text: `Full price range: ₹${sorted[0].priceVal} – ₹${sorted[sorted.length - 1].priceVal}`, products: sorted, filters: [{ label: "Sort", value: "Price: Low to High" }], suggestions: ["Cheapest option", "Most expensive", "Best deals"] };
  }
  if (intents.includes("compare")) {
    const products = matchedProducts.length > 0 ? matchedProducts : categoryProducts.length > 0 ? categoryProducts : PRODUCTS;
    const toCompare = products.slice(0, 3);
    if (toCompare.length >= 2) return { text: `Comparing ${toCompare.length} products.`, products: toCompare, filters: [{ label: "Mode", value: "Comparison" }, ...filters], suggestions: ["Which one should I buy?", "Show me more details", "Best deal among these"] };
  }
  if (intents.includes("details") && matchedProducts.length > 0) {
    const product = matchedProducts[0];
    const disc = getDiscount(product);
    return {
      text: `**${product.name}**\n\n💰 ${product.price} ~~${product.oldPrice}~~ ${disc > 0 ? `(${disc}% off)` : ""}\n⭐ ${product.rating} · ${product.reviews} reviews\n🏪 ${product.seller}\n\n${product.desc}`,
      products: [product], filters, suggestions: ["Compare with similar products", "Show me alternatives"],
    };
  }
  if (matchedProducts.length > 0) return { text: `Found ${matchedProducts.length} result${matchedProducts.length > 1 ? "s" : ""}.`, products: matchedProducts, filters, suggestions: matchedProducts.length === 1 ? ["Tell me more about it", "Show similar products", "Best deals"] : ["Compare these", "Show me the cheapest", "Tell me more about the first one"] };
  if (categoryProducts.length > 0 && matchedCategory) return { text: `${categoryProducts.length} product${categoryProducts.length > 1 ? "s" : ""} found.`, products: categoryProducts, filters, suggestions: ["Compare these", "Show me the best deal", "Tell me more"] };
  if (intents.includes("search")) return { text: "Here's the full catalog.", products: PRODUCTS, filters, suggestions: ["Show me earphones", "Best deals", "Budget options"] };
  if (intents.includes("cart")) return { text: "Popular picks you might like.", products: PRODUCTS.slice(0, 3), filters: [], suggestions: ["Show all products", "Best deals", "Top rated"] };
  return { text: "I didn't catch that. Try something like \"show me earphones\" or \"best deals\".", products: [], filters: [], suggestions: ["Show all products", "Best deals", "Help"] };
}

/* ─────────────── Icons ─────────────── */
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconCart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const IconSend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const IconSpark = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
  </svg>
);

/* ─────────────── Navbar ─────────────── */
function Navbar({ cartCount, onOpenCart }) {
  return (
    <nav className="flex items-center gap-4 px-5 md:px-8 h-14 bg-white border-b border-black/[0.06] shrink-0">
      <button onClick={() => navigate("/")} className="flex items-center gap-2 bg-transparent border-none cursor-pointer p-0 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center">
          <span className="text-white text-[11px] font-black tracking-tight">0C</span>
        </div>
        <span className="text-[16px] font-black text-black tracking-tight">Clik</span>
      </button>

      <div className="flex-1 max-w-sm mx-4 hidden sm:block">
        <div className="flex items-center bg-[#f5f5f5] rounded-lg px-3 h-9 gap-2 text-gray-400">
          <IconSearch />
          <span className="text-[13px] text-gray-400">Search products...</span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button className="hidden sm:block text-[13px] font-semibold text-gray-600 bg-transparent border-none cursor-pointer hover:text-black transition-colors">
          Sign in
        </button>
        <button onClick={onOpenCart} className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-all bg-transparent border-none cursor-pointer">
          <IconCart />
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-black text-white text-[9px] font-black rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white text-[11px] font-black">
          N
        </div>
      </div>
    </nav>
  );
}

/* ─────────────── Product Card ─────────────── */
function ProductCard({ product, onAddToCart, onViewDetails }) {
  const disc = getDiscount(product);
  return (
    <div className="rounded-2xl border border-black/[0.08] bg-white overflow-hidden group flex flex-col hover:border-black/20 hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-200">
      <div
        className="w-full aspect-[4/5] flex items-center justify-center relative cursor-pointer overflow-hidden"
        style={{ background: `linear-gradient(145deg, ${product.bgStart}, ${product.bgEnd})` }}
        onClick={() => onViewDetails(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="max-w-[80%] max-h-[80%] object-contain drop-shadow-[0_6px_16px_rgba(0,0,0,0.18)] group-hover:scale-[1.04] transition-transform duration-300"
          draggable={false}
        />
        {disc > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-black text-white text-[10px] font-black px-2 py-0.5 rounded-md tracking-wide">
            -{disc}%
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          {product.seller.replace("@", "")}
        </span>
        <h4 className="text-[12.5px] font-bold text-gray-900 leading-snug line-clamp-2">
          {product.name}
        </h4>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-[11px] font-black text-black">★ {product.rating}</span>
          <span className="text-[10px] text-gray-400">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-black/[0.05]">
          <span className="text-[15px] font-black text-black">{product.price}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="text-[11px] font-black px-3 py-1.5 rounded-lg bg-black text-white cursor-pointer hover:bg-gray-800 active:scale-95 transition-all border-none"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Filter Tags ─────────────── */
function FilterTags({ filters }) {
  if (!filters || filters.length === 0) return null;
  return (
    <div className="flex items-center gap-1.5 flex-wrap mb-1">
      {filters.map((f, i) => (
        <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/[0.06] text-[10.5px] font-semibold text-gray-600 border border-black/[0.06]">
          <span className="text-gray-400">{f.label}:</span>{f.value}
        </span>
      ))}
    </div>
  );
}

/* ─────────────── Chat Bubble ─────────────── */
function ChatBubble({ message, isUser, onAddToCart, onViewDetails }) {
  const renderText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*[^*]+\*\*|~~[^~]+~~)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
      if (part.startsWith("~~") && part.endsWith("~~")) return <span key={i} className="line-through opacity-40">{part.slice(2, -2)}</span>;
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className={`flex gap-3 items-end max-w-full ${isUser ? "flex-row-reverse" : ""}`}
      style={{ animation: "bubbleIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both" }}>

      {/* Avatar */}
      {!isUser ? (
        <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center text-white shrink-0 mb-0.5">
          <IconSpark />
        </div>
      ) : (
        <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center text-white shrink-0 mb-0.5 text-[10px] font-black">N</div>
      )}

      <div className={`max-w-[82%] flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
        {message.text && (
          <div className={`rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed ${
            isUser
              ? "bg-black text-white rounded-br-sm"
              : "bg-[#f5f5f5] text-gray-800 rounded-bl-sm"
          }`}>
            {message.text.split("\n").map((line, i) => (
              <p key={i} className={line === "" ? "mb-1" : "mb-0.5 last:mb-0"}>{renderText(line)}</p>
            ))}
          </div>
        )}

        {!isUser && message.filters && message.filters.length > 0 && (
          <FilterTags filters={message.filters} />
        )}

        {!isUser && message.products && message.products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full max-w-xl">
            {message.products.map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onViewDetails={onViewDetails} />
            ))}
          </div>
        )}

        {message.suggestions && message.suggestions.length > 0 && !isUser && (
          <div className="flex flex-wrap gap-1.5 mt-0.5">
            {message.suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => message.onChipClick?.(s)}
                className="px-3 py-1.5 rounded-full bg-white border border-black/[0.1] text-gray-600 text-[11.5px] font-semibold cursor-pointer hover:bg-black hover:text-white hover:border-black transition-all duration-150 active:scale-95 whitespace-nowrap"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────── Typing Indicator ─────────────── */
function TypingIndicator() {
  return (
    <div className="flex gap-3 items-end" style={{ animation: "bubbleIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both" }}>
      <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center text-white shrink-0">
        <IconSpark />
      </div>
      <div className="rounded-2xl rounded-bl-sm bg-[#f5f5f5] px-4 py-3">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map(i => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 block"
              style={{ animation: `typingDot 1.2s ${i * 0.2}s ease-in-out infinite` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Product Details Modal ─────────────── */
function ProductDetailsModal({ product, onClose, onAddToCart }) {
  const disc = getDiscount(product);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" style={{ animation: "fadeIn 0.15s ease-out" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full flex flex-col md:flex-row shadow-2xl max-h-[90vh]"
        style={{ animation: "slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1) both" }}>
        {/* Image */}
        <div className="md:w-[45%] flex items-center justify-center p-8 relative min-h-[260px]"
          style={{ background: `linear-gradient(145deg, ${product.bgStart}, ${product.bgEnd})` }}>
          <img src={product.image} alt={product.name} className="max-w-[80%] max-h-[220px] object-contain drop-shadow-2xl" />
          {disc > 0 && (
            <span className="absolute top-4 right-4 bg-black text-white text-[11px] font-black px-2.5 py-1 rounded-xl">
              -{disc}%
            </span>
          )}
          <button onClick={onClose} className="absolute top-4 left-4 md:hidden w-8 h-8 bg-black/20 backdrop-blur-sm text-white rounded-lg flex items-center justify-center text-sm font-bold">✕</button>
        </div>

        {/* Info */}
        <div className="flex-1 p-7 flex flex-col overflow-y-auto">
          <div className="flex items-start justify-between mb-3">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.seller.replace("@", "")}</span>
            <button onClick={onClose} className="hidden md:flex w-8 h-8 rounded-lg bg-gray-100 items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all text-sm font-bold border-none cursor-pointer">✕</button>
          </div>
          <h2 className="text-2xl font-black text-black leading-tight mb-4">{product.name}</h2>
          <div className="flex items-center gap-2 mb-5">
            <span className="flex items-center gap-1 text-sm font-black text-black">★ {product.rating}</span>
            <span className="text-sm text-gray-400">{product.reviews} reviews</span>
          </div>
          <div className="flex items-end gap-3 mb-6 pb-6 border-b border-black/[0.07]">
            <span className="text-3xl font-black text-black">{product.price}</span>
            {product.oldPrice && <span className="text-base text-gray-400 line-through mb-0.5">{product.oldPrice}</span>}
          </div>
          <p className="text-[13.5px] text-gray-500 leading-relaxed flex-1 mb-6">{product.desc}</p>
          <button
            onClick={() => { onAddToCart(product); onClose(); }}
            className="w-full py-3.5 rounded-xl bg-black text-white text-[14px] font-black hover:bg-gray-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
          >
            <IconCart /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Cart Modal ─────────────── */
function CartModal({ cart, onClose, onRemove, onCheckout }) {
  const total = cart.reduce((sum, p) => sum + p.priceVal, 0);
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" style={{ animation: "fadeIn 0.15s ease-out" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-w-sm h-full flex flex-col" style={{ animation: "slideInRight 0.25s cubic-bezier(0.34,1.56,0.64,1) both" }}>
        <div className="px-6 py-5 border-b border-black/[0.07] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[18px] font-black text-black">Cart</h2>
            <span className="w-6 h-6 rounded-lg bg-black text-white text-[11px] font-black flex items-center justify-center">{cart.length}</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white transition-all text-sm font-bold border-none cursor-pointer">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 text-gray-300">
                <IconCart />
              </div>
              <p className="font-black text-gray-900 text-[15px]">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-1">Ask the assistant to find something</p>
            </div>
          ) : (
            cart.map((item, i) => (
              <div key={i} className="flex gap-3 p-3 border border-black/[0.08] rounded-2xl">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0" style={{ background: `linear-gradient(145deg, ${item.bgStart}, ${item.bgEnd})` }}>
                  <img src={item.image} alt={item.name} className="w-10 object-contain drop-shadow-md" />
                </div>
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <p className="text-[12.5px] font-bold text-black line-clamp-2 leading-snug">{item.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[14px] font-black text-black">{item.price}</span>
                    <button onClick={() => onRemove(i)} className="text-[11px] font-black text-red-500 hover:text-red-600 bg-transparent border-none cursor-pointer">Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-5 border-t border-black/[0.07] shrink-0">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[13px] text-gray-500 font-semibold">Total</span>
              <span className="text-2xl font-black text-black">₹{total.toLocaleString()}</span>
            </div>
            <button onClick={onCheckout} className="w-full py-3.5 rounded-xl bg-black text-white text-[14px] font-black hover:bg-gray-900 active:scale-[0.98] transition-all border-none cursor-pointer">
              Checkout →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────── Main Component ─────────────── */
export default function AIShoppingAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      isUser: false,
      text: "Hey! I'm your AI shopping assistant. What are you looking for today?",
      products: [],
      filters: [],
      suggestions: ["Show me headphones", "Earphones under ₹1000", "Best rated products", "Show all products"],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);

  const handleSend = useCallback((text) => {
    const msg = (text || inputValue).trim();
    if (!msg) return;
    setMessages((prev) => [...prev, { id: Date.now(), isUser: true, text: msg }]);
    setInputValue("");
    setIsTyping(true);
    setTimeout(() => {
      const response = generateResponse(msg);
      setMessages((prev) => [...prev, { id: Date.now() + 1, isUser: false, ...response }]);
      setIsTyping(false);
    }, 500 + Math.random() * 600);
  }, [inputValue]);

  const handleChipClick = useCallback((chipText) => handleSend(chipText), [handleSend]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const quickSuggestions = ["Earphones under ₹1000", "Best ANC earbuds", "Smartwatch deals"];

  return (
    <div className="h-screen h-[100dvh] overflow-hidden bg-[#fafafa] flex flex-col" style={{ fontFamily: "'Geist', 'DM Sans', system-ui, sans-serif" }}>
      <Navbar cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} />

      {/* Assistant header */}
      <div className="bg-white border-b border-black/[0.06] px-5 md:px-8 py-3.5 shrink-0">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white">
            <IconSpark />
          </div>
          <div>
            <h1 className="text-[14px] font-black text-black tracking-tight">AI Assistant</h1>
            <p className="text-[11px] text-gray-400 font-medium">Ask anything about our products</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] text-gray-400 font-semibold">Online</span>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-4">
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={{ ...msg, onChipClick: handleChipClick }}
              isUser={msg.isUser}
              onAddToCart={(p) => setCart(prev => [...prev, p])}
              onViewDetails={setSelectedProduct}
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-black/[0.06] shrink-0">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-3.5">
          {messages.length <= 2 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {quickSuggestions.map((s, i) => (
                <button key={i} onClick={() => handleSend(s)}
                  className="px-3 py-1.5 rounded-full bg-[#f5f5f5] border border-transparent text-[12px] font-semibold text-gray-600 cursor-pointer hover:bg-black hover:text-white transition-all active:scale-95 border-none">
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about any product..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-[#f5f5f5] rounded-xl py-3 px-4 text-[14px] text-black outline-none border-2 border-transparent focus:border-black transition-all placeholder:text-gray-400 font-medium"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim()}
              className="w-11 h-11 rounded-xl bg-black text-white flex items-center justify-center cursor-pointer hover:bg-gray-800 active:scale-90 disabled:opacity-25 disabled:cursor-default transition-all border-none"
            >
              <IconSend />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedProduct && (
        <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)}
          onAddToCart={(p) => { setCart(prev => [...prev, p]); setSelectedProduct(null); }} />
      )}
      {isCartOpen && (
        <CartModal cart={cart} onClose={() => setIsCartOpen(false)}
          onRemove={(i) => setCart(prev => prev.filter((_, idx) => idx !== i))}
          onCheckout={() => { setIsCartOpen(false); setCheckoutSuccess(true); setCart([]); setTimeout(() => setCheckoutSuccess(false), 3000); }} />
      )}
      {checkoutSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" style={{ animation: "fadeIn 0.15s ease-out" }}>
          <div className="bg-white rounded-3xl p-8 max-w-xs w-full text-center shadow-2xl" style={{ animation: "slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-2xl mx-auto mb-5">🎉</div>
            <h2 className="text-xl font-black text-black mb-2">Order placed!</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">Your order has been confirmed. Thanks for shopping with Clik.</p>
            <button onClick={() => setCheckoutSuccess(false)} className="w-full py-3 rounded-xl bg-black text-white font-black text-[14px] hover:bg-gray-900 active:scale-[0.98] transition-all border-none cursor-pointer">
              Keep shopping →
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}