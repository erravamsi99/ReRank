import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calculator, Users, TrendingUp, Target, 
  Plus, X, ArrowRight, CheckCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface Candidate {
  id: string;
  name: string;
  title: string;
  overallScore: number;
  skills: string[];
  skillCoverage: { [key: string]: number };
}

interface TeamAnalysis {
  currentSkills: { [key: string]: number };
  gaps: string[];
  avgScore: number;
  teamSize: number;
}

const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "Senior DevOps Engineer",
    overallScore: 3250,
    skills: ["Python", "AWS", "Kubernetes", "Terraform", "Docker"],
    skillCoverage: { "Cloud": 95, "DevOps": 92, "Backend": 78, "Frontend": 45 }
  },
  {
    id: "2", 
    name: "Marcus Johnson",
    title: "Full Stack Developer",
    overallScore: 2980,
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "GraphQL"],
    skillCoverage: { "Frontend": 88, "Backend": 85, "Database": 80, "Cloud": 60 }
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    title: "Data Scientist",
    overallScore: 3150,
    skills: ["Python", "TensorFlow", "SQL", "AWS", "Spark"],
    skillCoverage: { "AI/ML": 92, "Data": 90, "Python": 88, "Cloud": 75 }
  }
];

const mockCurrentTeam: TeamAnalysis = {
  currentSkills: {
    "Frontend": 70,
    "Backend": 85,
    "Cloud": 60,
    "DevOps": 45,
    "AI/ML": 30,
    "Database": 75
  },
  gaps: ["DevOps", "AI/ML", "Advanced Cloud"],
  avgScore: 2750,
  teamSize: 8
};

