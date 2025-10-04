import { AdjacentEntry, EntityGeometryInfo, GraphEdgeType } from '../types/data_types'

import adjacencyGraph from '../../../data_dump/adjacency_graph.json'
import adjacencyGraphEdgeMetadata from '../../../data_dump/adjacency_graph_edge_metadata.json'
import entityGeometry from '../../../data_dump/entity_geometry_info.json'
import rgbEntityMap from '../../../data_dump/rgb_id_to_entity_id_map.json'

interface PocketCandidate extends AdjacentEntry {
    score: number;
    reasons: string[];
}

const detectPockets = () => {
    // Build the graph with full information
    const graph: Record<string, AdjacentEntry> = {}

    //TODO: This should be moved to a separate function
    Object.entries(adjacencyGraph).forEach(([key, values]) => {
        const geometry = findGeometryInfo(key);
        const rgb = findRBGEntity(key)

        let map: AdjacentEntry = {}
        map.entityId = key
        map.rgb = rgb?.[0]
        map.geometry = geometry;

        map.adjacentEntities = values.map((r): AdjacentEntry => {
            const metadata = findAdjacentMetadata(`${key}-${r}`)
            return { entityId: r, metadata }
        })

        graph[key] = map
    })

    // Find pocket candidates using multiple criteria
    const pocketCandidates: PocketCandidate[] = []

    Object.values(graph).forEach((entry: AdjacentEntry) => {
        const score = calculatePocketScore(entry, graph)

        if (score.score > 0) {
            pocketCandidates.push({
                ...entry,
                score: score.score,
                reasons: score.reasons
            })
        }
    })

    // Sort by score (highest first)
    pocketCandidates.sort((a, b) => b.score - a.score)

    // Remove pockets that share edges (keep only the highest scoring ones)
    const filteredPockets = removeOverlappingPockets(pocketCandidates)

    // console.log({
    //     pocketCandidates,
    //     filteredPockets,
    //     totalCandidates: pocketCandidates.length,
    //     filteredCount: filteredPockets.length,
    //     highConfidence: filteredPockets.filter(p => p.score >= 5).length
    // })

    return {filteredPockets, graph}
};

const removeOverlappingPockets = (
    pockets: PocketCandidate[]
): PocketCandidate[] => {
    const filtered: PocketCandidate[] = []
    const processedIds = new Set<string>()

    // Process pockets in order of score (highest first)
    for (const pocket of pockets) {
        const pocketId = pocket.entityId!
        
        // Skip if this pocket has already been marked as overlapping
        if (processedIds.has(pocketId)) {
            continue
        }

        // Check if this pocket shares edges with any already selected pocket
        const sharesEdgeWithSelected = filtered.some(selectedPocket => 
            areAdjacent(pocket, selectedPocket)
        )

        if (!sharesEdgeWithSelected) {
            // This pocket doesn't overlap with any selected pocket
            filtered.push(pocket)
            processedIds.add(pocketId)
        } else {
            // Mark as processed but don't include
            processedIds.add(pocketId)
        }
    }

    return filtered
}

const areAdjacent = (
    pocket1: AdjacentEntry, 
    pocket2: AdjacentEntry
): boolean => {
    if (!pocket1.entityId || !pocket2.entityId) {
        return false
    }

    // Check if pocket1 is adjacent to pocket2
    const pocket1AdjacentIds = pocket1.adjacentEntities?.map(a => a.entityId) || []
    if (pocket1AdjacentIds.includes(pocket2.entityId)) {
        return true
    }

    // Check if pocket2 is adjacent to pocket1
    const pocket2AdjacentIds = pocket2.adjacentEntities?.map(a => a.entityId) || []
    return pocket2AdjacentIds.includes(pocket1.entityId);
}

