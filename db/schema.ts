// schema.ts

import {
  pgTable,
  serial,
  uuid,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

// -------------------- Students Table --------------------
export const students = pgTable("students", {
  id: uuid("id").defaultRandom().primaryKey(), // Unique student ID
  name: text("name").notNull(),
  rollNumber: text("rollNumber"),
  section: text("section"),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  faceRegistered: boolean("face_registered").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Student = typeof students.$inferInsert;

// -------------------- Teachers Table --------------------
export const teachers = pgTable("teachers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(), // Store hashed passwords
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// -------------------- Attendance Records Table --------------------
export const attendanceRecords = pgTable("attendance_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }), // FK to students
  date: timestamp("date", { withTimezone: true }).defaultNow().notNull(),
  status: text("status").notNull(), // e.g., "Present" / "Absent"
  section: text("section").notNull(),
  name: text("name").notNull(),
  confidence: text("confidence"), // optional: store detection confidence
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// -------------------- Student Images Table --------------------
export const studentImages = pgTable("student_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => students.id, {
    onDelete: "cascade",
  }),
  imagePath: text("image_path").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