export default function HiringSimulator() {
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  const [simulationResults, setSimulationResults] = useState<any>(null);

  const addCandidate = (candidate: Candidate) => {
    if (!selectedCandidates.find(c => c.id === candidate.id)) {
      setSelectedCandidates([...selectedCandidates, candidate]);
    }
  };

  const removeCandidate = (candidateId: string) => {
    setSelectedCandidates(selectedCandidates.filter(c => c.id !== candidateId));
  };

  const runSimulation = () => {
    // Calculate impact of adding selected candidates
    const newTeamSize = mockCurrentTeam.teamSize + selectedCandidates.length;
    const newAvgScore = (mockCurrentTeam.avgScore * mockCurrentTeam.teamSize + 
      selectedCandidates.reduce((sum, c) => sum + c.overallScore, 0)) / newTeamSize;

    // Calculate skill improvements
    const skillImprovements: { [key: string]: number } = {};
    Object.keys(mockCurrentTeam.currentSkills).forEach(skill => {
      const currentLevel = mockCurrentTeam.currentSkills[skill];
      const candidateBoost = selectedCandidates.reduce((boost, candidate) => {
        return boost + (candidate.skillCoverage[skill] || 0);
      }, 0) / selectedCandidates.length || 0;
      
      const newLevel = Math.min(100, currentLevel + (candidateBoost * 0.3)); // 30% of candidate skill adds to team
      skillImprovements[skill] = newLevel - currentLevel;
    });

    // Calculate cost-benefit
    const estimatedSalary = selectedCandidates.reduce((total, c) => {
      const baseSalary = c.overallScore > 3000 ? 180000 : c.overallScore > 2500 ? 150000 : 120000;
      return total + baseSalary;
    }, 0);

    setSimulationResults({
      newAvgScore,
      scoreImprovement: newAvgScore - mockCurrentTeam.avgScore,
      skillImprovements,
      estimatedCost: estimatedSalary,
      productivityIncrease: Math.round((newAvgScore - mockCurrentTeam.avgScore) / 10), // Mock calculation
      timeToHire: selectedCandidates.length * 3 + 2, // weeks
      riskAssessment: selectedCandidates.length > 2 ? "Medium" : "Low"
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="text-blue-600" size={20} />
          <span>"What If" Hiring Simulator</span>
        </CardTitle>
        <p className="text-gray-600">
          Model the impact of hiring candidates on your team's skill coverage and performance
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Team State */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center space-x-2">
            <Users size={16} />
            <span>Current Team Analysis</span>
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(mockCurrentTeam.currentSkills).map(([skill, level]) => (
              <div key={skill} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{skill}</span>
                  <span className="font-medium">{level}%</span>
                </div>
                <Progress value={level} className="h-2" />
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4 text-sm">
            <span>Team Size: <strong>{mockCurrentTeam.teamSize}</strong></span>
            <span>Avg Score: <strong>{mockCurrentTeam.avgScore}</strong></span>
          </div>
        </div>

        {/* Candidate Pool */}
        <div>
          <h3 className="font-semibold mb-3">Available Candidates</h3>
          <div className="grid gap-3">
            {mockCandidates.map((candidate) => (
              <motion.div
                key={candidate.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedCandidates.find(c => c.id === candidate.id)
                    ? 'bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => 
                  selectedCandidates.find(c => c.id === candidate.id)
                    ? removeCandidate(candidate.id)
                    : addCandidate(candidate)
                }
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{candidate.name}</h4>
                    <p className="text-sm text-gray-600">{candidate.title}</p>
                    <div className="flex space-x-1 mt-1">
                      {candidate.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{candidate.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {candidate.overallScore.toLocaleString()}
                    </div>
                    {selectedCandidates.find(c => c.id === candidate.id) ? (
                      <CheckCircle className="text-green-600 mx-auto mt-1" size={16} />
                    ) : (
                      <Plus className="text-gray-400 mx-auto mt-1" size={16} />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Selected Candidates */}
        {selectedCandidates.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Selected for Simulation ({selectedCandidates.length})</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCandidates.map((candidate) => (
                <Badge
                  key={candidate.id}
                  variant="secondary"
                  className="flex items-center space-x-1 px-3 py-1"
                >
                  <span>{candidate.name}</span>
                  <X 
                    size={12} 
                    className="cursor-pointer hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCandidate(candidate.id);
                    }}
                  />
                </Badge>
              ))}
            </div>
            <Button onClick={runSimulation} className="w-full">
              <Calculator size={16} className="mr-2" />
              Run Hiring Simulation
            </Button>
          </div>
        )}

        {/* Simulation Results */}
        {simulationResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border"
          >
            <h3 className="font-semibold mb-4 flex items-center space-x-2">
              <TrendingUp className="text-green-600" size={20} />
              <span>Simulation Results</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  +{simulationResults.scoreImprovement.toFixed(0)}
                </div>
                <p className="text-sm text-gray-600">Average Score Boost</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  +{simulationResults.productivityIncrease}%
                </div>
                <p className="text-sm text-gray-600">Productivity Increase</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {simulationResults.timeToHire}
                </div>
                <p className="text-sm text-gray-600">Weeks to Hire</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">
                  ${(simulationResults.estimatedCost / 1000).toFixed(0)}K
                </div>
                <p className="text-sm text-gray-600">Annual Cost</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <h4 className="font-medium">Skill Coverage Improvements</h4>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(simulationResults.skillImprovements).map(([skill, improvement]) => {
                  const improvementValue = improvement as number;
                  return (
                    <div key={skill} className="bg-white p-3 rounded">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{skill}</span>
                        <span className={`text-sm font-bold ${improvementValue > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                          {improvementValue > 0 ? '+' : ''}{improvementValue.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${mockCurrentTeam.currentSkills[skill]}%` }}
                          />
                        </div>
                        <ArrowRight size={12} className="text-gray-400" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${Math.min(100, mockCurrentTeam.currentSkills[skill] + improvementValue)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator className="my-4" />

            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium mb-2">Risk Assessment: 
                <span className={`ml-2 ${
                  simulationResults.riskAssessment === 'Low' ? 'text-green-600' :
                  simulationResults.riskAssessment === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {simulationResults.riskAssessment}
                </span>
              </h4>
              <p className="text-sm text-gray-600">
                {simulationResults.riskAssessment === 'Low' 
                  ? 'Conservative hiring plan with predictable integration.'
                  : 'Moderate hiring velocity - consider staggered onboarding for optimal team dynamics.'
                }
              </p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}