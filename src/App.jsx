import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Background3D from "./components/Background3D";
import ScrollProgress from "./components/ScrollProgress";
import Preloader from "./components/Preloader";
import TechMarquee from "./components/TechMarquee";
import { AnimatedDivider } from "./components/ScrollReveal";
import { portfolioData } from "./data/portfolioData";
import { fetchLivePortfolio } from "./api";
import AdminApp from "./admin/AdminApp";
import { isSectionVisible } from "./siteSettings";

function PortfolioView({ data }) {
  const show = (id) => isSectionVisible(data, id);

  // Browser tab title and search description, editable in Admin → Settings
  useEffect(() => {
    const { siteTitle, metaDescription } = data?.settings || {};
    if (siteTitle) document.title = siteTitle;
    if (metaDescription) {
      document.querySelector('meta[name="description"]')?.setAttribute("content", metaDescription);
    }
  }, [data?.settings]);

  return (
    <div
      className="portfolio-app"
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "var(--ivory-canvas)"
      }}
    >
      <Preloader />

      {/* Top Reading Progress Bar & Floating Back-To-Top Meter */}
      <ScrollProgress />

      {/* Interactive 3D Background Animation with Scroll Parallax */}
      <Background3D />

      {/* Top Header */}
      <Navbar data={data} />

      {/* Main Structural Flow */}
      <main style={{ position: "relative", zIndex: 1 }}>
        <Hero data={data} />
        <AnimatedDivider />
        <TechMarquee data={data} />
        <AnimatedDivider />
        <About data={data} />
        <AnimatedDivider />
        {show("services") && (<><Services data={data} /><AnimatedDivider /></>)}
        {show("skills") && (<><Skills data={data} /><AnimatedDivider /></>)}
        {show("projects") && (<><Projects data={data} /><AnimatedDivider /></>)}
        {show("education") && (<><Education data={data} /><AnimatedDivider /></>)}
        {show("contact") && <Contact data={data} />}
      </main>

      {/* Footer */}
      <AnimatedDivider />
      <Footer data={data} />
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(portfolioData);

  useEffect(() => {
    async function loadLiveData() {
      const liveData = await fetchLivePortfolio();
      if (liveData) {
        setData((prev) => ({
          ...prev,
          ...liveData
        }));
      }
    }
    loadLiveData();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminApp />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="*" element={<PortfolioView data={data} />} />
      </Routes>
    </BrowserRouter>
  );
}

