import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle, AlertCircle, User, Star, MapPin, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface UploadProgress {
  step: number;
  status: 'idle' | 'uploading' | 'parsing' | 'scoring' | 'complete' | 'error';
  message: string;
  score?: number;
  breakdown?: {
    skills: number;
    experience: number;
    industry: number;
    certifications: number;
  };
}

export default function UploadResume() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<UploadProgress>({
    step: 0,
    status: 'idle',
    message: 'Ready to upload'
  });
  const [candidateInfo, setCandidateInfo] = useState({
    name: '',
    email: '',
    location: '',
    title: '',
    bio: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/resumes/upload', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    onSuccess: (data) => {
      setProgress({
        step: 4,
        status: 'complete',
        message: 'Resume processed successfully!',
        score: data.score,
        breakdown: data.breakdown
      });
      queryClient.invalidateQueries({ queryKey: ['/api/leaderboard'] });
      toast({
        title: "Success!",
        description: `Your resume has been scored: ${data.score.toLocaleString()} points`
      });
    },
    onError: (error) => {
      setProgress({
        step: 0,
        status: 'error',
        message: 'Upload failed. Please try again.'
      });
      toast({
        title: "Error",
        description: "Failed to upload resume. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document.",
        variant: "destructive"
      });
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
    setProgress({
      step: 1,
      status: 'uploading',
      message: 'File selected, ready to process'
    });
  };

  const simulateProcessing = async (formData: FormData) => {
    // Step 1: Uploading
    setProgress({ step: 1, status: 'uploading', message: 'Uploading resume...' });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 2: Parsing
    setProgress({ step: 2, status: 'parsing', message: 'Analyzing document structure...' });
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Step 3: Scoring
    setProgress({ step: 3, status: 'scoring', message: 'Calculating ReRank Score...' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Proceed with actual upload
    return uploadMutation.mutate(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a resume to upload.",
        variant: "destructive"
      });
      return;
    }

    if (!candidateInfo.name || !candidateInfo.email) {
      toast({
        title: "Missing information",
        description: "Please fill in your name and email.",
        variant: "destructive"
      });
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('name', candidateInfo.name);
    formData.append('email', candidateInfo.email);
    formData.append('location', candidateInfo.location);
    formData.append('title', candidateInfo.title);
    formData.append('bio', candidateInfo.bio);

    await simulateProcessing(formData);
  };

  const getStepIcon = (step: number) => {
    if (progress.step > step) return <CheckCircle className="text-green-600" size={20} />;
    if (progress.step === step && progress.status === 'error') return <AlertCircle className="text-red-600" size={20} />;
    if (progress.step === step) return <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
    return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Upload Your Resume
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get your comprehensive ReRank Score and join the global talent index. Our AI analyzes your skills, experience, and achievements to provide actionable insights.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="linkedin-card">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Upload size={20} className="text-blue-600" />
                  Resume Upload
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Resume Document (PDF, DOC, DOCX)
                  </Label>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                      dragActive 
                        ? 'border-blue-500 bg-blue-50' 
                        : file 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileInput}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    {file ? (
                      <div className="space-y-2">
                        <FileText className="mx-auto text-green-600" size={32} />
                        <p className="text-sm font-medium text-green-700">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto text-gray-400" size={32} />
                        <p className="text-sm text-gray-600">
                          Drop your resume here or <span className="text-blue-600 font-medium">browse files</span>
                        </p>
                        <p className="text-xs text-gray-500">Supports PDF, DOC, DOCX up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Candidate Information */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700">Personal Information</Label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm text-gray-600">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Smith"
                        value={candidateInfo.name}
                        onChange={(e) => setCandidateInfo(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-sm text-gray-600">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={candidateInfo.email}
                        onChange={(e) => setCandidateInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location" className="text-sm text-gray-600">Location</Label>
                      <Input
                        id="location"
                        type="text"
                        placeholder="San Francisco, CA"
                        value={candidateInfo.location}
                        onChange={(e) => setCandidateInfo(prev => ({ ...prev, location: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="title" className="text-sm text-gray-600">Current Title</Label>
                      <Input
                        id="title"
                        type="text"
                        placeholder="Senior Software Engineer"
                        value={candidateInfo.title}
                        onChange={(e) => setCandidateInfo(prev => ({ ...prev, title: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio" className="text-sm text-gray-600">Professional Summary (Optional)</Label>
                    <Textarea
                      id="bio"
                      placeholder="Brief description of your professional background..."
                      value={candidateInfo.bio}
                      onChange={(e) => setCandidateInfo(prev => ({ ...prev, bio: e.target.value }))}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSubmit}
                  disabled={!file || !candidateInfo.name || !candidateInfo.email || uploadMutation.isPending}
                  className="btn-primary w-full"
                >
                  {uploadMutation.isPending ? 'Processing...' : 'Upload & Get Score'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Progress & Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Processing Steps */}
            <Card className="linkedin-card mb-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Processing Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Upload', 'Parse Document', 'AI Analysis', 'Generate Score'].map((step, index) => (
                    <div key={step} className="flex items-center space-x-3">
                      {getStepIcon(index + 1)}
                      <span className={`text-sm ${progress.step > index + 1 ? 'text-green-600' : progress.step === index + 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>

                {progress.step > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round((progress.step / 4) * 100)}%</span>
                    </div>
                    <Progress value={(progress.step / 4) * 100} className="h-2" />
                    <p className="text-sm text-gray-600 mt-2">{progress.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results */}
            {progress.status === 'complete' && progress.score && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="linkedin-card">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Star className="text-amber-500" />
                      Your ReRank Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {progress.score.toLocaleString()}
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <span className={`${getTierClass(progress.score)} px-3 py-1 text-sm font-medium`}>
                          {getTierLabel(progress.score)}
                        </span>
                        <span className="text-sm text-gray-500">Tier</span>
                      </div>
                    </div>

                    {progress.breakdown && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">Score Breakdown</h4>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Skills</span>
                            <span className="text-sm font-medium">{progress.breakdown.skills}</span>
                          </div>
                          <Progress value={(progress.breakdown.skills / 1000) * 100} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Experience</span>
                            <span className="text-sm font-medium">{progress.breakdown.experience}</span>
                          </div>
                          <Progress value={(progress.breakdown.experience / 1000) * 100} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Industry Fit</span>
                            <span className="text-sm font-medium">{progress.breakdown.industry}</span>
                          </div>
                          <Progress value={(progress.breakdown.industry / 1000) * 100} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Certifications</span>
                            <span className="text-sm font-medium">{progress.breakdown.certifications}</span>
                          </div>
                          <Progress value={(progress.breakdown.certifications / 1000) * 100} className="h-2" />
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <Button 
                        className="btn-primary flex-1"
                        onClick={() => window.location.href = '/dashboard'}
                      >
                        View Dashboard
                      </Button>
                      <Button 
                        className="btn-secondary flex-1"
                        onClick={() => window.location.href = '/leaderboard'}
                      >
                        Join Leaderboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* What We Analyze */}
            <Card className="linkedin-card mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  What We Analyze
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Star className="text-blue-600 mt-0.5" size={16} />
                  <div>
                    <h4 className="font-medium text-gray-900">Skills & Technologies</h4>
                    <p className="text-sm text-gray-600">Programming languages, frameworks, and technical competencies</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Briefcase className="text-green-600 mt-0.5" size={16} />
                  <div>
                    <h4 className="font-medium text-gray-900">Experience & Achievements</h4>
                    <p className="text-sm text-gray-600">Career progression, project impact, and leadership roles</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <User className="text-amber-600 mt-0.5" size={16} />
                  <div>
                    <h4 className="font-medium text-gray-900">Industry Alignment</h4>
                    <p className="text-sm text-gray-600">Relevance to current market demands and industry trends</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-purple-600 mt-0.5" size={16} />
                  <div>
                    <h4 className="font-medium text-gray-900">Certifications & Education</h4>
                    <p className="text-sm text-gray-600">Professional credentials and continuous learning</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}