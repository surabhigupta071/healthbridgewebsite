"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, AlertCircle, HeartPulse, ShieldCheck, Siren } from 'lucide-react';
import { ScanResultCard } from '@/components/healthbridge/scan-result-card';
import { RequestRideModal } from '@/components/healthbridge/request-ride-modal';
import { mockScanHistory } from '@/lib/mock-data';
import type { ScanResult } from '@/lib/types';
import { ScanInterface } from './scan-interface';
import { ScanHistoryChart } from './scan-history-chart';

export function UserDashboard() {
  // State hooks for controlling scan mode, ride request modal, ride status & scan history
  const [isScanning, setIsScanning] = useState(false);
  const [showRideRequest, setShowRideRequest] = useState(false);
  const [rideRequestStatus, setRideRequestStatus] = useState<'idle' | 'pending' | 'accepted'>('idle');
  const [scans, setScans] = useState<ScanResult[]>(mockScanHistory);

  // Example urgent scan to simulate critical status
  const urgentScan: ScanResult = { 
      id: 'urgent1', 
      timestamp: new Date(), 
      status: 'urgent', 
      details: 'Critical vitals detected. Please seek medical attention immediately.'
  };

  // Callback when scan completes: add new scan to beginning of list and end scanning state
  const handleScanComplete = (result: ScanResult) => {
    setScans(prevScans => [result, ...prevScans]);
    setIsScanning(false);
  };

  // Show scanning UI while scanning in progress
  if (isScanning) {
    return <ScanInterface onScanComplete={handleScanComplete} />;
  }
  
  // Latest and previous scan from history for UI logic
  const currentScan = scans[0];
  const previousScan = scans[1];

  // Detect consecutive warning if last two scans show monitor or urgent status
  const showConsecutiveWarning = 
    scans.length > 1 &&
    (currentScan.status === 'urgent' || currentScan.status === 'monitor') &&
    (previousScan.status === 'urgent' || previousScan.status === 'monitor');

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header with title and scan buttons */}
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

      {/* Grid layout with scan result card, warnings, and ride request UI */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Show latest scan result as main card */}
        <ScanResultCard scan={currentScan} isLatest={true} />
        
        {/* Show urgent action card if current scan indicates urgent issue and no ride requested */}
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
                        Your latest scan indicates a critical issue. We recommend requesting assistance.
                    </CardDescription>
                    <Button variant="destructive" size="lg" className="w-full mt-4" onClick={() => setShowRideRequest(true)}>
                        Request Assistance
                    </Button>
                </CardContent>
            </Card>
        )}
        
        {/* Show consecutive warning if repeated monitor/urgent scans detected */}
        {showConsecutiveWarning && (
            <Card className="col-span-1 md:col-span-2 lg:col-span-1 bg-amber-500/10 border-amber-500">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Siren className="h-8 w-8 text-amber-600" />
                        <CardTitle className="text-amber-700">Health Alert: Pattern Detected</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <CardDescription>
                        We have detected multiple consecutive scans with 'monitor' or 'urgent' status. This may indicate a persistent issue. We strongly recommend consulting a healthcare professional.
                    </CardDescription>
                </CardContent>
            </Card>
        )}

        {/* Show ride request status card if request is pending or accepted */}
        {rideRequestStatus !== 'idle' && (
            <Card className="col-span-1 md:col-span-2 lg:col-span-1">
                <CardHeader>
                    <CardTitle>Assistance Request Status</CardTitle>
                </CardHeader>
                <CardContent>
                    {rideRequestStatus === 'pending' && (
                        <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                            <p>Contacting assistance...</p>
                        </div>
                    )}
                    {rideRequestStatus === 'accepted' && (
                         <div className="space-y-4">
                            <div className="flex items-center gap-3 text-alert-green">
                                <ShieldCheck className="h-5 w-5" />
                                <p className="font-semibold">Help is on the way!</p>
                            </div>
                            <p>Emergency services have been notified.</p>
                            <p>Arriving in approximately <span className="font-semibold text-primary">5 minutes</span>.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        )}
        
        {/* Static health tips card */}
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

      {/* Section for scan history chart and past scan cards */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold tracking-tight mb-6">Scan History</h3>
        <Card>
          <CardHeader>
            <CardTitle>Health Status Over Time</CardTitle>
            <CardDescription>
              This chart shows the status of your scans over the past week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScanHistoryChart scans={scans} />
          </CardContent>
        </Card>
        <div className="mt-6 space-y-4">
            {scans.slice(1).map(scan => (
                <ScanResultCard key={scan.id} scan={scan} />
            ))}
        </div>
      </div>
      
      {/* Modal for

