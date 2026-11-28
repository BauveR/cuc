import { afterEach, describe, expect, it, vi } from 'vitest'
import { flightBetween, heartDestinations, isRendered } from './flight'

const box = (left: number, top: number, width: number, height: number) => ({ left, top, width, height })

const renderedRect = (el: Element) =>
  vi.spyOn(el, 'getClientRects').mockReturnValue([{}] as unknown as DOMRectList)

describe('flightBetween', () => {
  it('traslada de centro a centro y escala por alto', () => {
    // De un monograma de 126 px centrado a uno de 96 px en el header.
    expect(flightBetween(box(689, 387, 62, 126), box(15, 19, 47, 96))).toEqual({
      x: 15 + 23.5 - (689 + 31),
      y: 19 + 48 - (387 + 63),
      scale: 96 / 126,
    })
  })

  it('sin alto de origen no escala (evita NaN/Infinity)', () => {
    expect(flightBetween(box(0, 0, 0, 0), box(10, 10, 20, 20)).scale).toBe(1)
  })
})

describe('heartDestinations', () => {
  afterEach(() => document.body.replaceChildren())

  /** Crea <tag data-intro-target=name> con hijos, sin innerHTML (regla de seguridad del proyecto). */
  const target = (name: string, ...children: HTMLElement[]) => {
    const el = document.createElement('div')
    el.dataset['introTarget'] = name
    el.append(...children)
    document.body.append(el)
    return el
  }
  const heartEl = () => document.createElement('i')

  it('con la nav visible: cada corazón va a su corazón del header', () => {
    const hearts = [heartEl(), heartEl()]
    for (const h of hearts) h.setAttribute('data-heart', '')
    renderedRect(target('hearts', ...hearts))
    const plan = heartDestinations()
    expect(plan.toMenu).toBe(false)
    expect(plan.at(1)).toBe(document.querySelectorAll('[data-heart]')[1])
  })

  it('con la nav oculta (< xl): todos van al botón Menú', () => {
    target('hearts')
    target('menu', document.createElement('button'))
    const plan = heartDestinations()
    expect(plan.toMenu).toBe(true)
    expect(plan.at(7)).toBe(document.querySelector('button'))
  })

  it('isRendered distingue elementos con caja de los ocultos', () => {
    const el = document.createElement('div')
    expect(isRendered(el)).toBe(false)
    renderedRect(el)
    expect(isRendered(el)).toBe(true)
    expect(isRendered(null)).toBe(false)
  })
})
