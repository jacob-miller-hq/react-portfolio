import React from 'react'
import Fourier from './Fourier'
import Footer from './Footer'

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
          <br /><br />
        </p>
      </div>
      <div id="proj-courses" className="col foreground">
        <h1>Projects and Courses</h1>
        <div class="row container">
          {projectsAndCourses.map(proj =>
              <div className="col">
                <h2>{proj.title}</h2>
                <p>{proj.summary}</p>
              </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

const projectsAndCourses = [
  {
    title: 'Q-Learning',
    summary: 'Created a q-learning algorithm from scratch to play pong. Working on a similar project to simulate an efficient and safe traffic intersection.'
  },
  {
    title: 'Machine Learning',
    summary: 'Took applied and theoretical machine learning (CS446, CS498) and created several projects including convolutional GANs, autoencoders, and recurrent deep nets.'
  },
  {
    title: 'Real-Time Systems',
    summary: 'Took real-time systems (CS424): worked on multithread robots and learned about utilization and schedulability with mutix-locks and multi-core systems.'
  }
]

export default Home