export const printHTMLContent = (htmlContent: string) => {
  try {
    const existingFrame = document.getElementById('khata-print-frame');
    if (existingFrame) {
      existingFrame.remove();
    }

    const printFrame = document.createElement('iframe');
    printFrame.id = 'khata-print-frame';
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument;
    if (frameDoc) {
      frameDoc.open();
      frameDoc.write(htmlContent);
      frameDoc.close();

      setTimeout(() => {
        try {
          printFrame.contentWindow?.focus();
          printFrame.contentWindow?.print();
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
};
