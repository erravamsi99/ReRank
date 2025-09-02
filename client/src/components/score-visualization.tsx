import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

interface ScoreVisualizationProps {
  scores: {
    skillsScore: number;
    certificationsScore: number;
    experienceScore: number;
    industryScore: number;
    overallScore: number;
  };
  extractedSkills: string[];
}

export default function ScoreVisualization({ scores, extractedSkills }: ScoreVisualizationProps) {
  // Prepare radar chart data
  const radarData = [
    {
      skill: 'Frontend',
      score: Math.floor((scores.skillsScore / 3500) * 100),
      fullMark: 100,
    },
    {
      skill: 'Backend',
      score: Math.floor((scores.experienceScore / 3500) * 100),
      fullMark: 100,
    },
    {
      skill: 'DevOps',
      score: Math.floor((scores.industryScore / 3500) * 100),
      fullMark: 100,
    },
    {
      skill: 'Databases',
      score: Math.floor((scores.skillsScore / 3500) * 90),
      fullMark: 100,
    },
    {
      skill: 'Cloud',
      score: Math.floor((scores.certificationsScore / 3500) * 85),
      fullMark: 100,
    },
    {
      skill: 'Security',
      score: Math.floor((scores.experienceScore / 3500) * 80),
      fullMark: 100,
    },
  ];

  // Prepare bar chart data for skills
  const skillsData = extractedSkills.slice(0, 6).map((skill, index) => ({
    name: skill,
    proficiency: Math.floor(Math.random() * 30) + 70, // Mock proficiency 70-100%
  }));

  return (
    <div className="space-y-6">
      {/* Radar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="glassmorphism">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Skills Assessment Radar</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid 
                    stroke="rgba(255, 255, 255, 0.2)"
                    radialLines={true}
                  />
                  <PolarAngleAxis 
                    dataKey="skill" 
                    tick={{ fill: '#ffffff', fontSize: 12 }}
                  />
                  <Radar
                    name="Your Skills"
                    dataKey="score"
                    stroke="var(--neon-cyan)"
                    fill="rgba(0, 245, 255, 0.1)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--neon-cyan)', strokeWidth: 2, r: 4 }}
                  />
                  <Radar
                    name="Industry Average"
                    dataKey="fullMark"
                    stroke="var(--neon-purple)"
                    fill="rgba(139, 92, 246, 0.05)"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-8 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-neon-cyan" />
                <span className="text-sm text-gray-300">Your Skills</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-neon-purple bg-transparent" />
                <span className="text-sm text-gray-300">Industry Benchmark</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Skills Proficiency Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="glassmorphism">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Extracted Skills Proficiency</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillsData} layout="horizontal">
                  <XAxis 
                    type="number" 
                    domain={[0, 100]}
                    tick={{ fill: '#ffffff', fontSize: 10 }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name"
                    tick={{ fill: '#ffffff', fontSize: 10 }}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--dark-accent)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                  <Bar 
                    dataKey="proficiency" 
                    fill="url(#gradient)"
                    radius={[0, 4, 4, 0]}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="var(--neon-cyan)" />
                      <stop offset="100%" stopColor="var(--neon-purple)" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
