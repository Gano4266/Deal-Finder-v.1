import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeText,
  selectSources,
  sha256,
  sourceSkipReason
} from "../scripts/scrape-official-sources.mjs";

const baseOptions = {
  confirmTermsReviewed: false,
  sourceIds: new Set(),
  limit: undefined
};

function source(overrides = {}) {
  return {
    source_id: "src-official",
    restaurant_id: "restaurant-one",
    source_tier: "tier_1_official",
    automation_allowed: "true",
    permission_required: "false",
    login_required: "false",
    source_status: "active",
    robots_or_terms_notes: "",
    source_url: "https://example.com/menu",
    ...overrides
  };
}

test("selectSources only allows reviewed official sources for Phase 2 scraping", () => {
  const rows = [
    source(),
    source({ source_id: "src-social", source_tier: "tier_2_official_social" }),
    source({ source_id: "src-manual", automation_allowed: "false" }),
    source({ source_id: "src-login", login_required: "true" }),
    source({ source_id: "src-permission", permission_required: "true" })
  ];

  const result = selectSources(rows, baseOptions);

  assert.deepEqual(result.selected.map((row) => row.source_id), ["src-official"]);
  assert.equal(result.skipped.length, 4);
});

test("terms notes block scraping unless the operator confirms review", () => {
  const row = source({ robots_or_terms_notes: "Review robots/terms before automated collection." });

  assert.match(
    sourceSkipReason(row, baseOptions),
    /--confirm-terms-reviewed/
  );

  assert.equal(
    sourceSkipReason(row, { ...baseOptions, confirmTermsReviewed: true }),
    undefined
  );
});

test("requested source filters preserve missing-source feedback", () => {
  const result = selectSources(
    [source({ source_id: "src-a" })],
    { ...baseOptions, sourceIds: new Set(["src-a", "src-missing"]) }
  );

  assert.equal(result.selected.length, 1);
  assert.deepEqual(result.missingRequested, ["src-missing"]);
});

test("hash helper uses the normalized asserted text contract", () => {
  const assertedText = normalizeText(" Lunch \n special\t $8 ");

  assert.equal(assertedText, "Lunch special $8");
  assert.match(sha256(assertedText), /^sha256:[a-f0-9]{64}$/);
});
