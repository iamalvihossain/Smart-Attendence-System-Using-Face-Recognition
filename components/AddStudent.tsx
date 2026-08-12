"use client";

import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const AddStudent = () => {
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/addstudent");
  };

  return (
    <div>
      <Button className="bg-brand-100" onClick={handleSubmit}>
        Add Student
      </Button>
    </div>
  );
};

export default AddStudent;
