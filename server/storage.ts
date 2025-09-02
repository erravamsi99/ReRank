import { type Candidate, type InsertCandidate, type Resume, type InsertResume, type CandidateWithRank } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Candidate operations
  getCandidate(id: string): Promise<Candidate | undefined>;
  getCandidateByName(name: string): Promise<Candidate | undefined>;
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  updateCandidate(id: string, updates: Partial<Candidate>): Promise<Candidate | undefined>;
  
  // Leaderboard operations
  getGlobalLeaderboard(limit?: number, offset?: number): Promise<CandidateWithRank[]>;
  getRegionalLeaderboard(region: string, limit?: number, offset?: number): Promise<CandidateWithRank[]>;
  getIndustryLeaderboard(industry: string, limit?: number, offset?: number): Promise<CandidateWithRank[]>;
  
  // Search and filter operations
  searchCandidates(filters: {
    skills?: string[];
    experience?: string;
    industry?: string;
    region?: string;
    minScore?: number;
    maxScore?: number;
  }): Promise<Candidate[]>;
  
  // Resume operations
  createResume(resume: InsertResume): Promise<Resume>;
  getResumesByCandidate(candidateId: string): Promise<Resume[]>;
  
  // Analytics
  getTotalCandidateCount(): Promise<number>;
  getAverageScore(): Promise<number>;
  getTopSkills(): Promise<{ skill: string; count: number }[]>;
}

export class MemStorage implements IStorage {
  private candidates: Map<string, Candidate>;
  private resumes: Map<string, Resume>;

  constructor() {
    this.candidates = new Map();
    this.resumes = new Map();
    this.seedData();
  }

