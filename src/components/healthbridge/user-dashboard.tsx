"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, AlertCircle, HeartPulse, ShieldCheck, Zap } from 'lucide-react';
import { ScanResultCard } from '@/components/healthbridge/scan-result-card';
import { RequestRideModal } from '@/components/healthbridge/request-ride-modal';
import { mockScanHistory } from '@/lib/mock-data';
import type { ScanResult } from '@/lib/types';
import { ScanInterface } from './scan-interface';

export function UserDashboard() {
  const [isScanning, setIsScanning] = useState(false);
  const [showRideRequest, setShowRideRequest] = useState(false);
  const [rideReqStatus, setRideReqStatus] = useState<'idle' | 'pending' | 'accepted'>('idle');
  const [scans, setScans] = useState<ScanResult[]>(mockScanHistory);
  const [showConsecWarning, setShowConsecWarning] = useState(false);

  // urgent scan for sim
  const urgentScan: ScanResult = { 
    id: 'urgent1', 
    timestamp: new Date(), 
    status: 'urgent', 
    details: 'Critical vitals detected. Pls seek medical attention asap.'
  };

  // When scan done, add it up front
  const handleScanComplete = (res: ScanResult) => {
    setScans([res, ...scans]);
    setIsScanning(false);
  };

  // Check for consecutive risky scans - show warning
  useEffect(() => {
    if(scans.length < 2) {
      setShowConsecWarning(false);
      return;
    }
    const risky = (s:string) => s === 'urgent' || s === 'monitor';
    const last = scans[0].status;
    const secLast = scans[1].status;
    setShowConsecWarning(risky(last) && risky(secLast));
  }, [scans]);

  if(isScanning) return <ScanInterface onScanComplete={handleScanComplete} />;

  const currentScan = scans[0];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Dashboard</h2>
          <p className="text-muted-foreground">Your personal health overview.</p>
        </div>
        <div className="flex gap-2">
          <Button size="lg" onClick
