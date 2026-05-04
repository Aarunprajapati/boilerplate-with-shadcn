"use client"

import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

export type TimelineStep = {
  title: string
  description?: string
}

type TimelineProps = {
  steps: TimelineStep[]
  currentStep: number
  onStepClick?: (stepIndex: number) => void
}

export const Timeline = ({
  steps,
  currentStep,
}: TimelineProps) => {
  return (
    <div className="w-64 border-r p-6">
      <h2 className="text-lg font-semibold">Create Offer</h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Fill the details step by step
      </p>

      <div className="mt-10 space-y-8">
        {steps.map((step, index) => {
          const isActive = currentStep === index
          const isCompleted = currentStep > index

          return (
            <button
              key={step.title}
              type="button"
            //   onClick={() => onStepClick?.(index)}
              className="flex w-full items-start gap-4 text-left mb-2!"
            >
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border",
                    isActive && "border-primary bg-primary",
                    isCompleted && "border-primary bg-primary",
                    !isActive && !isCompleted && "border-muted bg-muted"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3 w-3 text-white" />
                  ) : (
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        isActive ? "bg-white" : "bg-white"
                      )}
                    />
                  )}
                </div>

                {index !== steps.length - 1 && (
                  <div className="mt-2 h-16 w-px bg-border" />
                )}
              </div>

              <div>
                <p
                  className={cn(
                    "text-sm",
                    isActive
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>

                {step.description && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {step.description}
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}