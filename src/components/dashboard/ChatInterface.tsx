import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Bot, User } from "lucide-react";

const sampleQuestions = [
  "What are our top performing products?",
  "Show revenue trends for last quarter",
  "Which customers are at risk of churning?",
  "Analyze inventory levels by category",
];

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI Business Intelligence assistant. I can analyze your data and answer questions in natural language. Try asking me about revenue, customers, or trends!"
    }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: "user", content: input }]);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "This is a demo interface. In production, this would connect to the AI analysis engine to process your query and provide insights based on your actual database. The AI would understand natural language queries and generate SQL, analyze patterns, and present findings with visualizations."
      }]);
    }, 1000);
    
    setInput("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <div className="flex gap-4 items-start">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold">Natural Language Query Interface</h3>
              <p className="text-sm text-muted-foreground">
                Ask questions about your business data in plain English. The AI will analyze your database and provide insights.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {sampleQuestions.map((question, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary/10 hover:border-primary"
                  onClick={() => setInput(question)}
                >
                  {question}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Messages */}
          <div className="space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Ask a question about your data..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1"
            />
            <Button onClick={handleSend} className="gap-2">
              <Send className="w-4 h-4" />
              Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatInterface;
