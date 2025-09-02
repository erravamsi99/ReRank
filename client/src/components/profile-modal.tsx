import { motion } from "framer-motion";
import { X, MapPin, Building, Star, TrendingUp, Award, Calendar, Globe, Mail, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Candidate } from "@shared/schema";

interface ProfileModalProps {
  candidate: Candidate | null;
  onClose: () => void;
}

export default function ProfileModal({ candidate, onClose }: ProfileModalProps) {
  if (!candidate) return null;

  const getScoreColor = (score: number) => {
    if (score >= 800) return "text-green-600";
    if (score >= 600) return "text-blue-600";
    if (score >= 400) return "text-amber-600";
    return "text-orange-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 800) return "Excellent";
    if (score >= 600) return "Good";
    if (score >= 400) return "Average";
    return "Needs Improvement";
  };

  const getTierClass = (score: number) => {
    if (score >= 3000) return "tier-diamond";
    if (score >= 2500) return "tier-gold";
    if (score >= 2000) return "tier-silver";
    return "tier-bronze";
  };

  const getTierLabel = (score: number) => {
    if (score >= 3000) return "Diamond";
    if (score >= 2500) return "Gold";
    if (score >= 2000) return "Silver";
    return "Bronze";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Candidate Profile</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="p-8">
          {/* Header Section */}
          <div className="flex items-start space-x-8">
            <motion.img
              src={candidate.imageUrl || '/placeholder-avatar.jpg'}
              alt={candidate.name}
              className="w-32 h-32 rounded-xl object-cover border-4 border-blue-200"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            />
            
            <div className="flex-1">
              <motion.h1 
                className="text-3xl font-bold text-gray-900 mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {candidate.name}
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                {candidate.title}
              </motion.p>

              <div className="flex items-center space-x-6 text-gray-500 mb-6">
                <div className="flex items-center space-x-2">
                  <MapPin size={16} />
                  <span>{candidate.location}</span>
                </div>
                {candidate.company && (
                  <div className="flex items-center space-x-2">
                    <Building size={16} />
                    <span>{candidate.company}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Globe size={16} />
                  <span>{candidate.region}</span>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-3xl font-bold text-blue-600">
                    {candidate.overallScore.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">ReRank Score</div>
                </motion.div>

                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="text-2xl font-bold text-gray-900">
                    #{candidate.globalRank || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">Global Rank</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <span className={`${getTierClass(candidate.overallScore)} px-4 py-2 text-sm font-medium`}>
                    {getTierLabel(candidate.overallScore)}
                  </span>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Star className="text-blue-600" size={20} />
              <span>Key Skills</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 border border-gray-200"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Score Breakdown */}
          <motion.div 
            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card className="linkedin-card">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center space-x-2">
                  <TrendingUp className="text-blue-600" size={18} />
                  <span>Skills Rating</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-2xl font-bold ${getScoreColor(candidate.skillsScore)}`}>
                    {candidate.skillsScore}
                  </span>
                  <span className="text-sm text-gray-500">
                    {getScoreLabel(candidate.skillsScore)}
                  </span>
                </div>
                <Progress value={(candidate.skillsScore / 1000) * 100} className="h-3" />
              </CardContent>
            </Card>

            <Card className="linkedin-card">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center space-x-2">
                  <Award className="text-green-600" size={18} />
                  <span>Experience Rating</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-2xl font-bold ${getScoreColor(candidate.experienceScore)}`}>
                    {candidate.experienceScore}
                  </span>
                  <span className="text-sm text-gray-500">
                    {getScoreLabel(candidate.experienceScore)}
                  </span>
                </div>
                <Progress value={(candidate.experienceScore / 1000) * 100} className="h-3" />
              </CardContent>
            </Card>

            <Card className="linkedin-card">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center space-x-2">
                  <Building className="text-amber-600" size={18} />
                  <span>Industry Fit</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-2xl font-bold ${getScoreColor(candidate.industryScore)}`}>
                    {candidate.industryScore}
                  </span>
                  <span className="text-sm text-gray-500">
                    {getScoreLabel(candidate.industryScore)}
                  </span>
                </div>
                <Progress value={(candidate.industryScore / 1000) * 100} className="h-3" />
              </CardContent>
            </Card>

            <Card className="linkedin-card">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center space-x-2">
                  <Star className="text-amber-500" size={18} />
                  <span>Certifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-2xl font-bold ${getScoreColor(candidate.certificationsScore)}`}>
                    {candidate.certificationsScore}
                  </span>
                  <span className="text-sm text-gray-500">
                    {getScoreLabel(candidate.certificationsScore)}
                  </span>
                </div>
                <Progress value={(candidate.certificationsScore / 1000) * 100} className="h-3" />
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="mt-8 flex space-x-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Button className="btn-primary px-6 py-2">
              <Mail className="mr-2" size={16} />
              Contact Candidate
            </Button>
            <Button className="btn-secondary px-6 py-2">
              <Linkedin className="mr-2" size={16} />
              View LinkedIn
            </Button>
            <Button className="btn-secondary px-6 py-2">
              Add to Shortlist
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}