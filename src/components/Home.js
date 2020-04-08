import React from 'react'
import Fourier from './Fourier'

function Home() {
  return (
    <div id="Home">
      <Fourier />
      <div id="intro" className="col foreground">
        <h1>Hi, My Name's Jake</h1>
        <p>
          I started programming as a child, designing robots for the state fair, but my interests have shifted and now lie in user-focused data science and machine learning.
          <br /><br />
          I graduated December 2019 with a Bachelor of Science in Computer Science from the University of Illinois at Urbana-Champaign, Grainger School of Engineering. I've been a Software Development Engineer at Amazon since April.
          <br /><br />
          My dream is to work on machine learning systems in an effort to bring autonomous vehicles into the mainstream as the primary mode of transportation.
        </p>
      </div>
      <div id="proj-courses" className="col foreground">
        <h1>Projects and Courses</h1>
        <p>[WIP]</p>
      </div>
    </div>
  )
}

export default Home