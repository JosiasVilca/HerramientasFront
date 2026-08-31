"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function TrackingSkeleton() {
  return (
    <div className="space-y-6 max-w-[1440px] mx-auto w-full animate-pulse">
      
      {/* Header Summary Skeleton */}
      <Card className="border-zinc-200/80 dark:border-zinc-800 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-36" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-36" />
          </div>
        </div>
      </Card>

      {/* Grid Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stepper Skeleton */}
          <Card className="p-6 space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="flex justify-between pt-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </Card>

          {/* Timeline Skeleton */}
          <Card className="p-6 space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="space-y-4 pt-2">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          </Card>
        </div>

        {/* Right Column Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Card className="p-6 space-y-4">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </Card>
        </div>

      </div>

    </div>
  );
}
