"use client";

import { useApp } from '@/contexts/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { AvailabilitySlot } from '@/lib/types';

export function AvailabilityCalendar() {
  const { availability, toggleAvailability } = useApp();
  
  const days: AvailabilitySlot['day'][] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const times: AvailabilitySlot['time'][] = ['Morning', 'Afternoon', 'Evening'];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Your Availability</CardTitle>
        <CardDescription>Click to toggle available time slots for the week.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-1 text-center text-sm">
          <div>&nbsp;</div>
          {times.map(time => <div key={time} className="font-semibold">{time}</div>)}
          
          {days.map(day => (
            <>
              <div key={day} className="font-semibold self-center">{day}</div>
              {times.map(time => {
                const slot = { day, time };
                const isAvailable = availability.some(s => s.day === day && s.time === time);
                return (
                  <div 
                    key={`${day}-${time}`}
                    onClick={() => toggleAvailability(slot)}
                    className={cn(
                        "p-2 h-12 flex items-center justify-center rounded-md cursor-pointer transition-colors",
                        isAvailable ? "bg-secondary text-secondary-foreground" : "bg-muted/50 hover:bg-muted"
                    )}
                    role="button"
                    aria-pressed={isAvailable}
                  >
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
