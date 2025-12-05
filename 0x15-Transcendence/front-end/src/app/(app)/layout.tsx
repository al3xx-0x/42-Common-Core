"use client";

import React from "react";
import HeaderSideBar from "../header-side-bar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="bg-cyan-950"
      style={{
        // backgroundImage: `url("/landing-background.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh", // important so background covers screen
      }}
    >
      <HeaderSideBar />
      {children}
    </div>
  );
}
