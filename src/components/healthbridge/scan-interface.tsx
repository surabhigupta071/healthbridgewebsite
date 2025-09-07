"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Camera } from 'lucide-react';
import type { ScanResult } from '@/lib/types';
import { ScanResultCard } from './scan-result-card';

export function ScanInterface({ onScanComplete }: { onScanComplete: (result: ScanResult) => void }) {
    const [isCapturing, setIsCapturing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isCapturing) {
            timer = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(timer);
                        // Simulate getting a random result
                        const statuses: ScanResult['status'][] = ['healthy', 'monitor', 'urgent'];
                        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                        const result: ScanResult = {
                            id: `scan-${Date.now()}`,
                            timestamp: new Date(),
                            status: randomStatus,
                            details: `This is a simulated result for a '${randomStatus}' status. Contact a health professional for a real diagnosis.`,
                        };
                        setScanResult(result);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 200);
        }
        return () => clearInterval(timer);
    }, [isCapturing]);
    
    if (scanResult) {
        return (
            <div className="container mx-auto p-8 flex flex-col items-center">
                <h2 className="text-3xl font-bold tracking-tight mb-8">Scan Complete</h2>
                <div className="w-full max-w-md">
                    <ScanResultCard scan={scanResult} isLatest={true} />
                    <Button className="w-full mt-8" onClick={() => onScanComplete(scanResult)}>
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8 flex flex-col items-center">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Scan Your Patch</h2>
            <p className="text-muted-foreground mb-8">Position your patch inside the frame and tap Capture.</p>
            
            <div className="w-full max-w-lg aspect-square bg-black rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-8 border-2 border-dashed border-white/50 rounded-md"></div>
                <Camera className="w-24 h-24 text-white/20" />
            </div>

            {isCapturing ? (
                <div className="w-full max-w-lg mt-8">
                     <Progress value={progress} className="w-full" />
                     <p className="text-center mt-2 text-muted-foreground">Analyzing...</p>
                </div>
            ) : (
                <Button size="lg" className="mt-8" onClick={() => setIsCapturing(true)}>
                    Capture
                </Button>
            )}
            
            <p className="text-xs text-muted-foreground mt-8">Note: The scanning process works offline.</p>
        </div>
    );
}
