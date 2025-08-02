import React, { useState } from 'react';

const ApiTestComponent = () => {
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testApiConnection = async () => {
    setIsLoading(true);
    setTestResult('');
    
    try {
      const response = await fetch('/api/test-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test: 'data',
          name: 'Test User',
          email: 'test@example.com',
          quantity: '1'
        })
      });

      const result = await response.json();
      setTestResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setTestResult(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '10px',
      borderRadius: '5px',
      zIndex: 9999,
      maxWidth: '400px'
    }}>
      <h4>API Test</h4>
      <button onClick={testApiConnection} disabled={isLoading}>
        {isLoading ? 'Testing...' : 'Test API Connection'}
      </button>
      {testResult && (
        <pre style={{ 
          marginTop: '10px', 
          fontSize: '12px', 
          background: '#f5f5f5', 
          padding: '10px',
          borderRadius: '3px',
          overflow: 'auto',
          maxHeight: '200px'
        }}>
          {testResult}
        </pre>
      )}
    </div>
  );
};

export default ApiTestComponent;
