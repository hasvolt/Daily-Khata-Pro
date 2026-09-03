/**
 * Daily Khata Pro - Calculator Print & PDF Generator
 * Generates official, clean calculation slips with company watermark and website branding
 */

export interface CalcPrintParams {
  title: string;
  type: string;
  mainResult: string;
  resultLabel?: string;
  secondaryInfo?: string;
  items: Array<{ label: string; value: string; isBold?: boolean; isHighlight?: boolean }>;
  recentTape?: Array<{ expr: string; res: string }>;
  notes?: string;
}

export function generateCalculatorSlipHTML(params: CalcPrintParams): string {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Daily Khata Pro — Calculation Slip (${params.title})</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      padding: 30px;
      color: #0f172a;
      max-width: 720px;
      margin: 0 auto;
      line-height: 1.5;
      background: #ffffff;
      position: relative;
    }
    .watermark-bg {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-28deg);
      font-size: 46px;
      font-weight: 900;
      color: rgba(15, 23, 42, 0.045);
      letter-spacing: 2px;
      pointer-events: none;
      z-index: 0;
      text-align: center;
      line-height: 1.35;
      user-select: none;
    }
    .brand-header {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid #0284c7;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .brand-subtitle {
      font-size: 12px;
      color: #64748b;
      margin-top: 2px;
    }
    .brand-website {
      font-size: 11.5px;
      font-weight: 700;
      color: #0284c7;
      margin-top: 3px;
    }
    .meta-box {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      background: #f8fafc;
      padding: 10px 14px;
      border-radius: 8px;
      margin-bottom: 20px;
      border: 1px solid #e2e8f0;
      font-size: 12px;
      color: #475569;
    }
    .calc-hero {
      position: relative;
      z-index: 1;
      background: #0f172a;
      color: #ffffff;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 22px;
      text-align: center;
    }
    .calc-hero-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #94a3b8;
      font-weight: 700;
    }
    .calc-hero-result {
      font-size: 32px;
      font-weight: 800;
      color: #38bdf8;
      font-family: -apple-system, BlinkMacSystemFont, "Courier New", monospace;
      margin: 6px 0;
      letter-spacing: -0.5px;
    }
    .calc-hero-sub {
      font-size: 13px;
      color: #34d399;
      font-weight: 600;
    }
    .sec-title {
      position: relative;
      z-index: 1;
      font-size: 13px;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.5px;
      color: #1e293b;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 6px;
      margin-top: 20px;
      margin-bottom: 12px;
    }
    table {
      position: relative;
      z-index: 1;
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px;
      margin-bottom: 20px;
      background: transparent;
    }
    th {
      text-align: left;
      padding: 8px 10px;
      border-bottom: 2px solid #cbd5e1;
      color: #475569;
      font-weight: 700;
      background: #f1f5f9;
    }
    td {
      padding: 8px 10px;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: middle;
    }
    .val-col {
      text-align: right;
      font-family: -apple-system, BlinkMacSystemFont, "Courier New", monospace;
      font-weight: 700;
    }
    .tape-box {
      position: relative;
      z-index: 1;
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      padding: 12px 14px;
      font-family: monospace;
      font-size: 11.5px;
      margin-bottom: 20px;
      color: #334155;
    }
    .tape-row {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      border-bottom: 1px dotted #e2e8f0;
    }
    .tape-row:last-child {
      border-bottom: none;
    }
    .footer {
      position: relative;
      z-index: 1;
      margin-top: 36px;
      border-top: 1.5px solid #cbd5e1;
      padding-top: 12px;
      font-size: 11px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="brand-header">
    <div>
      <div class="brand-title">Daily Khata Pro</div>
      <div class="brand-subtitle">Smart Financial &amp; Calculation Slip · ${params.type}</div>
      <div class="brand-website">Website: www.rozfiber.com</div>
    </div>
    <div style="text-align: right; font-size: 11px; color: #475569;">
      <div>Verified Calculation Record</div>
      <div>Confidential &amp; Accurate</div>
      <div style="font-size: 10px; color: #0284c7; font-weight: 700; margin-top: 2px;">Daily Khata Pro</div>
    </div>
  </div>

  <div class="meta-box">
    <span>Calculation Title: <strong>${params.title}</strong></span>
    <span>Date &amp; Time: <strong>${currentDate} · ${currentTime}</strong></span>
  </div>

  <div class="calc-hero">
    <div class="calc-hero-label">${params.resultLabel || 'Calculated Final Result'}</div>
    <div class="calc-hero-result">${params.mainResult}</div>
    ${params.secondaryInfo ? `<div class="calc-hero-sub">${params.secondaryInfo}</div>` : ''}
  </div>

  <div class="sec-title">Itemized Calculation Breakdown</div>
  <table>
    <thead>
      <tr>
        <th>Calculation Parameter</th>
        <th style="text-align: right;">Computed Value</th>
      </tr>
    </thead>
    <tbody>
      ${params.items
        .map(
          (item) => `
        <tr style="${item.isHighlight ? 'background-color: #f0fdf4;' : ''}">
          <td style="${item.isBold ? 'font-weight: 700; color: #0f172a;' : 'color: #334155;'}">${item.label}</td>
          <td class="val-col" style="${item.isHighlight ? 'color: #15803d; font-size: 13.5px;' : item.isBold ? 'color: #0f172a;' : 'color: #1e293b;'}">${item.value}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  ${
    params.recentTape && params.recentTape.length > 0
      ? `
    <div class="sec-title">Calculation Tape (Audit Trail)</div>
    <div class="tape-box">
      ${params.recentTape
        .map(
          (t) => `
        <div class="tape-row">
          <span>${t.expr}</span>
          <span style="font-weight: bold; color: #0284c7;">= ${t.res}</span>
        </div>
      `
        )
        .join('')}
    </div>
  `
      : ''
  }

  ${
    params.notes
      ? `
    <div style="font-size: 11px; color: #64748b; background: #f8fafc; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0; margin-top: 10px;">
      <strong>Note:</strong> ${params.notes}
    </div>
  `
      : ''
  }

  <div class="footer">
    <div style="display: flex; align-items: center; gap: 8px;">
      <img src="https://avatars.githubusercontent.com/mdzafeerhasan" alt="MD Zafeer Hasan" style="width: 24px; height: 24px; border-radius: 50%; border: 1px solid #0284C7;" />
      <span>
        <strong>Daily Khata Pro</strong> · Modern Financial Ledger Utility<br>
        <span style="color: #0284c7; font-weight: 700;">Developed by MD Zafeer Hasan (YAZDAAN)</span>
      </span>
    </div>
    <div style="text-align: right;">
      <span>Verified Digital Computation</span><br>
      <span style="color: #94a3b8; font-size: 10px;">Generated from local client vault</span>
    </div>
  </div>
</body>
</html>`;
}

/**
 * High-reliability printing using an isolated hidden iframe
 */
export function printCalculatorSlip(params: CalcPrintParams): void {
  try {
    const htmlContent = generateCalculatorSlipHTML(params);
    let printFrame = document.getElementById('calc-print-frame') as HTMLIFrameElement | null;
    if (!printFrame) {
      printFrame = document.createElement('iframe');
      printFrame.id = 'calc-print-frame';
      printFrame.style.position = 'fixed';
      printFrame.style.top = '0';
      printFrame.style.left = '0';
      printFrame.style.width = '1px';
      printFrame.style.height = '1px';
      printFrame.style.border = 'none';
      printFrame.style.opacity = '0.01';
      printFrame.style.pointerEvents = 'none';
      document.body.appendChild(printFrame);
    }

    const doc = printFrame.contentDocument || printFrame.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();
      setTimeout(() => {
        if (printFrame && printFrame.contentWindow) {
          printFrame.contentWindow.focus();
          printFrame.contentWindow.print();
        }
      }, 350);
    }
  } catch (err) {
    console.error('Print slip failed, falling back to window.print():', err);
    window.print();
  }
}

/**
 * Downloads formatted calculation slip as an official HTML / PDF-ready document
 */
export function downloadCalculatorSlipHTML(params: CalcPrintParams): void {
  try {
    const htmlContent = generateCalculatorSlipHTML(params);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const sanitizedTitle = params.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    a.download = `daily-khata-calc-${sanitizedTitle}-${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Download calculation slip failed:', err);
  }
}