  private seedData() {
    // Generate 25 realistic mock candidates with diverse backgrounds
    const mockCandidates: Omit<Candidate, 'id'>[] = [
      {
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
        industry: "Technology"
      },
      {
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
        industry: "Technology"
      },
      {
        name: "Michael Rodriguez",
        title: "DevOps Architect",
        location: "Austin, TX",
        company: "Microsoft",
        experience: "6 years",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
        overallScore: 3398,
        skillsScore: 3400,
        certificationsScore: 3600,
        experienceScore: 3250,
        industryScore: 3350,
        globalRank: 3,
        regionalRank: 3,
        industryRank: 2,
        skills: ["Kubernetes", "AWS", "Terraform", "Jenkins", "Docker", "Prometheus", "Grafana", "Python"],
        badge: "Elite Pro",
        region: "North America",
        industry: "Technology"
      },
      {
        name: "Emma Watson",
        title: "ML Engineer",
        location: "Seattle, WA",
        company: "Amazon",
        experience: "4 years",
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
        overallScore: 3276,
        skillsScore: 3300,
        certificationsScore: 3100,
        experienceScore: 3200,
        industryScore: 3400,
        globalRank: 4,
        regionalRank: 4,
        industryRank: 3,
        skills: ["PyTorch", "Python", "GCP", "MLOps", "Kubernetes", "TensorFlow", "Scikit-learn"],
        badge: "Rising Talent",
        region: "North America",
        industry: "Technology"
      },
      {
        name: "David Kim",
        title: "Backend Engineer",
        location: "Boston, MA",
        company: "Stripe",
        experience: "4 years",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
        overallScore: 3198,
        skillsScore: 3250,
        certificationsScore: 2900,
        experienceScore: 3300,
        industryScore: 3200,
        globalRank: 5,
        regionalRank: 5,
        industryRank: 4,
        skills: ["Java", "Spring Boot", "PostgreSQL", "Redis", "Kafka", "Docker", "AWS"],
        badge: "Top 1%",
        region: "North America",
        industry: "Fintech"
      }
    ];

    // Add more candidates with varying scores and backgrounds
    const additionalCandidates = [
      { name: "Lisa Chang", title: "Frontend Developer", location: "Toronto, CA", company: "Shopify", experience: "3 years", overallScore: 3156 },
      { name: "James Wilson", title: "Security Engineer", location: "London, UK", company: "Palantir", experience: "8 years", overallScore: 3089 },
      { name: "Maria Garcia", title: "Product Manager", location: "Madrid, ES", company: "Spotify", experience: "6 years", overallScore: 3045 },
      { name: "Ryan O'Connor", title: "iOS Developer", location: "Dublin, IE", company: "Apple", experience: "5 years", overallScore: 2987 },
      { name: "Priya Patel", title: "Cloud Architect", location: "Mumbai, IN", company: "Zomato", experience: "7 years", overallScore: 2934 },
      { name: "Sophie Martin", title: "UX Designer", location: "Paris, FR", company: "Figma", experience: "4 years", overallScore: 2876 },
      { name: "Hassan Ali", title: "Blockchain Developer", location: "Dubai, AE", company: "Binance", experience: "3 years", overallScore: 2823 },
      { name: "Anna Kowalski", title: "QA Engineer", location: "Warsaw, PL", company: "CD Projekt", experience: "5 years", overallScore: 2778 },
      { name: "Carlos Santos", title: "Data Engineer", location: "São Paulo, BR", company: "Nubank", experience: "4 years", overallScore: 2734 },
      { name: "Yuki Tanaka", title: "Game Developer", location: "Tokyo, JP", company: "Nintendo", experience: "6 years", overallScore: 2689 }
    ];

    additionalCandidates.forEach((candidate, index) => {
      const fullCandidate: Omit<Candidate, 'id'> = {
        ...candidate,
        imageUrl: `https://images.unsplash.com/photo-150780321${index}?w=150&h=150&fit=crop`,
        skillsScore: candidate.overallScore + Math.floor(Math.random() * 200) - 100,
        certificationsScore: candidate.overallScore + Math.floor(Math.random() * 300) - 150,
        experienceScore: candidate.overallScore + Math.floor(Math.random() * 200) - 100,
        industryScore: candidate.overallScore + Math.floor(Math.random() * 200) - 100,
        globalRank: index + 6,
        regionalRank: Math.floor(Math.random() * 50) + 1,
        industryRank: Math.floor(Math.random() * 20) + 1,
        skills: ["JavaScript", "Python", "React", "AWS"].slice(0, Math.floor(Math.random() * 4) + 2),
        badge: candidate.overallScore > 3000 ? "Top 1%" : "Rising Talent",
        region: candidate.location.includes("US") || candidate.location.includes("CA") ? "North America" : 
                candidate.location.includes("UK") || candidate.location.includes("FR") || candidate.location.includes("ES") ? "Europe" : "Asia Pacific",
        industry: "Technology"
      };
      mockCandidates.push(fullCandidate);
    });

    mockCandidates.forEach((candidate) => {
      const id = randomUUID();
      this.candidates.set(id, { ...candidate, id });
    });
  }

  async getCandidate(id: string): Promise<Candidate | undefined> {
    return this.candidates.get(id);
  }

  async getCandidateByName(name: string): Promise<Candidate | undefined> {
    return Array.from(this.candidates.values()).find(
      (candidate) => candidate.name.toLowerCase() === name.toLowerCase(),
    );
  }

  async createCandidate(insertCandidate: InsertCandidate): Promise<Candidate> {
    const id = randomUUID();
    
    // Calculate overall score using the weighted formula
    const overallScore = Math.round(
      0.4 * insertCandidate.skillsScore + 
      0.2 * insertCandidate.certificationsScore + 
      0.3 * insertCandidate.experienceScore + 
      0.1 * insertCandidate.industryScore
    );

    const candidate: Candidate = { 
      ...insertCandidate, 
      id, 
      overallScore,
      globalRank: null,
      regionalRank: null,
      industryRank: null,
      company: insertCandidate.company ?? null,
      experience: insertCandidate.experience ?? null,
      imageUrl: insertCandidate.imageUrl ?? null,
      badge: insertCandidate.badge ?? null,
      skills: insertCandidate.skills || []
    };
    
    this.candidates.set(id, candidate);
    await this.updateRankings();
    return candidate;
  }

  async updateCandidate(id: string, updates: Partial<Candidate>): Promise<Candidate | undefined> {
    const candidate = this.candidates.get(id);
    if (!candidate) return undefined;
    
    const updated = { ...candidate, ...updates };
    this.candidates.set(id, updated);
    await this.updateRankings();
    return updated;
  }

