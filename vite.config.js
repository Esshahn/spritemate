const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
  
  // No need to define $ and jQuery here; it will be handled within the app itself.
};
