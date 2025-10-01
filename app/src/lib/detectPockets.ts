import { AdjacentEntry, EntityGeometryInfo, GraphEdgeType } from '../types/data_types'

import adjacencyGraph from '../../../data_dump/adjacency_graph.json'
import adjacencyGraphEdgeMetadata from '../../../data_dump/adjacency_graph_edge_metadata.json'
import entityGeometry from '../../../data_dump/entity_geometry_info.json'
import rgbEntityMap from '../../../data_dump/rgb_id_to_entity_id_map.json'

const detectPockets = () => {
    // console.log({ adjacencyGraph })
    const graph = {}

    Object.entries(adjacencyGraph).forEach(([key, values]) => {
        const geometry = findGeometryInfo(key);
        const rgb = findRBGEntity(key)

        let map: AdjacentEntry = {}
        map.entityId = key
        map.rgb = rgb[0]
        map.geometry = geometry;

        map.adjacentEntities = values.map((r): AdjacentEntry => {
            const metadata = findAdjacentMetadata(`${key}-${r}`)
            return { entityId: r, metadata }
        })

        graph[key] = map
    })

    // Find entities with 3-4 adjacent entities
    let pockets = Object.values(graph).filter((r: AdjacentEntry) => {
        const hasConcaveEdges = r.adjacentEntities.some(adj => 
         adj.metadata?.includes('CONCAVE') || adj.metadata?.includes('TANGENT')
       )

        return r.adjacentEntities.length >= 3 && r.adjacentEntities.length <= 4
    })
    console.log({ pockets })
};

const findAdjacentMetadata = (key: string) => {
    return adjacencyGraphEdgeMetadata[key].map((r: number) => {
        const edgeType = GraphEdgeType[r];
        return edgeType;
    })
}

const findGeometryInfo = (entityId: string): EntityGeometryInfo  => {
    return entityGeometry.find((r: EntityGeometryInfo) => r.entityId === entityId)
}

const findRBGEntity = (entityId: string) => {
    return Object.entries(rgbEntityMap).find((([key, value]) => {
        return value === entityId
    }))
}

export default detectPockets;