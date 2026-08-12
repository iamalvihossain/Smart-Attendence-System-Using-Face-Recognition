import AddStudent from "@/components/AddStudent";
import { DataTableDemo } from "@/components/StudentDataTable";
import StudentsTable from "@/components/StudentsTable";
import { Button } from "@/components/ui/button";
import React from "react";

const ManageStudents = () => {
  return (
    <div>
      <AddStudent />
      <StudentsTable />
      {/* <DataTableDemo /> */}
    </div>
  );
};

export default ManageStudents;
