import React, { useState, useEffect, useRef } from 'react'
import data from './../signature.json'

function Fourier() {
  const [hasMounted, setHasMounted] = useState(false)
  const canvas = useRef(null)
  useEffect(() => {
    if (!hasMounted) {
      const points = pointsFromData()
      new Cycles(canvas.current, points)

      setHasMounted(true)
    }
  }, [hasMounted])

  return (
    <div className="Fourier col">
      <canvas ref={canvas} />
    </div>
  )
}

const TARGET_RATIO = 2
const MILLISEC_PER_CYCLE = 10000
const STEPS_PER_CYCLE = 2880

class Cycles {
  constructor(canvas, points) {
    this.cvs = canvas
    this.points = points
    this.trace = []
    this.ctx = this.cvs.getContext('2d')
    
    window.addEventListener('resize', this.handleResize)
    this.handleResize()

    window.requestAnimationFrame(this.animLoop)
  }

  boundPoints() {
    // centers bounding rectangle at (w/2, h/2) and scales it to match shorter axis
    let minX = this.points.reduce((min, p) => Math.min(p.x, min), this.points[0].x)
    let maxX = this.points.reduce((max, p) => Math.max(p.x, max), this.points[0].x)
    let minY = this.points.reduce((min, p) => Math.min(p.y, min), this.points[0].y)
    let maxY = this.points.reduce((max, p) => Math.max(p.y, max), this.points[0].y)
    console.log('boundPoints:', minX, minY, maxX, maxY)
    let boundW = maxX - minX
    let boundH = maxY - minY
    let wFactor = this.cvs.width / boundW
    let hFactor = this.cvs.height / boundH
    
    let dx = -minX - (boundW / 2)
    let dy = -minY - (boundH / 2)
    let scaleFactor = 0.95 * Math.min(wFactor, hFactor)
    this.points = translate(this.points, dx, dy)
    this.points = scale(this.points, scaleFactor)
    return {dx, dy, scaleFactor}
  }

  drawPoints(c = '#ffffff', s = 1) {
    let drawPoints = translate(this.points, this.cvs.width/2, this.cvs.height/2)
    drawPoints.forEach(p => {
      this.ctx.fillStyle = c
      this.ctx.fillRect(p.x, p.y, s, s)
    })
  }

  handleResize = () => {
    this.resizeCanvas()

    let transform = this.boundPoints()
    // scale trace to fit as well
    this.trace = translate(this.trace, transform.dx, transform.dy)
    this.trace = scale(this.trace, transform.scaleFactor)

    this.generateEpicycles()
  }

  resizeCanvas() {
    console.log(this.cvs)
    this.cvs.width = this.cvs.getBoundingClientRect().width
    this.cvs.height = this.cvs.width / TARGET_RATIO
    // console.log('resizeCanvas:', this.cvs.width, this.cvs.height)
  }

  generateEpicycles() {
    let deg = Math.floor(this.points.length / 4)
    this.generateComplex(deg)
    // this.complex = [{r: 0, i: 10}, {r: -10, i: -10}, {r: 20, i: 0}]
    this.generateCircles()
    console.log(this.circles)
    this.circles.sort((c1, c2) => {
      if (c1.speed === 0) return -1
      if (c2.speed === 0) return 1
      let speedDiff = Math.abs(c1.speed) - Math.abs(c2.speed)
      return speedDiff === 0 ? c2.radius - c1.radius : speedDiff
    })
  }

  generateComplex(deg) {
    this.complex = []
    for(let n = -deg; n <= deg; n++) {
      let real = 0;
      let imag = 0;
      let numPoints = this.points.length
      this.points.forEach((p, k) => {
        let angle = 2*Math.PI / numPoints * k * n
        real += p.x * Math.cos(angle) - p.y * Math.sin(angle)
        imag -= p.x * Math.sin(angle) + p.y * Math.cos(angle) 
      })
      this.complex.push({r: real/numPoints, i: imag/numPoints})
    }
  }

  generateCircles() {
    this.circles = this.complex.map((c, i) => {
      return {
        radius: magnitude(c.r, c.i),
        speed: i - Math.floor(this.complex.length/2),
        offset: Math.atan2(c.i, c.r)
      }
    })
  }

