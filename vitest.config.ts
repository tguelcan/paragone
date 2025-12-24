import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
    environment: "node",
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/lib/**/*.ts"],
      exclude: ["src/lib/**/*.test.ts", "src/lib/**/*.spec.ts"],
    },
  },
  resolve: {
    alias: {
      $lib: "/src/lib",
    },
  },
});
