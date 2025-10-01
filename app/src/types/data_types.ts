// Relevant to entity_geometry_info.json
export interface AdjacentEntry {
    entityId?: string;
    adjacentEntities?: AdjacentEntry[]
    rgb?: string
    geometry?: EntityGeometryInfo
    metadata?: GraphEdgeType[]
}

export interface EntityGeometryInfo
{
    entityType?: EntityType;
    entityId?: string;
    centerUv?: number[];
    centerPoint?: number[];
    centerNormal?: number[];
    area?: number;
    minRadius?: number;
    minPosRadius?: number;
    minNegRadius?: number;
    edgeCurveChains?: EdgeCurveChain[];
}

export interface EdgeCurveChain
{
    edgeType?: EdgeType;
    edgeCurves?: EdgeCurve[];
}

export interface EdgeCurve
{
    startPoint?: number;
    midPoint?: number;
    endPoint?: number;
    startPointNormal?: number;
}

export enum EntityType
{
    ENTITY_TYPE_PLANE,
    ENTITY_TYPE_CYLINDER,
    ENTITY_TYPE_ROTATIONAL,
    ENTITY_TYPE_NURBS,
}

export enum EdgeType
{
    EDGE_TYPE_OUTER,
    EDGE_TYPE_INNER,
}

// Relevant to adjacency_graph_edge_metadata.json
export enum GraphEdgeType
{
    CONCAVE = 0,
    CONVEX = 1,
    TANGENTIAL = 2,
}