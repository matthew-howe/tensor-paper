import React from 'react'
import Tensor from './components/Tensor'
import {Link, Route} from 'react-router-dom'

const App = () => {
  return (
    <div>
      <Route exact path="/" component={Tensor} />
    </div>
  )
}

export default App