  private async updateRankings(): Promise<void> {
    const allCandidates = Array.from(this.candidates.values())
      .sort((a, b) => b.overallScore - a.overallScore);
    
    allCandidates.forEach((candidate, index) => {
      candidate.globalRank = index + 1;
    });
  }

  async getGlobalLeaderboard(limit = 50, offset = 0): Promise<CandidateWithRank[]> {
    const allCandidates = Array.from(this.candidates.values())
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(offset, offset + limit);
    
    const totalCount = this.candidates.size;
    
    return allCandidates.map(candidate => ({
      ...candidate,
      percentile: Math.round(((totalCount - (candidate.globalRank || 0) + 1) / totalCount) * 100)
    }));
  }

  async getRegionalLeaderboard(region: string, limit = 50, offset = 0): Promise<CandidateWithRank[]> {
    const regionalCandidates = Array.from(this.candidates.values())
      .filter(candidate => candidate.region === region)
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(offset, offset + limit);
    
    const totalRegionalCount = Array.from(this.candidates.values()).filter(c => c.region === region).length;
    
    return regionalCandidates.map((candidate, index) => ({
      ...candidate,
      percentile: Math.round(((totalRegionalCount - index) / totalRegionalCount) * 100)
    }));
  }

  async getIndustryLeaderboard(industry: string, limit = 50, offset = 0): Promise<CandidateWithRank[]> {
    const industryCandidates = Array.from(this.candidates.values())
      .filter(candidate => candidate.industry === industry)
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(offset, offset + limit);
    
    const totalIndustryCount = Array.from(this.candidates.values()).filter(c => c.industry === industry).length;
    
    return industryCandidates.map((candidate, index) => ({
      ...candidate,
      percentile: Math.round(((totalIndustryCount - index) / totalIndustryCount) * 100)
    }));
  }

  async searchCandidates(filters: {
    skills?: string[];
    experience?: string;
    industry?: string;
    region?: string;
    minScore?: number;
    maxScore?: number;
  }): Promise<Candidate[]> {
    let results = Array.from(this.candidates.values());

    if (filters.skills && filters.skills.length > 0) {
      results = results.filter(candidate =>
        filters.skills!.some(skill => 
          candidate.skills.some(candidateSkill => 
            candidateSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    if (filters.industry) {
      results = results.filter(candidate => 
        candidate.industry.toLowerCase().includes(filters.industry!.toLowerCase())
      );
    }

    if (filters.region) {
      results = results.filter(candidate => 
        candidate.region.toLowerCase().includes(filters.region!.toLowerCase())
      );
    }

    if (filters.minScore !== undefined) {
      results = results.filter(candidate => candidate.overallScore >= filters.minScore!);
    }

    if (filters.maxScore !== undefined) {
      results = results.filter(candidate => candidate.overallScore <= filters.maxScore!);
    }

    return results.sort((a, b) => b.overallScore - a.overallScore);
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = randomUUID();
    const resume: Resume = { 
      ...insertResume, 
      id,
      uploadedAt: new Date().toISOString(),
      content: insertResume.content ?? null,
      candidateId: insertResume.candidateId ?? null
    };
    this.resumes.set(id, resume);
    return resume;
  }

  async getResumesByCandidate(candidateId: string): Promise<Resume[]> {
    return Array.from(this.resumes.values()).filter(
      (resume) => resume.candidateId === candidateId,
    );
  }

  async getTotalCandidateCount(): Promise<number> {
    return 15000; // Total professionals in the global talent pool
  }

  async getAverageScore(): Promise<number> {
    const candidates = Array.from(this.candidates.values());
    if (candidates.length === 0) return 0;
    
    const total = candidates.reduce((sum, candidate) => sum + candidate.overallScore, 0);
    return Math.round(total / candidates.length);
  }

  async getTopSkills(): Promise<{ skill: string; count: number }[]> {
    const skillCounts = new Map<string, number>();
    
    Array.from(this.candidates.values()).forEach(candidate => {
      candidate.skills.forEach(skill => {
        skillCounts.set(skill, (skillCounts.get(skill) || 0) + 1);
      });
    });
    
    return Array.from(skillCounts.entries())
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}

export const storage = new MemStorage();
