import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export function RequestRideModal({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; }) {
    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="text-destructive" />
                        Confirm Emergency Ride Request
                    </DialogTitle>
                    <DialogDescription className="pt-4">
                        This will send a request to nearby volunteers for a ride to the nearest hospital. Are you sure you want to proceed?
                        <p className="font-medium text-foreground mt-2">~3 volunteers available nearby.</p>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button variant="destructive" onClick={onConfirm}>Send Request</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
