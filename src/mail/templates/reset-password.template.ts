export const resetPasswordTemplate = (name: string, resetLink: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
    body { font-family: 'Inter', Arial, sans-serif; background-color: #f0f3f8; margin: 0; padding: 40px 20px; color: #1e293b; -webkit-font-smoothing: antialiased; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05); }
    
    /* Deep diagonal gradient */
    .header { 
      background: linear-gradient(135deg, #112440 0%, #372fa0 100%);
      position: relative;
      padding: 50px 40px 30px;
      text-align: center;
      color: #ffffff;
    }
    
    /* Logo with glass-pill fallback */
    .logo-pill {
      display: inline-block;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 8px 24px;
      border-radius: 50px;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .logo-pill span { color: #c5a059; }
    
    .header h1 { margin: 0; font-size: 28px; font-weight: 800; text-shadow: 0 2px 10px rgba(0,0,0,0.3); }
    .header p { color: #cbd5e1; font-size: 15px; margin-top: 8px; }

    /* SVG wave separator */
    .wave-container {
      background: #372fa0;
      line-height: 0;
    }
    .wave-container svg {
      display: block;
      width: 100%;
      height: 40px;
    }

    .content { padding: 40px; text-align: center; }
    .content h2 { margin-top: 0; font-size: 22px; color: #0f172a; }
    .content p { line-height: 1.6; color: #475569; margin-bottom: 24px; font-size: 15px; }

    /* Button: Multi-layer shadow stack */
    .btn-wrapper { text-align: center; margin: 30px 0; }
    .btn {
      display: inline-block;
      background: linear-gradient(180deg, #c5a059 0%, #b08c48 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 16px 36px;
      border-radius: 12px;
      font-weight: 800;
      font-size: 16px;
      border: 1px solid #9e7a3a;
      box-shadow: 
        0 2px 0 rgba(255,255,255,0.2) inset, 
        0 4px 6px rgba(176, 140, 72, 0.2),   
        0 10px 15px rgba(176, 140, 72, 0.3), 
        0 20px 25px rgba(176, 140, 72, 0.1); 
    }
    
    .warning-box {
      background: #fef2f2;
      border: 1px dashed #fca5a5;
      border-radius: 12px;
      padding: 20px;
      margin-top: 30px;
      text-align: left;
    }
    .warning-box p {
      margin: 0;
      font-size: 13px;
      color: #991b1b;
      line-height: 1.5;
    }
    .warning-box strong { color: #7f1d1d; display: block; margin-bottom: 4px; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }

    .footer { padding: 30px 40px; text-align: center; font-size: 13px; color: #94a3b8; background: #f8fafc; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo-pill">Clezo <span>Services</span></div>
      <h1>Password Reset</h1>
      <p>Secure account recovery process.</p>
    </div>
    
    <div class="wave-container">
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#ffffff" d="M0,50 C320,100 420,0 720,50 C1020,100 1120,0 1440,50 L1440,100 L0,100 Z"></path>
      </svg>
    </div>

    <div class="content">
      <h2>Hi ${name},</h2>
      <p>We received a secure request to reset the password associated with your Clezo Express Laundry admin account. If you initiated this request, please click the button below to securely set a new password.</p>
      
      <div class="btn-wrapper">
        <a href="${resetLink}" class="btn">Reset My Password</a>
      </div>
      
      <p style="font-size: 13px; color: #64748b;">This link will expire in 15 minutes for your protection.</p>
      
      <div class="warning-box">
        <strong>Didn't request this?</strong>
        <p>If you didn't ask to reset your password, you can safely ignore this email. Your password will remain unchanged and your account is secure. Do not forward this email to anyone.</p>
      </div>
    </div>
    
    <div class="footer">
      &copy; ${new Date().getFullYear()} Clezo Express Laundry. All rights reserved.<br>
      Strictly Confidential. For authorized personnel only.
    </div>
  </div>
</body>
</html>
`;
