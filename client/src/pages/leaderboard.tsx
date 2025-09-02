import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, Trophy, Globe, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import CandidateCard from "@/components/candidate-card";
import ProfileModal from "@/components/profile-modal";
import type { CandidateWithRank } from "@shared/schema";

export default function Leaderboard() {
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateWithRank | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rankingType, setRankingType] = useState("global");
  const [skillFilter, setSkillFilter] = useState("all");

  // Fetch leaderboard data
  const { data: leaderboard, isLoading } = useQuery<CandidateWithRank[]>({
    queryKey: ["/api/leaderboard/global"],
    refetchInterval: 30000, // Update every 30 seconds for real-time feel
  });

  // Fetch analytics
  const { data: analytics } = useQuery<{
    totalCandidates: number;
    averageScore: number;
    countries: number;
    accuracyRate: number;
    topSkills: { skill: string; count: number }[];
  }>({
    queryKey: ["/api/analytics"],
  });

  const filteredCandidates = leaderboard?.filter((candidate) => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         candidate.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = skillFilter === "all" || 
                        candidate.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()));
    return matchesSearch && matchesSkill;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div 
          className="text-blue-600 text-4xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <TrendingUp size={48} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Global Talent Index
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover top professionals ranked by comprehensive skills assessment and industry performance
          </p>
        </motion.div>

        {/* Stats Cards */}
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
              <div className="text-gray-500 flex items-center justify-center gap-2 text-sm">
                <Users size={14} />
                Total Professionals
              </div>
            </CardContent>
          </Card>

          <Card className="linkedin-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {analytics?.averageScore?.toLocaleString() || "2,421"}
              </div>
              <div className="text-gray-500 flex items-center justify-center gap-2 text-sm">
                <TrendingUp size={14} />
                Average Score
              </div>
            </CardContent>
          </Card>

          <Card className="linkedin-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {analytics?.countries || "152"}
              </div>
              <div className="text-gray-500 flex items-center justify-center gap-2 text-sm">
                <Globe size={14} />
                Countries
              </div>
            </CardContent>
          </Card>

          <Card className="linkedin-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {analytics?.accuracyRate || "98.2"}%
              </div>
              <div className="text-gray-500 flex items-center justify-center gap-2 text-sm">
                <Trophy size={14} />
                Accuracy Rate
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="linkedin-card p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <Select value={rankingType} onValueChange={setRankingType}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global Rankings</SelectItem>
                  <SelectItem value="regional">Regional Rankings</SelectItem>
                  <SelectItem value="industry">Industry Rankings</SelectItem>
                </SelectContent>
              </Select>

              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  <SelectItem value="react">Frontend Development</SelectItem>
                  <SelectItem value="python">Backend Development</SelectItem>
                  <SelectItem value="ml">Data Science</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 relative">
              <Search className="absolute left-3 text-gray-400 z-10" size={16} />
              <Input
                type="text"
                placeholder="Search professionals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div 
          className="linkedin-card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Top Performers</h2>
            <p className="text-gray-600 text-sm mt-1">Ranked by comprehensive skills assessment</p>
          </div>

          <div className="divide-y divide-gray-100">
            <AnimatePresence>
              {filteredCandidates?.slice(0, 25).map((candidate, index) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CandidateCard 
                    candidate={candidate}
                    onClick={() => setSelectedCandidate(candidate)}
                    showRankBadge={true}
                  />
                </motion.div>
              ))}
              {(!filteredCandidates || filteredCandidates.length === 0) && (
                <div className="p-8 text-center text-gray-500">
                  <Users className="mx-auto mb-4" size={48} />
                  <p>No professionals found matching your criteria</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-6 text-center border-t border-gray-200">
            <Button className="btn-primary px-6 py-2">
              Load More Professionals
            </Button>
          </div>
        </motion.div>

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
