# OpenCog HyperGraphQL Customer ESN Implementation

## Overview

This implementation adds a new Customer Account UI extension that demonstrates concepts from **OpenCog** and **HyperGraphQL** to create an Extended Social Network (ESN) for customers within Shopify's customer account system.

## What Was Implemented

### Three Complete Examples

1. **React Version**: `react/example-customer-account--esn--react/`
2. **JavaScript Version**: `javascript/example-customer-account--esn--js/`
3. **Preact Version**: `preact/example-customer-account--esn--preact/`

Each example includes:
- Complete Shopify app infrastructure (Remix-based)
- Customer Account UI extension
- Metafield-based data persistence
- Internationalization (English and French)
- Full documentation

## Key Concepts

### OpenCog Integration

[OpenCog](https://opencog.org/) is an open-source framework for Artificial General Intelligence (AGI) that uses a hypergraph knowledge representation called the **AtomSpace**. This implementation borrows the following concepts:

1. **Hypergraph Structure**: Customer relationships are represented as nodes and edges
2. **Knowledge Representation**: Each connection contains metadata about the relationship
3. **Graph-based Relationships**: Multi-way relationships between entities

### HyperGraphQL Integration

[HyperGraphQL](https://www.hypergraphql.org/) is a GraphQL interface for querying and serving linked data. This implementation:

1. **Uses GraphQL as Query Language**: All data operations use Shopify's GraphQL API
2. **Graph Query Semantics**: Queries follow a hypergraph traversal pattern
3. **Typed Relationships**: Each edge (connection) has a specific type

### Extended Social Network (ESN)

The ESN allows customers to:
- Add connections (friends, colleagues, family members)
- Store relationship metadata
- View their network as a graph structure
- Remove connections
- Track network statistics (node count, edge count)

## Data Structure

The ESN is stored as a JSON metafield with the following structure:

```json
{
  "nodes": [
    {
      "id": "conn_123",
      "name": "John Doe",
      "email": "john@example.com",
      "relationshipType": "friend",
      "metadata": {
        "addedAt": "2024-10-12T00:00:00Z"
      }
    }
  ],
  "edges": [
    {
      "from": "gid://shopify/Customer/123",
      "to": "conn_123",
      "type": "friend"
    }
  ]
}
```

This structure represents:
- **Nodes**: Individual connections in the customer's network
- **Edges**: Directed relationships from the customer to each connection
- **Metadata**: Additional information about each relationship

## Architecture

### Backend (Shopify App)

- **Location**: `app/shopify.server.ts`
- **Functionality**: 
  - Creates metafield definition on app installation
  - Handles webhooks
  - Manages authentication

### Frontend Extension

- **Location**: `extensions/customer-esn-network/src/CustomerESNExtension.tsx`
- **Functionality**:
  - Renders customer network interface
  - Allows adding/removing connections
  - Displays relationship types with badges
  - Shows graph statistics

### Metafield Storage

- **Namespace**: `$app:esn`
- **Key**: `connections`
- **Type**: `json`
- **Access**: 
  - Customer Account: `READ_WRITE`
  - Admin: `MERCHANT_READ`

## Features Implemented

### 1. Network Management UI
- Add new connections via modal dialog
- Display all connections in a list
- Remove connections with confirmation
- Badge indicators for relationship types

### 2. Hypergraph Data Model
- Nodes represent entities (customers and their connections)
- Edges represent typed relationships
- Metadata for each connection
- Extensible structure for future enhancements

### 3. GraphQL Integration
- Query customer metafields using GraphQL
- Mutate network data using GraphQL mutations
- Type-safe data operations

### 4. Internationalization
- English (`en.default.json`)
- French (`fr.json`)
- Easily extensible to other languages

### 5. Real-time Updates
- Changes persist immediately to customer metafields
- UI updates reflect current state
- Error handling for failed operations

## How to Use

### Installation

1. Navigate to any of the example directories:
   ```bash
   cd react/example-customer-account--esn--react
   # or
   cd javascript/example-customer-account--esn--js
   # or
   cd preact/example-customer-account--esn--preact
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Follow the Shopify CLI prompts to install on your development store

### Testing the Extension

1. After installing the app, navigate to your customer account
2. Go to the Profile page
3. Look for the "My Network (ESN)" card
4. Click the "+" icon to add connections
5. Fill in connection details (name, email, relationship type)
6. View your network graph information

## Technical Highlights

### Hypergraph Representation

The implementation demonstrates a true hypergraph structure where:
- Each customer is a central node
- Connections are satellite nodes
- Edges have types (friend, colleague, family, etc.)
- The structure can be extended to support multi-way relationships

### GraphQL as Query Interface

Following HyperGraphQL principles:
- All data access goes through GraphQL queries
- Mutations are used for write operations
- The schema supports graph traversal patterns
- Type safety is maintained throughout

### OpenCog Inspiration

Borrowing from OpenCog's AtomSpace:
- Nodes represent entities
- Links (edges) represent relationships
- Metadata provides context
- The structure supports reasoning and inference (future enhancement)

## Future Enhancements

The current implementation provides a foundation for:

1. **Advanced Graph Operations**:
   - Graph traversal algorithms
   - Community detection
   - Centrality measures
   - Recommendation algorithms

2. **Relationship Inference**:
   - Suggest new connections based on existing relationships
   - Identify potential common connections
   - Relationship strength scoring

3. **Visualization**:
   - Interactive network graph visualization
   - Force-directed graph layouts
   - Hierarchical relationship views

4. **Privacy Controls**:
   - Connection visibility settings
   - Relationship type permissions
   - Network sharing options

## Files Created

### React Version (39 files)
- Complete Shopify app structure
- Customer ESN extension
- Configuration files
- Localization files
- README documentation

### JavaScript Version (39 files)
- Complete Shopify app structure
- Customer ESN extension
- Configuration files
- Localization files
- README documentation

### Preact Version (39 files)
- Complete Shopify app structure
- Customer ESN extension with Preact hooks
- Configuration files
- Localization files
- README documentation

## Conclusion

This implementation successfully demonstrates how concepts from OpenCog and HyperGraphQL can be applied to create a customer social network within Shopify's Customer Account extensions. The hypergraph data model provides a flexible foundation for representing complex customer relationships, while GraphQL serves as an elegant query interface following modern web standards.

The three implementations (React, JavaScript, and Preact) ensure developers can work with their preferred framework while maintaining the same core functionality and architecture.
