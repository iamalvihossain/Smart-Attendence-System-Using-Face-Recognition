"use client";

import FaceRecognition from "@/components/FaceRecognition";
import React from "react";

const Task1 = () => {
  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize text-center bg-[#cca4e6] rounded-2xl py-4">
          Facial Recognition
        </h1>
        <FaceRecognition />
      </section>
    </div>
  );
};

export default Task1;
