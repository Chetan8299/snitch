import React from 'react'
import { RouterProvider } from 'react-router'
import { appRoutes } from './app.routes'

const App = () => {
  return (
    <RouterProvider router={appRoutes} />
  )
}

export default App