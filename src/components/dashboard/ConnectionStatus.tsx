import { Badge } from '@/components/ui/badge';
import { useConnectionTest } from '@/hooks/use-cast-data';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ConnectionStatus() {
  const { data, isLoading, error } = useConnectionTest();

  if (isLoading) {
    return <Badge variant="outline">Connecting...</Badge>;
  }
  // support both { data: boolean } and legacy { db: 1 }
  const isConnected = !!(data === true || data === 1 || data?.db === 1 || data?.data === true);

  if (error || !isConnected) {
    return (
      <Badge variant="destructive" className="flex items-center gap-2">
        <XCircle className="w-4 h-4" />
        Disconnected
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="flex items-center gap-2">
      <CheckCircle className="w-4 h-4" />
      Connected
    </Badge>
  );
}
