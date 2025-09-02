import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCandidateSchema, type ScoreBreakdown } from "@shared/schema";
import multer from "multer";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Mock AI scoring function
function calculateResumeScore(resumeContent: string, skills: string[] = []): ScoreBreakdown {
  // Simulate AI analysis - in real implementation, this would use actual AI/ML models
  const baseScore = 2000;
  const variation = 1000;
  
  // Generate scores that feel realistic based on content analysis
  const skillsScore = Math.floor(baseScore + Math.random() * variation + skills.length * 50);
  const certificationsScore = Math.floor(baseScore + Math.random() * variation);
  const experienceScore = Math.floor(baseScore + Math.random() * variation);
  const industryScore = Math.floor(baseScore + Math.random() * variation);
  
  // Apply weighted formula
  const overallScore = Math.round(
    0.4 * skillsScore + 
    0.2 * certificationsScore + 
    0.3 * experienceScore + 
    0.1 * industryScore
  );

  return {
    skillsScore,
    certificationsScore,
    experienceScore,
    industryScore,
    overallScore
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get global leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const leaderboard = await storage.getGlobalLeaderboard(limit, offset);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Get global leaderboard (alternative endpoint)
  app.get("/api/leaderboard/global", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const leaderboard = await storage.getGlobalLeaderboard(limit, offset);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Get regional leaderboard
  app.get("/api/leaderboard/regional/:region", async (req, res) => {
    try {
      const { region } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const leaderboard = await storage.getRegionalLeaderboard(region, limit, offset);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch regional leaderboard" });
    }
  });

  // Get industry leaderboard
  app.get("/api/leaderboard/industry/:industry", async (req, res) => {
    try {
      const { industry } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const leaderboard = await storage.getIndustryLeaderboard(industry, limit, offset);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch industry leaderboard" });
    }
  });

  // Get candidate by ID
  app.get("/api/candidates/:id", async (req, res) => {
    try {
      const candidate = await storage.getCandidate(req.params.id);
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
      res.json(candidate);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch candidate" });
    }
  });

  // Search candidates with filters
  app.get("/api/candidates/search", async (req, res) => {
    try {
      const {
        skills,
        experience,
        industry,
        region,
        minScore,
        maxScore
      } = req.query;

      const filters = {
        skills: skills ? (skills as string).split(',').map(s => s.trim()) : undefined,
        experience: experience as string,
        industry: industry as string,
        region: region as string,
        minScore: minScore ? parseInt(minScore as string) : undefined,
        maxScore: maxScore ? parseInt(maxScore as string) : undefined,
      };

      const candidates = await storage.searchCandidates(filters);
      res.json(candidates);
    } catch (error) {
      res.status(500).json({ message: "Failed to search candidates" });
    }
  });

  // Upload and rate resume
  app.post("/api/resumes/rate", upload.single('resume'), async (req: MulterRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No resume file uploaded" });
      }

      // In a real implementation, you would:
      // 1. Parse the PDF/DOC file to extract text
      // 2. Use AI/ML models to analyze skills, experience, etc.
      // 3. Calculate scores based on market data and algorithms

      const resumeContent = req.file.buffer.toString('base64');
      const mockSkills = ["JavaScript", "React", "Node.js", "Python"]; // Would be extracted from actual resume
      
      const scores = calculateResumeScore(resumeContent, mockSkills);
      
      // Create resume record
      const resume = await storage.createResume({
        candidateId: null, // Would be linked to actual candidate after registration
        filename: req.file.originalname,
        content: resumeContent
      });

      res.json({
        resumeId: resume.id,
        scores,
        extractedSkills: mockSkills,
        recommendations: [
          "Add cloud certifications to boost your score by 200+ points",
          "Highlight leadership experience and project management skills",
          "Update technology stack with modern frameworks like Next.js"
        ]
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to process resume" });
    }
  });

  // Get platform analytics
  app.get("/api/analytics", async (req, res) => {
    try {
      const [totalCandidates, averageScore, topSkills] = await Promise.all([
        storage.getTotalCandidateCount(),
        storage.getAverageScore(),
        storage.getTopSkills()
      ]);

      res.json({
        totalCandidates,
        averageScore,
        topSkills,
        countries: 152, // Mock data
        accuracyRate: 98.2 // Mock data
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Export candidates as CSV (for recruiters)
  app.get("/api/export/candidates", async (req, res) => {
    try {
      const candidates = await storage.getGlobalLeaderboard(1000); // Large limit for export
      
      const csvHeader = "Name,Title,Location,Company,Overall Score,Skills Score,Experience Score,Global Rank\n";
      const csvData = candidates.map(candidate => 
        `"${candidate.name}","${candidate.title}","${candidate.location}","${candidate.company || ''}",${candidate.overallScore},${candidate.skillsScore},${candidate.experienceScore},${candidate.globalRank || ''}`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="candidates.csv"');
      res.send(csvHeader + csvData);
    } catch (error) {
      res.status(500).json({ message: "Failed to export candidates" });
    }
  });

  // Upload resume endpoint
  app.post('/api/resumes/upload', upload.single('resume'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No resume file uploaded' });
      }

      const { name, email, location = '', title = '', bio = '' } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      // Simulate AI processing and scoring
      const mockScore = {
        skills: Math.floor(Math.random() * 400) + 600, // 600-1000
        experience: Math.floor(Math.random() * 400) + 600,
        industry: Math.floor(Math.random() * 400) + 600,
        certifications: Math.floor(Math.random() * 400) + 600
      };

      const overallScore = Math.floor(
        mockScore.skills * 0.35 + 
        mockScore.experience * 0.30 + 
        mockScore.industry * 0.20 + 
        mockScore.certifications * 0.15
      );

      // Create candidate
      const candidateData = {
        name,
        title,
        location,
        company: null,
        experience: 'Mid-level',
        imageUrl: null,
        overallScore,
        skillsScore: mockScore.skills,
        experienceScore: mockScore.experience,
        industryScore: mockScore.industry,
        certificationsScore: mockScore.certifications,
        globalRank: null,
        regionalRank: null,
        industryRank: null,
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
        badges: [],
        region: 'North America',
        industry: 'Technology',
        email
      };

      const candidate = await storage.createCandidate(candidateData);

      // Create resume record
      const resumeData = {
        filename: req.file.originalname,
        content: req.file.buffer.toString('base64'),
        candidateId: candidate.id
      };

      await storage.createResume(resumeData);

      res.json({
        success: true,
        candidateId: candidate.id,
        score: overallScore,
        breakdown: mockScore
      });
    } catch (error) {
      console.error('Resume upload error:', error);
      res.status(500).json({ error: 'Failed to process resume' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
