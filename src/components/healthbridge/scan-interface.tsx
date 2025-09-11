"use client";

import { useState, useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import type { ScanResult } from '@/lib/types';
import { ScanResultCard } from './scan-result-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { analyzePatchAction } from '@/actions/analyze-patch';
import Image from 'next/image';

// initial state for the form/action
const initialState = {
  message: '',
  result: undefined,
  errors: {},
};

// btn that disables and show anim while pending
function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full mt-4">
      {pending ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...</> : children}
    </Button>
  );
}

export function ScanInterface({ onScanComplete }: { onScanComplete: (result: ScanResult) => void }) {
    // hook to handle react server actions w/ loading state
    const [state, formAction] = useActionState(analyzePatchAction, initialState);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [imageDataUri, setImageDataUri] = useState<string>('');
    const formRef = useRef<HTMLFormElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // handle when user selects a file
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

    // when AI model returns result, set local scan data
    useEffect(() => {
        if (state.result) {
            const result: ScanResult = {
                id: `scan-${Date.now()}`, // unique id w/ timestamp
                timestamp: new Date(),
                status: state.result.status,
                details: state.result.details,
            };
            setScanResult(result);
            setImageDataUri(''); // clear out img after processin
        }
        // TODO: Add errors handling for state.message at some point
    }, [state]);
    
    // if we got a scan res, show results page or else form
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

    // main form UI for upload or camera tabs (camera not ready yet)
    return (
        <div className="container mx-auto p-8 flex flex-col items-center">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Scan Your Patch</h2>
            <p className="text-muted-foreground mb-8">Position your patch for the camera or upload an image.</p>
            
            <form ref={formRef} action={formAction}>
                <input type="hidden" name="imageDataUri" value={imageDataUri} />
                <Tabs defaultValue="upload" className="w-full max-w-lg">
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
                        <p className="text-center text-sm text-muted-foreground mt-4">Camera func not yet impl. Use upload pls.</p>
                        <Button size="lg" className="w-full mt-4" disabled>
                            Capture
                        </Button>
                    </TabsContent>
                    <TabsContent value="upload">
                         <div className="mt-4">
                            <Label 
                                htmlFor="patch-upload" 
                                className="w-full aspect-square border-2 border-dashed border-muted-foreground/50 rounded-lg flex flex-col items-center justify-center relative overflow-hidden bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors"
                            >
                                {imageDataUri ? (
                                    <Image src={imageDataUri} alt="Selected patch" fill className="object-cover" />
                                ) : (
                                    <div className="text-center">
                                        <Upload className="w-16 h-16 text-muted-foreground/40 mb-4 mx-auto" />
                                        <p className="text-muted-foreground mb-2">Click to browse or drag & drop</p>
                                        <Button variant="outline" type="button">
                                            Browse Files
                                        </Button>
                                    </div>
                                )}
                            </Label>
                            <Input 
                                id="patch-upload"
                                ref={fileInputRef}
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                         <SubmitButton>
                             <Upload className="mr-2 h-5 w-5" /> Upload and Analyze
                         </SubmitButton>
                    </TabsContent>
                </Tabs>
            </form>
            
            <p className="text-xs text-muted-foreground mt-8">Note: Analysis is performed by AI model.</p>
        </div>
    );
}
