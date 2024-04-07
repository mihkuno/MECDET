import React from 'react'
import ReactDOM from 'react-dom/client'

import { ChakraProvider } from '@chakra-ui/react'
import App from './App.jsx'

function Root() {
  return (
    <ChakraProvider>
        <App />
    </ChakraProvider>
  )
}


ReactDOM.createRoot(document.getElementById('root')).render(<Root />)


