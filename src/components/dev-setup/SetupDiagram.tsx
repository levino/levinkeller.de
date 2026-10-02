import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'
import {
  type DiagramEdge,
  type DiagramNode,
  edges,
  type FlowId,
  flows,
  type Lang,
  nodes,
  ui,
  zones,
} from './diagramData'

const WIDTH = 900
const HEIGHT = 580
const NODE_W = 150
const NODE_H = 52

const nodeWidth = (node: DiagramNode) => node.w ?? NODE_W

const nodeById = new Map(nodes.map((node) => [node.id, node]))

const flowColor = (flow: FlowId | undefined) =>
  flows.find(({ id }) => id === flow)?.color ?? 'var(--color-base-content)'

// Kontrollpunkt der quadratischen Kurve zwischen zwei Knotenmitten. Die leichte
// Biegung macht parallele Kanten (Tailnet → drei Drohnen) unterscheidbar; lange
// Kanten setzen `bend: 0` oder einen eigenen Kontrollpunkt (`via`), damit sie
// nicht hinter fremden Knoten verlaufen.
const controlPoint = ({ source, target, bend = 0.12, via }: DiagramEdge) => {
  const a = nodeById.get(source) as DiagramNode
  const b = nodeById.get(target) as DiagramNode
  if (via) return { a, b, cx: via[0], cy: via[1] }
  const dx = b.x - a.x
  const dy = b.y - a.y
  return {
    a,
    b,
    cx: (a.x + b.x) / 2 - dy * bend,
    cy: (a.y + b.y) / 2 + dx * bend,
  }
}

const edgePath = (edge: DiagramEdge) => {
  const { a, b, cx, cy } = controlPoint(edge)
  return `M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}`
}

// Punkt auf der quadratischen Kurve bei t = 0.5
const edgeLabelPosition = (edge: DiagramEdge) => {
  const { a, b, cx, cy } = controlPoint(edge)
  return {
    x: (a.x + 2 * cx + b.x) / 4,
    y: (a.y + 2 * cy + b.y) / 4,
  }
}

const nodesInFlow = (flow: FlowId) =>
  new Set(
    edges
      .filter(({ flows: edgeFlows }) => edgeFlows.includes(flow))
      .flatMap(({ source, target }) => [source, target])
  )

