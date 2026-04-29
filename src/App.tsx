import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './clients'
import { MyRouter } from './config/router/MyRouter'
import { TooltipProvider } from '@/components/ui/tooltip'

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider>
        <TooltipProvider>
          <RouterProvider router={MyRouter} />
        </TooltipProvider>
      </ThemeProvider>
    </Suspense>
  )
}

export default App