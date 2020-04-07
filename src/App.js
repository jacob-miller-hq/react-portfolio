import React from 'react';
import './App.scss';
import { Route, BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Route exact path="/" component={null} />
        <Route path="/contact" component={null} />
        <Route path="/resume" component={null} />
      </div>
    </BrowserRouter>
  );
}

export default App;
