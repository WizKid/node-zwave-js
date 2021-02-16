# Migrating to v7

In version 7.x we got rid of some old habits, leading to several breaking changes. Follow this guide if you're migrating to v7:

## No automatic query of all node values when restarting from cache

This legacy behavior resulted in a lot of traffic and delays when the driver was restarted, often doing many unnecessary queries. To reduce the strain on battery devices and to keep the network as responsive as possible, we've opted not to do this anymore when a node was previously interviewed. This also means that the `"interview completed"` event is no longer emitted on restart.

If you need to manually update values, you can do that on demand with [`node.refreshValues()`](../api/node.md#refreshValues) or [`node.refreshCCValues()`](../api/node.md#refreshCCValues).
