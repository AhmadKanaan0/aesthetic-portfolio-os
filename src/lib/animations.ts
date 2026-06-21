import { gsap } from "gsap"

const DUR_IN  = 0.5
const DUR_OUT = 0.22

function reduced(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

type Root = Element | null

function observe(
  el: Element,
  root: Root,
  onIn: () => void,
  onOut: (wentAbove: boolean) => void,
): IntersectionObserver {
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        onIn()
      } else if (entry.rootBounds) {
        const wentAbove = entry.boundingClientRect.top < entry.rootBounds.top
        onOut(wentAbove)
      }
    },
    { root, threshold: 0.01, rootMargin: "0px 0px -5% 0px" },
  )
  io.observe(el)
  return io
}

function make(
  el: Element,
  root: Root,
  from: gsap.TweenVars,
  to: gsap.TweenVars,
  exitAbove: gsap.TweenVars,
  exitBelow: gsap.TweenVars,
  staggerDelay = 0,
): IntersectionObserver {
  gsap.set(el, from)
  return observe(
    el, root,
    () => gsap.to(el, { ...to, delay: staggerDelay, overwrite: true }),
    (wentAbove) => gsap.to(el, {
      ...(wentAbove ? exitAbove : exitBelow),
      delay: 0,
      overwrite: true,
    }),
  )
}

export function animateSlideUp(els: Element[], root: Root, stagger = 0): IntersectionObserver[] {
  if (reduced()) { els.forEach(el => gsap.set(el, { opacity: 1, y: 0 })); return [] }
  return els.map((el, i) => make(
    el, root,
    { opacity: 0, y: 55 },
    { opacity: 1, y: 0,   duration: DUR_IN,  ease: "back.out(1.4)" },
    { opacity: 0, y: -30, duration: DUR_OUT, ease: "power2.in" },
    { opacity: 0, y: 55,  duration: DUR_OUT, ease: "power2.in" },
    i * stagger,
  ))
}

export function animatePop(els: Element[], root: Root, stagger = 0): IntersectionObserver[] {
  if (reduced()) { els.forEach(el => gsap.set(el, { opacity: 1, scale: 1, y: 0 })); return [] }
  return els.map((el, i) => make(
    el, root,
    { opacity: 0, scale: 0.78, y: 18 },
    { opacity: 1, scale: 1,    y: 0,  duration: DUR_IN,  ease: "back.out(1.7)" },
    { opacity: 0, scale: 0.92,        duration: DUR_OUT, ease: "power2.in" },
    { opacity: 0, scale: 0.78, y: 18, duration: DUR_OUT, ease: "power2.in" },
    i * stagger,
  ))
}

export function animateFade(els: Element[], root: Root): IntersectionObserver[] {
  if (reduced()) { els.forEach(el => gsap.set(el, { opacity: 1 })); return [] }
  return els.map((el) => make(
    el, root,
    { opacity: 0 },
    { opacity: 1, duration: 0.55, ease: "power2.out" },
    { opacity: 0, duration: DUR_OUT, ease: "power2.in" },
    { opacity: 0, duration: DUR_OUT, ease: "power2.in" },
  ))
}

export function animateScale(els: Element[], root: Root): IntersectionObserver[] {
  if (reduced()) { els.forEach(el => gsap.set(el, { opacity: 1, scale: 1 })); return [] }
  return els.map((el) => make(
    el, root,
    { opacity: 0, scale: 0.82 },
    { opacity: 1, scale: 1,    duration: DUR_IN,  ease: "back.out(1.7)" },
    { opacity: 0, scale: 0.95, duration: DUR_OUT, ease: "power2.in" },
    { opacity: 0, scale: 0.82, duration: DUR_OUT, ease: "power2.in" },
  ))
}

export function animateSlideRight(els: Element[], root: Root): IntersectionObserver[] {
  if (reduced()) { els.forEach(el => gsap.set(el, { opacity: 1, x: 0 })); return [] }
  return els.map((el) => make(
    el, root,
    { opacity: 0, x: -55 },
    { opacity: 1, x: 0,   duration: DUR_IN,  ease: "back.out(1.4)" },
    { opacity: 0, x: -30, duration: DUR_OUT, ease: "power2.in" },
    { opacity: 0, x: -55, duration: DUR_OUT, ease: "power2.in" },
  ))
}

export function animateSlideLeft(els: Element[], root: Root): IntersectionObserver[] {
  if (reduced()) { els.forEach(el => gsap.set(el, { opacity: 1, x: 0 })); return [] }
  return els.map((el) => make(
    el, root,
    { opacity: 0, x: 55 },
    { opacity: 1, x: 0,  duration: DUR_IN,  ease: "back.out(1.4)" },
    { opacity: 0, x: 30, duration: DUR_OUT, ease: "power2.in" },
    { opacity: 0, x: 55, duration: DUR_OUT, ease: "power2.in" },
  ))
}

export function animateTextReveal(els: Element[], root: Root): IntersectionObserver[] {
  if (reduced()) { els.forEach(el => gsap.set(el, { opacity: 1 })); return [] }

  const ios: IntersectionObserver[] = []

  for (const el of els) {
    const text = el.textContent?.trim() || ""
    const words = text.split(/\s+/).filter(Boolean)
    if (!words.length) continue

    el.innerHTML = words
      .map(w => `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:0.05em"><span class="tw" style="display:inline-block">${w}</span></span>`)
      .join(" ")

    const spans = Array.from(el.querySelectorAll<HTMLElement>(".tw"))
    gsap.set(spans, { y: "110%", opacity: 0 })

    const io = observe(
      el, root,
      () => gsap.to(spans, { y: "0%", opacity: 1, duration: 0.6, stagger: 0.06,  ease: "power3.out", overwrite: true }),
      (wentAbove) => {
        if (wentAbove) {
          gsap.to(spans, { y: "-110%", opacity: 0, duration: 0.25, stagger: -0.03, ease: "power2.in", overwrite: true })
        } else {
          gsap.to(spans, { y: "110%",  opacity: 0, duration: 0.25, stagger: 0.03,  ease: "power2.in", overwrite: true })
        }
      },
    )
    ios.push(io)
  }

  return ios
}
