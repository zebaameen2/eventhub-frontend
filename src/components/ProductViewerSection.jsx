import { useState, useCallback } from "react";
import ProductViewer from "./ProductViewer";

const PRESET_COLORS = [
  { name: "Coral", value: "#f02e65" },
  { name: "Navy", value: "#1e3a5f" },
  { name: "Forest", value: "#2d5a3d" },
  { name: "Gold", value: "#c9a227" },
  { name: "Slate", value: "#475569" },
  { name: "White", value: "#f8fafc" },
];

export default function ProductViewerSection({ title = "Product Viewer", onBack }) {
  const [productColor, setProductColor] = useState("#f02e65");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);

  const handleResetView = useCallback(() => {
    setCanvasKey((k) => k + 1);
  }, []);

  return (
    <section
      className="relative w-full bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-lg"
      style={{ height: 520 }}
    >
      {/* 3D Viewer - fills section, behind overlay */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ touchAction: "none" }}
      >
        <ProductViewer
          key={canvasKey}
          productColor={productColor}
          className="w-full h-full"
          style={{ height: "100%", minHeight: 520 }}
        />
      </div>

      {/* Overlay UI - stays on top and remains clickable */}
      <div
        className="absolute inset-0 z-10 pointer-events-none flex flex-col"
        aria-hidden="true"
      >
        <div className="pointer-events-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition"
              >
                ← Back
              </button>
            )}
            <h2 className="text-lg font-semibold text-white">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetView}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition pointer-events-auto"
            >
              Reset view
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen((f) => !f)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Color picker strip - bottom left */}
        <div className="mt-auto p-4 flex flex-wrap items-center gap-2 pointer-events-auto">
          <span className="text-white/90 text-sm font-medium mr-2">Color</span>
          {PRESET_COLORS.map(({ name, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setProductColor(value)}
              className="w-8 h-8 rounded-full border-2 border-white/30 hover:border-white hover:scale-110 transition shadow-md"
              style={{ backgroundColor: value }}
              title={name}
            />
          ))}
          <label className="flex items-center gap-1.5 ml-2">
            <span className="text-white/80 text-sm">Custom</span>
            <input type="color" value={productColor} onChange={(e) => setProductColor(e.target.value)} className="w-8 h-8 rounded-full cursor-pointer border-2 border-white/30 bg-transparent" />
          </label>
        </div>

        {/* Hint - bottom right */}
        <div className="absolute bottom-4 right-4 text-white/60 text-xs pointer-events-none">
          Drag to rotate · Scroll to zoom
        </div>
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black flex flex-col"
          style={{ minHeight: "100vh" }}
        >
          <div className="absolute inset-0 w-full h-full">
            <ProductViewer
              key={`fullscreen-${canvasKey}`}
              productColor={productColor}
              className="w-full h-full"
              style={{ minHeight: "100vh", height: "100%" }}
            />
          </div>
          <div className="absolute top-4 right-4 z-20 flex gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium backdrop-blur-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
