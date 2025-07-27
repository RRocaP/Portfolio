module.exports = {
  ci: {
    collect: {
      startServerCommand: 'http-server -p 8080',
      url: ['http://localhost:8080/index.html']
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'largest-contentful-paint': ['error', {maxNumericValue: 2500}],
        'cumulative-layout-shift': ['error', {maxNumericValue: 0.1}],
        'total-byte-weight': ['error', {maxNumericValue: 35000}]
      }
    }
  }
};