const calculatePocketScore = (entry: AdjacentEntry, graph: Record<string, AdjacentEntry>) => {
    let score = 0
    const reasons: string[] = []

    if (!entry.adjacentEntities || !entry.geometry) {
        return { score, reasons }
    }

    // Criteria 1: Number of adjacent entities (pockets are typically surrounded)
    const adjacentCount = entry.adjacentEntities.length
    if (adjacentCount >= 3 && adjacentCount <= 6) {
        score += 1
        reasons.push(`Surrounded by ${adjacentCount} entities`)
    }

    // Criteria 2: Check for concave edges (strong indicator of pockets)
    const concaveEdges = entry.adjacentEntities.filter(adj =>
        adj.metadata?.includes(GraphEdgeType.CONCAVE)
    )
    const concaveRatio = concaveEdges.length / adjacentCount

    if (concaveRatio >= 0.5) {
        score += 2
        reasons.push(`${concaveEdges.length}/${adjacentCount} edges are concave (${(concaveRatio * 100).toFixed(0)}%)`)
    } else if (concaveEdges.length >= 2) {
        score += 1
        reasons.push(`Has ${concaveEdges.length} concave edges`)
    }

    // Criteria 3: Geometry curvature analysis
    const hasNegativeCurvature = entry.geometry.minNegRadius && entry.geometry.minNegRadius > 0
    if (hasNegativeCurvature) {
        score += 1
        reasons.push(`Has negative curvature`)
    }

    // Criteria 4: Inner edge loops (holes/pockets often have inner edges)
    const hasInnerEdges = entry.geometry.edgeCurveChains?.some(chain =>
        chain.edgeType === 1 // EDGE_TYPE_INNER
    )
    if (hasInnerEdges) {
        score += 1
        reasons.push('Has inner edge loops')
    }

    // Criteria 5: Check if an entity forms a closed boundary with neighbors
    if (formsClosedBoundary(entry, graph)) {
        score += 1
        reasons.push('Forms closed boundary with neighbors')
    }

    // Criteria 6: Depth analysis - compare position with neighbors
    const depthScore = analyzeDepth(entry, graph)
    if (depthScore > 0) {
        score += depthScore
        reasons.push(`Recessed relative to neighbors (depth score: ${depthScore})`)
    }

    // Criteria 7: Small surface area relative to surroundings
    if (isRelativelySmall(entry, graph)) {
        score += 1
        reasons.push('Small area compared to neighbors')
    }

    return { score, reasons }
}

const formsClosedBoundary = (entry: AdjacentEntry, graph: Record<string, AdjacentEntry>): boolean => {
    if (!entry.adjacentEntities || entry.adjacentEntities.length < 3) {
        return false
    }

    // Check if adjacent entities are also connected to each other
    const adjacentIds = entry.adjacentEntities.map(a => a.entityId).filter(Boolean)
    let interconnections = 0

    for (let i = 0; i < adjacentIds.length; i++) {
        const neighbor1 = graph[adjacentIds[i]]
        if (!neighbor1?.adjacentEntities) continue

        const neighbor1Adjacent = neighbor1.adjacentEntities.map(a => a.entityId)

        for (let j = i + 1; j < adjacentIds.length; j++) {
            if (neighbor1Adjacent.includes(adjacentIds[j])) {
                interconnections++
            }
        }
    }

    // If neighbors are well-connected, it suggests a closed region
    return interconnections >= adjacentIds.length - 1
}

const analyzeDepth = (entry: AdjacentEntry, graph: Record<string, AdjacentEntry>): number => {
    if (!entry.geometry?.centerPoint || !entry.adjacentEntities) {
        return 0
    }
    let depthScore = 0

    // Compare center normal direction with neighbors
    const centerNormal = entry.geometry.centerNormal
    if (!centerNormal) return 0

    // If normal points inward (opposite to most neighbors), it's likely a pocket
    let oppositeNormals = 0
    let totalNeighborsWithNormals = 0

    entry.adjacentEntities.forEach(adj => {
        const neighborGeometry = graph[adj.entityId!]?.geometry
        if (neighborGeometry?.centerNormal) {
            totalNeighborsWithNormals++
            const dotProduct =
                centerNormal[0] * neighborGeometry.centerNormal[0] +
                centerNormal[1] * neighborGeometry.centerNormal[1] +
                centerNormal[2] * neighborGeometry.centerNormal[2]

            // Negative dot product means normals point in opposite directions
            if (dotProduct < -0.3) {
                oppositeNormals++
            }
        }
    })

    if (totalNeighborsWithNormals > 0 && oppositeNormals / totalNeighborsWithNormals > 0.5) {
        depthScore = 2
    } else if (oppositeNormals >= 2) {
        depthScore = 1
    }

    return depthScore
}

const isRelativelySmall = (entry: AdjacentEntry, graph: Record<string, AdjacentEntry>): boolean => {
    if (!entry.geometry?.area || !entry.adjacentEntities) {
        return false
    }

    const areas = entry.adjacentEntities
        .map(adj => graph[adj.entityId!]?.geometry?.area)
        .filter((area): area is number => area !== undefined && area > 0)

    if (areas.length === 0) return false

    const avgNeighborArea = areas.reduce((sum, area) => sum + area, 0) / areas.length

    // If this entity is less than 50% of the average neighbor area, it might be a pocket
    return entry.geometry.area < avgNeighborArea * 0.5
}

const findAdjacentMetadata = (key: string): GraphEdgeType[] => {
    const metadata = adjacencyGraphEdgeMetadata[key]
    if (!metadata) return []

    return metadata.map((r: number) => {
        return r as GraphEdgeType
    })
}

const findGeometryInfo = (entityId: string): EntityGeometryInfo | undefined => {
    return entityGeometry.find((r: EntityGeometryInfo) => r.entityId === entityId)
}

const findRBGEntity = (entityId: string) => {
    return Object.entries(rgbEntityMap).find(([_key, value]) => {
        return value === entityId
    })
}

export default detectPockets;