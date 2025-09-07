"use client";

import { useState, useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Camera, Upload, Loader2 } from 'lucide-react';
import type { ScanResult } from '@/lib/types';
import { ScanResultCard } from './scan-result-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input';
import { analyzePatchAction } from '@/actions/analyze-patch';

const initialState = {
  message: '',
  result: undefined,
  errors: {},
};

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full mt-4">
      {pending ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...</> : children}
    </Button>
  );
}


export function ScanInterface({ onScanComplete }: { onScanComplete: (result: ScanResult) => void }) {
    const [state, formAction] = useActionState(analyzePatchAction, initialState);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [imageDataUri, setImageDataUri] = useState<string>('');
    const formRef = useRef<HTMLFormElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                const dataUri = loadEvent.target?.result as string;
                setImageDataUri(dataUri);
            };
            reader.readAsDataURL(file);
        }
    };
    
    useEffect(() => {
        if(imageDataUri) {
            formRef.current?.requestSubmit();
        }
    }, [imageDataUri]);

    useEffect(() => {
        if (state.result) {
            const result: ScanResult = {
                id: `scan-${Date.now()}`,
                timestamp: new Date(),
                status: state.result.status,
                details: state.result.details,
            };
            setScanResult(result);
        }
        // TODO: Handle errors from state.message
    }, [state]);
    
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
            <p className="text-muted-foreground mb-8">Position your patch for the camera or upload an image.</p>
            
            <form ref={formRef} action={formAction}>
                 <input type="hidden" name="imageDataUri" value={imageDataUri} />
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
                        <p className="text-center text-sm text-muted-foreground mt-4">Camera functionality is not yet implemented. Please use the upload option.</p>
                        <Button size="lg" className="w-full mt-4" disabled>
                            Capture
                        </Button>
                    </TabsContent>
                    <TabsContent value="upload">
                        <Label htmlFor="patch-upload" className="w-full aspect-square border-2 border-dashed border-muted-foreground/50 rounded-lg flex flex-col items-center justify-center relative overflow-hidden mt-4 bg-muted/20 cursor-pointer">
                            <Upload className="w-16 h-16 text-muted-foreground/40 mb-4" />
                            <p className="text-muted-foreground mb-2">Click to browse or drag & drop</p>
                            <Button variant="outline" type="button">
                                Browse Files
                            </Button>
                        </Label>
                        <Input 
                            id="patch-upload"
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                         <SubmitButton>
                             <Upload className="mr-2 h-5 w-5" /> Upload and Analyze
                         </SubmitButton>
                    </TabsContent>
                </Tabs>
            </form>
            
            <p className="text-xs text-muted-foreground mt-8">Note: Analysis is performed by an AI model.</p>
        </div>
    );
}
