"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, AlertCircle, HeartPulse, ShieldCheck } from 'lucide-react';
import { ScanResultCard } from '@/components/healthbridge/scan-result-card';
import { RequestRideModal } from '@/components/healthbridge/request-ride-modal';
import { mockScanHistory } from '@/lib/mock-data';
import type { ScanResult } from '@/lib/types';
import { ScanInterface } from './scan-interface';

export function UserDashboard() {
  const [isScanning, setIsScanning] = useState(false);
  const [showRideRequest, setShowRideRequest] = useState(false);
  const [rideRequestStatus, setRideRequestStatus] = useState<'idle' | 'pending' | 'accepted'>('idle');
  const [scans, setScans] = useState<ScanResult[]>(mockScanHistory);

  const urgentScan: ScanResult = { 
      id: 'urgent1', 
      timestamp: new Date(), 
      status: 'urgent', 
      details: 'Critical vitals detected. Please seek medical attention immediately.'
  };

  const handleScanComplete = (result: ScanResult) => {
    setScans(prevScans => [result, ...prevScans]);
    setIsScanning(false);
  };

  if (isScanning) {
    return <ScanInterface onScanComplete={handleScanComplete} />;
  }
  
  const currentScan = scans[0];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Dashboard</h2>
          <p className="text-muted-foreground">Your personal health overview.</p>
        </div>
        <div className="flex gap-2">
            <Button size="lg" onClick={() => setIsScanning(true)}>
                <Camera className="mr-2 h-5 w-5" />
                Scan Your Patch
            </Button>
             <Button size="lg" variant="outline" onClick={() => handleScanComplete(urgentScan)}>
                Simulate Urgent Scan
            </Button>
        </div>

      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <ScanResultCard scan={currentScan} isLatest={true} />
        
        {currentScan.status === 'urgent' && rideRequestStatus === 'idle' && (
            <Card className="col-span-1 md:col-span-2 lg:col-span-1 bg-destructive/10 border-destructive">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                        <CardTitle className="text-destructive">Urgent Action Required</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <CardDescription>
                        Your latest scan indicates a critical issue. We recommend requesting a volunteer ride to the nearest hospital.
                    </CardDescription>
                    <Button variant="destructive" size="lg" className="w-full mt-4" onClick={() => setShowRideRequest(true)}>
                        Request Volunteer Ride
                    </Button>
                </CardContent>
            </Card>
        )}
        
        {rideRequestStatus !== 'idle' && (
            <Card className="col-span-1 md:col-span-2 lg:col-span-1">
                <CardHeader>
                    <CardTitle>Ride Request Status</CardTitle>
                </CardHeader>
                <CardContent>
                    {rideRequestStatus === 'pending' && (
                        <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                            <p>Searching for nearby volunteers...</p>
                        </div>
                    )}
                    {rideRequestStatus === 'accepted' && (
                         <div className="space-y-4">
                            <div className="flex items-center gap-3 text-alert-green">
                                <ShieldCheck className="h-5 w-5" />
                                <p className="font-semibold">Volunteer assigned!</p>
                            </div>
                            <p><span className="font-semibold">Sarah C.</span> is on their way.</p>
                            <p>Arriving in approximately <span className="font-semibold text-primary">5 minutes</span>.</p>
                             <div className="aspect-video w-full rounded-lg overflow-hidden mt-4">
                                <Image src="https://picsum.photos/600/400" alt="Map" width={600} height={400} className="object-cover w-full h-full" data-ai-hint="map satellite" />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        )}
        
        <Card>
            <CardHeader>
                <CardTitle>Health Tips</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3"><HeartPulse className="h-4 w-4 mt-1 shrink-0 text-primary" /><span>Stay hydrated throughout the day.</span></li>
                    <li className="flex items-start gap-3"><HeartPulse className="h-4 w-4 mt-1 shrink-0 text-primary" /><span>Ensure you get 7-8 hours of sleep per night.</span></li>
                </ul>
            </CardContent>
        </Card>
      </div>
      
      <RequestRideModal 
        isOpen={showRideRequest}
        onClose={() => setShowRideRequest(false)}
        onConfirm={() => {
            setShowRideRequest(false);
            setRideRequestStatus('pending');
            // Simulate finding a volunteer
            setTimeout(() => setRideRequestStatus('accepted'), 3000);
        }}
      />
    </div>
  );
}
