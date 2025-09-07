import type { ScanResult } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

type HealthStatusConfig = {
    [key in ScanResult['status']]: {
        label: string;
        color: string;
        textColor: string;
    };
};

const statusConfig: HealthStatusConfig = {
    healthy: { label: 'Healthy', color: 'bg-alert-green', textColor: 'text-white' },
    monitor: { label: 'Monitor', color: 'bg-alert-amber', textColor: 'text-black' },
    urgent: { label: 'Urgent', color: 'bg-destructive', textColor: 'text-destructive-foreground' },
};


export function ScanResultCard({ scan, isLatest = false }: { scan: ScanResult; isLatest?: boolean; }) {
    const config = statusConfig[scan.status];

    return (
        <Card className={cn("flex flex-col", isLatest && "col-span-1 md:col-span-2 lg:col-span-1")}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>
                            {isLatest ? "Last Scan Result" : "Past Scan"}
                        </CardTitle>
                        <CardDescription>
                            {formatDistanceToNow(scan.timestamp, { addSuffix: true })}
                        </CardDescription>
                    </div>
                    <Badge className={cn('text-sm', config.color, config.textColor)}>
                        {config.label}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <p>{scan.details}</p>
            </CardContent>
            {isLatest && (
                <CardFooter>
                    <p className="text-xs text-muted-foreground">Offline results available. Sync for full history.</p>
                </CardFooter>
            )}
        </Card>
    );
}
