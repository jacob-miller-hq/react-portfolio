import React from 'react';
import './App.scss';
import { Route, BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'

function App() {
  const ROOT_PATH = "/react-portfolio"
  return (
    <BrowserRouter>
      <div id="App">
        <Navbar rootPath={ROOT_PATH} />
        <Route exact path={ROOT_PATH} component={Home} />
        <Route path={ROOT_PATH + "/contact"} component={null} />
        <Route path={ROOT_PATH + "/resume"} component={null} />
      </div>
    </BrowserRouter>
  );
}

export default App;
