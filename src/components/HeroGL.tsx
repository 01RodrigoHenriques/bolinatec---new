"use client"
import { useState } from "react"
import { GL } from "./gl/index"

export function HeroGL() {
  const [hovering, setHovering] = useState(false)
  return (
    <div
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <GL hovering={hovering} />
    </div>
  )
}
