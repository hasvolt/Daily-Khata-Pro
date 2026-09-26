import React from 'react';
import { Invoice } from '../../types';

interface InvoicePrintViewProps {
  invoice: Invoice;
  qrDataUrl?: string;
  isHindi?: boolean;
}

export const InvoicePrintView: React.FC<InvoicePrintViewProps> = ({
  invoice,
  qrDataUrl,
  isHindi = false
}) => {
  const {
    invoiceNumber,
    invoiceDate,
    dueDate,
    poNumber,
    paymentTerms,
    sender,
    client,
    items,
    subtotal,
    itemDiscountTotal,
    extraDiscountTotal,
    totalDiscount,
    taxType,
    taxTotal,
    cgst,
    sgst,
    igst,
    shippingCharges,
    roundOff,
    grandTotal,
    amountInWords,
    bankDetails,
    upiDetails,
    currency,
    templateTheme,
    notes,
    terms,
    signatureData,
    signatureType,
    signatureText,
    status
  } = invoice;

  const isRetail = templateTheme === 'retail';
  const isCorporate = templateTheme === 'corporate';
  const isMinimal = templateTheme === 'minimal';

  return (
    <div
      id="invoice-printable-sheet"
      className="w-full max-w-[850px] mx-auto bg-white text-slate-900 shadow-2xl rounded-2xl p-4 sm:p-8 sm:min-h-[960px] border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none print:rounded-none print:min-h-0 print:h-auto font-sans leading-normal selection:bg-blue-100"
    >
      {/* Top Colorful Accent Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-full mb-4 print:mb-2 print:h-1" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 pb-4 sm:pb-5 border-b-2 border-slate-900 print:border-slate-800 print:pb-2.5">
        <div className="flex items-center gap-3.5 min-w-0">
          {sender.logoUrl ? (
            <img
              src={sender.logoUrl}
              alt={sender.businessName}
              className="h-14 w-14 sm:h-18 sm:w-18 object-contain rounded-lg border border-slate-200 p-1 shrink-0 bg-white print:border-slate-300"
            />
          ) : (
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex items-center justify-center font-black text-xl tracking-wider shrink-0 print:bg-blue-900 print:text-white shadow-xs">
              {sender.businessName ? sender.businessName.charAt(0).toUpperCase() : 'DK'}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-black text-slate-900 print:text-black tracking-tight leading-tight">
              {sender.businessName || 'Business Name'}
            </h1>
            <p className="text-xs text-slate-600 print:text-slate-800 whitespace-pre-line mt-0.5 max-w-sm">
              {sender.address}
              {sender.city ? `, ${sender.city}` : ''}
              {sender.state ? `, ${sender.state}` : ''}
              {sender.pincode ? ` - ${sender.pincode}` : ''}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-600 print:text-slate-800 mt-1">
              {sender.phone && <span>Ph: {sender.phone}</span>}
              {sender.email && <span>Email: {sender.email}</span>}
              {sender.gstin && (
                <span className="font-bold text-slate-900 print:text-black">GSTIN: {sender.gstin}</span>
              )}
            </div>
          </div>
        </div>

        {/* Invoice Title & Meta */}
        <div className="sm:text-right w-full sm:w-auto shrink-0 flex flex-col sm:items-end">
          <div className="inline-flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-slate-900 print:text-black">
              {isRetail ? 'TAX INVOICE' : 'INVOICE'}
            </h2>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs print:border print:border-slate-800 ${
                status === 'paid'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 print:bg-emerald-50 print:text-emerald-900'
                  : status === 'overdue'
                  ? 'bg-rose-100 text-rose-800 border border-rose-300 print:bg-rose-50 print:text-rose-900'
                  : 'bg-amber-100 text-amber-800 border border-amber-300 print:bg-amber-50 print:text-amber-900'
              }`}
            >
              {status}
            </span>
          </div>

          <div className="mt-1.5 text-xs space-y-0.5 text-slate-700 print:text-slate-800">
            <p>
              <span className="text-slate-500 print:text-slate-600 font-medium">Invoice No: </span>
              <strong className="text-slate-900 print:text-black font-bold">{invoiceNumber}</strong>
            </p>
            <p>
              <span className="text-slate-500 print:text-slate-600 font-medium">Invoice Date: </span>
              <strong>{invoiceDate}</strong>
            </p>
            <p>
              <span className="text-slate-500 print:text-slate-600 font-medium">Due Date: </span>
              <strong className="text-slate-900 print:text-black font-bold">{dueDate || 'Due on Receipt'}</strong>
            </p>
            {poNumber && (
              <p>
                <span className="text-slate-500 print:text-slate-600 font-medium">PO Number: </span>
                <strong>{poNumber}</strong>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bill To & Ship To */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 py-3 sm:py-4 border-b border-slate-200 print:border-slate-300 print:py-2">
        <div className="rounded-xl p-3 bg-slate-50/70 border border-slate-200 print:bg-transparent print:border-none print:p-0">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 print:text-slate-600 mb-0.5">
            {isHindi ? 'बिल भेजा गया (Bill To)' : 'Billed To'}
          </p>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 print:text-black">
            {client.clientName || 'Cash / Walk-in Customer'}
          </h3>
          {client.companyName && (
            <p className="text-xs font-semibold text-slate-800 print:text-slate-900">{client.companyName}</p>
          )}
          <p className="text-xs text-slate-600 print:text-slate-800 whitespace-pre-line mt-0.5">
            {client.billingAddress}
            {client.city ? `, ${client.city}` : ''}
            {client.state ? `, ${client.state}` : ''}
            {client.pincode ? ` - ${client.pincode}` : ''}
          </p>
          <div className="text-[11px] text-slate-600 print:text-slate-800 mt-1 space-y-0.5">
            {client.phone && <p>Phone: {client.phone}</p>}
            {client.email && <p>Email: {client.email}</p>}
            {client.gstin && (
              <p className="font-bold text-slate-900 print:text-black">GSTIN: {client.gstin}</p>
            )}
          </div>
        </div>

        {client.hasShippingAddress && client.shippingAddress ? (
          <div className="rounded-xl p-3 bg-slate-50/70 border border-slate-200 print:bg-transparent print:border-none print:p-0">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 print:text-slate-600 mb-0.5">
              {isHindi ? 'डिलीवरी का पता (Ship To)' : 'Shipped To'}
            </p>
            <p className="text-xs text-slate-700 print:text-slate-800 whitespace-pre-line">
              {client.shippingAddress}
            </p>
          </div>
        ) : (
          <div className="hidden sm:flex flex-col justify-end text-right text-xs text-slate-500 print:text-slate-700">
            <p className="italic">
              Payment Terms: <span className="font-semibold text-slate-800 print:text-slate-900 capitalize">{paymentTerms}</span>
            </p>
          </div>
        )}
      </div>

      {/* Line Items Table */}
      <div className="py-2.5 sm:py-3.5 overflow-x-auto print:overflow-visible print:py-1.5">
        <table className="w-full text-left border-collapse text-xs print:border print:border-slate-400">
          <thead>
            <tr className="border-b-2 border-slate-900 bg-slate-100 text-slate-900 font-bold uppercase tracking-wider text-[10px] print:bg-slate-100 print:border-slate-800 print:text-black">
              <th className="py-2 px-2 text-center w-8 print:border-r print:border-slate-300">#</th>
              <th className="py-2 px-2 print:border-r print:border-slate-300">Item Description</th>
              {isRetail && <th className="py-2 px-2 text-center print:border-r print:border-slate-300">HSN/SAC</th>}
              <th className="py-2 px-2 text-right print:border-r print:border-slate-300">Qty</th>
              <th className="py-2 px-2 text-right print:border-r print:border-slate-300">Rate ({currency})</th>
              {itemDiscountTotal > 0 && <th className="py-2 px-2 text-right print:border-r print:border-slate-300">Disc</th>}
              {taxType !== 'none' && <th className="py-2 px-2 text-right print:border-r print:border-slate-300">Tax %</th>}
              <th className="py-2 px-2 text-right">Amount ({currency})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 print:divide-slate-300">
            {items.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-50/50 print:hover:bg-transparent">
                <td className="py-1.5 px-2 text-center font-mono text-slate-500 print:text-slate-700 text-[11px] print:border-r print:border-slate-200">
                  {idx + 1}
                </td>
                <td className="py-1.5 px-2 print:border-r print:border-slate-200">
                  <div className="font-bold text-slate-900 print:text-black">{item.description || 'Item Name'}</div>
                  {item.hsnSac && !isRetail && (
                    <span className="text-[10px] text-slate-500 print:text-slate-600 font-mono">HSN: {item.hsnSac}</span>
                  )}
                </td>
                {isRetail && (
                  <td className="py-1.5 px-2 text-center font-mono text-slate-700 print:border-r print:border-slate-200">
                    {item.hsnSac || '-'}
                  </td>
                )}
                <td className="py-1.5 px-2 text-right font-medium text-slate-900 print:border-r print:border-slate-200">
                  {item.quantity} {item.unit || ''}
                </td>
                <td className="py-1.5 px-2 text-right font-mono text-slate-900 print:border-r print:border-slate-200">
                  {item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                {itemDiscountTotal > 0 && (
                  <td className="py-1.5 px-2 text-right text-slate-600 font-mono print:border-r print:border-slate-200">
                    {item.discountValue > 0
                      ? item.discountType === 'percent'
                        ? `${item.discountValue}%`
                        : `${currency}${item.discountValue}`
                      : '-'}
                  </td>
                )}
                {taxType !== 'none' && (
                  <td className="py-1.5 px-2 text-right text-slate-700 font-mono print:border-r print:border-slate-200">
                    {item.taxRate > 0 ? `${item.taxRate}%` : '0%'}
                  </td>
                )}
                <td className="py-1.5 px-2 text-right font-bold font-mono text-slate-900 print:text-black">
                  {item.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Calculations & Summary Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 pt-3 sm:pt-4 border-t-2 border-slate-900 print:border-slate-800 print:pt-2 print:gap-3 invoice-summary-section print-break-inside-avoid">
        {/* Left side: Bank, UPI QR, and Amount In Words */}
        <div className="w-full sm:w-7/12 space-y-2 sm:space-y-2.5 print:space-y-1.5">
          {/* Amount In Words */}
          <div className="p-2 sm:p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs print:bg-slate-50 print:border-slate-300 print:p-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 print:text-slate-700 block tracking-wider">
              Amount In Words:
            </span>
            <p className="font-semibold text-slate-900 print:text-black italic mt-0.5">
              {amountInWords}
            </p>
          </div>

          {/* Payment & Bank Details */}
          {(bankDetails?.accountNumber || upiDetails?.upiId) && (
            <div className="p-2.5 sm:p-3 bg-slate-50/80 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between print:bg-slate-50 print:border-slate-300 print:p-2">
              <div className="space-y-0.5 min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-slate-600 print:text-slate-700 block tracking-wider">
                  Payment Details:
                </span>
                {bankDetails?.bankName && (
                  <p className="text-slate-800 print:text-black">
                    <span className="text-slate-500 print:text-slate-600">Bank:</span> <strong>{bankDetails.bankName}</strong>
                    {bankDetails.branchName && ` (${bankDetails.branchName})`}
                  </p>
                )}
                {bankDetails?.accountName && (
                  <p className="text-slate-800 print:text-black">
                    <span className="text-slate-500 print:text-slate-600">A/C Name:</span> <strong>{bankDetails.accountName}</strong>
                  </p>
                )}
                {bankDetails?.accountNumber && (
                  <p className="text-slate-800 print:text-black">
                    <span className="text-slate-500 print:text-slate-600">A/C No:</span> <strong className="font-mono">{bankDetails.accountNumber}</strong>
                  </p>
                )}
                {bankDetails?.ifscCode && (
                  <p className="text-slate-800 print:text-black">
                    <span className="text-slate-500 print:text-slate-600">IFSC Code:</span> <strong className="font-mono">{bankDetails.ifscCode}</strong>
                  </p>
                )}
                {upiDetails?.upiId && (
                  <p className="text-slate-800 print:text-black font-mono text-[11px] pt-0.5">
                    <span className="text-slate-500 print:text-slate-600 font-sans">UPI ID:</span> <strong>{upiDetails.upiId}</strong>
                  </p>
                )}
              </div>

              {/* UPI QR Code */}
              {qrDataUrl && (
                <div className="flex flex-col items-center justify-center shrink-0 text-center">
                  <div className="p-1 bg-white border border-slate-300 rounded-lg shadow-xs">
                    <img src={qrDataUrl} alt="UPI QR Code" className="w-16 h-16 sm:w-20 sm:h-20 object-contain print:w-16 print:h-16" />
                  </div>
                  <span className="text-[8.5px] font-bold text-slate-600 print:text-slate-700 uppercase tracking-tight mt-0.5">
                    Scan & Pay UPI
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side: Calculations breakdown */}
        <div className="w-full sm:w-5/12 space-y-1 text-xs print:space-y-0.5">
          <div className="flex justify-between py-0.5 sm:py-1 text-slate-700 print:text-slate-800 border-b border-slate-100 print:border-slate-200">
            <span>Subtotal:</span>
            <span className="font-mono font-medium text-slate-900 print:text-black">
              {currency} {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {totalDiscount > 0 && (
            <div className="flex justify-between py-0.5 sm:py-1 text-emerald-700 print:text-emerald-900 border-b border-slate-100 print:border-slate-200">
              <span>Total Discount:</span>
              <span className="font-mono font-medium">
                - {currency} {totalDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {/* Tax Breakdown */}
          {taxType === 'cgst_sgst' && taxTotal > 0 && (
            <>
              <div className="flex justify-between py-0.5 sm:py-1 text-slate-700 print:text-slate-800 border-b border-slate-100 print:border-slate-200">
                <span>CGST:</span>
                <span className="font-mono font-medium text-slate-900 print:text-black">
                  {currency} {cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between py-0.5 sm:py-1 text-slate-700 print:text-slate-800 border-b border-slate-100 print:border-slate-200">
                <span>SGST:</span>
                <span className="font-mono font-medium text-slate-900 print:text-black">
                  {currency} {sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </>
          )}

          {taxType === 'igst' && taxTotal > 0 && (
            <div className="flex justify-between py-0.5 sm:py-1 text-slate-700 print:text-slate-800 border-b border-slate-100 print:border-slate-200">
              <span>IGST:</span>
              <span className="font-mono font-medium text-slate-900 print:text-black">
                {currency} {igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {taxType === 'single' && taxTotal > 0 && (
            <div className="flex justify-between py-0.5 sm:py-1 text-slate-700 print:text-slate-800 border-b border-slate-100 print:border-slate-200">
              <span>Tax:</span>
              <span className="font-mono font-medium text-slate-900 print:text-black">
                {currency} {taxTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {shippingCharges > 0 && (
            <div className="flex justify-between py-0.5 sm:py-1 text-slate-700 print:text-slate-800 border-b border-slate-100 print:border-slate-200">
              <span>Shipping / Delivery:</span>
              <span className="font-mono font-medium text-slate-900 print:text-black">
                {currency} {shippingCharges.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {roundOff !== 0 && (
            <div className="flex justify-between py-0.5 sm:py-1 text-slate-600 print:text-slate-700 border-b border-slate-100 print:border-slate-200">
              <span>Round Off:</span>
              <span className="font-mono">
                {roundOff > 0 ? `+${roundOff}` : roundOff}
              </span>
            </div>
          )}

          {/* Grand Total */}
          <div className="flex justify-between items-center py-2 px-3 bg-slate-100 border border-slate-300 text-slate-900 rounded-xl font-bold text-sm sm:text-base print:bg-slate-100 print:border-slate-800 print:text-black shadow-2xs mt-1.5 grand-total-print-bar">
            <span className="text-slate-800 print:text-black font-extrabold uppercase tracking-wide text-xs sm:text-sm">Grand Total:</span>
            <span className="font-mono text-base sm:text-lg font-black text-slate-900 print:text-black">
              {currency} {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Terms & Conditions + Authorized Signatory */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-3 sm:pt-5 mt-3 sm:mt-5 border-t border-slate-200 print:border-slate-300 print:pt-2 print:mt-2 print:gap-3 invoice-terms-signature-section print-break-inside-avoid">
        <div className="space-y-1.5 print:space-y-1">
          {terms && (
            <div>
              <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-500 print:text-slate-700 mb-0.5">
                Terms & Conditions
              </h4>
              <p className="text-[11px] text-slate-600 print:text-slate-800 whitespace-pre-line leading-relaxed">
                {terms}
              </p>
            </div>
          )}
          {notes && (
            <div className="pt-0.5">
              <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-500 print:text-slate-700 mb-0.5">
                Notes
              </h4>
              <p className="text-[11px] text-slate-600 print:text-slate-800 italic">
                {notes}
              </p>
            </div>
          )}
        </div>

        {/* Signature Box */}
        <div className="flex flex-col items-center sm:items-end justify-end text-center sm:text-right pt-2 sm:pt-0">
          <div className="flex flex-col items-center sm:items-end">
            {signatureData ? (
              <img
                src={signatureData}
                alt="Signature"
                className="h-12 sm:h-14 object-contain mb-1 print:h-10"
              />
            ) : (
              <div className="h-10 flex items-end">
                <span className="font-serif italic text-base sm:text-lg text-slate-800 print:text-black">
                  {signatureText || sender.businessName}
                </span>
              </div>
            )}
            <div className="w-44 sm:w-48 border-b-2 border-slate-900 print:border-black mt-1" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 print:text-slate-800 mt-0.5">
              Authorized Signatory
            </span>
            <span className="text-[9px] text-slate-500 print:text-slate-600">
              For {sender.businessName || 'Business'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Branding Note */}
      <div className="pt-2 sm:pt-3 mt-3 sm:mt-4 border-t border-slate-200 print:border-slate-300 print:pt-1.5 print:mt-2 flex items-center justify-center text-center invoice-branding-footer print-break-inside-avoid">
        <p className="text-[10.5px] text-slate-500 print:text-slate-700 font-medium">
          Generated by Daily Khata Pro • <span className="font-mono text-slate-700 print:text-slate-900 font-bold">www.rozfiber.com</span>
        </p>
      </div>
    </div>
  );
};
