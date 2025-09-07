"use client";

import { useApp } from '@/contexts/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Map, Check, X } from 'lucide-react';
import { AvailabilityCalendar } from '@/components/healthbridge/availability-calendar';
import { useState } from 'react';
import { RideRequestDetailsModal } from './ride-request-details-modal';
import type { RideRequest } from '@/lib/types';
import Image from 'next/image';

export function VolunteerDashboard() {
  const { rideRequests, acceptRide } = useApp();
  const [selectedRide, setSelectedRide] = useState<RideRequest | null>(null);

  const handleAccept = (ride: RideRequest) => {
    setSelectedRide(ride);
  };

  const handleConfirmAccept = () => {
    if (selectedRide) {
      acceptRide(selectedRide.id);
      setSelectedRide(null);
      // Here you would typically navigate to a live-tracking screen
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Volunteer Dashboard</h2>
          <p className="text-muted-foreground">Manage your availability and help your community.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ride Requests */}
        <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-semibold">Active Ride Requests ({rideRequests.length})</h3>
            {rideRequests.length > 0 ? (
                rideRequests.map(request => (
                    <Card key={request.id} className="shadow-md">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>{request.userName}</CardTitle>
                                <div className="flex items-center gap-2 p-2 rounded-md bg-destructive text-destructive-foreground">
                                    <Bell className="h-4 w-4" />
                                    <span className="text-sm font-medium">URGENT</span>
                                </div>
                            </div>
                            <CardDescription className="flex items-center gap-2 pt-2">
                                <Map className="h-4 w-4" /> {request.userLocation}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                                <X className="mr-2 h-4 w-4" /> Decline
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => handleAccept(request)}>
                                <Check className="mr-2 h-4 w-4" /> Accept
                            </Button>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
                    <CardHeader>
                        <CardTitle>All Clear!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">There are no active ride requests in your area right now.</p>
                    </CardContent>
                </Card>
            )}
        </div>

        {/* Availability and Map */}
        <div className="space-y-8">
            <AvailabilityCalendar />
            <Card>
                <CardHeader>
                    <CardTitle>Requests Map</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="aspect-square w-full rounded-lg overflow-hidden">
                        <Image src="https://picsum.photos/400/400" alt="Map of requests" width={400} height={400} className="object-cover w-full h-full" data-ai-hint="map gps" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Map shows approximate locations of active requests.</p>
                </CardContent>
            </Card>
        </div>
      </div>

      {selectedRide && (
        <RideRequestDetailsModal
          ride={selectedRide}
          onClose={() => setSelectedRide(null)}
          onAccept={handleConfirmAccept}
        />
      )}
    </div>
  );
}
