// app/_layout.tsx
import { Slot } from "expo-router";
import React from "react";
import NavBar from "../components/NavBar"; // make sure the file name/casing matches
export default function RootLayout() {
  return (
    <>
      {/* Current screen */}
      <Slot />
      
      <NavBar />
    </>
  );
}