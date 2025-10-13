# OpenCog HyperGraphQL Customer ESN - Architecture

## System Overview

This Customer Account Extension implements a hypergraph-based social network using concepts from OpenCog and HyperGraphQL.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Shopify Customer Account                    │
│                        (Customer View)                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Renders Extension
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│           Customer ESN Extension (UI Component)                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  - Display Network Connections                            │ │
│  │  - Add/Remove Connections                                 │ │
│  │  - Show Graph Statistics                                  │ │
│  │  - Relationship Type Management                           │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ GraphQL Queries/Mutations
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Shopify GraphQL API (Customer Context)             │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Query:  customer.metafield(namespace, key)               │ │
│  │  Mutation: metafieldsSet                                  │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Metafield Storage
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Customer Metafields                          │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Namespace: $app:esn                                      │ │
│  │  Key: connections                                         │ │
│  │  Type: JSON                                               │ │
│  │  Value: {                                                 │ │
│  │    "nodes": [...],                                        │ │
│  │    "edges": [...]                                         │ │
│  │  }                                                        │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

                             │
                             │ App Installation
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Shopify App Backend (Remix)                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  shopify.server.ts                                        │ │
│  │  - Creates metafield definition on install                │ │
│  │  - Handles webhooks                                       │ │
│  │  - Manages authentication                                 │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Loading Customer Network

```
Extension Load
    │
    ├─> GraphQL Query (getCustomerESN)
    │       │
    │       └─> Query customer.metafield
    │               │
    │               └─> Returns JSON: {nodes: [...], edges: [...]}
    │
    └─> Parse JSON into ESNGraph structure
            │
            └─> Render UI with connections
```

### 2. Adding a Connection

```
User clicks "Add Connection"
    │
    ├─> Modal opens with form
    │
    ├─> User fills in:
    │   - Name
    │   - Email (optional)
    │   - Relationship Type
    │
    ├─> Submit form
    │
    ├─> Create new CustomerConnection object
    │       │
    │       └─> Generate unique ID
    │       └─> Add metadata (timestamp)
    │
    ├─> Update local state (connections array)
    │
    ├─> Rebuild ESNGraph
    │   - Update nodes array
    │   - Rebuild edges array
    │
    ├─> GraphQL Mutation (setCustomerESN)
    │       │
    │       └─> metafieldsSet mutation
    │               │
    │               └─> Save JSON to customer metafield
    │
    └─> Close modal & re-render UI
```

### 3. Removing a Connection

```
User clicks delete icon on connection
    │
    ├─> Filter connection from array
    │
    ├─> Rebuild ESNGraph
    │   - Update nodes array
    │   - Rebuild edges array
    │
    ├─> GraphQL Mutation (setCustomerESN)
    │       │
    │       └─> metafieldsSet mutation
    │               │
    │               └─> Save updated JSON
    │
    └─> Re-render UI
```

## Data Structures

### ESNGraph (HyperGraph Structure)

```typescript
interface ESNGraph {
  nodes: CustomerConnection[];  // Vertices in the graph
  edges: Edge[];                // Relationships between nodes
}
```

### CustomerConnection (Graph Node)

```typescript
interface CustomerConnection {
  id: string;                    // Unique identifier
  name: string;                  // Connection name
  email?: string;                // Optional email
  relationshipType: string;      // Type of relationship
  metadata?: Record<string, any>; // Additional data
}
```

### Edge (Graph Relationship)

```typescript
interface Edge {
  from: string;    // Customer ID (source node)
  to: string;      // Connection ID (target node)
  type: string;    // Relationship type (friend, colleague, etc.)
}
```

## HyperGraph Concepts Applied

### 1. Nodes (Vertices)
- **Customer**: The central node (owner of the network)
- **Connections**: Satellite nodes representing other people

### 2. Edges (Links)
- **Directed edges**: From customer to each connection
- **Typed edges**: Each edge has a relationship type
- **Metadata**: Edges can store additional information

### 3. Hypergraph Properties
- **Multi-way relationships**: Structure supports extending to multi-way connections
- **Typed relationships**: Different relationship types (friend, colleague, family)
- **Flexible schema**: JSON storage allows schema evolution

## OpenCog Integration Points

### Current Implementation
- **AtomSpace-inspired storage**: JSON representation mirrors AtomSpace structure
- **Nodes and Links**: Clear separation of entities (nodes) and relationships (edges)
- **Metadata support**: Each connection can have arbitrary metadata

### Future Extensions
- **Truth Values**: Could add confidence scores to relationships
- **Attention Values**: Could track importance/recency of connections
- **Pattern Matching**: Could implement graph pattern queries
- **Inference**: Could infer new relationships based on existing ones

## GraphQL Interface

### Query Pattern (HyperGraphQL-inspired)

```graphql
query customerESN($key: String!, $namespace: String!) {
  customer {
    id
    metafield(namespace: $namespace, key: $key) {
      value  # Returns serialized hypergraph
    }
  }
}
```

### Mutation Pattern

```graphql
mutation setESN($metafields: [MetafieldsSetInput!]!) {
  metafieldsSet(metafields: $metafields) {
    userErrors {
      field
      message
    }
  }
}
```

## Security & Privacy

### Access Control
- **Customer Account**: `READ_WRITE` - Customers can manage their own network
- **Admin**: `MERCHANT_READ` - Merchants can view but not modify

### Data Storage
- **Namespace**: `$app:esn` - App-specific namespace prevents conflicts
- **Type**: `JSON` - Flexible structure stored as JSON metafield
- **Scope**: Customer-level - Each customer has their own isolated network

## Performance Considerations

### Current Implementation
- **Client-side processing**: Network manipulation happens in the browser
- **Single metafield**: Entire network stored in one metafield (suitable for moderate networks)
- **Simple queries**: Direct metafield access (no complex joins)

### Scaling Strategies (Future)
- **Pagination**: For large networks, implement paginated node retrieval
- **Lazy loading**: Load connection details on demand
- **Caching**: Cache network graph locally in browser
- **Batch operations**: Batch multiple connection changes into single mutation

## Extension Points

The architecture supports extending with:

1. **Connection Suggestions**: Algorithm to suggest new connections
2. **Network Analytics**: Centrality measures, community detection
3. **Relationship Strength**: Scoring based on interaction frequency
4. **Network Visualization**: Interactive graph visualization component
5. **Privacy Controls**: Per-connection visibility settings
6. **Shared Connections**: Find common connections between customers
7. **Network Export**: Export network data in standard formats (GraphML, etc.)

## Technology Stack

### Frontend
- **UI Framework**: React / Preact
- **UI Components**: Shopify UI Extensions
- **State Management**: React hooks (useState)
- **Type Safety**: TypeScript

### Backend
- **Framework**: Remix (React-based)
- **Authentication**: Shopify App OAuth
- **Database**: Prisma ORM
- **Webhooks**: Shopify App webhooks

### Infrastructure
- **API**: Shopify GraphQL API
- **Storage**: Shopify Metafields
- **Deployment**: Node.js server

## Development Workflow

1. **Local Development**: `npm run dev` - Starts Shopify CLI dev server
2. **Testing**: Install on development store via CLI
3. **Extension Preview**: View in customer account UI
4. **Deployment**: `npm run deploy` - Deploy to production

## Conclusion

This architecture demonstrates how modern web technologies (GraphQL, React) can be combined with theoretical concepts from AGI (OpenCog's hypergraphs) to create practical customer-facing features. The hypergraph data model provides flexibility for future enhancements while maintaining simplicity in the current implementation.
