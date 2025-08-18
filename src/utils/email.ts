// Email utility for contact form
// This is a utility module for handling email sending with multiple provider support

interface EmailConfig {
  provider: 'sendgrid' | 'nodemailer' | 'resend' | 'console';
  apiKey?: string;
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  from: string;
  to: string;
}

interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  organization?: string;
  timestamp?: string;
  language?: string;
  userAgent?: string;
}

// Get email configuration from environment variables
function getEmailConfig(): EmailConfig {
  const provider = (import.meta.env.EMAIL_PROVIDER || 'console') as EmailConfig['provider'];
  
  const config: EmailConfig = {
    provider,
    from: import.meta.env.FROM_EMAIL || 'noreply@portfolio.com',
    to: import.meta.env.CONTACT_EMAIL || 'ramon.roca@example.com',
  };

  switch (provider) {
    case 'sendgrid':
      config.apiKey = import.meta.env.SENDGRID_API_KEY;
      break;
    case 'resend':
      config.apiKey = import.meta.env.RESEND_API_KEY;
      break;
    case 'nodemailer':
      config.smtp = {
        host: import.meta.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(import.meta.env.SMTP_PORT || '587'),
        secure: import.meta.env.SMTP_SECURE === 'true',
        auth: {
          user: import.meta.env.SMTP_USER || '',
          pass: import.meta.env.SMTP_PASS || '',
        },
      };
      break;
  }

  return config;
}

