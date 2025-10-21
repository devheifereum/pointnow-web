import React from "react";

export default function DecorativeShapes() {
  const shapes = [
    "w-[300px] h-[300px] -bottom-[150px] -left-[100px]",
    "w-[200px] h-[200px] -bottom-[80px] left-[150px]",
    "w-[250px] h-[250px] -bottom-[100px] left-[300px]",
    "w-[350px] h-[350px] -bottom-[180px] -right-[150px]",
    "w-[180px] h-[180px] -bottom-[60px] right-[200px]",
    "w-[220px] h-[220px] -bottom-[90px] right-[350px]",
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[200px] pointer-events-none -z-10">
      {shapes.map((shape, i) => (
        <div
          key={i}
          className={`absolute bg-[#7bc74d] opacity-60 rounded-full ${shape}`}
        />
      ))}
    </div>
  );
}
