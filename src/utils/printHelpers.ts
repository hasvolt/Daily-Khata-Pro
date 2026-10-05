export const printHTMLContent = (htmlContent: string) => {
  try {
    const existingFrame = document.getElementById('khata-print-frame');
    if (existingFrame) {
      existingFrame.remove();
    }

    const printFrame = document.createElement('iframe');
    printFrame.id = 'khata-print-frame';
    printFrame.style.position = 'fixed';
    printFrame.style.left = '-9999px';
    printFrame.style.top = '-9999px';
    printFrame.style.width = '1024px';
    printFrame.style.height = '1200px';
    printFrame.style.border = '0';
    printFrame.style.opacity = '0';
    printFrame.style.pointerEvents = 'none';
    document.body.appendChild(printFrame);

    const frameWindow = printFrame.contentWindow;
    const frameDoc = frameWindow?.document || printFrame.contentDocument;
    if (frameDoc && frameWindow) {
      frameDoc.open();
      frameDoc.write(htmlContent);
      frameDoc.close();

      const doPrint = async () => {
        try {
          if (frameDoc.fonts && frameDoc.fonts.ready) {
            await frameDoc.fonts.ready;
          }
          const images = Array.from(frameDoc.images || []);
          if (images.length > 0) {
            await Promise.all(
              images.map(
                (img) =>
                  new Promise<void>((resolve) => {
                    if (img.complete && img.naturalWidth !== 0) {
                      resolve();
                    } else {
                      img.onload = () => resolve();
                      img.onerror = () => resolve();
                      setTimeout(resolve, 1500);
                    }
                  })
              )
            );
          }
          await new Promise((r) => setTimeout(r, 120));
          frameWindow.focus();
          frameWindow.print();
        } catch {
          window.print();
        }
      };

      if (frameDoc.readyState === 'complete') {
        doPrint();
      } else {
        frameWindow.addEventListener('load', () => doPrint(), { once: true });
        setTimeout(doPrint, 500);
      }
    } else {
      window.print();
    }
  } catch {
    window.print();
  }
};
