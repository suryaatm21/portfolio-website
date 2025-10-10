/**
 * Smoke test for basic application functionality
 * Tests path alias resolution and basic imports
 */
import { describe, it, expect } from "vitest";

// Test simple imports and path alias resolution
import { hero } from "@/content/site";

describe("Application Smoke Test", () => {
  it("validates path alias resolution works", () => {
    // This test passes if the import from "@/content/site" resolves correctly
    expect(hero).toBeDefined();
    expect(hero.name).toBe("Surya Atmuri");
    expect(hero.tagline).toContain("Junior in cs @ georgia tech");
  });

  it("validates site content structure", () => {
    expect(hero).toHaveProperty("name");
    expect(hero).toHaveProperty("tagline");
    expect(hero).toHaveProperty("cta");
    expect(hero.cta).toHaveProperty("primary");
    expect(hero.cta).toHaveProperty("secondary");

    // Ensure CTA links are defined
    expect(hero.cta.primary.text).toBe("Get in touch");
    expect(hero.cta.secondary.text).toBe("See resume");
  });

  it("validates TypeScript compilation works", () => {
    // If this test runs, TypeScript compilation and module resolution works
    const testValue: string = hero.name;
    expect(testValue).toBe("Surya Atmuri");
  });
});
