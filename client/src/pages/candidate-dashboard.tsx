import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  User, Star, TrendingUp, Award, MapPin, Briefcase, 
  Calendar, Target, BarChart3, Radar, Activity,
  Github, Linkedin, ExternalLink, ChevronRight,
  Trophy, Medal, Crown, Diamond, ArrowUp, ArrowDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar as RechartsRadar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell
} from "recharts";

// Mock candidate data - in real app would come from API
const mockCandidate = {
  id: "1",
  name: "Sarah Chen",
  title: "Senior DevOps Engineer",
  company: "Tech Innovations Inc.",
  location: "San Francisco, CA",
  email: "sarah.chen@example.com",
  imageUrl: null,
  overallScore: 3250,
  globalRank: 42,
  regionalRank: 8,
  industryRank: 12,
  tier: "Diamond",
  badges: ["Cloud Expert", "DevOps Leader", "Kubernetes Certified"],
  skills: ["Python", "AWS", "Kubernetes", "Terraform", "Docker", "React", "Node.js", "PostgreSQL"],
  experience: "Senior-level",
  region: "North America",
  industry: "Technology",
  
  // Detailed skill ratings
  skillRatings: [
    { name: "Python", level: "Expert", score: 95, years: 6, projects: 15, justification: "6+ years building production systems, Django expert, ML libraries" },
    { name: "AWS", level: "Expert", score: 92, years: 5, projects: 12, justification: "AWS Certified Solutions Architect, managed multi-region deployments" },
    { name: "Kubernetes", level: "Advanced", score: 88, years: 4, projects: 8, justification: "CKA certified, orchestrated 100+ microservices across 3 companies" },
    { name: "Terraform", level: "Advanced", score: 85, years: 3, projects: 10, justification: "Infrastructure as Code expert, managed cloud resources for 50+ services" },
    { name: "Docker", level: "Expert", score: 90, years: 5, projects: 20, justification: "Container expert, optimized deployment pipelines, reduced build time 70%" },
    { name: "React", level: "Intermediate", score: 75, years: 2, projects: 6, justification: "Frontend development for internal tools and dashboards" },
    { name: "Node.js", level: "Advanced", score: 82, years: 4, projects: 12, justification: "Built APIs and microservices, handled 10k+ RPS in production" },
    { name: "PostgreSQL", level: "Advanced", score: 80, years: 4, projects: 8, justification: "Database design and optimization, handled TB-scale datasets" }
  ],

  // Skill clusters
  skillClusters: [
    { name: "Cloud & Infrastructure", score: 89, skills: ["AWS", "Terraform", "Kubernetes"], color: "#3B82F6" },
    { name: "DevOps & Automation", score: 87, skills: ["Docker", "Kubernetes", "Terraform"], color: "#10B981" },
    { name: "Backend Development", score: 83, skills: ["Python", "Node.js", "PostgreSQL"], color: "#8B5CF6" },
    { name: "Frontend Development", score: 75, skills: ["React"], color: "#F59E0B" }
  ],

  // Rating history timeline
  ratingHistory: [
    { month: "Jan 2023", overallScore: 2850, skills: 2800, experience: 2900, certifications: 2850 },
    { month: "Mar 2023", overallScore: 2950, skills: 2920, experience: 2980, certifications: 2900 },
    { month: "Jun 2023", overallScore: 3080, skills: 3100, experience: 3060, certifications: 3080 },
    { month: "Sep 2023", overallScore: 3180, skills: 3220, experience: 3140, certifications: 3150 },
    { month: "Dec 2023", overallScore: 3250, skills: 3290, experience: 3210, certifications: 3200 }
  ],

  // Peer comparisons
  peerComparisons: {
    global: { percentile: 95, total: 125000 },
    regional: { percentile: 92, total: 8500 },
    industry: { percentile: 88, total: 15000 },
    similar: { percentile: 85, total: 2200 }
  },

  // Certifications with scores
  certifications: [
    { name: "AWS Solutions Architect", level: "Professional", score: 95, issuer: "Amazon", year: 2023 },
    { name: "Certified Kubernetes Administrator", level: "Expert", score: 88, issuer: "CNCF", year: 2023 },
    { name: "HashiCorp Terraform Associate", level: "Advanced", score: 82, issuer: "HashiCorp", year: 2022 },
    { name: "Google Cloud Professional", level: "Professional", score: 78, issuer: "Google", year: 2022 }
  ],

  // Social links
  socialLinks: {
    linkedin: "https://linkedin.com/in/sarahchen",
    github: "https://github.com/sarahchen",
    portfolio: "https://sarahchen.dev"
  }
};

const radarData = mockCandidate.skillClusters.map(cluster => ({
  subject: cluster.name.split(" ")[0], // Shorten for radar
  score: cluster.score,
  fullMark: 100
}));

const getTierIcon = (tier: string) => {
  switch (tier) {
    case "Diamond": return <Diamond className="text-blue-400" size={20} />;
    case "Platinum": return <Crown className="text-gray-300" size={20} />;
    case "Gold": return <Trophy className="text-yellow-500" size={20} />;
    default: return <Medal className="text-orange-600" size={20} />;
  }
};