// Sanitize HTML content
function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Generate email templates
function generateEmailTemplate(data: EmailData): { html: string; text: string } {
  const sanitizedData = {
    name: sanitizeHtml(data.name),
    email: sanitizeHtml(data.email),
    subject: sanitizeHtml(data.subject),
    message: sanitizeHtml(data.message).replace(/\n/g, '<br>'),
    organization: data.organization ? sanitizeHtml(data.organization) : null,
    timestamp: data.timestamp || new Date().toISOString(),
    language: data.language || 'en',
    userAgent: data.userAgent ? sanitizeHtml(data.userAgent) : 'Unknown',
  };

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>New Contact Form Submission</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #DA291C, #FF4444);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 30px;
    }
    .field-group {
      background: #f8f9fa;
      border-radius: 6px;
      padding: 20px;
      margin-bottom: 20px;
      border-left: 4px solid #DA291C;
    }
    .field {
      margin-bottom: 15px;
    }
    .field:last-child {
      margin-bottom: 0;
    }
    .field-label {
      font-weight: 600;
      color: #495057;
      margin-bottom: 5px;
      display: block;
    }
    .field-value {
      color: #333;
      word-wrap: break-word;
    }
    .message-box {
      background: white;
      border: 2px solid #e9ecef;
      border-radius: 6px;
      padding: 20px;
      margin: 20px 0;
    }
    .message-box h3 {
      margin-top: 0;
      color: #DA291C;
      font-size: 18px;
    }
    .metadata {
      background: #e9ecef;
      border-radius: 6px;
      padding: 15px;
      margin-top: 20px;
      font-size: 12px;
      color: #6c757d;
    }
    .metadata strong {
      color: #495057;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #6c757d;
      background: #f8f9fa;
      border-top: 1px solid #e9ecef;
    }
    .reply-button {
      display: inline-block;
      background: #DA291C;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📧 New Portfolio Contact</h1>
    </div>
    
    <div class="content">
      <div class="field-group">
        <div class="field">
          <span class="field-label">👤 Name:</span>
          <div class="field-value">${sanitizedData.name}</div>
        </div>
        
        <div class="field">
          <span class="field-label">📧 Email:</span>
          <div class="field-value">
            <a href="mailto:${sanitizedData.email}" style="color: #DA291C;">
              ${sanitizedData.email}
            </a>
          </div>
        </div>
        
        ${sanitizedData.organization ? `
        <div class="field">
          <span class="field-label">🏢 Organization:</span>
          <div class="field-value">${sanitizedData.organization}</div>
        </div>
        ` : ''}
        
        <div class="field">
          <span class="field-label">💼 Subject:</span>
          <div class="field-value">${sanitizedData.subject}</div>
        </div>
      </div>
      
      <div class="message-box">
        <h3>💬 Message:</h3>
        <div style="line-height: 1.6;">${sanitizedData.message}</div>
      </div>
      
      <div style="text-align: center;">
        <a href="mailto:${sanitizedData.email}?subject=Re: ${encodeURIComponent(data.subject)}" 
           class="reply-button">
          Reply to ${sanitizedData.name}
        </a>
      </div>
      
      <div class="metadata">
        <strong>📊 Submission Details:</strong><br>
        🕐 Submitted: ${new Date(sanitizedData.timestamp).toLocaleString()}<br>
        🌍 Language: ${sanitizedData.language.toUpperCase()}<br>
        💻 User Agent: ${sanitizedData.userAgent}
      </div>
    </div>
    
    <div class="footer">
      This message was sent via the contact form on your portfolio website.<br>
      <strong>Respond promptly to maintain professional image!</strong>
    </div>
  </div>
</body>
</html>`;

  const text = `
NEW PORTFOLIO CONTACT FORM SUBMISSION
====================================

Contact Information:
👤 Name: ${data.name}
📧 Email: ${data.email}
${data.organization ? `🏢 Organization: ${data.organization}\n` : ''}
💼 Subject: ${data.subject}

Message:
💬 ${data.message}

Submission Details:
🕐 Submitted: ${new Date(sanitizedData.timestamp).toLocaleString()}
🌍 Language: ${data.language?.toUpperCase() || 'EN'}
💻 User Agent: ${data.userAgent || 'Unknown'}

====================================
Reply to: ${data.email}
`;

  return { html, text };
}

// Send email via SendGrid
async function sendWithSendGrid(config: EmailConfig, data: EmailData): Promise<boolean> {
  if (!config.apiKey) {
    console.error('SendGrid API key not configured');
    return false;
  }

  try {
    const { html, text } = generateEmailTemplate(data);
    
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: config.to }],
          subject: `Portfolio Contact: ${data.subject}`,
        }],
        from: { email: config.from },
        content: [
          { type: 'text/plain', value: text },
          { type: 'text/html', value: html },
        ],
        reply_to: { email: data.email },
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('SendGrid email failed:', error);
    return false;
  }
}

// Send email via Resend
async function sendWithResend(config: EmailConfig, data: EmailData): Promise<boolean> {
  if (!config.apiKey) {
    console.error('Resend API key not configured');
    return false;
  }

  try {
    const { html, text } = generateEmailTemplate(data);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        subject: `Portfolio Contact: ${data.subject}`,
        html,
        text,
        reply_to: data.email,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Resend email failed:', error);
    return false;
  }
}

// Console logging (for development)
function logToConsole(data: EmailData): boolean {
  console.log('\n🎯 CONTACT FORM SUBMISSION');
  console.log('==========================');
  console.log(`👤 Name: ${data.name}`);
  console.log(`📧 Email: ${data.email}`);
  if (data.organization) console.log(`🏢 Organization: ${data.organization}`);
  console.log(`💼 Subject: ${data.subject}`);
  console.log(`🕐 Time: ${new Date().toISOString()}`);
  console.log(`🌍 Language: ${data.language || 'en'}`);
  console.log('\n💬 Message:');
  console.log(data.message);
  console.log('\n==========================\n');
  return true;
}

// Main email sending function
export async function sendContactEmail(data: EmailData): Promise<boolean> {
  const config = getEmailConfig();
  
  try {
    switch (config.provider) {
      case 'sendgrid':
        return await sendWithSendGrid(config, data);
      
      case 'resend':
        return await sendWithResend(config, data);
      
      case 'nodemailer':
        // Would implement nodemailer here in a Node.js environment
        console.warn('Nodemailer not implemented in browser environment');
        return logToConsole(data);
      
      case 'console':
      default:
        return logToConsole(data);
    }
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

// Validate email configuration
export function validateEmailConfig(): { isValid: boolean; errors: string[] } {
  const config = getEmailConfig();
  const errors: string[] = [];

  if (!config.from) {
    errors.push('FROM_EMAIL environment variable is required');
  }

  if (!config.to) {
    errors.push('CONTACT_EMAIL environment variable is required');
  }

  switch (config.provider) {
    case 'sendgrid':
      if (!config.apiKey) {
        errors.push('SENDGRID_API_KEY environment variable is required for SendGrid');
      }
      break;
    
    case 'resend':
      if (!config.apiKey) {
        errors.push('RESEND_API_KEY environment variable is required for Resend');
      }
      break;
    
    case 'nodemailer':
      if (!config.smtp?.host || !config.smtp?.auth.user || !config.smtp?.auth.pass) {
        errors.push('SMTP configuration (SMTP_HOST, SMTP_USER, SMTP_PASS) is required for Nodemailer');
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}