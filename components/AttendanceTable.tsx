"use client";

import { useState, useEffect } from "react";
import { getAttendance, updateAttendance } from "@/lib/actions/server.action";
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

const AttendanceTable = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      const data = await getAttendance();
      setStudents(data);
      setIsLoading(false);
    };

    fetchStudents();
  }, []);

  const handleStudentDeleted = (deletedId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== deletedId));
  };

  // helper function to format time/date
  const formatTime = (isoString: string) => {
    if (!isoString) return "Not added";
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "Not added";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleEdit = (student: any) => {
    setEditingId(student.id);
    setEditData({
      name: student.name,
      status: student.status,
      section: student.section,
      date: student.createdAt,
    });
  };

  const handleChange = (field: string, value: string) => {
    setEditData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (id: string) => {
    // Call your server action to update DB
    await updateAttendance({ id, ...editData });

    // Update UI locally
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              ...editData,
              createdAt: editData.date, // update date field properly
            }
          : s
      )
    );

    setEditingId(null);
    setEditData({});
  };

  return (
    <Table>
      <TableCaption className="pt-8">
        Attendance list of the students.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead>Student Name</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Section</TableHead>
          <TableHead>Confidence</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center">
              Fetching data...
            </TableCell>
          </TableRow>
        ) : students.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center">
              No students found.
            </TableCell>
          </TableRow>
        ) : (
          students.map((student, index) => (
            <TableRow key={student.id}>
              <TableCell>{index + 1}</TableCell>

              {editingId === student.id ? (
                <>
                  {/* Editable cells */}
                  <TableCell>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="border px-2 py-1 rounded"
                    />
                  </TableCell>
                  <TableCell>{formatTime(editData.date)}</TableCell>
                  <TableCell>
                    <input
                      type="date"
                      value={
                        new Date(editData.date).toISOString().split("T")[0]
                      }
                      onChange={(e) => handleChange("date", e.target.value)}
                      className="border px-2 py-1 rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <select
                      value={editData.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    <input
                      type="text"
                      value={editData.section}
                      onChange={(e) => handleChange("section", e.target.value)}
                      className="border px-2 py-1 rounded"
                    />
                  </TableCell>
                  <TableCell>{student.confidence}%</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        className="bg-brand-100"
                        onClick={() => handleSave(student.id)}
                      >
                        Save
                      </Button>
                      <Button
                        className="bg-gray-500"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </TableCell>
                </>
              ) : (
                <>
                  {/* Read-only cells */}
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{formatTime(student.createdAt)}</TableCell>
                  <TableCell>{formatDate(student.createdAt)}</TableCell>
                  <TableCell>{student.status}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.confidence}%</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        className="bg-brand"
                        onClick={() => handleEdit(student)}
                      >
                        Edit
                      </Button>
                      {/* <DeleteStudentButton
                        studentId={student.id}
                        name={student.name}
                        onDeleted={() => handleStudentDeleted(student.id)}
                      /> */}
                    </div>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default AttendanceTable;
