import React, { useState, useCallback } from 'react';
import { ArrayOfObjectsInputProps, set, insert } from 'sanity';
import {
  hasMarkdownSyntax,
  markdownToHtml,
  markdownToPortableTextBlocks
} from './markdownUtils';

export function MarkdownPastePortableTextInput(props: ArrayOfObjectsInputProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [markdownInput, setMarkdownInput] = useState('');
  const [insertMode, setInsertMode] = useState<'append' | 'replace'>('append');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  /**
   * Automatic onPasteCapture:
   * Catches paste events within the Portable Text editor.
   * If Markdown syntax is detected in plain text, it converts it
   * into clean HTML and injects it so Portable Text editor formats it.
   */
  const handlePasteCapture = useCallback((event: React.ClipboardEvent) => {
    try {
      const clipboard = event.clipboardData;
      if (!clipboard) return;

      const plainText = clipboard.getData('text/plain');
      const htmlText = clipboard.getData('text/html');

      // Only intervene if plain text contains markdown syntax and it's not already pre-formatted rich HTML with headings
      const isPlainMarkdown = hasMarkdownSyntax(plainText);
      const hasRealHtmlHeadings = htmlText && /<(h[1-6]|ul|ol|blockquote)/i.test(htmlText);

      if (isPlainMarkdown && !hasRealHtmlHeadings) {
        const convertedHtml = markdownToHtml(plainText);

        if (convertedHtml && typeof document !== 'undefined' && document.queryCommandSupported('insertHTML')) {
          event.preventDefault();
          event.stopPropagation();
          const inserted = document.execCommand('insertHTML', false, convertedHtml);

          if (inserted) {
            showToast('✓ Markdown automatically converted to Portable Text');
            return;
          }
        }

        // Fallback: If document.execCommand did not handle it, convert directly to Portable Text blocks
        const blocks = markdownToPortableTextBlocks(plainText);
        if (blocks && blocks.length > 0) {
          event.preventDefault();
          event.stopPropagation();

          if (!props.value || props.value.length === 0) {
            props.onChange(set(blocks));
          } else {
            props.onChange(insert(blocks, 'after', [-1]));
          }
          showToast('✓ Markdown converted into formatted blocks');
        }
      }
    } catch (err) {
      console.warn('Markdown paste capture handled with standard fallback:', err);
    }
  }, [props]);

  /**
   * Helper modal submission:
   * Converts user's pasted markdown directly into valid Portable Text blocks.
   */
  const handleInsertMarkdownModal = () => {
    if (!markdownInput.trim()) return;

    try {
      const blocks = markdownToPortableTextBlocks(markdownInput);
      if (blocks.length === 0) return;

      if (insertMode === 'replace' || !props.value || props.value.length === 0) {
        props.onChange(set(blocks));
        showToast(`✓ Replaced with ${blocks.length} formatted blocks`);
      } else {
        props.onChange(insert(blocks, 'after', [-1]));
        showToast(`✓ Appended ${blocks.length} formatted blocks`);
      }

      setMarkdownInput('');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to convert markdown:', err);
      alert('Error parsing markdown. Please check format.');
    }
  };

  return (
    <div className="markdown-paste-wrapper" style={{ position: 'relative' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'absolute',
            top: '-36px',
            right: 0,
            zIndex: 100,
            background: '#059669',
            color: '#ffffff',
            padding: '4px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            pointerEvents: 'none',
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Auxiliary Toolbar Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
          padding: '4px 8px',
          background: '#132438',
          border: '1px solid #213E61',
          borderRadius: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
            ⚡ Markdown Paste Auto-Converter Active
          </span>
          <span
            style={{
              fontSize: '10px',
              padding: '1px 6px',
              borderRadius: '4px',
              background: '#0284C7',
              color: '#ffffff',
              fontWeight: 700,
            }}
          >
            AI-Ready
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 10px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#38BDF8',
            background: '#0E1A29',
            border: '1px solid #0284C7',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          <span>📋 Paste Markdown / AI Draft</span>
        </button>
      </div>

      {/* Portable Text Editor with Paste Interception */}
      <div onPasteCapture={handlePasteCapture}>
        {props.renderDefault(props)}
      </div>

      {/* Paste Markdown Helper Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '680px',
              backgroundColor: '#0E1A29',
              border: '1px solid #213E61',
              borderRadius: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '90vh',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #213E61',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#132438',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#F8FAFC' }}>
                  Paste Markdown / AI Article Draft
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#94A3B8' }}>
                  Automatically formats headings (#, ##, ###), bold (**text**), lists (- or 1.), and quotes (&gt;)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                  Paste text or choose a local file (.md, .txt) to load:
                </span>
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    background: '#1E293B',
                    border: '1px solid #38BDF8',
                    color: '#38BDF8',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  📁 Upload / Open File (.md, .txt)
                  <input
                    type="file"
                    accept=".md,.markdown,.txt"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const content = ev.target?.result as string;
                        if (content) {
                          setMarkdownInput(content);
                          showToast(`✓ Loaded file: ${file.name}`);
                        }
                      };
                      reader.readAsText(file);
                    }}
                  />
                </label>
              </div>

              <textarea
                value={markdownInput}
                onChange={(e) => setMarkdownInput(e.target.value)}
                placeholder="Paste Markdown from ChatGPT, Claude, Gemini, or file here...&#10;&#10;# Main Heading&#10;&#10;Paragraph with **bold text**...&#10;&#10;## Section Heading&#10;&#10;- Point 1&#10;- Point 2"
                rows={12}
                style={{
                  width: '100%',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  backgroundColor: '#070E18',
                  color: '#F8FAFC',
                  border: '1px solid #213E61',
                  borderRadius: '10px',
                  padding: '12px',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#CBD5E1' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="insertMode"
                      checked={insertMode === 'append'}
                      onChange={() => setInsertMode('append')}
                    />
                    Append to existing content
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="insertMode"
                      checked={insertMode === 'replace'}
                      onChange={() => setInsertMode('replace')}
                    />
                    Replace entire Body
                  </label>
                </div>

                <span style={{ fontSize: '11px', color: '#64748B' }}>
                  {markdownInput.split('\n').filter((l) => l.trim()).length} blocks ready
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '12px 20px',
                borderTop: '1px solid #213E61',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '10px',
                background: '#132438',
              }}
            >
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #213E61',
                  background: '#0E1A29',
                  color: '#94A3B8',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertMarkdownModal}
                disabled={!markdownInput.trim()}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: markdownInput.trim() ? '#0284C7' : '#475569',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: markdownInput.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                ✨ Insert Formatted Blocks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
