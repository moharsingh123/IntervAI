import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'  // it helps to navigate and create the route in the react app
import store from './redux/store.js'
import {Provider} from 'react-redux'  // it helps to connect the react app with the redux store

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider> 
    </BrowserRouter>
    
  </StrictMode>,
)
