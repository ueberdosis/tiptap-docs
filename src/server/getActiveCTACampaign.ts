import { WebflowCampaign } from "@/types";

type CampaignResult = {
  items: WebflowCampaign[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
};

/**
 * Retrieves the active CTA campaign from the official Tiptap website
 */
export async function getActiveCTACampaign() {
  try {
    const collectionId = process.env.NEXT_WEBFLOW_CAMPAIGN_COLLECTION_ID;

    if (!collectionId) {
      console.error("NEXT_WEBFLOW_CAMPAIGN_COLLECTION_ID is not configured");
      return null;
    }

    const url = `https://api.webflow.com/v2/collections/${collectionId}/items`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_WEBFLOW_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60,
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch CTA campaigns from Webflow", {
        status: res.status,
        statusText: res.statusText,
        requestId: res.headers.get("x-request-id"),
      });
      return null;
    }

    const json = (await res.json()) as CampaignResult;
    if (!json?.items) {
      return null;
    }

    const campaign = json.items.find((item) => item.fieldData.active);

    if (!campaign) {
      return null;
    }

    return campaign;
  } catch (error) {
    console.error("Failed to fetch active CTA campaign from Webflow", error);
    return null;
  }
}
