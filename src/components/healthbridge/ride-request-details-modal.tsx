import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { RideRequest } from '@/lib/types';
import { ShieldAlert, Navigation } from 'lucide-react';
import { LocationEnhancer } from './location-enhancer';

export function RideRequestDetailsModal({ ride, onClose, onAccept }: { ride: RideRequest, onClose: () => void, onAccept: () => void }) {
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Ride Request Details</DialogTitle>
                    <DialogDescription>
                        Please review the details before accepting the ride.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold">User</span>
                        <span>{ride.userName}</span>
                    </div>
                     <div className="flex items-center justify-between">
                        <span className="font-semibold">Health Status</span>
                        <Badge variant="destructive" className="flex items-center gap-2">
                            <ShieldAlert className="h-4 w-4" /> URGENT
                        </Badge>
                    </div>
                     <div className="flex items-start justify-between">
                        <span className="font-semibold pt-1">Pickup Location</span>
                         <div className="text-right">
                            <p>{ride.userLocation}</p>
                            <span className="text-sm text-muted-foreground">(approx. 2 miles away)</span>
                         </div>
                    </div>
                    <LocationEnhancer initialLocation={ride.userLocation} />
                </div>
                <DialogFooter className="sm:justify-between gap-2">
                    <Button variant="ghost" onClick={onClose}>Decline</Button>
                    <div className="flex gap-2">
                        <Button variant="outline">
                           <Navigation className="mr-2 h-4 w-4" /> Navigate
                        </Button>
                        <Button variant="secondary" onClick={onAccept}>Accept Ride</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
