import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { TriangleAlertIcon } from 'lucide-react';

export function PermissionDenied() {
  return (
    <Alert>
      <TriangleAlertIcon className="h-4 w-4 mr-2" />
      <AlertTitle>Permissions Denied</AlertTitle>
      <AlertDescription>Contact admin to gain access to this content.</AlertDescription>
    </Alert>
  );
}
