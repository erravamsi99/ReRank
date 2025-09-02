import { Candidate } from "@shared/schema";
import { motion } from "framer-motion";
import { MapPin, Briefcase, Trophy } from "lucide-react";

interface CandidateCardProps {
  candidate: Candidate;
  onClick?: () => void;
  showRankBadge?: boolean;
}

export default function CandidateCard({ candidate, onClick, showRankBadge = false }: CandidateCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 3000) return "text-green-600";
    if (score >= 2500) return "text-blue-600";
    if (score >= 2000) return "text-amber-600";
    return "text-orange-600";
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
    <motion.div
      className="p-6 hover:bg-gray-50 transition-all duration-200 cursor-pointer group border-l-4 border-transparent hover:border-blue-500"
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Rank Badge */}
          {showRankBadge && candidate.globalRank && (
            <div className="flex flex-col items-center min-w-[60px]">
              <div className="text-xl font-bold text-gray-900">#{candidate.globalRank}</div>
              {candidate.globalRank === 1 && (
                <Trophy className="text-amber-500 mt-1" size={16} />
              )}
            </div>
          )}
          
          <img 
            src={candidate.imageUrl || '/placeholder-avatar.jpg'} 
            alt={candidate.name}
            className="w-14 h-14 rounded-lg object-cover border border-gray-200"
          />
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {candidate.name}
              </h3>
              <span className={`${getTierClass(candidate.overallScore)}`}>
                {getTierLabel(candidate.overallScore)}
              </span>
            </div>
            <p className="text-gray-600 mb-2 text-sm">{candidate.title}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin size={12} />
                <span>{candidate.location}</span>
              </div>
              {candidate.company && (
                <div className="flex items-center gap-1">
                  <Briefcase size={12} />
                  <span>{candidate.company}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className={`text-xl font-bold ${getScoreColor(candidate.overallScore)} mb-2`}>
            {candidate.overallScore.toLocaleString()}
          </div>
          
          <div className="flex flex-wrap gap-1 justify-end max-w-48">
            {candidate.skills.slice(0, 3).map((skill) => (
              <span 
                key={skill} 
                className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700"
              >
                {skill}
              </span>
            ))}
            {candidate.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">
                +{candidate.skills.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}