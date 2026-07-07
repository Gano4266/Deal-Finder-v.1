"use client";

import { useMemo, useState } from "react";
import { findNearestArea, getAreaAssistCopy } from "../lib/today-location";

type LocationStatus =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "denied"; message: string }
  | { kind: "unsupported"; message: string }
  | { kind: "success"; message: string };

type TodayLocationClientProps = {
  selectedArea: string;
  areaOptions: string[];
  selectedMeal: string;
  selectedQuick: string;
  selectedSearchQuery: string;
};

function buildTonightHref(params: { area: string; meal: string; quick: string; q: string }) {
  const query = new URLSearchParams();

  if (params.area !== "All") {
    query.set("area", params.area);
  }

  if (params.meal !== "all") {
    query.set("meal", params.meal);
  }

  if (params.quick !== "all") {
    query.set("quick", params.quick);
  }

  if (params.q) {
    query.set("q", params.q);
  }

  const queryText = query.toString();
  return queryText ? `/tonight?${queryText}` : "/tonight";
}

export function TodayLocationClient({
  selectedArea,
  areaOptions,
  selectedMeal,
  selectedQuick,
  selectedSearchQuery
}: TodayLocationClientProps) {
  const [status, setStatus] = useState<LocationStatus>({ kind: "idle" });
  const visibleAreaOptions = useMemo(() => areaOptions.filter((area) => area !== "All"), [areaOptions]);
  const selectedAreaLabel = selectedArea === "All" ? "All Wilmington" : selectedArea;
  const assistCopy = getAreaAssistCopy(selectedArea);

  function goToArea(area: string) {
    try {
      window.localStorage.setItem("forkcast.today.selectedArea", area);
      window.localStorage.removeItem("forkcast.today.lastCoordinates");
    } catch {
      // Local storage is a convenience only. Never block navigation on it.
    }

    window.location.assign(buildTonightHref({
      area,
      meal: selectedMeal,
      quick: selectedQuick,
      q: selectedSearchQuery
    }));
  }

  function useCurrentLocation() {
    if (!("geolocation" in navigator)) {
      setStatus({
        kind: "unsupported",
        message: "Your browser does not support location here. Choose an area instead."
      });
      return;
    }

    setStatus({ kind: "loading" });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nearest = findNearestArea(
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          visibleAreaOptions
        );

        try {
          window.localStorage.setItem("forkcast.today.locationMode", "near-me");
          window.localStorage.setItem("forkcast.today.selectedArea", nearest.area);
          window.localStorage.removeItem("forkcast.today.lastCoordinates");
        } catch {
          // Exact coordinates are intentionally not persisted.
        }

        setStatus({
          kind: "success",
          message: `Sorting around ${nearest.label}. Your exact location is not stored.`
        });
        goToArea(nearest.area);
      },
      () => {
        setStatus({
          kind: "denied",
          message: "Location is off. Choose an area to sort nearby specials without sharing your location."
        });
      },
      {
        enableHighAccuracy: false,
        maximumAge: 5 * 60 * 1000,
        timeout: 8000
      }
    );
  }

  return (
    <section className="todayLocationPanel" aria-label="Location-aware Today controls">
      <div className="todayLocationCopy">
        <p className="eyebrow">Nearby today</p>
        <h2>{selectedArea === "All" ? "Make Today local" : `Today near ${selectedAreaLabel}`}</h2>
        <p>{assistCopy}</p>
        <p className="privacyNote">
          Near Me uses your browser once to choose a nearby area. Forkcast does not store your exact location.
        </p>
        {status.kind !== "idle" && status.kind !== "loading" ? (
          <p className={`locationStatus ${status.kind}`}>{status.message}</p>
        ) : null}
      </div>

      <div className="todayLocationActions">
        <button type="button" className="primaryLink nearMeButton" onClick={useCurrentLocation} disabled={status.kind === "loading"}>
          {status.kind === "loading" ? "Finding area…" : "Use near me"}
        </button>
        <a className="secondaryLink" href={buildTonightHref({ area: "All", meal: selectedMeal, quick: selectedQuick, q: selectedSearchQuery })}>
          All Wilmington
        </a>
      </div>

      <nav className="areaQuickChips" aria-label="Sort Today by area">
        {visibleAreaOptions.slice(0, 7).map((area) => (
          <a
            key={area}
            href={buildTonightHref({ area, meal: selectedMeal, quick: selectedQuick, q: selectedSearchQuery })}
            className={area === selectedArea ? "active" : ""}
            aria-current={area === selectedArea ? "page" : undefined}
            onClick={(event) => {
              event.preventDefault();
              goToArea(area);
            }}
          >
            {area}
          </a>
        ))}
      </nav>
    </section>
  );
}
