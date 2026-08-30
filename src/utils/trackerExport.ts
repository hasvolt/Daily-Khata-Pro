import { WorkLog, DailyLifeLog } from '../types';

export const downloadTrackerCSV = (workLogs: WorkLog[], dailyLifeLogs: DailyLifeLog[]) => {
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // Work Logs Section
  csvContent += "--- WORK & DELIVERABLES HISTORY ---\n";
  csvContent += "ID,Date,Title,Client/Company,Category,Status,Hours,Earnings/Cost,Location,Notes,Deliverables,Created At\n";
  workLogs.forEach(log => {
    const row = [
      `"${log.id}"`,
      `"${log.date}"`,
      `"${(log.title || '').replace(/"/g, '""')}"`,
      `"${(log.clientOrCompany || '').replace(/"/g, '""')}"`,
      `"${log.category || ''}"`,
      `"${log.status || ''}"`,
      log.hoursSpent || 0,
      log.earningsOrCost || 0,
      `"${(log.location || '').replace(/"/g, '""')}"`,
      `"${(log.notes || '').replace(/"/g, '""')}"`,
      `"${(log.deliverables ? log.deliverables.join(';') : '').replace(/"/g, '""')}"`,
      `"${new Date(log.createdAt).toISOString()}"`
    ];
    csvContent += row.join(",") + "\n";
  });
  
  csvContent += "\n\n";

  // Daily Life Section
  csvContent += "--- DAILY LIFE & DIARY LOGS ---\n";
  csvContent += "ID,Date,Title,Highlights,Mood,Wake Time,Sleep Time,Morning,Afternoon,Evening,Learnings,Gratitude,Tags,Created At\n";
  dailyLifeLogs.forEach(log => {
    const row = [
      `"${log.id}"`,
      `"${log.date}"`,
      `"${(log.title || '').replace(/"/g, '""')}"`,
      `"${(log.highlights || '').replace(/"/g, '""')}"`,
      `"${log.mood || ''}"`,
      `"${log.wakeTime || ''}"`,
      `"${log.sleepTime || ''}"`,
      `"${(log.morningRoutine || '').replace(/"/g, '""')}"`,
      `"${(log.afternoonRoutine || '').replace(/"/g, '""')}"`,
      `"${(log.eveningRoutine || '').replace(/"/g, '""')}"`,
      `"${(log.keyLearnings || '').replace(/"/g, '""')}"`,
      `"${(log.gratitude || '').replace(/"/g, '""')}"`,
      `"${(log.tags ? log.tags.join(';') : '').replace(/"/g, '""')}"`,
      `"${new Date(log.createdAt).toISOString()}"`
    ];
    csvContent += row.join(",") + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `work-life-tracker-backup-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const printTrackerData = (workLogs: WorkLog[], dailyLifeLogs: DailyLifeLog[]) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Work & Life Tracker Backup</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; color: #111; max-width: 1000px; margin: 0 auto; padding: 20px; }
        h1, h2, h3 { color: #222; }
        h1 { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 30px; }
        h2 { margin-top: 40px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px; }
        th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; vertical-align: top; }
        th { background-color: #f5f5f5; font-weight: bold; }
        tr:nth-child(even) { background-color: #fafafa; }
        .meta { color: #666; font-size: 13px; }
        @media print {
          body { padding: 0; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>Work & Life Tracker - Data Backup</h1>
      <p class="meta">Generated on: ${new Date().toLocaleString()}</p>
      
      <h2>Work & Deliverables History</h2>
      <table>
        <thead>
          <tr>
            <th width="12%">Date</th>
            <th width="15%">Title / Client</th>
            <th width="10%">Category</th>
            <th width="10%">Status</th>
            <th width="10%">Earnings/Hrs</th>
            <th width="43%">Details & Notes</th>
          </tr>
        </thead>
        <tbody>
          ${workLogs.map(log => `
            <tr>
              <td><strong>${log.date}</strong></td>
              <td><strong>${log.title}</strong><br/>${log.clientOrCompany ? `<span class="meta">${log.clientOrCompany}</span>` : ''}</td>
              <td>${log.category}</td>
              <td>${log.status}</td>
              <td>${log.earningsOrCost ? `₹${log.earningsOrCost}` : '-'}<br/>${log.hoursSpent ? `${log.hoursSpent} hrs` : ''}</td>
              <td>
                ${log.notes ? `<p style="margin:0 0 5px 0;">${log.notes}</p>` : ''}
                ${log.deliverables && log.deliverables.length > 0 ? `<ul style="margin:0; padding-left:15px;">${log.deliverables.map(d => `<li>${d}</li>`).join('')}</ul>` : ''}
              </td>
            </tr>
          `).join('')}
          ${workLogs.length === 0 ? '<tr><td colspan="6" style="text-align:center;">No work logs found.</td></tr>' : ''}
        </tbody>
      </table>

      <h2>Daily Life & Diary History</h2>
      <table>
        <thead>
          <tr>
            <th width="12%">Date</th>
            <th width="10%">Mood</th>
            <th width="78%">Journal Highlights & Routines</th>
          </tr>
        </thead>
        <tbody>
          ${dailyLifeLogs.map(log => `
            <tr>
              <td><strong>${log.date}</strong></td>
              <td>${log.mood || '-'}</td>
              <td>
                ${log.title ? `<strong style="display:block; margin-bottom:5px;">${log.title}</strong>` : ''}
                <p style="margin:0 0 8px 0;">${log.highlights}</p>
                ${(log.morningRoutine || log.afternoonRoutine || log.eveningRoutine) ? `
                  <div style="font-size:13px; color:#444; border-left:2px solid #ccc; padding-left:10px; margin-bottom:8px;">
                    ${log.morningRoutine ? `<strong>Morning:</strong> ${log.morningRoutine}<br/>` : ''}
                    ${log.afternoonRoutine ? `<strong>Afternoon:</strong> ${log.afternoonRoutine}<br/>` : ''}
                    ${log.eveningRoutine ? `<strong>Evening:</strong> ${log.eveningRoutine}` : ''}
                  </div>
                ` : ''}
                ${log.keyLearnings ? `<p style="margin:0 0 5px 0; font-size:13px;"><strong>Learnings:</strong> ${log.keyLearnings}</p>` : ''}
                ${log.gratitude ? `<p style="margin:0; font-size:13px;"><strong>Gratitude:</strong> ${log.gratitude}</p>` : ''}
              </td>
            </tr>
          `).join('')}
          ${dailyLifeLogs.length === 0 ? '<tr><td colspan="3" style="text-align:center;">No life logs found.</td></tr>' : ''}
        </tbody>
      </table>
      <div style="text-align:center; margin-top:30px;">
        <button onclick="window.print()" style="padding:10px 20px; font-size:16px; cursor:pointer;">Print / Save as PDF</button>
      </div>
      <script>
        window.onload = () => { setTimeout(() => window.print(), 500); }
      </script>
    </body>
    </html>
  `;

  let printFrame = document.getElementById('tracker-print-frame') as HTMLIFrameElement | null;
  if (!printFrame) {
    printFrame = document.createElement('iframe');
    printFrame.id = 'tracker-print-frame';
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
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
  }
};