export const SetupDiagram = ({ lang }: { lang: Lang }) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [activeFlow, setActiveFlow] = useState<FlowId | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  // Aufbau: einmal pro Sprache
  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    svg
      .append('g')
      .attr('class', 'zones')
      .selectAll('g')
      .data(zones)
      .join('g')
      .call((g) =>
        g
          .append('rect')
          .attr('x', (d) => d.x)
          .attr('y', (d) => d.y)
          .attr('width', (d) => d.w)
          .attr('height', (d) => d.h)
          .attr('rx', 14)
          .attr('fill', 'var(--color-base-200)')
          .attr('stroke', 'var(--color-base-300)')
      )
      .call((g) =>
        g
          .append('text')
          .attr('x', (d) => d.x + 12)
          .attr('y', (d) => d.y + 22)
          .attr('fill', 'var(--color-base-content)')
          .attr('opacity', 0.7)
          .attr('font-size', 13)
          .attr('font-weight', 600)
          .text((d) => d.label[lang])
      )

    const edgeLayer = svg.append('g').attr('class', 'edges')
    edgeLayer
      .selectAll('path')
      .data(edges)
      .join('path')
      .attr('class', 'edge')
      .attr('d', edgePath)
      .attr('fill', 'none')
      .attr('stroke', (d) => flowColor(d.flows[0]))
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', (d) => (d.dashed ? '6 6' : null))

    const labelLayer = svg.append('g').attr('class', 'edge-labels')
    labelLayer
      .selectAll('text')
      .data(edges.filter((edge) => edge.label))
      .join('text')
      .attr('class', 'edge-label')
      .attr('x', (d) => edgeLabelPosition(d).x)
      .attr('y', (d) => edgeLabelPosition(d).y)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', 12)
      .attr('font-weight', 500)
      .attr('fill', 'var(--color-base-content)')
      .attr('stroke', 'var(--color-base-100)')
      .attr('stroke-width', 7)
      .attr('stroke-linejoin', 'round')
      .attr('paint-order', 'stroke')
      .text((d) => d.label?.[lang] ?? '')

    const nodeGroups = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .attr(
        'transform',
        (d) => `translate(${d.x - nodeWidth(d) / 2},${d.y - NODE_H / 2})`
      )
      .attr('role', 'button')
      .attr('tabindex', 0)
      .attr('aria-label', (d) => `${d.label[lang]}: ${d.sub?.[lang] ?? ''}`)
      .style('cursor', 'pointer')
      .on('click', (_event, d) =>
        setSelectedNode((current) => (current === d.id ? null : d.id))
      )
      .on('keydown', (event: KeyboardEvent, d) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          setSelectedNode((current) => (current === d.id ? null : d.id))
        }
      })

    nodeGroups
      .append('rect')
      .attr('width', nodeWidth)
      .attr('height', NODE_H)
      .attr('rx', (d) => (d.network ? NODE_H / 2 : 10))
      .attr('fill', 'var(--color-base-100)')
      .attr('stroke', 'var(--color-base-content)')
      .attr('stroke-opacity', 0.35)
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', (d) => (d.network ? '5 4' : null))

    nodeGroups
      .append('text')
      .attr('x', (d) => nodeWidth(d) / 2)
      .attr('y', 22)
      .attr('text-anchor', 'middle')
      .attr('font-size', 14)
      .attr('font-weight', 700)
      .attr('fill', 'var(--color-base-content)')
      .text((d) => d.label[lang])

    nodeGroups
      .append('text')
      .attr('x', (d) => nodeWidth(d) / 2)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .attr('font-size', 11)
      .attr('fill', 'var(--color-base-content)')
      .attr('opacity', 0.8)
      .text((d) => d.sub?.[lang] ?? '')
  }, [lang])

  // Hervorhebung: bei jedem Wechsel von Kanal oder Auswahl
  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    const active = activeFlow ? nodesInFlow(activeFlow) : null

    svg
      .selectAll<SVGPathElement, DiagramEdge>('path.edge')
      .classed('edge-flowing', (d) =>
        activeFlow ? d.flows.includes(activeFlow) && !d.dashed : false
      )
      .transition()
      .duration(300)
      .attr('stroke', (d) =>
        flowColor(
          activeFlow && d.flows.includes(activeFlow) ? activeFlow : d.flows[0]
        )
      )
      .attr('opacity', (d) =>
        !activeFlow || d.flows.includes(activeFlow) ? 0.9 : 0.1
      )
      .attr('stroke-width', (d) =>
        activeFlow && d.flows.includes(activeFlow) ? 4 : 2.5
      )

    svg
      .selectAll<SVGTextElement, DiagramEdge>('text.edge-label')
      .transition()
      .duration(300)
      .attr('opacity', (d) =>
        !activeFlow || d.flows.includes(activeFlow) ? 1 : 0.1
      )

    // Nur Schrift und Rahmen ausblenden, die Füllung bleibt deckend – sonst
    // scheinen die gedimmten Kanten durch die Knoten hindurch.
    const dimmed = (d: DiagramNode) => Boolean(active && !active.has(d.id))
    svg
      .selectAll<SVGTextElement, DiagramNode>('g.node text')
      .transition()
      .duration(300)
      .attr('fill-opacity', (d) => (dimmed(d) ? 0.3 : 1))

    svg
      .selectAll<SVGRectElement, DiagramNode>('g.node rect')
      .transition()
      .duration(300)
      .attr('stroke', (d) =>
        d.id === selectedNode
          ? 'var(--color-primary)'
          : 'var(--color-base-content)'
      )
      .attr('stroke-opacity', (d) =>
        d.id === selectedNode ? 1 : dimmed(d) ? 0.12 : 0.35
      )
      .attr('stroke-width', (d) => (d.id === selectedNode ? 3 : 1.5))
  }, [activeFlow, selectedNode])

  const node = selectedNode ? nodeById.get(selectedNode) : undefined
  const flow = activeFlow
    ? flows.find(({ id }) => id === activeFlow)
    : undefined

  return (
    <div className="not-prose my-6">
      <style>{`
        @keyframes dev-setup-flow { to { stroke-dashoffset: -24; } }
        .edge-flowing { stroke-dasharray: 8 4; animation: dev-setup-flow 0.8s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .edge-flowing { animation: none; } }
        .node:focus-visible rect { stroke: var(--color-primary); stroke-width: 3; }
        .node:focus { outline: none; }
      `}</style>
      <div className="mb-3 flex flex-wrap gap-1 sm:gap-2">
        <button
          type="button"
          className={`btn btn-sm px-2 sm:px-3 ${activeFlow === null ? 'btn-neutral' : 'btn-ghost'}`}
          onClick={() => setActiveFlow(null)}
        >
          {ui.all[lang]}
        </button>
        {flows.map(({ id, color, label }) => (
          <button
            key={id}
            type="button"
            className={`btn btn-sm px-2 sm:px-3 ${activeFlow === id ? 'btn-neutral' : 'btn-ghost'}`}
            onClick={() =>
              setActiveFlow((current) => (current === id ? null : id))
            }
          >
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ background: color }}
            />
            {label[lang]}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="block w-full min-w-[640px]"
          role="img"
          aria-label={ui.ariaLabel[lang]}
        />
      </div>
      <div
        className="mt-3 min-h-24 rounded-box bg-base-200 p-4 text-sm"
        aria-live="polite"
      >
        {node ? (
          <>
            <div className="font-bold">
              {node.label[lang]}
              {node.sub ? (
                <span className="font-normal opacity-70">
                  {' '}
                  · {node.sub[lang]}
                </span>
              ) : null}
            </div>
            <p className="mt-1">{node.info[lang]}</p>
            {node.page ? (
              <a
                className="link mt-2 inline-block"
                href={`/${lang}${node.page}`}
              >
                {ui.more[lang]} →
              </a>
            ) : null}
          </>
        ) : flow ? (
          <>
            <div className="font-bold">{flow.label[lang]}</div>
            <p className="mt-1">{flow.info[lang]}</p>
          </>
        ) : (
          <p className="opacity-70">{ui.hint[lang]}</p>
        )}
      </div>
    </div>
  )
}
