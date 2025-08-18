// API testing utility for development and validation

interface ApiTestResult {
  endpoint: string;
  method: string;
  status: 'success' | 'error' | 'skip';
  statusCode?: number;
  responseTime?: number;
  error?: string;
}

/**
 * Test contact form API endpoint
 */
const testContactAPI = async (baseUrl: string): Promise<ApiTestResult> => {
  const endpoint = '/api/contact';
  const startTime = Date.now();
  
  try {
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'API Test Contact',
      message: 'This is a test message for the contact form API.',
      organization: 'Test Organization',
      timestamp: new Date().toISOString(),
      language: 'en',
      website: '', // Honeypot field should be empty
    };
    
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Recaptcha-Token': 'test-token', // In production, this would be a real token
      },
      body: JSON.stringify(testData),
    });
    
    const responseTime = Date.now() - startTime;
    
    if (!response.ok) {
      return {
        endpoint,
        method: 'POST',
        status: 'error',
        statusCode: response.status,
        responseTime,
        error: `HTTP ${response.status}`,
      };
    }
    
    const result = await response.json();
    
    return {
      endpoint,
      method: 'POST',
      status: result.success ? 'success' : 'error',
      statusCode: response.status,
      responseTime,
      error: result.success ? undefined : result.error,
    };
    
  } catch (error) {
    return {
      endpoint,
      method: 'POST',
      status: 'error',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Test newsletter API endpoint
 */
const testNewsletterAPI = async (baseUrl: string): Promise<ApiTestResult> => {
  const endpoint = '/api/newsletter';
  const startTime = Date.now();
  
  try {
    const testData = {
      email: 'test-newsletter@example.com',
      name: 'Newsletter Test User',
      interests: ['antimicrobial-resistance', 'protein-design'],
      language: 'en',
      source: 'api-test',
      timestamp: new Date().toISOString(),
    };
    
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    const responseTime = Date.now() - startTime;
    
    if (!response.ok) {
      return {
        endpoint,
        method: 'POST',
        status: 'error',
        statusCode: response.status,
        responseTime,
        error: `HTTP ${response.status}`,
      };
    }
    
    const result = await response.json();
    
    return {
      endpoint,
      method: 'POST',
      status: result.success ? 'success' : 'error',
      statusCode: response.status,
      responseTime,
      error: result.success ? undefined : result.error,
    };
    
  } catch (error) {
    return {
      endpoint,
      method: 'POST',
      status: 'error',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Test search API endpoint
 */
const testSearchAPI = async (baseUrl: string): Promise<ApiTestResult> => {
  const endpoint = '/api/search';
  const startTime = Date.now();
  
  try {
    const queryParams = new URLSearchParams({
      q: 'antimicrobial resistance',
      limit: '5',
      offset: '0',
      type: 'all',
      lang: 'en',
    });
    
    const response = await fetch(`${baseUrl}${endpoint}?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const responseTime = Date.now() - startTime;
    
    if (!response.ok) {
      return {
        endpoint,
        method: 'GET',
        status: 'error',
        statusCode: response.status,
        responseTime,
        error: `HTTP ${response.status}`,
      };
    }
    
    const result = await response.json();
    
    return {
      endpoint,
      method: 'GET',
      status: result.success ? 'success' : 'error',
      statusCode: response.status,
      responseTime,
      error: result.success ? undefined : result.error,
    };
    
  } catch (error) {
    return {
      endpoint,
      method: 'GET',
      status: 'error',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Test analytics API endpoint
 */
const testAnalyticsAPI = async (baseUrl: string): Promise<ApiTestResult> => {
  const endpoint = '/api/analytics';
  const startTime = Date.now();
  
  try {
    const testData = {
      event: 'api_test',
      category: 'page_view' as const,
      data: {
        page: '/test',
        section: 'api-testing',
        component: 'test-suite',
      },
      user: {
        id: 'test-user-123',
        language: 'en' as const,
        device_type: 'desktop' as const,
      },
      meta: {
        timestamp: Date.now(),
        version: '1.0',
      },
    };
    
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    const responseTime = Date.now() - startTime;
    
    if (!response.ok) {
      return {
        endpoint,
        method: 'POST',
        status: 'error',
        statusCode: response.status,
        responseTime,
        error: `HTTP ${response.status}`,
      };
    }
    
    const result = await response.json();
    
    return {
      endpoint,
      method: 'POST',
      status: result.success ? 'success' : 'error',
      statusCode: response.status,
      responseTime,
      error: result.success ? undefined : result.error,
    };
    
  } catch (error) {
    return {
      endpoint,
      method: 'POST',
      status: 'error',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Test all API endpoints
 */
export const runAPITests = async (baseUrl: string = 'http://localhost:4321'): Promise<ApiTestResult[]> => {
  console.log(`🧪 Running API tests against ${baseUrl}`);
  console.log('');
  
  const tests = [
    { name: 'Contact API', test: testContactAPI },
    { name: 'Newsletter API', test: testNewsletterAPI },
    { name: 'Search API', test: testSearchAPI },
    { name: 'Analytics API', test: testAnalyticsAPI },
  ];
  
  const results: ApiTestResult[] = [];
  
  for (const { name, test } of tests) {
    console.log(`Testing ${name}...`);
    const result = await test(baseUrl);
    results.push(result);
    
    const statusIcon = result.status === 'success' ? '✅' : '❌';
    const responseTime = result.responseTime ? ` (${result.responseTime}ms)` : '';
    const errorMsg = result.error ? ` - ${result.error}` : '';
    
    console.log(`  ${statusIcon} ${result.method} ${result.endpoint}${responseTime}${errorMsg}`);
  }
  
  console.log('');
  
  const successCount = results.filter(r => r.status === 'success').length;
  const totalCount = results.length;
  
  console.log(`📊 Test Results: ${successCount}/${totalCount} passed`);
  
  if (successCount === totalCount) {
    console.log('🎉 All API tests passed!');
  } else {
    console.log('⚠️  Some tests failed. Check the details above.');
  }
  
  return results;
};

/**
 * Test CORS headers
 */
export const testCORS = async (baseUrl: string = 'http://localhost:4321'): Promise<void> => {
  console.log('🌐 Testing CORS configuration...');
  
  const endpoints = ['/api/contact', '/api/newsletter', '/api/search', '/api/analytics'];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'OPTIONS',
      });
      
      const corsHeaders = {
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
        'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
      };
      
      console.log(`  ${endpoint}:`);
      Object.entries(corsHeaders).forEach(([header, value]) => {
        console.log(`    ${header}: ${value || 'Not set'}`);
      });
      
    } catch (error) {
      console.log(`  ❌ ${endpoint}: ${error}`);
    }
  }
};

/**
 * Generate test report
 */
export const generateTestReport = (results: ApiTestResult[]): string => {
  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  
  const averageResponseTime = results
    .filter(r => r.responseTime)
    .reduce((sum, r) => sum + (r.responseTime || 0), 0) / results.length;
  
  return `
# API Test Report

**Date:** ${new Date().toISOString()}
**Total Tests:** ${results.length}
**Passed:** ${successCount}
**Failed:** ${errorCount}
**Average Response Time:** ${Math.round(averageResponseTime)}ms

## Test Results

${results.map(result => `
### ${result.method} ${result.endpoint}

- **Status:** ${result.status === 'success' ? '✅ Success' : '❌ Failed'}
- **HTTP Status:** ${result.statusCode || 'N/A'}
- **Response Time:** ${result.responseTime || 'N/A'}ms
${result.error ? `- **Error:** ${result.error}` : ''}
`).join('')}

## Recommendations

${errorCount > 0 ? `
⚠️ **Issues Found:** ${errorCount} API endpoint(s) failed testing.
- Review error messages above
- Check server logs for detailed error information
- Verify API route configurations
- Ensure all required environment variables are set
` : '✅ **All tests passed!** API routes are functioning correctly.'}

## Next Steps

1. Run tests in different environments (dev, staging, production)
2. Add automated testing to CI/CD pipeline
3. Monitor API performance and error rates
4. Set up alerts for API failures
  `.trim();
};

export type { ApiTestResult };