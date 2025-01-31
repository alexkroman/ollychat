export default {
    transform: {
      "^.+\\.(ts|tsx)$": ["babel-jest", { configFile: "./babel.config.js" }],
    },
    extensionsToTreatAsEsm: [".ts", ".tsx", ".jsx"],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1", // Fix Jest import resolution
      }
  };