const getSkillLevelColor = (level: string) => {
  switch (level) {
    case "Expert": return "bg-green-100 text-green-800 border-green-200";
    case "Advanced": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Intermediate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function CandidateDashboard() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-6">
                {/* Profile Image */}
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="text-white" size={32} />
                </div>

                {/* Basic Info */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockCandidate.name}</h1>
                  <p className="text-xl text-gray-600 mb-2">{mockCandidate.title}</p>
                  <div className="flex items-center space-x-4 text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Briefcase size={16} />
                      <span>{mockCandidate.company}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin size={16} />
                      <span>{mockCandidate.location}</span>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <Linkedin size={16} />
                      <span>LinkedIn</span>
                      <ExternalLink size={12} />
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <Github size={16} />
                      <span>GitHub</span>
                      <ExternalLink size={12} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Score Card */}
              <div className="text-right">
                <div className="flex items-center justify-end space-x-2 mb-2">
                  {getTierIcon(mockCandidate.tier)}
                  <span className="text-lg font-semibold text-gray-700">{mockCandidate.tier} Tier</span>
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-1">
                  {mockCandidate.overallScore.toLocaleString()}
                </div>
                <p className="text-sm text-gray-500">ReRank Score</p>
                <div className="flex items-center justify-end space-x-1 mt-2 text-sm text-green-600">
                  <ArrowUp size={14} />
                  <span>+120 this month</span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-6">
              {mockCandidate.badges.map((badge, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                  <Award size={12} className="mr-1" />
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
            <TabsTrigger value="timeline">Progress Timeline</TabsTrigger>
            <TabsTrigger value="comparisons">Peer Analysis</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Rankings Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="text-amber-500" size={20} />
                      <span>Global Rankings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Global Rank</span>
                      <div className="text-right">
                        <div className="font-bold text-lg">#{mockCandidate.globalRank}</div>
                        <div className="text-xs text-gray-500">of 125k</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Regional Rank</span>
                      <div className="text-right">
                        <div className="font-bold text-lg">#{mockCandidate.regionalRank}</div>
                        <div className="text-xs text-gray-500">of 8.5k</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Industry Rank</span>
                      <div className="text-right">
                        <div className="font-bold text-lg">#{mockCandidate.industryRank}</div>
                        <div className="text-xs text-gray-500">of 15k</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Skill Clusters Radar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Radar className="text-blue-600" size={20} />
                      <span>Skill Domain Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} />
                          <RechartsRadar
                            name="Score"
                            dataKey="score"
                            stroke="#3B82F6"
                            fill="#3B82F6"
                            fillOpacity={0.3}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Skill Clusters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockCandidate.skillClusters.map((cluster, index) => (
                <motion.div
                  key={cluster.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-sm">{cluster.name}</h3>
                        <div className="text-lg font-bold" style={{ color: cluster.color }}>
                          {cluster.score}
                        </div>
                      </div>
                      <Progress value={cluster.score} className="mb-2" />
                      <div className="flex flex-wrap gap-1">
                        {cluster.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Skills Analysis Tab */}
          <TabsContent value="skills" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Skills List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Skill Ratings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockCandidate.skillRatings.map((skill) => (
                      <motion.div
                        key={skill.name}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedSkill === skill.name 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedSkill(selectedSkill === skill.name ? null : skill.name)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-semibold">{skill.name}</h4>
                            <Badge className={getSkillLevelColor(skill.level)}>
                              {skill.level}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right text-sm text-gray-500">
                              <div>{skill.years} years</div>
                              <div>{skill.projects} projects</div>
                            </div>
                            <div className="text-xl font-bold text-blue-600">
                              {skill.score}
                            </div>
                            <ChevronRight size={16} className="text-gray-400" />
                          </div>
                        </div>
                        
                        {selectedSkill === skill.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-gray-200"
                          >
                            <p className="text-sm text-gray-600">{skill.justification}</p>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Certifications */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="text-purple-600" size={20} />
                      <span>Certifications</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mockCandidate.certifications.map((cert, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-sm">{cert.name}</h4>
                          <span className="text-lg font-bold text-purple-600">{cert.score}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">{cert.issuer} • {cert.year}</p>
                        <Badge variant="outline" className="text-xs">{cert.level}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="text-green-600" size={20} />
                  <span>Rating Progress Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockCandidate.ratingHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="overallScore" stroke="#3B82F6" strokeWidth={3} name="Overall Score" />
                      <Line type="monotone" dataKey="skills" stroke="#10B981" strokeWidth={2} name="Skills" />
                      <Line type="monotone" dataKey="experience" stroke="#8B5CF6" strokeWidth={2} name="Experience" />
                      <Line type="monotone" dataKey="certifications" stroke="#F59E0B" strokeWidth={2} name="Certifications" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Peer Comparisons Tab */}
          <TabsContent value="comparisons" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(mockCandidate.peerComparisons).map(([key, data]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="capitalize">{key} Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-4">
                        <div className="text-4xl font-bold text-blue-600 mb-2">
                          Top {100 - data.percentile}%
                        </div>
                        <p className="text-gray-600">
                          You outrank {data.percentile}% of {data.total.toLocaleString()} candidates
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
                          style={{ width: `${data.percentile}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="text-green-600" size={20} />
                    <span>Strengths</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800">Cloud Infrastructure Excellence</h4>
                    <p className="text-sm text-green-700">Your AWS and Kubernetes expertise places you in the top 8% globally</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800">DevOps Leadership</h4>
                    <p className="text-sm text-green-700">Strong automation and deployment pipeline experience</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800">Multi-Cloud Expertise</h4>
                    <p className="text-sm text-green-700">Rare combination of AWS and GCP certifications</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="text-amber-600" size={20} />
                    <span>Growth Opportunities</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <h4 className="font-medium text-amber-800">Frontend Development</h4>
                    <p className="text-sm text-amber-700">Strengthen React skills to reach Full-Stack level (+180 points potential)</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <h4 className="font-medium text-amber-800">Machine Learning</h4>
                    <p className="text-sm text-amber-700">Add ML/AI skills to complement your Python expertise (+220 points potential)</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <h4 className="font-medium text-amber-800">Leadership Certification</h4>
                    <p className="text-sm text-amber-700">Consider management certifications to boost experience score</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}