import type { PublicAreaGroup, PublicDeal } from "./data";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

type AreaCenter = Coordinates & {
  area: PublicAreaGroup;
  label: string;
  radiusMiles: number;
  boundary: boolean;
  aliases: string[];
  neighbors: PublicAreaGroup[];
};

// Southport is intentionally excluded: it has its own /southport route and
// soft-pilot scope (see AGENTS.md), so it should not appear in /tonight's
// area-aware sorting, distance labels, or Near Me candidate areas.
export const todayAreaCenters: AreaCenter[] = [
  {
    area: "Downtown",
    label: "Downtown",
    latitude: 34.2367,
    longitude: -77.9481,
    radiusMiles: 2.5,
    boundary: false,
    aliases: ["downtown", "riverfront", "central wilmington"],
    neighbors: ["South Front", "College Rd / UNCW", "Other Wilmington"]
  },
  {
    area: "South Front",
    label: "South Front",
    latitude: 34.2153,
    longitude: -77.9468,
    radiusMiles: 2,
    boundary: false,
    aliases: ["south front", "greenfield", "castle street"],
    neighbors: ["Downtown", "South Wilmington", "Other Wilmington"]
  },
  {
    area: "College Rd / UNCW",
    label: "College / UNCW",
    latitude: 34.2257,
    longitude: -77.8789,
    radiusMiles: 3,
    boundary: false,
    aliases: ["college", "uncw", "college rd", "college road"],
    neighbors: ["Mayfaire/Ogden", "Other Wilmington", "Monkey Junction"]
  },
  {
    area: "Mayfaire/Ogden",
    label: "Mayfaire / Ogden",
    latitude: 34.241,
    longitude: -77.828,
    radiusMiles: 4,
    boundary: false,
    aliases: ["mayfaire", "ogden", "military cutoff"],
    neighbors: ["College Rd / UNCW", "Other Wilmington"]
  },
  {
    area: "Monkey Junction",
    label: "Monkey Junction",
    latitude: 34.1454,
    longitude: -77.894,
    radiusMiles: 3.25,
    boundary: false,
    aliases: ["monkey junction", "carolina beach road"],
    neighbors: ["South Wilmington", "College Rd / UNCW", "Carolina Beach"]
  },
  {
    area: "South Wilmington",
    label: "South Wilmington",
    latitude: 34.1814,
    longitude: -77.9224,
    radiusMiles: 3.25,
    boundary: false,
    aliases: ["south wilmington", "south college", "pine valley"],
    neighbors: ["Monkey Junction", "South Front", "Other Wilmington"]
  },
  {
    area: "Carolina Beach",
    label: "Carolina Beach",
    latitude: 34.0352,
    longitude: -77.8936,
    radiusMiles: 3,
    boundary: true,
    aliases: ["carolina beach", "cb"],
    neighbors: ["Monkey Junction", "South Wilmington"]
  },
  {
    area: "Other Wilmington",
    label: "Other Wilmington",
    latitude: 34.2104,
    longitude: -77.8868,
    radiusMiles: 5,
    boundary: false,
    aliases: ["wilmington", "midtown", "oleander"],
    neighbors: ["Downtown", "College Rd / UNCW", "South Wilmington", "Mayfaire/Ogden"]
  }
];

const exactAreaOrder = new Map(todayAreaCenters.map((area, index) => [area.area, index]));

export function getAreaCenter(area: string | undefined): AreaCenter | undefined {
  if (!area || area === "All") {
    return undefined;
  }

  const normalized = area.trim().toLowerCase();

  return todayAreaCenters.find(
    (candidate) =>
      candidate.area.toLowerCase() === normalized ||
      candidate.label.toLowerCase() === normalized ||
      candidate.aliases.some((alias) => alias.toLowerCase() === normalized)
  );
}

