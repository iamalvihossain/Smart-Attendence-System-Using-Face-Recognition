"use client";

import { useState, useEffect } from "react";
import { getStudents } from "@/lib/actions/server.action";
import DeleteStudentButton from "./DeleteStudent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "./ui/table";
import { Button } from "./ui/button";

const StudentsTable = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      const data = await getStudents();
      setStudents(data);
      setIsLoading(false);
    };

    fetchStudents();
  }, []);

  const handleStudentDeleted = (deletedId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== deletedId));
  };

  return (
    <Table>
      <TableCaption className="pt-8">
        All students currently registered in this class.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead>Student Name</TableHead>
          <TableHead>Roll Number</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Face Registered</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              Fetching data...
            </TableCell>
          </TableRow>
        ) : students.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              No students found.
            </TableCell>
          </TableRow>
        ) : (
          students.map((student, index) => (
            <TableRow key={student.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>
                {student.rollNumber ? student.rollNumber : "Not added"}
              </TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.phone}</TableCell>
              <TableCell>{student.faceRegistered ? "Yes" : "No"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    className="bg-brand"
                    onClick={() =>
                      (window.location.href = `/addstudent?studentId=${student.id}`)
                    }
                  >
                    Edit
                  </Button>
                  <DeleteStudentButton
                    studentId={student.id}
                    name={student.name}
                    onDeleted={() => handleStudentDeleted(student.id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default StudentsTable;
