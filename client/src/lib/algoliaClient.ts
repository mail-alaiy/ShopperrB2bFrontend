import algoliasearch from "algoliasearch/lite";

// Initialize the Algolia client
// Replace with your actual Algolia credentials
export const searchClient = algoliasearch(
  "YourApplicationID",
  "YourSearchOnlyAPIKey"
);

export const ALGOLIA_INDEX_NAME = "products";
