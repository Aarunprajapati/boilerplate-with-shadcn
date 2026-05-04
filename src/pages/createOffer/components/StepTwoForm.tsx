"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useCreateOffer } from "../context/CreateOfferContext"

export const StepTwoForm = () => {
  const { formData, updateStepData, goNext, goPrev } = useCreateOffer()

  const [email, setEmail] = useState(formData.stepTwo.email)

  const handleNext = () => {
    updateStepData("stepTwo", {
      email,
    })

    goNext()
  }

  return (
    <div className="max-w-xl">
      <p className="text-sm text-muted-foreground">Step 2/3</p>

      <h1 className="mt-2 text-2xl font-semibold">Offer Details</h1>

      <div className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={goPrev}>
          Prev
        </Button>

        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  )
}