import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  Crown, 
  TrendingUp, 
  Wrench, 
  Target, 
  BarChart3, 
  PieChart, 
  Activity, 
  Shield, 
  AlertTriangle,
  Code,
  Zap,
  Layers,
  Clock,
  Database,
  LineChart,
  TrendingDown
} from 'lucide-react';

const HelpDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Help & Documentation</h1>
          <p className="text-muted-foreground">Understanding your CAST Dashboard metrics and charts</p>
        </div>
      </div>

      <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
        <TabsList className="grid w-full max-w-3xl grid-cols-6 mx-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="executive">Executive</TabsTrigger>
          <TabsTrigger value="cto">CTO</TabsTrigger>
          <TabsTrigger value="architect">Architect</TabsTrigger>
          <TabsTrigger value="appowner">App Owner</TabsTrigger>
          <TabsTrigger value="glossary">Glossary</TabsTrigger>
        </TabsList>

        {/* Overview Section */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                CAST Dashboard Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">What is CAST?</h3>
                <p className="text-gray-600 mb-4">
                  CAST analyzes your application source code to measure software quality, security, and maintainability. 
                  It provides objective metrics to help you make informed decisions about your software portfolio.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Quality Scoring</h4>
                  <p className="text-sm text-blue-700">
                    CAST uses a scale of 1.0 to 4.0 for quality metrics:
                  </p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• <strong>4.0 - Excellent:</strong> Industry best practices</li>
                    <li>• <strong>3.0 - Good:</strong> Above average quality</li>
                    <li>• <strong>2.0 - Fair:</strong> Needs improvement</li>
                    <li>• <strong>1.0 - Poor:</strong> Immediate attention required</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Grade System</h4>
                  <p className="text-sm text-green-700">
                    Quality scores are converted to letter grades:
                  </p>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• <strong>A:</strong> Score 3.5 - 4.0 (Excellent)</li>
                    <li>• <strong>B:</strong> Score 2.5 - 3.4 (Good)</li>
                    <li>• <strong>C:</strong> Score 1.5 - 2.4 (Fair)</li>
                    <li>• <strong>D:</strong> Score 1.0 - 1.4 (Poor)</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Dashboard Purpose</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <Crown className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <h4 className="font-medium">Executive</h4>
                    <p className="text-sm text-gray-600">High-level portfolio overview for business decisions</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h4 className="font-medium">CTO</h4>
                    <p className="text-sm text-gray-600">Technical architecture and code quality analytics</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <Wrench className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <h4 className="font-medium">Architect</h4>
                    <p className="text-sm text-gray-600">Software design and architecture quality insights</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <Target className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h4 className="font-medium">App Owner</h4>
                    <p className="text-sm text-gray-600">Application-specific metrics and detailed analysis</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Executive Dashboard Help */}
        <TabsContent value="executive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-purple-600" />
                Executive Dashboard Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Purpose</h3>
                <p className="text-gray-600">
                  The Executive Dashboard provides high-level insights for business leaders to understand 
                  the overall health and risk of their application portfolio.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Key Metrics Explained</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium">Portfolio Health</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>What it shows:</strong> Average quality score across all applications
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>How it's calculated:</strong> Sum of all application quality scores ÷ number of applications
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium">Security Score</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>What it shows:</strong> How secure your applications are from vulnerabilities
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>How it's calculated:</strong> CAST analyzes code for security weaknesses and rates from 1-4
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <h4 className="font-medium">Critical Issues</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>What it shows:</strong> Number of high-priority problems that need immediate attention
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>How it's calculated:</strong> Count of violations with "Critical" severity level
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <h4 className="font-medium">Technical Debt</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>What it shows:</strong> Estimated effort (hours) to fix quality issues
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>How it's calculated:</strong> CAST estimates time needed to resolve all code quality problems
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Charts Explained</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <PieChart className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Risk Distribution (Pie Chart)</h4>
                      <p className="text-sm text-gray-600">
                        Shows what percentage of your applications are High Risk, Medium Risk, or Low Risk. 
                        Helps you prioritize which applications need attention first.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <LineChart className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Health Trends (Line Chart)</h4>
                      <p className="text-sm text-gray-600">
                        Shows how your portfolio quality has changed over time (last 6 months). 
                        Upward trends are good, downward trends indicate quality is getting worse.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Application Summary (Table)</h4>
                      <p className="text-sm text-gray-600">
                        Lists your applications with their quality scores, grades, and key metrics. 
                        Use this to identify which specific applications need improvement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CTO Dashboard Help */}
        <TabsContent value="cto" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                CTO Dashboard Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Purpose</h3>
                <p className="text-gray-600">
                  The CTO Dashboard focuses on technical architecture, security, and performance metrics 
                  that help technology leaders make informed decisions about their software stack.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Key Metrics Explained</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium">Architecture Complexity</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>What it shows:</strong> How complex your application structure is
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>How it's calculated:</strong> CAST analyzes code structure, dependencies, and layering
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium">Security Metrics</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>What it shows:</strong> Detailed security vulnerabilities and weaknesses
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>How it's calculated:</strong> Count of security violations by severity and type
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      <h4 className="font-medium">Performance Issues</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>What it shows:</strong> Problems that could slow down your applications
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>How it's calculated:</strong> Count of performance-related code violations
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-5 w-5 text-purple-600" />
                      <h4 className="font-medium">Technology Health</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>What it shows:</strong> Quality scores for different technologies (Java, .NET, etc.)
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>How it's calculated:</strong> Average quality score per technology stack
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Architect Dashboard Help */}
        <TabsContent value="architect" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-orange-600" />
                Architect Dashboard Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Purpose</h3>
                <p className="text-gray-600">
                  The Architect Dashboard provides insights into software design quality, modularity, 
                  and architectural patterns to help architects make better design decisions.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Key Concepts</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Module Health Radar</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>What it shows:</strong> Quality across different architectural dimensions
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>How to read it:</strong> Larger areas = better quality. Look for balanced shapes.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Complexity Analysis</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>What it shows:</strong> How many objects are High/Medium/Low complexity
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Goal:</strong> More Low complexity objects = easier to maintain code
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Technology Distribution</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>What it shows:</strong> Breakdown of technologies used in your portfolio
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Use case:</strong> Understand technology diversity and standardization opportunities
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Architectural Debt</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>What it shows:</strong> Design and architecture issues that need fixing
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Impact:</strong> High debt = harder to change and extend applications
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* App Owner Dashboard Help */}
        <TabsContent value="appowner" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                App Owner Dashboard Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Purpose</h3>
                <p className="text-gray-600">
                  The App Owner Dashboard provides detailed insights for individual applications, 
                  helping application owners understand quality, risks, and improvement opportunities.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Detailed Metrics</h3>
                
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Application Health Scorecard</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Shows quality metrics in two formats:
                    </p>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 rounded border-l-4 border-green-400">
                        <h5 className="font-medium text-green-800 mb-1">ISO 5055 Compliance Scores</h5>
                        <p className="text-xs text-green-700 mb-2">
                          Displayed as <strong>percentage compliance (0-100%)</strong> with color coding:
                        </p>
                        <div className="grid grid-cols-1 gap-1 text-xs text-green-700">
                          <div><span className="inline-block w-3 h-3 bg-green-600 rounded mr-2"></span><strong>≥95%:</strong> Excellent (Green)</div>
                          <div><span className="inline-block w-3 h-3 bg-purple-600 rounded mr-2"></span><strong>90-94%:</strong> Good (Purple)</div>
                          <div><span className="inline-block w-3 h-3 bg-red-600 rounded mr-2"></span><strong>&lt;90%:</strong> Needs Improvement (Red)</div>
                        </div>
                        <p className="text-xs text-green-600 mt-2">
                          <strong>Covers:</strong> ISO-5055-Index, Maintainability, Performance-Efficiency, Reliability, Security
                        </p>
                      </div>
                      
                      <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                        <h5 className="font-medium text-blue-800 mb-1">CAST Health Scores</h5>
                        <p className="text-xs text-blue-700 mb-2">
                          Displayed as <strong>score out of 4.0</strong> with traditional grades:
                        </p>
                        <div className="grid grid-cols-2 gap-1 text-xs text-blue-700">
                          <div><strong>≥3.5:</strong> Grade A/B</div>
                          <div><strong>2.5-3.4:</strong> Grade C</div>
                          <div><strong>1.5-2.4:</strong> Grade D</div>
                          <div><strong>&lt;1.5:</strong> Grade F</div>
                        </div>
                        <p className="text-xs text-blue-600 mt-2">
                          <strong>Covers:</strong> Overall Score, Technical Debt, Other quality dimensions
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Violation Analysis</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>What it shows:</strong> Specific code problems broken down by technology
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>How to use it:</strong> Focus on technologies with the most critical violations first
                    </p>
                    <Badge variant="destructive" className="text-xs">Critical</Badge>
                    <span className="text-xs ml-2">= Must fix immediately</span>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Risk Assessment</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Complexity Risk:</strong> How hard it will be to maintain your code
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Security Risk:</strong> How vulnerable your application is to attacks
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Overall Rating:</strong> Combined risk level (High/Medium/Low)
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Productivity Metrics</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Quality Efficiency:</strong> How much quality you get per line of code
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Debt Ratio:</strong> Technical debt hours ÷ development hours
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Goal:</strong> Higher efficiency, lower debt ratio = more productive development
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tips for App Owners</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Focus on <strong>Critical violations</strong> first - they have the biggest impact</li>
                  <li>• Track your <strong>Overall Score</strong> monthly to see improvement trends</li>
                  <li>• Use <strong>Technical Debt</strong> hours to plan refactoring sprints</li>
                  <li>• Compare your app's scores to portfolio averages for context</li>
                  <li>• Export reports to share progress with stakeholders</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Glossary Section */}
        <TabsContent value="glossary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                CAST Terminology Glossary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-blue-900">Technical Debt</h4>
                    <p className="text-sm text-gray-600">
                      The estimated effort (in hours) required to fix all quality issues in your code. 
                      Like financial debt, it accumulates "interest" making future changes harder.
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-blue-900">Violations</h4>
                    <p className="text-sm text-gray-600">
                      Instances where code doesn't follow best practices or quality rules. 
                      Critical violations have the highest impact on quality.
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-blue-900">Complexity</h4>
                    <p className="text-sm text-gray-600">
                      How difficult code is to understand and modify. High complexity = harder to maintain, 
                      more bugs, longer development time.
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-blue-900">Quality Index</h4>
                    <p className="text-sm text-gray-600">
                      Overall quality score combining all CAST dimensions (Security, Performance, 
                      Reliability, etc.) into a single 1.0-4.0 rating.
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg bg-green-50">
                    <h4 className="font-semibold text-green-900">ISO 5055 Compliance Score</h4>
                    <p className="text-sm text-gray-600">
                      Percentage compliance (0-100%) with ISO 5055 software quality standards. 
                      Based on automated code analysis against international quality criteria.
                      <br/><strong>Target:</strong> ≥95% for excellent quality, ≥90% for good quality.
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-blue-900">Snapshot</h4>
                    <p className="text-sm text-gray-600">
                      A point-in-time analysis of your application. CAST creates snapshots after 
                      each code scan to track changes over time.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-green-900">Maintainability</h4>
                    <p className="text-sm text-gray-600">
                      How easy it is to modify, extend, and fix your code. Good maintainability 
                      = faster development and lower costs.
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-green-900">Reliability</h4>
                    <p className="text-sm text-gray-600">
                      How stable your application is. High reliability = fewer crashes, 
                      better user experience, less downtime.
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-green-900">Security</h4>
                    <p className="text-sm text-gray-600">
                      Protection against vulnerabilities like SQL injection, XSS, etc. 
                      Higher scores = lower risk of security breaches.
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-green-900">Performance Efficiency</h4>
                    <p className="text-sm text-gray-600">
                      How well your application uses system resources (CPU, memory, network). 
                      Higher efficiency = faster response times, lower infrastructure costs.
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-green-900">Transferability</h4>
                    <p className="text-sm text-gray-600">
                      How easy it is to move your application to different environments or platforms. 
                      Good transferability = easier deployments and migrations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">📊 Understanding the Numbers</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-yellow-800">CAST Health Scores</h5>
                    <ul className="text-yellow-700 space-y-1">
                      <li>• 3.5-4.0: Excellent (A)</li>
                      <li>• 2.5-3.4: Good (B)</li>
                      <li>• 1.5-2.4: Fair (C)</li>
                      <li>• 1.0-1.4: Poor (D)</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-green-800">ISO Compliance %</h5>
                    <ul className="text-green-700 space-y-1">
                      <li>• ≥95%: Excellent (Green)</li>
                      <li>• 90-94%: Good (Purple)</li>
                      <li>• &lt;90%: Needs Work (Red)</li>
                      <li>• Target: 95%+ compliance</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-yellow-800">Risk Levels</h5>
                    <ul className="text-yellow-700 space-y-1">
                      <li>• Critical: Fix immediately</li>
                      <li>• High: Plan this sprint</li>
                      <li>• Medium: Next quarter</li>
                      <li>• Low: Monitor trends</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-yellow-800">Technical Debt</h5>
                    <ul className="text-yellow-700 space-y-1">
                      <li>• Hours to fix issues</li>
                      <li>• Lower = better quality</li>
                      <li>• Use for sprint planning</li>
                      <li>• Track trends over time</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpDashboard;