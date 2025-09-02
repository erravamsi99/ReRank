import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const candidates = pgTable("candidates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  company: text("company"),
  experience: text("experience"),
  imageUrl: text("image_url"),
  
  // Scores (900-3500+ range)
  overallScore: integer("overall_score").notNull(),
  skillsScore: integer("skills_score").notNull(),
  certificationsScore: integer("certifications_score").notNull(),
  experienceScore: integer("experience_score").notNull(),
  industryScore: integer("industry_score").notNull(),
  
  // Rankings
  globalRank: integer("global_rank"),
  regionalRank: integer("regional_rank"),
  industryRank: integer("industry_rank"),
  
  // Additional fields
  skills: text("skills").array().notNull().default(sql`ARRAY[]::text[]`),
  badge: text("badge"), // Elite Pro, Top 1%, Rising Talent
  region: text("region").notNull(),
  industry: text("industry").notNull(),
});

export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  candidateId: varchar("candidate_id").references(() => candidates.id),
  filename: text("filename").notNull(),
  content: text("content"),
  uploadedAt: text("uploaded_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertCandidateSchema = createInsertSchema(candidates).omit({
  id: true,
  globalRank: true,
  regionalRank: true,
  industryRank: true,
});

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  uploadedAt: true,
});

export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Candidate = typeof candidates.$inferSelect;
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;

// Scoring calculation interface
export interface ScoreBreakdown {
  skillsScore: number;
  certificationsScore: number;
  experienceScore: number;
  industryScore: number;
  overallScore: number;
}

export interface CandidateWithRank extends Candidate {
  percentile: number;
}
