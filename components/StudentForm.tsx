"use client";
import React, { useEffect, useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createStudent,
  getStudentById,
  saveStudentImage,
  updateStudent,
} from "@/lib/actions/server.action";
// import { createAccount, signInUser } from "@/lib/actions/user.action";
// import OTPModal from "./OTPModal";

import { toast } from "sonner";

const authFormSchema = () => {
  return z.object({
    fullName: z.string(),
    rollNumber: z.string(),
    email: z.string().email(),
    phone: z.string(),
    image: z
      .any()
      .refine((file) => file instanceof File, "Image must be a file")
      .optional(),
  });
};

const StudentForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [accountId, setAccountId] = useState(null);

  const formSchema = authFormSchema();
  const [preview, setPreview] = useState<string | null>(null);
  const [imageStored, setImageStored] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      rollNumber: "",
      email: "",
      phone: "",
      image: undefined,
    },
  });

  const router = useRouter();

  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");
  const isEditMode = !!studentId;

  useEffect(() => {
    if (!studentId) return; // only load if editing

    const loadStudent = async () => {
      const student = await getStudentById(studentId);
      if (!student) return;

      form.reset({
        fullName: student.name || "",
        rollNumber: student.rollNumber || "",
        email: student.email || "",
        phone: student.phone || "",
        image: undefined, // cannot set File object, only preview if needed
      });

      if (student.imagePath) {
        setPreview(`/labeled_images/${student.name}/1.jpg`);
        setImageStored(true);
      }
    };

    loadStudent();
  }, [studentId]);

  const onSubmitHandler = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      let studentResult;

      if (isEditMode && studentId) {
        // Update existing student
        studentResult = await updateStudent({
          id: studentId,
          name: values.fullName,
          email: values.email,
          phone: values.phone,
          rollNumber: values.rollNumber,
        });
      } else {
        // Create new student
        studentResult = await createStudent({
          name: values.fullName,
          email: values.email,
          phone: values.phone,
          rollNumber: values.rollNumber,
        });
      }

      if (!studentResult.success || !studentResult.student) {
        throw new Error(studentResult.message || "Failed to save student");
      }

      const savedStudentId = studentResult.student.id;

      // Save image if uploaded
      if (values.image instanceof File) {
        await saveStudentImage(values.image, values.fullName, savedStudentId);
      }

      toast(`Student ${isEditMode ? "updated" : "added"}.`, {
        action: { label: "Close", onClick: () => {} },
      });

      router.push("/students");
    } catch (error) {
      setErrorMessage(
        `Error while ${isEditMode ? "updating" : "adding"} a student.`
      );

      toast(`Error while ${isEditMode ? "updating" : "adding"} student.`, {
        description: `${error}`,
        action: { label: "Close", onClick: () => {} },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitHandler)}
          className="auth-form"
        >
          <h1 className="form-title">
            <p>{isEditMode ? "Edit Student" : "Add Student"}</p>
          </h1>

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="student name"
                      {...field}
                      className="shad-input"
                    />
                  </FormControl>
                </div>

                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rollNumber"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Roll Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="student roll number"
                      {...field}
                      className="shad-input"
                    />
                  </FormControl>
                </div>

                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="shad-input"
                    />
                  </FormControl>
                </div>

                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="student phone number"
                      {...field}
                      className="shad-input"
                    />
                  </FormControl>
                </div>

                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Upload Photo
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file); // store File in form state
                          setPreview(URL.createObjectURL(file)); // generate preview
                        }
                      }}
                      className="shad-input hover:cursor-pointer"
                    />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          {preview && (
            <div className="mt-2">
              <Image
                src={preview}
                alt="Preview"
                width={120}
                height={120}
                className="rounded-md border"
              />
            </div>
          )}

          <Button
            type="submit"
            className="form-submit-button"
            disabled={isLoading}
          >
            <p>{isEditMode ? "Update Student" : "Add Student"}</p>
            {isLoading && (
              <Image
                src={"/assets/icons/loader.svg"}
                width={24}
                height={24}
                alt="loader"
                className="ml-2 animate-spin"
              />
            )}
          </Button>

          {errorMessage && <p className="error-message">*{errorMessage}</p>}
        </form>
      </Form>
    </div>
  );
};

export default StudentForm;
