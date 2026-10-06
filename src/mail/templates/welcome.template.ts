export const welcomeEmailTemplate = (name: string, username: string, role: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
    body { font-family: 'Inter', Arial, sans-serif; background-color: #f0f3f8; margin: 0; padding: 40px 20px; color: #1e293b; -webkit-font-smoothing: antialiased; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05); }
    
    /* 1. Deep diagonal gradient with dual radial glows (faked via overlapping gradients) */
    .header { 
      background: linear-gradient(135deg, #112440 0%, #372fa0 100%);
      position: relative;
      padding: 50px 40px 30px;
      text-align: center;
      color: #ffffff;
    }
    
    /* 5. Logo with glass-pill fallback */
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

    /* 2. SVG wave separator */
    .wave-container {
      background: #372fa0;
      line-height: 0;
    }
    .wave-container svg {
      display: block;
      width: 100%;
      height: 40px;
    }

    .content { padding: 40px; }
    .content h2 { margin-top: 0; font-size: 22px; color: #0f172a; }
    .content p { line-height: 1.6; color: #475569; margin-bottom: 24px; font-size: 15px; }
    
    /* 3. Details card: Glass-card with dark gradient header */
    .glass-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 30px;
      box-shadow: inset 0 2px 4px rgba(255,255,255,0.5), 0 4px 6px rgba(0,0,0,0.02);
    }
    /* Since email clients struggle with Flexbox sometimes, standard blocks are used with float fallback if needed, but modern clients support basic flex */
    .glass-card-header {
      background: linear-gradient(90deg, #1e293b 0%, #0f172a 100%);
      padding: 12px 20px;
    }
    .glass-card-header-left { display: inline-block; color: #ffffff; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px; }
    
    /* Branded badge for the role */
    .role-badge {
      display: inline-block;
      float: right;
      background: linear-gradient(135deg, #c5a059 0%, #d4b472 100%);
      color: #112440;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      box-shadow: 0 2px 5px rgba(197, 160, 89, 0.4);
    }
    
    .glass-card-body { padding: 20px; clear: both; }
    .detail-row { border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 12px; }
    .detail-row:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
    .detail-label { color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; display: inline-block; width: 120px; }
    .detail-val { color: #0f172a; font-size: 15px; font-weight: 800; display: inline-block; }

    /* 4. Button: Multi-layer shadow stack */
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

    .footer { padding: 30px 40px; text-align: center; font-size: 13px; color: #94a3b8; background: #f8fafc; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <!-- 1. Deep diagonal gradient with dual radial glows -->
    <!-- 5. Logo with glass-pill fallback -->
    <div class="header">
      <div class="logo-pill">Clezo <span>Services</span></div>
      <h1>Welcome Aboard!</h1>
      <p>Your secure administration account is ready.</p>
    </div>
    
    <!-- 2. SVG wave separator cutting between header and body -->
    <div class="wave-container">
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#ffffff" d="M0,50 C320,100 420,0 720,50 C1020,100 1120,0 1440,50 L1440,100 L0,100 Z"></path>
      </svg>
    </div>

    <div class="content">
      <h2>Hi ${name},</h2>
      <p>We are absolutely thrilled to welcome you to the team. Your system credentials have been securely provisioned and you now have access to the Clezo Express Laundry dashboard.</p>
      
      <!-- 3. Details card: Glass-card with dark gradient header and branded badge -->
      <div class="glass-card">
        <div class="glass-card-header">
          <div class="glass-card-header-left">Account Details</div>
          <div class="role-badge">${role.replace('_', ' ')}</div>
          <div style="clear: both;"></div>
        </div>
        <div class="glass-card-body">
          <div class="detail-row">
            <span class="detail-label">Username</span>
            <span class="detail-val">${username}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Access Level</span>
            <span class="detail-val">${role.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      <p style="font-size: 13px; color: #64748b; font-style: italic;">Note: Please log in using the temporary password provided securely by your IT administrator. For security reasons, passwords are never transmitted via email.</p>
      
      <!-- 4. Button: Multi-layer shadow stack (rgba stacked shadows) -->
      <div class="btn-wrapper">
        <a href="${process.env.ADMIN_PANEL_URL || 'http://localhost:5173'}/login" class="btn">Access Dashboard</a>
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
