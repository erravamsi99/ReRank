import type { Candidate, CandidateWithRank } from "@shared/schema";

export const mockCandidates: CandidateWithRank[] = [
  {
    id: "1",
    name: "Alex Chen",
    title: "Senior Full Stack Developer",
    location: "San Francisco, CA",
    company: "Meta",
    experience: "5 years",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    overallScore: 3487,
    skillsScore: 3500,
    certificationsScore: 3800,
    experienceScore: 3200,
    industryScore: 3450,
    globalRank: 1,
    regionalRank: 1,
    industryRank: 1,
    skills: ["React", "Node.js", "AWS", "Python", "TypeScript", "Docker", "Kubernetes", "GraphQL"],
    badge: "Elite Pro",
    region: "North America",
    industry: "Technology",
    percentile: 98
  },
  {
    id: "2", 
    name: "Sarah Johnson",
    title: "Principal Data Scientist",
    location: "New York, NY",
    company: "Google",
    experience: "7 years",
    imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b1ac?w=150&h=150&fit=crop",
    overallScore: 3421,
    skillsScore: 3450,
    certificationsScore: 3700,
    experienceScore: 3100,
    industryScore: 3300,
    globalRank: 2,
    regionalRank: 2,
    industryRank: 1,
    skills: ["Python", "TensorFlow", "SQL", "Azure", "Spark", "Tableau", "R", "MLOps"],
    badge: "Top 1%",
    region: "North America",
    industry: "Technology",
    percentile: 96
  }
];

export const mockAnalytics = {
  totalCandidates: 24847,
  averageScore: 3421,
  countries: 152,
  accuracyRate: 98.2,
  topSkills: [
    { skill: "JavaScript", count: 15423 },
    { skill: "Python", count: 14892 },
    { skill: "React", count: 12754 },
    { skill: "AWS", count: 11246 }
  ]
};
