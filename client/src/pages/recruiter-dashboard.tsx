import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, Filter, Download, Users, Briefcase, MapPin, Award, TrendingUp, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CandidateCard from "@/components/candidate-card";
import ProfileModal from "@/components/profile-modal";
import HiringSimulator from "@/components/hiring-simulator";
import type { Candidate } from "@shared/schema";

export default function RecruiterDashboard() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [filters, setFilters] = useState({
    skills: "",
    experience: "all",
    industry: "all",
    region: "all",
    minScore: "",
    maxScore: "",
  });

  // Fetch candidates based on filters
  const { data: candidates, isLoading, refetch } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates/search", filters],
    enabled: Object.values(filters).some(value => value !== "" && value !== "all"),
  });

  // Default to showing global leaderboard if no filters
  const { data: defaultCandidates, isLoading: defaultLoading } = useQuery<Candidate[]>({
    queryKey: ["/api/leaderboard"],
    enabled: !Object.values(filters).some(value => value !== "" && value !== "all"),
  });

  // Fetch analytics for KPIs
  const { data: analytics } = useQuery<{
    totalCandidates: number;
    averageScore: number;
    top1Percent: number;
    shortlistRate: number;
    scoreDistribution: Array<{name: string; value: number}>;
    topSkills: Array<{skill: string; count: number}>;
  }>({
    queryKey: ["/api/analytics"],
  });

  const displayCandidates = candidates || defaultCandidates || [];
  const loading = isLoading || defaultLoading;

  const handleSearch = () => {
    refetch();
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch("/api/export/candidates");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "candidates.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export CSV:", error);
    }
  };

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Smart Picks - candidates with high scores but potentially overlooked
  const smartPicks = displayCandidates.filter(candidate => 
    candidate.overallScore > 2800 && 
    (candidate.globalRank === null || candidate.globalRank > 50)
  ).slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div 
          className="text-blue-600 text-4xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Users size={48} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Recruiter Hub
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl">
                Discover exceptional talent with comprehensive candidate insights and advanced filtering
              </p>
            </div>
            <Button onClick={handleExportCSV} className="btn-secondary">
              <Download size={16} className="mr-2" />
              Export CSV
            </Button>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="linkedin-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {analytics?.totalCandidates?.toLocaleString() || "24,847"}
              </div>
              <div className="text-gray-500 text-sm flex items-center justify-center gap-2">
                <Users size={14} />
                Total Candidates
              </div>
            </CardContent>
          </Card>

          <Card className="linkedin-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {analytics?.averageScore?.toLocaleString() || "2,421"}
              </div>
              <div className="text-gray-500 text-sm flex items-center justify-center gap-2">
                <TrendingUp size={14} />
                Average Score
              </div>
            </CardContent>
          </Card>

          <Card className="linkedin-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {analytics?.top1Percent || "248"}
              </div>
              <div className="text-gray-500 text-sm flex items-center justify-center gap-2">
                <Award size={14} />
                Top 1% Talent
              </div>
            </CardContent>
          </Card>

          <Card className="linkedin-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {analytics?.shortlistRate || "94.2"}%
              </div>
              <div className="text-gray-500 text-sm flex items-center justify-center gap-2">
                <Eye size={14} />
                Shortlist Rate
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs for different functionality */}
        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search">Smart Search</TabsTrigger>
            <TabsTrigger value="shortlists">My Shortlists</TabsTrigger>
            <TabsTrigger value="simulator">Hiring Simulator</TabsTrigger>
            <TabsTrigger value="analytics">Deep Analytics</TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Candidate Search */}
          <div className="lg:col-span-2">
            {/* Search and Filters */}
            <motion.div 
              className="linkedin-card p-6 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Search size={14} />
                      Search Skills
                    </label>
                    <Input
                      type="text"
                      placeholder="React, Python, AWS..."
                      value={filters.skills}
                      onChange={(e) => updateFilter("skills", e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Briefcase size={14} />
                      Experience Level
                    </label>
                    <Select value={filters.experience} onValueChange={(value) => updateFilter("experience", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                        <SelectItem value="mid">Mid-level (3-5 years)</SelectItem>
                        <SelectItem value="senior">Senior (6-10 years)</SelectItem>
                        <SelectItem value="principal">Principal (10+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Industry</label>
                    <Select value={filters.industry} onValueChange={(value) => updateFilter("industry", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Industries" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Industries</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="fintech">Fintech</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPin size={14} />
                      Region
                    </label>
                    <Select value={filters.region} onValueChange={(value) => updateFilter("region", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Location</SelectItem>
                        <SelectItem value="North America">North America</SelectItem>
                        <SelectItem value="Europe">Europe</SelectItem>
                        <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
                        <SelectItem value="Remote">Remote Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleSearch} className="btn-primary mt-6">
                    <Filter size={16} className="mr-2" />
                    Apply Filters
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Results */}
            <motion.div 
              className="linkedin-card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Search Results ({displayCandidates.length} candidates)
                </h2>
                <p className="text-gray-600 text-sm mt-1">Ranked by ReRank Score</p>
              </div>

              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {displayCandidates.slice(0, 10).map((candidate, index) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CandidateCard 
                      candidate={candidate}
                      onClick={() => setSelectedCandidate(candidate)}
                      showRankBadge={false}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Smart Picks */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Card className="linkedin-card">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Smart Picks
                  </CardTitle>
                  <p className="text-sm text-gray-600">High-potential candidates you might have missed</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {smartPicks.map((candidate) => (
                    <div 
                      key={candidate.id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      <img 
                        src={candidate.imageUrl || '/placeholder-avatar.jpg'} 
                        alt={candidate.name}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {candidate.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {candidate.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-medium text-blue-600">
                            {candidate.overallScore.toLocaleString()}
                          </span>
                          <span className="tier-diamond text-xs">Diamond</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Skills */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <Card className="linkedin-card">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Top Skills in Pool
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analytics?.topSkills?.slice(0, 8).map((skill) => (
                    <div key={skill.skill} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{skill.skill}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(skill.count / 100 * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-8">{skill.count}</span>
                      </div>
                    </div>
                  )) || (
                    // Fallback data
                    ['React', 'Python', 'TypeScript', 'AWS', 'Docker', 'Node.js'].map((skill, index) => (
                      <div key={skill} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{skill}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-12 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${Math.max(20, 100 - index * 15)}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-8">{Math.max(120, 200 - index * 20)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
          </TabsContent>

          {/* Shortlists Tab */}
          <TabsContent value="shortlists">
            <Card className="linkedin-card">
              <CardHeader>
                <CardTitle>My Shortlists</CardTitle>
                <p className="text-gray-600">Organize candidates for different roles and projects</p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No shortlists yet</h3>
                  <p className="text-gray-600 mb-4">Start by searching for candidates and adding them to your shortlists</p>
                  <Button className="btn-primary">Create First Shortlist</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hiring Simulator Tab */}
          <TabsContent value="simulator">
            <HiringSimulator />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="linkedin-card">
                <CardHeader>
                  <CardTitle>Talent Pool Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Diamond Tier (3000+)</span>
                      <span className="font-bold text-blue-600">1,247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Gold Tier (2500-2999)</span>
                      <span className="font-bold text-yellow-600">3,891</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Silver Tier (2000-2499)</span>
                      <span className="font-bold text-gray-600">8,524</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Bronze Tier (900-1999)</span>
                      <span className="font-bold text-orange-600">11,185</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="linkedin-card">
                <CardHeader>
                  <CardTitle>Hiring Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Response Rate</span>
                        <span>87%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Interview Success</span>
                        <span>73%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '73%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Offer Acceptance</span>
                        <span>91%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '91%' }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Profile Modal */}
        {selectedCandidate && (
          <ProfileModal 
            candidate={selectedCandidate} 
            onClose={() => setSelectedCandidate(null)} 
          />
        )}
      </div>
    </div>
  );
}