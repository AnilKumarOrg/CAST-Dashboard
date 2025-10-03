import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MultiDashboardExportButton } from "@/components/ui/pdf-download-button";
import { Brain, TrendingUp, MessageSquare, Settings, Crown, Wrench, Code, Users, Target, HelpCircle } from "lucide-react";
import ExecutiveDashboard from "@/components/dashboard/ExecutiveDashboard";
import CTODashboard from "@/components/dashboard/CTODashboard";
import ArchitectDashboard from "@/components/dashboard/ArchitectDashboard";
import AppOwnerDashboard from "@/components/dashboard/AppOwnerDashboard";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import HelpDashboard from "@/components/dashboard/HelpDashboard";
import AIInsights from "@/components/dashboard/AIInsights";
import ChatInterface from "@/components/dashboard/ChatInterface";
// import DatabaseConnection from "@/components/dashboard/DatabaseConnection";

const Index = () => {
  const [activeTab, setActiveTab] = useState("executive");

  // Handle tab changes to ensure Help is only accessible via header button
  const handleTabChange = (value: string) => {
    if (value === "help") {
      // If someone tries to navigate to help via tab, redirect to executive
      setActiveTab("executive");
    } else {
      setActiveTab(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  CAST Executive Dashboard
                </h1>
                <p className="text-xs text-muted-foreground">Application Intelligence & Quality Analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant={activeTab === "help" ? "default" : "outline"} 
                size="sm" 
                className={`gap-2 transition-all duration-200 ${
                  activeTab === "help" 
                    ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg" 
                    : "border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 hover:shadow-md"
                }`}
                onClick={() => setActiveTab("help")}
              >
                <HelpCircle className="w-4 h-4" />
                Help
              </Button>
              {/* Export All Dashboard button - hidden for now, can be re-enabled later
              <MultiDashboardExportButton
                sections={[
                  { elementId: "executive-dashboard-content", title: "Executive Dashboard" },
                  { elementId: "cto-dashboard-content", title: "CTO Dashboard" },
                  { elementId: "architect-dashboard-content", title: "Architect Dashboard" },
                  { elementId: "app-owner-dashboard-content", title: "App Owner Dashboard" }
                ]}
                className="ml-2"
              />
              */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full max-w-4xl grid-cols-6 mx-auto">
            <TabsTrigger value="executive" className="gap-2">
              <Crown className="w-4 h-4" />
              Executive
            </TabsTrigger>
            <TabsTrigger value="cto" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              CTO
            </TabsTrigger>
            <TabsTrigger value="architect" className="gap-2">
              <Wrench className="w-4 h-4" />
              Architect
            </TabsTrigger>
            <TabsTrigger value="appowner" className="gap-2">
              <Target className="w-4 h-4" />
              App Owner
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Brain className="w-4 h-4" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat
            </TabsTrigger>
          </TabsList>
          <TabsContent value="executive" className="space-y-6">
            <ExecutiveDashboard />
          </TabsContent>

          <TabsContent value="cto" className="space-y-6">
            <CTODashboard />
          </TabsContent>

          <TabsContent value="architect" className="space-y-6">
            <ArchitectDashboard />
          </TabsContent>

          <TabsContent value="appowner" className="space-y-6">
            <AppOwnerDashboard />
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <HelpDashboard />
          </TabsContent>

          <TabsContent value="ai">
            <AIInsights />
          </TabsContent>

          <TabsContent value="chat">
            <ChatInterface />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
