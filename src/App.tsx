import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Faq from "./pages/Faq";
import Review from "./pages/Review";
import ForRentalCompanies from "./pages/ForRentalCompanies";
import AutoHurenCuracao from "./pages/AutoHurenCuracao";
import CarRentalAirport from "./pages/CarRentalAirport";
import CheapCarRentalCuracao from "./pages/CheapCarRentalCuracao";
import RentCarWillemstad from "./pages/RentCarWillemstad";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cars" element={<Cars />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/about" element={<About />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/review" element={<Review />} />
      <Route path="/for-rental-companies" element={<ForRentalCompanies />} />
      <Route path="/auto-huren-curacao" element={<AutoHurenCuracao />} />
      <Route path="/car-rental-curacao-airport" element={<CarRentalAirport />} />
      <Route path="/cheap-car-rental-curacao" element={<CheapCarRentalCuracao />} />
      <Route path="/rent-a-car-willemstad" element={<RentCarWillemstad />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
