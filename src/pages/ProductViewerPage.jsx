import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ProductViewerSection from "../components/ProductViewerSection";

export default function ProductViewerPage() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="md:ml-64 ml-0 pt-20 min-h-screen bg-gray-50/80 p-4 md:p-8 pb-12">
        <div className="max-w-4xl mx-auto">
          <ProductViewerSection title="3D Product Viewer" onBack={() => navigate(-1)} />
          <p className="mt-4 text-gray-500 text-sm text-center">
            Drag to rotate · Scroll to zoom · Use overlay to change color
          </p>
        </div>
      </div>
    </>
  );
}
