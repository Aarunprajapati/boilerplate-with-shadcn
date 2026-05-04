"use client"

import { StepOneForm } from "./components/StepOneForm"
import { StepThreeForm } from "./components/StepThreeForm"
import { StepTwoForm } from "./components/StepTwoForm"
import { Timeline, type TimelineStep } from "./components/Timeline"
import { CreateOfferProvider, useCreateOffer } from "./context/CreateOfferContext"



const timelineSteps: TimelineStep[] = [
  {
    title: "Candidate Information",
    description: "Basic candidate details",
  },
  {
    title: "Offer Details",
    description: "Offer related details",
  },
  {
    title: "Offer Template",
    description: "Select offer template",
  },
]

const CreateOfferContent = () => {
  const { currentStep, formData } = useCreateOffer()


  console.log(formData)

  return (
    <div className="flex min-h-screen">
      <Timeline
        steps={timelineSteps}
        currentStep={currentStep}
      />

      <main className="flex-1 p-10">
        {currentStep === 0 && <StepOneForm />}
        {currentStep === 1 && <StepTwoForm />}
        {currentStep === 2 && <StepThreeForm />}
      </main>
    </div>
  )
}

const CreateOfferPage = () => {
  return (
    <CreateOfferProvider>
      <CreateOfferContent />
    </CreateOfferProvider>
  )
}

export default CreateOfferPage