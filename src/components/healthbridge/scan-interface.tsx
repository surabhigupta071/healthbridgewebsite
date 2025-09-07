"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Camera, Upload } from 'lucide-react';
import type { ScanResult } from '@/lib/types';
import { ScanResultCard } from './scan-result-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


export function ScanInterface({ onScanComplete }: { onScanComplete: (result: ScanResult) => void }) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const startAnalysis = () => {
        setIsAnalyzing(true);
        setProgress(0);
    }
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            // We could process the file here, e.g., show a preview.
            // For now, we just start the analysis simulation.
            startAnalysis();
        }
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isAnalyzing) {
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
    }, [isAnalyzing]);
    
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

    if (isAnalyzing) {
        return (
             <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh]">
                 <div className="w-full max-w-lg mt-8">
                     <Progress value={progress} className="w-full" />
                     <p className="text-center mt-4 text-lg text-muted-foreground">Analyzing your patch...</p>
                </div>
            </div>
        );
    }


    return (
        <div className="container mx-auto p-8 flex flex-col items-center">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Scan Your Patch</h2>
            <p className="text-muted-foreground mb-8">Position your patch for the camera or upload an image.</p>
            
            <Tabs defaultValue="camera" className="w-full max-w-lg">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="camera">
                        <Camera className="mr-2 h-4 w-4"/>
                        Scan with Camera
                    </TabsTrigger>
                    <TabsTrigger value="upload">
                        <Upload className="mr-2 h-4 w-4"/>
                        Upload Image
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="camera">
                     <div className="w-full aspect-square bg-black rounded-lg flex items-center justify-center relative overflow-hidden mt-4">
                        <div className="absolute inset-8 border-2 border-dashed border-white/50 rounded-md"></div>
                        <Camera className="w-24 h-24 text-white/20" />
                    </div>
                    <Button size="lg" className="w-full mt-4" onClick={startAnalysis}>
                        Capture
                    </Button>
                </TabsContent>
                <TabsContent value="upload">
                    <div className="w-full aspect-square border-2 border-dashed border-muted-foreground/50 rounded-lg flex flex-col items-center justify-center relative overflow-hidden mt-4 bg-muted/20">
                        <Upload className="w-16 h-16 text-muted-foreground/40 mb-4" />
                        <p className="text-muted-foreground mb-2">Drag & drop an image or</p>
                         <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                            Browse Files
                        </Button>
                        <Input 
                            ref={fileInputRef}
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                </TabsContent>
            </Tabs>
            
            <p className="text-xs text-muted-foreground mt-8">Note: The scanning process works offline.</p>
        </div>
    );
}
