"use client";

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[#06060f]" />

      {/* Orb 1 — violet */}
      <div
        className="orb-1 absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Orb 2 — blue */}
      <div
        className="orb-2 absolute top-[30%] right-[-15%] w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(37,99,235,0.14) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Orb 3 — pink/rose */}
      <div
        className="orb-3 absolute bottom-[-10%] left-[30%] w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(236,72,153,0.10) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}
