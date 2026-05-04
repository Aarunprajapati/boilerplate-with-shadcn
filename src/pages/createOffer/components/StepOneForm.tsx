"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useCreateOffer } from "../context/CreateOfferContext"

export const StepOneForm = () => {
  const { formData, updateStepData, goNext } = useCreateOffer()

  const [userName, setUserName] = useState(formData.stepOne.userName)
  const [password, setPassword] = useState(formData.stepOne.password)

  const handleNext = () => {
    updateStepData("stepOne", {
      userName,
      password,
    })

    goNext()
  }

  return (
    <div className="max-w-xl">
      <p className="text-sm text-muted-foreground">Step 1/3</p>

      <h1 className="mt-2 text-2xl font-semibold">Candidate Information</h1>

      <div className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label>User Name</Label>
          <Input
            placeholder="Enter user name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Password</Label>
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  )
}