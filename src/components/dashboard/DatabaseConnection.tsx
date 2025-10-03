import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Database, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useConnectionTest } from "@/hooks/use-cast-data";
import { getDatabaseConfig } from "../../../config/app.config";

const DatabaseConnection = () => {
  const { toast } = useToast();
  const { data: connectionStatus, isLoading, error, refetch } = useConnectionTest();

  // Read config from centralized configuration
  const config = getDatabaseConfig();

  const handleTestConnection = async () => {
    await refetch();
    if (connectionStatus) {
      toast({
        title: "Connection Successful",
        description: "Successfully connected to CAST DataMart database.",
      });
    } else if (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to the database. Please check your configuration.",
        variant: "destructive",
      });
    }
  };

  const connectionStatusIcon = () => {
    if (isLoading) return <Database className="w-5 h-5 animate-pulse" />;
    if (error || !connectionStatus) return <AlertTriangle className="w-5 h-5 text-destructive" />;
    return <CheckCircle className="w-5 h-5 text-green-600" />;
  };

  const connectionStatusText = () => {
    if (isLoading) return "Testing connection...";
    if (error || !connectionStatus) return "Connection failed";
    return "Connected to CAST DataMart";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">CAST DataMart Configuration</h3>
            <p className="text-sm text-muted-foreground">
              Configure the connection to your CAST AIP DataMart PostgreSQL database. 
              This will enable real-time analysis of your application portfolio quality metrics.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          {connectionStatusIcon()}
          <div>
            <p className="font-medium">{connectionStatusText()}</p>
            {error && (
              <p className="text-sm text-muted-foreground">{error.message}</p>
            )}
          </div>
          <Button 
            onClick={handleTestConnection} 
            variant="outline" 
            size="sm" 
            className="ml-auto"
            disabled={isLoading}
          >
            Test Connection
          </Button>
        </div>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Configuration Note:</strong> Update your <code>.env</code> file with your CAST DataMart 
          PostgreSQL connection details. The database should contain the standard CAST AIP DataMart schema.
        </AlertDescription>
      </Alert>

      <Card className="p-6">
        <div className="space-y-4">
          <h4 className="font-semibold">Current Configuration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="host">Database Host</Label>
              <Input
                id="host"
                value={config.host}
                placeholder="localhost or server IP"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                value={config.port.toString()}
                placeholder="2284"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="database">Database Name</Label>
              <Input
                id="database"
                value={config.name}
                placeholder="cast_datamart"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={config.user}
                placeholder="Database user"
                disabled
              />
            </div>
          </div>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Security:</strong> Database credentials are read from environment variables. 
              Update your <code>.env</code> file to change these settings.
            </AlertDescription>
          </Alert>
        </div>
      </Card>
    </div>
  );
};

export default DatabaseConnection;
