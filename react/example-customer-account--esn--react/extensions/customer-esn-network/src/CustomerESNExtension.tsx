import {
  BlockStack,
  Button,
  Card,
  Form,
  TextField,
  Heading,
  Icon,
  InlineStack,
  Modal,
  reactExtension,
  Text,
  useApi,
  List,
  ListItem,
  Badge,
} from "@shopify/ui-extensions-react/customer-account";
import { useState } from "react";

// HyperGraphQL-inspired Customer ESN (Extended Social Network)
// Represents customer relationships as a hypergraph structure
interface CustomerConnection {
  id: string;
  name: string;
  email?: string;
  relationshipType: string;
  metadata?: Record<string, any>;
}

interface ESNGraph {
  nodes: CustomerConnection[];
  edges: Array<{
    from: string;
    to: string;
    type: string;
  }>;
}

export default reactExtension(
  "customer-account.profile.block.render",
  async () => {
    const { customerId, esnGraph } = await getCustomerESN();

    return (
      <CustomerESNExtension
        customerId={customerId}
        esnGraph={esnGraph}
      />
    );
  },
);

interface Props {
  customerId: string;
  esnGraph: ESNGraph;
}

function CustomerESNExtension(props: Props) {
  const { i18n, ui } = useApi();
  const [connections, setConnections] = useState<CustomerConnection[]>(
    props.esnGraph.nodes || []
  );
  const [newConnectionName, setNewConnectionName] = useState("");
  const [newConnectionEmail, setNewConnectionEmail] = useState("");
  const [newRelationType, setNewRelationType] = useState("friend");

  const handleAddConnection = async () => {
    const newConnection: CustomerConnection = {
      id: `conn_${Date.now()}`,
      name: newConnectionName,
      email: newConnectionEmail,
      relationshipType: newRelationType,
      metadata: {
        addedAt: new Date().toISOString(),
      },
    };

    const updatedConnections = [...connections, newConnection];
    setConnections(updatedConnections);

    const updatedGraph: ESNGraph = {
      nodes: updatedConnections,
      edges: updatedConnections.map((conn) => ({
        from: props.customerId,
        to: conn.id,
        type: conn.relationshipType,
      })),
    };

    await setCustomerESN(props.customerId, updatedGraph);
    
    // Reset form
    setNewConnectionName("");
    setNewConnectionEmail("");
    setNewRelationType("friend");
    
    ui.overlay.close("add-connection-modal");
  };

  const handleRemoveConnection = async (connectionId: string) => {
    const updatedConnections = connections.filter(
      (conn) => conn.id !== connectionId
    );
    setConnections(updatedConnections);

    const updatedGraph: ESNGraph = {
      nodes: updatedConnections,
      edges: updatedConnections.map((conn) => ({
        from: props.customerId,
        to: conn.id,
        type: conn.relationshipType,
      })),
    };

    await setCustomerESN(props.customerId, updatedGraph);
  };

  return (
    <Card padding>
      <BlockStack spacing="loose">
        <Heading level={3}>
          <InlineStack>
            <Text>{i18n.translate("esnCard.heading")}</Text>
            <Button
              kind="plain"
              accessibilityLabel={i18n.translate("esnCard.addConnection")}
              overlay={
                <Modal
                  id="add-connection-modal"
                  padding
                  title={i18n.translate("esnCard.modalHeading")}
                >
                  <Form onSubmit={handleAddConnection}>
                    <BlockStack>
                      <TextField
                        label={i18n.translate("esnCard.connectionName.label")}
                        value={newConnectionName}
                        onChange={(value) => setNewConnectionName(value)}
                      />
                      <TextField
                        label={i18n.translate("esnCard.connectionEmail.label")}
                        value={newConnectionEmail}
                        onChange={(value) => setNewConnectionEmail(value)}
                      />
                      <TextField
                        label={i18n.translate("esnCard.relationType.label")}
                        value={newRelationType}
                        onChange={(value) => setNewRelationType(value)}
                      />
                      <InlineStack blockAlignment="center" inlineAlignment="end">
                        <Button
                          kind="plain"
                          onPress={() =>
                            ui.overlay.close("add-connection-modal")
                          }
                        >
                          {i18n.translate("esnCard.cancel")}
                        </Button>
                        <Button accessibilityRole="submit">
                          {i18n.translate("esnCard.save")}
                        </Button>
                      </InlineStack>
                    </BlockStack>
                  </Form>
                </Modal>
              }
            >
              <Icon source="plus" size="small" appearance="monochrome" />
            </Button>
          </InlineStack>
        </Heading>
        <Text appearance="subdued">
          {i18n.translate("esnCard.description")}
        </Text>
        {connections.length > 0 ? (
          <List>
            {connections.map((connection) => (
              <ListItem key={connection.id}>
                <InlineStack spacing="tight">
                  <Text>{connection.name}</Text>
                  {connection.email && (
                    <Text appearance="subdued">({connection.email})</Text>
                  )}
                  <Badge tone="info">{connection.relationshipType}</Badge>
                  <Button
                    kind="plain"
                    size="small"
                    onPress={() => handleRemoveConnection(connection.id)}
                  >
                    <Icon source="delete" size="small" />
                  </Button>
                </InlineStack>
              </ListItem>
            ))}
          </List>
        ) : (
          <Text appearance="subdued">
            {i18n.translate("esnCard.noConnections")}
          </Text>
        )}
        <Text appearance="subdued" size="small">
          {i18n.translate("esnCard.graphInfo", {
            nodeCount: connections.length,
            edgeCount: connections.length,
          })}
        </Text>
      </BlockStack>
    </Card>
  );
}

// Fetch customer ESN data using HyperGraphQL-inspired query structure
async function getCustomerESN() {
  const response = await fetch(
    "shopify:customer-account/api/2024-07/graphql.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query customerESN($key: String!, $namespace: String!) {
          customer {
            id
            metafield(namespace: $namespace, key: $key) {
              value
            }
          }
        }`,
        variables: {
          key: "connections",
          namespace: "$app:esn",
        },
      }),
    },
  );

  const { data } = await response.json();

  let esnGraph: ESNGraph = {
    nodes: [],
    edges: [],
  };

  try {
    if (data.customer.metafield?.value) {
      esnGraph = JSON.parse(data.customer.metafield.value);
    }
  } catch (error) {
    console.error("Error parsing ESN graph:", error);
  }

  return {
    customerId: data.customer.id,
    esnGraph,
  };
}

// Update customer ESN using GraphQL mutation
async function setCustomerESN(customerId: string, esnGraph: ESNGraph) {
  await fetch("shopify:customer-account/api/2024-07/graphql.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `mutation setESN($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          userErrors {
            field
            message
          }
        }
      }`,
      variables: {
        metafields: [
          {
            key: "connections",
            namespace: "$app:esn",
            ownerId: customerId,
            type: "json",
            value: JSON.stringify(esnGraph),
          },
        ],
      },
    }),
  });
}