  animLoop = (timestamp) => {
    // TODO: move the calculation of this into a worker for them
    //                  * Z M O O T H   C U R V E Z *
    if (!this.start) {
      this.start = timestamp
      this.step = -1
      this.tracing = true
    }
    this.elapsed = timestamp - this.start
    while(this.step / STEPS_PER_CYCLE < this.elapsed / MILLISEC_PER_CYCLE) {
      this.step++
      let x = 0
      let y = 0
      this.circles.forEach(circle => {
        circle.x = x
        circle.y = y
        let angle = (this.step/STEPS_PER_CYCLE) * (2*Math.PI) * circle.speed + circle.offset
        x += circle.radius * Math.cos(angle)
        y -= circle.radius * Math.sin(angle)
      })
      if (this.tracing) {
        this.trace.push({x, y})
      }
      if (this.step === STEPS_PER_CYCLE) {
        this.tracing = false
      }
    }

    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height)

    // draw trace shadow
    let drawTraceShadow = translate(this.trace, this.cvs.width/2 + 2, this.cvs.height/2 + 4)
    this.ctx.lineCap = 'round'
    this.ctx.strokeStyle = "#06276f"
    drawTraceShadow.slice(1).forEach((point, i) => {
      this.ctx.beginPath()
      let lastX = drawTraceShadow[i].x
      let lastY = drawTraceShadow[i].y
      this.ctx.moveTo(lastX, lastY)
      this.ctx.lineTo(point.x, point.y)
      let len = 0.2*magnitude(point.x - lastX, point.y - lastY) + 0.8*Math.abs(point.y - lastY)
      this.ctx.lineWidth = Math.max(0, (6 - 1.2*Math.log(len)) * this.cvs.width / 1000)
      this.ctx.stroke()
    })
    // draw trace
    let drawTrace = translate(this.trace, this.cvs.width/2, this.cvs.height/2)
    this.ctx.lineCap = 'round'
    this.ctx.strokeStyle = "#3455aa"
    drawTrace.slice(1).forEach((point, i) => {
      this.ctx.beginPath()
      let lastX = drawTrace[i].x
      let lastY = drawTrace[i].y
      this.ctx.moveTo(lastX, lastY)
      this.ctx.lineTo(point.x, point.y)
      let len = 0.2*magnitude(point.x - lastX, point.y - lastY) + 0.8*Math.abs(point.y - lastY)
      this.ctx.lineWidth = Math.max(0, (6 - 1.2*Math.log(len)) * this.cvs.width / 1000)
      this.ctx.stroke()
    })

    // draw circles
    let drawCircles = translate(this.circles, this.cvs.width/2, this.cvs.height/2)
    drawCircles.forEach((circle, i) => {
      this.ctx.beginPath()
      this.ctx.arc(circle.x, circle.y, Math.abs(this.circles[i].radius), 0, 2*Math.PI)
      this.ctx.fillStyle = '#ffffff07'
      this.ctx.fill()
    })

    // draw arms
    this.ctx.beginPath()
    this.ctx.moveTo(drawCircles[0].x, drawCircles[0].y)
    drawCircles.forEach(circle => {
      this.ctx.lineTo(circle.x, circle.y)
    })
    let lastPoint = drawTrace[this.step % STEPS_PER_CYCLE]
    this.ctx.lineTo(lastPoint.x, lastPoint.y)
    this.ctx.lineWidth = 2;
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = "#dfdfdfaa";
    this.ctx.stroke();

    // this.drawPoints()

    window.requestAnimationFrame(this.animLoop)
  }
}

function translate(points, dx, dy) {
  return points.map(p => { return {x: p.x + dx, y: p.y + dy} })
}

function scale(points, factor) {
  return points.map(p => { return {x: factor*p.x, y: factor*p.y}})
}

function magnitude(x, y) {
  return Math.sqrt(x*x + y*y)
}

function pointsFromData() {
  let copy = data.slice()
  let points = []
  while(copy.length) points.push(copy.splice(0, 2))
  return points.map(p => {
    const [x, y] = p
    return {x, y}
  })
}

export default Fourier