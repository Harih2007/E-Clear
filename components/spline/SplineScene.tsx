"use client"

import Spline from '@splinetool/react-spline'
import { Suspense } from 'react'

export function SplineScene({ scene, className }: { scene: string, className?: string }) {
    return (
        <div className={`w-full h-full ${className}`}>
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted-foreground animate-pulse">Loading 3D Scene...</div>}>
                <Spline scene={scene} />
            </Suspense>
        </div>
    )
}
