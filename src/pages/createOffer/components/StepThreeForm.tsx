"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useCreateOffer } from "../context/CreateOfferContext"

export const StepThreeForm = () => {
  const { formData, updateStepData, goPrev } = useCreateOffer()

  const [role, setRole] = useState(formData.stepThree.role)

  const handleSubmit = () => {
    const finalData = {
      ...formData,
      stepThree: {
        role,
      },
    }

    updateStepData("stepThree", {
      role,
    })

    console.log("Final Data:", finalData)
  }

  return (
    <div className="max-w-xl">
      <p className="text-sm text-muted-foreground">Step 3/3</p>

      <h1 className="mt-2 text-2xl font-semibold">Offer Template</h1>

      <div className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label>Role</Label>
          <Input
            placeholder="Enter role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={goPrev}>
          Prev
        </Button>

        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  )
}