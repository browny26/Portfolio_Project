"use client";

import { useState } from "react";
import Intro from "@/components/Intro";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProjectsBanner from "@/components/ProjectsBanner";
import ServicesSection from "@/components/ServicesSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import Footer from "@/components/Footer";

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      <Intro onComplete={() => setIntroComplete(true)} />
      <Header />
      <main className="bg-[#f5f3ef] min-h-screen">
        <Hero />
        <ProjectsBanner />
        <ServicesSection />
        <SkillsSection />
        <ExperienceSection />
        <Footer />
      </main>
    </>
  );
}
