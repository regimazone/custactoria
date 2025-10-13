# OpenCog-Inspired HyperGraphQL Customer ESN (Extended Social Network)

This tutorial demonstrates implementing a Customer Account UI extension that uses concepts from **OpenCog** and **HyperGraphQL** to create an Extended Social Network (ESN) for customers. The code is based on a template for building a [Shopify app](https://shopify.dev/docs/apps/getting-started) using the [Remix](https://remix.run) framework.

## Overview

This example implements:

- **HyperGraph Data Structure**: Customer connections are stored as a hypergraph with nodes (connections) and edges (relationships)
- **GraphQL Interface**: Uses Shopify's GraphQL API to query and mutate the hypergraph structure
- **Extended Social Network**: Allows customers to manage their network of connections with different relationship types

### What is OpenCog?

[OpenCog](https://opencog.org/) is an open-source framework for Artificial General Intelligence (AGI) that uses a hypergraph knowledge representation called the AtomSpace. This example borrows the concept of representing relationships as a hypergraph structure.

### What is HyperGraphQL?

[HyperGraphQL](https://www.hypergraphql.org/) is a GraphQL interface for querying and serving linked data on the Web. This example uses GraphQL queries to interact with a hypergraph-like data structure representing customer social connections.

## Features

- **Customer Network Management**: Customers can add, view, and remove connections
- **Relationship Types**: Each connection has a type (friend, colleague, family, etc.)
- **Hypergraph Structure**: Data is stored as nodes and edges representing the social graph
- **Localization**: Supports multiple languages (English and French included)
- **Real-time Updates**: Changes are persisted to customer metafields

## Your New App and Extension

Some notable files:

- `shopify.app.toml` - Configuration file for your app with required access scopes
- `shopify.extension.toml` - Configuration for the customer account extension
- `app/shopify.server.ts` - Server-side code for creating metafield definitions on app installation
- `extensions/customer-esn-network/src/CustomerESNExtension.tsx` - Main extension UI component
- `extensions/customer-esn-network/locales/*.json` - Translation files for internationalization

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

## Quick Start

### Prerequisites

Before you begin, you'll need the following:

1. **Node.js**: [Download and install](https://nodejs.org/en/download/) it if you haven't already.
2. **Shopify Partner Account**: [Create an account](https://partners.shopify.com/signup) if you don't have one.
3. **Test Store**: Set up a [development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) that's part of the [Checkout and Customer Account Extensibility Dev Preview](https://shopify.dev/docs/api/release-notes/developer-previews#checkout-and-customer-accounts-extensibility-developer-preview) in order to test your app.

### Setup

Using yarn:

```shell
yarn install
```

Using npm:

```shell
npm install
```

Using pnpm:

```shell
pnpm install
```

### Local Development

Using yarn:

```shell
yarn dev
```

Using npm:

```shell
npm run dev
```

Using pnpm:

```shell
pnpm run dev
```

Begin by following the install link to install the app on your development shop.

Press `P` to preview your app.

Local development is powered by [the Shopify CLI](https://shopify.dev/docs/apps/tools/cli). It logs into your partners account, connects to an app, provides environment variables, updates remote config, creates a tunnel and provides commands to generate extensions.

## How It Works

1. **App Installation**: When the app is installed, it creates a JSON metafield definition for storing customer ESN data
2. **Extension Rendering**: The extension loads on the customer profile page
3. **Data Fetching**: Customer connections are retrieved via GraphQL query
4. **Network Management**: Customers can add/remove connections through the UI
5. **Data Persistence**: Changes are saved back to the metafield using GraphQL mutations

## Architecture

This implementation demonstrates:

- **Hypergraph Concepts**: Nodes represent entities (customers, connections), edges represent relationships
- **GraphQL as Query Language**: Shopify's GraphQL API serves as the interface layer (similar to HyperGraphQL)
- **Knowledge Representation**: The hypergraph structure can represent complex multi-way relationships
- **Extensibility**: The structure can be extended to include more complex relationship types and metadata

## Useful Links

- [Customer account UI extension documentation](https://shopify.dev/docs/api/customer-account-ui-extensions)
  - [Configuration](https://shopify.dev/docs/api/customer-account-ui-extensions/2024-10/configuration)
  - [API Reference](https://shopify.dev/docs/api/customer-account-ui-extensions/2024-10/apis)
  - [UI Components](https://shopify.dev/docs/api/customer-account-ui-extensions/2024-10/components)
- [OpenCog Framework](https://opencog.org/)
- [HyperGraphQL](https://www.hypergraphql.org/)
- [Metafields Documentation](https://shopify.dev/docs/apps/build/custom-data/metafields)
