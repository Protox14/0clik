import { useEffect, useState } from "react";
import ProductSwipeFeed from "./ProductSwipeFeed.jsx";
import TinderSwipeFeed from "./TinderSwipeFeed.jsx";
import AIShoppingAssistant from "./AIShoppingAssistant.jsx";
import BlinkitIOSView from "./BlinkitIOSView.jsx";

export function navigate(to) {
  window.history.pushState({}, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

const TRENDING = [
  { emoji: "👟", name: "Air Runner Pro", price: "₹2,499", old: "₹3,999", rating: "4.9", bg: "bg-green-50" },
  { emoji: "🎧", name: "Bass Max 60", price: "₹1,299", old: "₹1,999", rating: "4.6", bg: "bg-orange-50" },
  { emoji: "👜", name: "Tote Classic", price: "₹899", old: "₹1,400", rating: "4.8", bg: "bg-pink-50" },
  { emoji: "⌚", name: "SmartWatch S3", price: "₹4,199", old: "₹5,999", rating: "4.5", bg: "bg-blue-50" },
];

const MODES = [
  {
    to: "/instagram",
    emoji: "🎬",
    tag: "Reels feed",
    title: "Video commerce",
    desc: "Full-screen vertical product videos, scroll to explore.",
    tagColor: "bg-orange-50 text-orange-700",
    iconBg: "bg-orange-50",
  },
  {
    to: "/tinder",
    emoji: "💳",
    tag: "Swipe cards",
    title: "Card swipe",
    desc: "Tinder-style — swipe right to save, left to skip.",
    tagColor: "bg-pink-50 text-pink-700",
    iconBg: "bg-pink-50",
  },
  {
    to: "/ai-assistant",
    emoji: "✦",
    tag: "AI powered",
    title: "AI assistant",
    desc: "Chat to find products, compare prices, and get picks.",
    tagColor: "bg-blue-50 text-blue-700",
    iconBg: "bg-blue-50",
  },
  {
    to: "/blinkit",
    emoji: "⚡",
    tag: "Blinkit iOS",
    title: "Quick commerce",
    desc: "Superfast grocery delivery. Drag-to-pay and track rider live on map.",
    tagColor: "bg-amber-100 text-amber-800",
    iconBg: "bg-amber-50",
  },
];

function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between sticky top-0 z-50">
      <div className="text-lg font-bold tracking-tight text-gray-900">
        0Clik<span className="text-orange-500">.</span>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-sm text-gray-500 cursor-pointer hover:text-gray-800 transition-colors">Browse</span>
        <span className="text-sm text-gray-500 cursor-pointer hover:text-gray-800 transition-colors">Sell</span>
        <span className="text-sm text-gray-500 cursor-pointer hover:text-gray-800 transition-colors">Orders</span>
        <button className="bg-gray-900 text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-gray-700 transition-colors">
          Sign in
        </button>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <div className="bg-white border-b border-gray-100 px-6 py-10">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 leading-tight mb-2">
            Shop smarter.<br />Discover faster.
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
            Browse through reels, swipe cards, or chat with AI — find what you love in seconds.
          </p>
          <div className="flex gap-8 mt-6">
            {[["2.4M+", "Products"], ["180K", "Sellers"], ["4.8★", "Avg rating"]].map(([num, label]) => (
              <div key={label}>
                <div className="text-xl font-bold text-gray-900">{num}</div>
                <div className="text-xs text-gray-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl px-8 py-5 text-center shrink-0">
          <div className="text-3xl font-bold text-green-600">₹0</div>
          <div className="text-xs text-green-400 mt-1 leading-snug">Commission for<br />new sellers</div>
        </div>
      </div>
    </div>
  );
}

function ModeCard({ to, emoji, tag, title, desc, tagColor, iconBg }) {
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="bg-white border border-gray-100 rounded-2xl p-5 text-left hover:border-gray-300 transition-colors cursor-pointer group"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${iconBg}`}>
        {emoji}
      </div>
      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2 ${tagColor}`}>
        {tag}
      </span>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
    </button>
  );
}

function ProductCard({ emoji, name, price, old, rating, bg }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden cursor-pointer hover:border-gray-300 transition-colors">
      <div className={`h-24 flex items-center justify-center text-3xl ${bg}`}>{emoji}</div>
      <div className="p-3">
        <div className="text-xs font-medium text-gray-800 mb-1">{name}</div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-gray-900">{price}</span>
          <span className="text-xs text-gray-300 line-through">{old}</span>
        </div>
        <div className="text-xs text-amber-400 mt-1">{"★".repeat(Math.floor(parseFloat(rating)))} {rating}</div>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="min-h-dvh bg-gray-50 font-sans">
      <Navbar />
      <Hero />

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Browse by experience</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {MODES.map((m) => <ModeCard key={m.to} {...m} />)}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Trending now</h2>
            <span className="text-xs text-orange-500 cursor-pointer">See all →</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {TRENDING.map((p) => <ProductCard key={p.name} {...p} />)}
          </div>
        </section>

        <footer className="text-center text-xs text-gray-300 pb-4 pt-2">
          0Clik · Commerce Interface Preview
        </footer>
      </main>
    </div>
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
  if (currentPath === "/blinkit") return <BlinkitIOSView />;
  return <Home />;
}