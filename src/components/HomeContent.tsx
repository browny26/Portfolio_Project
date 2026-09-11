"use client";

import Intro from "@/components/Intro";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ProjectsBanner from "@/components/ProjectsBanner";
import ServicesSection from "@/components/ServicesSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import Footer from "@/components/Footer";

export default function HomeContent() {
  return (
    <>
      {/* The intro announces when it is out of the way; the hero and the header
          both listen for that instead of counting seconds of their own. */}
      <Intro />
      <main className="bg-[#f5f3ef] min-h-screen">
        <Hero />
        <AboutSection />
        <ProjectsBanner />
        <ServicesSection />
        <SkillsSection />
        <ExperienceSection />
        <Footer />
      </main>
    </>
  );
}
