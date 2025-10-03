import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target } from "lucide-react";

const insights = [
  {
    type: "opportunity",
    icon: TrendingUp,
    title: "Revenue Growth Opportunity",
    description: "Electronics category shows 45% profit margin and growing demand. Consider expanding inventory by 30% to capture market opportunity.",
    impact: "High",
    confidence: 92,
    color: "text-green-600 bg-green-100"
  },
  {
    type: "warning",
    icon: AlertTriangle,
    title: "Inventory Alert",
    description: "23 products in the Food category are below reorder threshold. Historical data suggests stockouts could result in $12K lost revenue.",
    impact: "Medium",
    confidence: 88,
    color: "text-orange-600 bg-orange-100"
  },
  {
    type: "insight",
    icon: Lightbulb,
    title: "Customer Behavior Pattern",
    description: "Peak purchase times are 7-9 PM on weekdays. Scheduling promotions during these hours could increase conversion by 15-20%.",
    impact: "Medium",
    confidence: 85,
    color: "text-blue-600 bg-blue-100"
  },
  {
    type: "recommendation",
    icon: Target,
    title: "Marketing Optimization",
    description: "Customers who buy Electronics have 68% likelihood to purchase accessories within 7 days. Implement targeted email campaigns.",
    impact: "High",
    confidence: 91,
    color: "text-purple-600 bg-purple-100"
  },
  {
    type: "trend",
    icon: TrendingUp,
    title: "Seasonal Trend Detected",
    description: "Historical data indicates 35% revenue spike in next quarter. Consider increasing staffing and inventory accordingly.",
    impact: "High",
    confidence: 89,
    color: "text-teal-600 bg-teal-100"
  },
  {
    type: "insight",
    icon: Brain,
    title: "Churn Risk Analysis",
    description: "142 high-value customers show declining engagement. Proactive retention campaign could save $85K in annual revenue.",
    impact: "Critical",
    confidence: 94,
    color: "text-red-600 bg-red-100"
  },
];

const AIInsights = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="flex gap-4 items-start">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
            <Brain className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">AI-Powered Business Intelligence</h3>
            <p className="text-sm text-white/90">
              Our AI analyzes your data patterns, identifies trends, and generates actionable insights 
              to help executive leadership make data-driven decisions.
            </p>
            <div className="flex gap-3 pt-2">
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
                <Brain className="w-3 h-3 mr-1" />
                6 Insights Generated
              </Badge>
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
                Updated 5 min ago
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((insight, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${insight.color} flex items-center justify-center`}>
                    <insight.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{insight.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge 
                        variant={insight.impact === "Critical" ? "destructive" : insight.impact === "High" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {insight.impact} Impact
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {insight.confidence}% Confidence
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {insight.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;
