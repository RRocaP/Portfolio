module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:8080'],
      numberOfRuns: 1
    },
    assert: {
      preset: 'lighthouse:recommended'
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
