export interface Vector2D {
  x: number
  y: number
}

export interface Boid {
  position: Vector2D
  velocity: Vector2D
  acceleration: Vector2D
  maxSpeed: number
  maxForce: number
  bounds: { width: number; height: number }
  wanderAngle: number
}

export function createBoid(x: number, y: number, boundsWidth: number, boundsHeight: number): Boid {
  return {
    position: { x, y },
    velocity: {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
    },
    acceleration: { x: 0, y: 0 },
    maxSpeed: 1.5 + Math.random() * 0.5,
    maxForce: 0.03,
    bounds: { width: boundsWidth, height: boundsHeight },
    wanderAngle: Math.random() * Math.PI * 2,
  }
}

function addVectors(a: Vector2D, b: Vector2D): Vector2D {
  return { x: a.x + b.x, y: a.y + b.y }
}

function subtractVectors(a: Vector2D, b: Vector2D): Vector2D {
  return { x: a.x - b.x, y: a.y - b.y }
}

function multiplyVector(v: Vector2D, scalar: number): Vector2D {
  return { x: v.x * scalar, y: v.y * scalar }
}

function magnitude(v: Vector2D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y)
}

function normalize(v: Vector2D): Vector2D {
  const mag = magnitude(v)
  return mag > 0 ? { x: v.x / mag, y: v.y / mag } : { x: 0, y: 0 }
}

function limit(v: Vector2D, max: number): Vector2D {
  const mag = magnitude(v)
  return mag > max ? multiplyVector(normalize(v), max) : v
}

function distance(a: Vector2D, b: Vector2D): number {
  const diff = subtractVectors(a, b)
  return magnitude(diff)
}

// Separation: steer to avoid crowding local flockmates
function separate(boid: Boid, boids: Boid[], desiredSeparation = 25): Vector2D {
  let steer = { x: 0, y: 0 }
  let count = 0

  for (const other of boids) {
    const d = distance(boid.position, other.position)
    if (d > 0 && d < desiredSeparation) {
      const diff = subtractVectors(boid.position, other.position)
      const normalized = normalize(diff)
      const weighted = multiplyVector(normalized, 1 / d) // Weight by distance
      steer = addVectors(steer, weighted)
      count++
    }
  }

  if (count > 0) {
    steer = multiplyVector(steer, 1 / count)
    steer = normalize(steer)
    steer = multiplyVector(steer, boid.maxSpeed)
    steer = subtractVectors(steer, boid.velocity)
    steer = limit(steer, boid.maxForce)
  }

  return steer
}

// Alignment: steer towards the average heading of neighbors
function align(boid: Boid, boids: Boid[], neighborDist = 50): Vector2D {
  let sum = { x: 0, y: 0 }
  let count = 0

  for (const other of boids) {
    const d = distance(boid.position, other.position)
    if (d > 0 && d < neighborDist) {
      sum = addVectors(sum, other.velocity)
      count++
    }
  }

  if (count > 0) {
    sum = multiplyVector(sum, 1 / count)
    sum = normalize(sum)
    sum = multiplyVector(sum, boid.maxSpeed)
    const steer = subtractVectors(sum, boid.velocity)
    return limit(steer, boid.maxForce)
  }

  return { x: 0, y: 0 }
}

// Cohesion: steer to move toward the average position of local flockmates
function cohesion(boid: Boid, boids: Boid[], neighborDist = 50): Vector2D {
  let sum = { x: 0, y: 0 }
  let count = 0

  for (const other of boids) {
    const d = distance(boid.position, other.position)
    if (d > 0 && d < neighborDist) {
      sum = addVectors(sum, other.position)
      count++
    }
  }

  if (count > 0) {
    sum = multiplyVector(sum, 1 / count)
    return seek(boid, sum)
  }

  return { x: 0, y: 0 }
}

// Seek: steer towards a target
function seek(boid: Boid, target: Vector2D): Vector2D {
  const desired = subtractVectors(target, boid.position)
  const normalizedDesired = normalize(desired)
  const scaledDesired = multiplyVector(normalizedDesired, boid.maxSpeed)
  const steer = subtractVectors(scaledDesired, boid.velocity)
  return limit(steer, boid.maxForce)
}

// Wander: random steering
function wander(boid: Boid): Vector2D {
  const wanderRadius = 25
  const wanderDistance = 80
  const change = 0.3

  boid.wanderAngle += Math.random() * change - change * 0.5

  const circlePos = normalize(boid.velocity)
  circlePos.x *= wanderDistance
  circlePos.y *= wanderDistance
  circlePos.x += boid.position.x
  circlePos.y += boid.position.y

  const target = {
    x: circlePos.x + wanderRadius * Math.cos(boid.wanderAngle),
    y: circlePos.y + wanderRadius * Math.sin(boid.wanderAngle),
  }

  return seek(boid, target)
}

// Boundary wrapping
function wrap(boid: Boid): void {
  if (boid.position.x < -10) boid.position.x = boid.bounds.width + 10
  if (boid.position.y < -10) boid.position.y = boid.bounds.height + 10
  if (boid.position.x > boid.bounds.width + 10) boid.position.x = -10
  if (boid.position.y > boid.bounds.height + 10) boid.position.y = -10
}

export function updateBoid(
  boid: Boid,
  boids: Boid[],
  mouse: Vector2D,
  influenceRadius: number,
  speedMultiplier = 1.0,
): void {
  // Reset acceleration
  boid.acceleration = { x: 0, y: 0 }

  // Calculate forces
  const sep = separate(boid, boids)
  const ali = align(boid, boids)
  const coh = cohesion(boid, boids)

  // Weight the forces
  const separation = multiplyVector(sep, 2.0)
  const alignment = multiplyVector(ali, 1.0)
  const cohesionForce = multiplyVector(coh, 1.0)

  // Apply flocking forces
  boid.acceleration = addVectors(boid.acceleration, separation)
  boid.acceleration = addVectors(boid.acceleration, alignment)
  boid.acceleration = addVectors(boid.acceleration, cohesionForce)

  // Mouse influence
  const mouseDistance = distance(boid.position, mouse)
  if (mouseDistance < influenceRadius && mouseDistance > 0) {
    const mouseSeek = seek(boid, mouse)
    const mouseForce = multiplyVector(mouseSeek, 1.5)
    boid.acceleration = addVectors(boid.acceleration, mouseForce)
  } else {
    // Wander when not influenced by mouse
    const wanderForce = multiplyVector(wander(boid), 0.5)
    boid.acceleration = addVectors(boid.acceleration, wanderForce)
  }

  // Update velocity and position
  boid.velocity = addVectors(boid.velocity, boid.acceleration)
  boid.velocity = limit(boid.velocity, boid.maxSpeed * speedMultiplier)
  boid.position = addVectors(boid.position, boid.velocity)

  // Wrap around boundaries
  wrap(boid)
}