export function distanceMiles(from: Coordinates, to: Coordinates): number {
  const radiusMiles = 3958.8;
  const degreesToRadians = Math.PI / 180;
  const deltaLatitude = (to.latitude - from.latitude) * degreesToRadians;
  const deltaLongitude = (to.longitude - from.longitude) * degreesToRadians;
  const fromLatitude = from.latitude * degreesToRadians;
  const toLatitude = to.latitude * degreesToRadians;

  const haversine =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(deltaLongitude / 2) ** 2;

  return 2 * radiusMiles * Math.asin(Math.sqrt(haversine));
}

export function formatDistanceMiles(distance: number): string {
  if (!Number.isFinite(distance)) {
    return "";
  }

  if (distance < 0.1) {
    return "nearby";
  }

  if (distance < 10) {
    return `${distance.toFixed(1)} mi`;
  }

  return `${Math.round(distance)} mi`;
}

export function getDealApproximateCoordinates(deal: PublicDeal): Coordinates | undefined {
  return getAreaCenter(deal.areaGroup) ?? getAreaCenter(deal.area);
}

export function getDealDistanceFromArea(deal: PublicDeal, selectedArea: string | undefined): number | undefined {
  const origin = getAreaCenter(selectedArea);
  const destination = getDealApproximateCoordinates(deal);

  if (!origin || !destination) {
    return undefined;
  }

  return distanceMiles(origin, destination);
}

export function getDealDistanceLabel(deal: PublicDeal, selectedArea: string | undefined): string | undefined {
  const distance = getDealDistanceFromArea(deal, selectedArea);

  if (distance === undefined) {
    return undefined;
  }

  return formatDistanceMiles(distance);
}

function areaPriority(deal: PublicDeal, selectedArea: string | undefined): number {
  const center = getAreaCenter(selectedArea);

  if (!center) {
    return exactAreaOrder.get(deal.areaGroup) ?? 99;
  }

  if (deal.areaGroup === center.area) {
    return 0;
  }

  if (center.neighbors.includes(deal.areaGroup)) {
    return 1;
  }

  const dealCenter = getAreaCenter(deal.areaGroup);

  if (dealCenter?.boundary && !center.boundary) {
    return 3;
  }

  return 2;
}

function timeCertaintyPriority(deal: PublicDeal): number {
  if (deal.timeWindow === "N/A" || !deal.timeWindow.trim()) {
    return 1;
  }

  return 0;
}

export function sortDealsForSelectedArea(deals: PublicDeal[], selectedArea: string | undefined): PublicDeal[] {
  return [...deals].sort((left, right) => {
    const leftAreaPriority = areaPriority(left, selectedArea);
    const rightAreaPriority = areaPriority(right, selectedArea);

    if (leftAreaPriority !== rightAreaPriority) {
      return leftAreaPriority - rightAreaPriority;
    }

    const leftDistance = getDealDistanceFromArea(left, selectedArea) ?? Number.POSITIVE_INFINITY;
    const rightDistance = getDealDistanceFromArea(right, selectedArea) ?? Number.POSITIVE_INFINITY;

    if (leftDistance !== rightDistance) {
      return leftDistance - rightDistance;
    }

    const timePriority = timeCertaintyPriority(left) - timeCertaintyPriority(right);

    if (timePriority !== 0) {
      return timePriority;
    }

    return left.restaurantName.localeCompare(right.restaurantName);
  });
}

export function findNearestArea(origin: Coordinates, allowedAreas?: string[]): AreaCenter {
  const allowed = new Set((allowedAreas ?? []).filter((area) => area !== "All"));
  const candidates = allowed.size > 0
    ? todayAreaCenters.filter((area) => allowed.has(area.area))
    : todayAreaCenters;

  return candidates
    .map((area) => ({ area, distance: distanceMiles(origin, area) }))
    .sort((left, right) => left.distance - right.distance)[0]?.area ?? todayAreaCenters[0];
}

export function getAreaAssistCopy(selectedArea: string | undefined): string {
  const center = getAreaCenter(selectedArea);

  if (!center) {
    return "Choose an area or use Near Me to sort useful specials around where you are.";
  }

  if (center.boundary) {
    return `${center.label} specials first, with Wilmington options still available.`;
  }

  return `${center.label} specials first, followed by nearby Wilmington areas.`;
}
