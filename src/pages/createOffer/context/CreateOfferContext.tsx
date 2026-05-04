/* eslint-disable react-refresh/only-export-components */
"use client"

import React, { createContext, useContext, useState } from "react"

export type CreateOfferFormData = {
  stepOne: {
    userName: string
    password: string
  }
  stepTwo: {
    email: string
  }
  stepThree: {
    role: string
  }
}

type CreateOfferContextType = {
  currentStep: number
  formData: CreateOfferFormData
  goNext: () => void
  goPrev: () => void
  goToStep: (step: number) => void
  updateStepData: <K extends keyof CreateOfferFormData>(
    stepKey: K,
    data: Partial<CreateOfferFormData[K]>
  ) => void
}

const CreateOfferContext = createContext<CreateOfferContextType | null>(null)

const initialFormData: CreateOfferFormData = {
  stepOne: {
    userName: "",
    password: "",
  },
  stepTwo: {
    email: "",
  },
  stepThree: {
    role: "",
  },
}

export const CreateOfferProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] =
    useState<CreateOfferFormData>(initialFormData)

  const goNext = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const goPrev = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const goToStep = (step: number) => {
    setCurrentStep(step)
  }

  const updateStepData = <K extends keyof CreateOfferFormData>(
    stepKey: K,
    data: Partial<CreateOfferFormData[K]>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        ...data,
      },
    }))
  }

  return (
    <CreateOfferContext.Provider
      value={{
        currentStep,
        formData,
        goNext,
        goPrev,
        goToStep,
        updateStepData,
      }}
    >
      {children}
    </CreateOfferContext.Provider>
  )
}

export const useCreateOffer = () => {
  const context = useContext(CreateOfferContext)

  if (!context) {
    throw new Error("useCreateOffer must be used inside CreateOfferProvider")
  }

  return context
}