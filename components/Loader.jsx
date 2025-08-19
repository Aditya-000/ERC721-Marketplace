import React from "react";

export default function Loader({ text }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh]">
      {/* Glassmorphism background */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-28 h-28 rounded-full bg-white/10 backdrop-blur-lg animate-ping" />
        <div className="w-20 h-20 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin shadow-[0_0_25px_rgba(168,85,247,0.7)]" />
      </div>

      {/* Loader text */}
      {text && (
        <p className="mt-6 text-lg font-medium text-gray-300 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
