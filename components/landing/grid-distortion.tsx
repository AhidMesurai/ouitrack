'use client'

import { useEffect, useRef } from 'react'

export function GridDistortion() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let mouseX = 0
    let mouseY = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener('mousemove', handleMouseMove)

    const gridSize = 50
    const distortionRadius = 150
    const maxDistortion = 20

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Set grid color with opacity
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.1)'
      ctx.lineWidth = 1

      // Draw grid with distortion
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const dx = mouseX - x
          const dy = mouseY - y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          let offsetX = 0
          let offsetY = 0
          
          if (distance < distortionRadius) {
            const force = (1 - distance / distortionRadius) * maxDistortion
            offsetX = (dx / distance) * force
            offsetY = (dy / distance) * force
          }

          // Draw grid lines with distortion
          ctx.beginPath()
          ctx.moveTo(x + offsetX, y + offsetY)
          ctx.lineTo(x + gridSize + offsetX, y + offsetY)
          ctx.stroke()

          ctx.beginPath()
          ctx.moveTo(x + offsetX, y + offsetY)
          ctx.lineTo(x + offsetX, y + gridSize + offsetY)
          ctx.stroke()
        }
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}

