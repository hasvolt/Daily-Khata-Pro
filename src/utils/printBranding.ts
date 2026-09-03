/**
 * Daily Khata: Pro — Standardized Branded Print & PDF Export Utility
 * Ensures all printed and downloaded documents carry the official App & Company Watermark,
 * Enterprise details, and authentic verification credentials.
 */

export const BRAND_WATERMARK_CONFIG = {
  appName: 'Daily Khata: Pro',
  tagline: 'Multi-Bucket Systematic Financial Ledger',
  companyName: 'HASAN SMART ELECTRICAL SOLUTIONS ®',
  msmeRegistration: 'UDYAM-DL-10-0098630',
  license: 'Open Source MIT License',
  developer: 'MD Zafeer Hasan (YAZDAAN)',
  website: 'https://hasvolt.com',
  supportPortal: 'https://hses247help.com',
  year: '2026'
};

/**
 * Returns clean CSS for printing with watermarks and company branding.
 */
export function getPrintWatermarkCSS(): string {
  return `
    @page {
      size: A4 portrait;
      margin: 12mm 14mm;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0F172A;
      background: #FFFFFF;
      line-height: 1.5;
      padding: 24px;
      position: relative;
      max-width: 840px;
      margin: 0 auto;
    }
    
    /* Background Company Watermark */
    .print-watermark-bg {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 34px;
      font-weight: 900;
      color: rgba(15, 23, 42, 0.045);
      text-transform: uppercase;
      letter-spacing: 2px;
      text-align: center;
      line-height: 1.4;
      pointer-events: none;
      z-index: 0;
      width: 90%;
      user-select: none;
    }
    .print-watermark-secondary {
      font-size: 20px;
      font-weight: 700;
      color: rgba(15, 23, 42, 0.035);
      margin-top: 8px;
      letter-spacing: 1px;
    }

    /* Content wrapper sits above watermark */
    .document-content {
      position: relative;
      z-index: 1;
    }

    /* Standardized Branded Header */
    .brand-header-box {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2.5px solid #0284C7;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .brand-left-title {
      font-size: 20px;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: -0.5px;
    }
    .brand-left-sub {
      font-size: 11px;
      color: #0369A1;
      font-weight: 600;
      margin-top: 2px;
    }
    .brand-company-tag {
      font-size: 10px;
      color: #64748B;
      margin-top: 2px;
    }
    .brand-right-meta {
      text-align: right;
      font-size: 10.5px;
      color: #475569;
      line-height: 1.4;
    }
    .brand-badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 9.5px;
      font-weight: 700;
      text-transform: uppercase;
      background: #E0F2FE;
      color: #0369A1;
      border: 1px solid #BAE6FD;
      margin-bottom: 4px;
    }

    /* Standardized Branded Footer */
    .brand-footer-box {
      margin-top: 28px;
      border-top: 1px solid #CBD5E1;
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: #64748B;
      flex-wrap: wrap;
      gap: 6px;
    }
    .brand-footer-legal {
      font-weight: 600;
      color: #334155;
    }
    .brand-footer-link {
      color: #0284C7;
      text-decoration: none;
      font-weight: 600;
    }

    @media print {
      body { padding: 8px 12px; }
      .no-print { display: none !important; }
      .print-watermark-bg { display: block !important; }
    }
  `;
}

/**
 * Returns the HTML for the translucent watermark and official company header.
 */
export function getWatermarkAndHeaderHTML(docTitle: string, subtitle?: string): { watermarkHTML: string; headerHTML: string; footerHTML: string } {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const watermarkHTML = ``;

  const headerHTML = `
    <div class="brand-header-box">
      <div>
        <div class="brand-left-title">${docTitle}</div>
        <div class="brand-left-sub">${subtitle || BRAND_WATERMARK_CONFIG.tagline}</div>
        <div class="brand-company-tag">
          Official Record · <strong>${BRAND_WATERMARK_CONFIG.companyName}</strong> (MSME: ${BRAND_WATERMARK_CONFIG.msmeRegistration})
        </div>
      </div>
      <div class="brand-right-meta">
        <div><span class="brand-badge">CONFIDENTIAL RECORD</span></div>
        <div>Date: <strong>${currentDate}</strong></div>
        <div>Portal: <strong>${BRAND_WATERMARK_CONFIG.website.replace('https://', '')}</strong></div>
      </div>
    </div>
  `;

  const footerHTML = `
    <div class="brand-footer-box">
      <div style="display: flex; align-items: center; gap: 8px;">
        <img src="https://avatars.githubusercontent.com/mdzafeerhasan" alt="MD Zafeer Hasan" style="width: 24px; height: 24px; border-radius: 50%; border: 1px solid #0284C7;" />
        <span>
          <span class="brand-footer-legal">Daily Khata: Pro</span> · Developed by <strong>${BRAND_WATERMARK_CONFIG.developer}</strong> · ${BRAND_WATERMARK_CONFIG.license}
        </span>
      </div>
      <div>
        Enterprise: <strong>${BRAND_WATERMARK_CONFIG.companyName}</strong> (Govt. MSME: ${BRAND_WATERMARK_CONFIG.msmeRegistration}) · <a class="brand-footer-link" href="${BRAND_WATERMARK_CONFIG.website}" target="_blank">${BRAND_WATERMARK_CONFIG.website.replace('https://', '')}</a>
      </div>
    </div>
  `;

  return { watermarkHTML, headerHTML, footerHTML };
}

/**
 * Executes high-reliability iframe-based print to avoid printing the active applet window.
 */
export function executeIframePrint(htmlContent: string, iframeId = 'dailykhata-branded-print-frame') {
  try {
    let printFrame = document.getElementById(iframeId) as HTMLIFrameElement | null;
    if (!printFrame) {
      printFrame = document.createElement('iframe');
      printFrame.id = iframeId;
      printFrame.style.position = 'fixed';
      printFrame.style.right = '0';
      printFrame.style.bottom = '0';
      printFrame.style.width = '0';
      printFrame.style.height = '0';
      printFrame.style.border = '0';
      printFrame.style.opacity = '0';
      document.body.appendChild(printFrame);
    }

    const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument;
    if (frameDoc) {
      frameDoc.open();
      frameDoc.write(htmlContent);
      frameDoc.close();

      setTimeout(() => {
        try {
          printFrame?.contentWindow?.focus();
          printFrame?.contentWindow?.print();
        } catch {
          window.print();
        }
      }, 400);
    } else {
      window.print();
    }
  } catch {
    window.print();
  }
}

/**
 * Downloads a self-contained HTML/PDF document that can be opened or saved directly as PDF.
 */
export function downloadPrintableHTML(htmlContent: string, fileName: string) {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName.endsWith('.html') ? fileName : `${fileName}.html`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
