module.exports = {
  preset: "solid-jest/preset/browser",
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  transform: {
    "^.+\\.(t|j)sx?$": "babel-jest",
  },
  setupFiles: ["./__tests__/_setup.ts"],
  testEnvironmentOptions: {
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
  },
};
