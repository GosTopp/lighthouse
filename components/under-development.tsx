import React from "react"

interface UnderDevelopmentProps {
  pageName: string
}

export function UnderDevelopment({ pageName }: UnderDevelopmentProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4 p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold">{pageName}</h1>
        <p className="text-muted-foreground">
          This page is currently under development. Please check back later.
        </p>
      </div>
    </div>
  )
} 