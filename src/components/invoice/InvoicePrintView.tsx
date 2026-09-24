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
      className="w-full max-w-[850px] mx-auto bg-white text-slate-900 shadow-2xl rounded-2xl p-6 sm:p-10 border border-slate-200 print:border-none print:shadow-none print:p-2 print:m-0 print:max-w-none print:rounded-none font-sans leading-normal selection:bg-blue-100"
      style={{ minHeight: '1050px' }}
    >
      {/* Top Colorful Accent Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-full mb-6 print:mb-4" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-slate-900 print:border-slate-800">
        <div className="flex items-center gap-3.5 min-w-0">
          {sender.logoUrl ? (
            <img
              src={sender.logoUrl}
              alt={sender.businessName}
              className="h-16 w-16 sm:h-20 sm:w-20 object-contain rounded-lg border border-slate-200 p-1 shrink-0 bg-white"
            />
          ) : (
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex items-center justify-center font-black text-xl tracking-wider shrink-0 print:bg-blue-800 print:text-white shadow-xs">
              {sender.businessName ? sender.businessName.charAt(0).toUpperCase() : 'DK'}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              {sender.businessName || 'Business Name'}
            </h1>
            <p className="text-xs text-slate-600 whitespace-pre-line mt-0.5 max-w-sm">
              {sender.address}
              {sender.city ? `, ${sender.city}` : ''}
              {sender.state ? `, ${sender.state}` : ''}
              {sender.pincode ? ` - ${sender.pincode}` : ''}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500 mt-1">
              {sender.phone && <span>Ph: {sender.phone}</span>}
              {sender.email && <span>Email: {sender.email}</span>}
              {sender.gstin && (
                <span className="font-bold text-slate-800">GSTIN: {sender.gstin}</span>
              )}
            </div>
          </div>
        </div>

        {/* Invoice Title & Meta */}
        <div className="sm:text-right w-full sm:w-auto shrink-0 flex flex-col sm:items-end">
          <div className="inline-flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-slate-900 print:text-slate-900">
              {isRetail ? 'TAX INVOICE' : 'INVOICE'}
            </h2>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs ${
                status === 'paid'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : status === 'overdue'
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {status}
            </span>
          </div>

          <div className="mt-2 text-xs space-y-0.5 text-slate-700">
            <p>
              <span className="text-slate-500 font-medium">Invoice No: </span>
              <strong className="text-slate-900 font-bold">{invoiceNumber}</strong>
            </p>
            <p>
              <span className="text-slate-500 font-medium">Invoice Date: </span>
              <strong>{invoiceDate}</strong>
            </p>
            <p>
              <span className="text-slate-500 font-medium">Due Date: </span>
              <strong className="text-slate-900 font-bold">{dueDate || 'Due on Receipt'}</strong>
            </p>
            {poNumber && (
              <p>
                <span className="text-slate-500 font-medium">PO Number: </span>
                <strong>{poNumber}</strong>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bill To & Ship To */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-b border-slate-200">
        <div className="rounded-xl p-3.5 bg-slate-50/70 border border-slate-100 print:bg-transparent print:border-none print:p-0">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
            {isHindi ? 'बिल भेजा गया (Bill To)' : 'Billed To'}
          </p>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            {client.clientName || 'Cash / Walk-in Customer'}
          </h3>
          {client.companyName && (
            <p className="text-xs font-medium text-slate-700">{client.companyName}</p>
          )}
          <p className="text-xs text-slate-600 whitespace-pre-line mt-0.5">
            {client.billingAddress}
            {client.city ? `, ${client.city}` : ''}
            {client.state ? `, ${client.state}` : ''}
            {client.pincode ? ` - ${client.pincode}` : ''}
          </p>
          <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
            {client.phone && <p>Phone: {client.phone}</p>}
            {client.email && <p>Email: {client.email}</p>}
            {client.gstin && (
              <p className="font-bold text-slate-800">GSTIN: {client.gstin}</p>
            )}
          </div>
        </div>

        {client.hasShippingAddress && client.shippingAddress ? (
          <div className="rounded-xl p-3.5 bg-slate-50/70 border border-slate-100 print:bg-transparent print:border-none print:p-0">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
              {isHindi ? 'डिलीवरी का पता (Ship To)' : 'Shipped To'}
            </p>
            <p className="text-xs text-slate-700 whitespace-pre-line">
              {client.shippingAddress}
            </p>
          </div>
        ) : (
          <div className="hidden sm:flex flex-col justify-end text-right text-xs text-slate-500">
            <p className="italic">
              Payment Terms: <span className="font-semibold text-slate-700 capitalize">{paymentTerms}</span>
            </p>
          </div>
        )}
      </div>

      {/* Line Items Table */}
      <div className="py-4 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b-2 border-slate-900 bg-slate-100 text-slate-900 font-bold uppercase tracking-wider text-[10px] print:bg-transparent print:border-black">
              <th className="py-2 px-2 text-center w-8">#</th>
              <th className="py-2 px-2">Item Description</th>
              {isRetail && <th className="py-2 px-2 text-center">HSN/SAC</th>}
              <th className="py-2 px-2 text-right">Qty</th>
              <th className="py-2 px-2 text-right">Rate ({currency})</th>
              {itemDiscountTotal > 0 && <th className="py-2 px-2 text-right">Disc</th>}
              {taxType !== 'none' && <th className="py-2 px-2 text-right">Tax %</th>}
              <th className="py-2 px-2 text-right">Amount ({currency})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-50/50 print:hover:bg-transparent">
                <td className="py-2 px-2 text-center font-mono text-slate-400 text-[11px]">
                  {idx + 1}
                </td>
                <td className="py-2 px-2">
                  <div className="font-bold text-slate-800">{item.description || 'Item Name'}</div>
                  {item.hsnSac && !isRetail && (
                    <span className="text-[10px] text-slate-400 font-mono">HSN: {item.hsnSac}</span>
                  )}
                </td>
                {isRetail && (
                  <td className="py-2 px-2 text-center font-mono text-slate-600">
                    {item.hsnSac || '-'}
                  </td>
                )}
                <td className="py-2 px-2 text-right font-medium">
                  {item.quantity} {item.unit || ''}
                </td>
                <td className="py-2 px-2 text-right font-mono">
                  {item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                {itemDiscountTotal > 0 && (
                  <td className="py-2 px-2 text-right text-slate-500 font-mono">
                    {item.discountValue > 0
                      ? item.discountType === 'percent'
                        ? `${item.discountValue}%`
                        : `${currency}${item.discountValue}`
                      : '-'}
                  </td>
                )}
                {taxType !== 'none' && (
                  <td className="py-2 px-2 text-right text-slate-600 font-mono">
                    {item.taxRate > 0 ? `${item.taxRate}%` : '0%'}
                  </td>
                )}
                <td className="py-2 px-2 text-right font-bold font-mono text-slate-900">
                  {item.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Calculations & Summary Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t-2 border-slate-900 print:border-black">
        {/* Left side: Bank, UPI QR, and Amount In Words */}
        <div className="w-full sm:w-7/12 space-y-3">
          {/* Amount In Words */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs print:bg-transparent print:border-slate-300">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Amount In Words:
            </span>
            <p className="font-semibold text-slate-900 italic mt-0.5">
              {amountInWords}
            </p>
          </div>

          {/* Payment & Bank Details */}
          {(bankDetails?.accountNumber || upiDetails?.upiId) && (
            <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row gap-4 items-center justify-between print:bg-transparent">
              <div className="space-y-1 min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
                  Payment Details:
                </span>
                {bankDetails?.bankName && (
                  <p className="text-slate-800">
                    <span className="text-slate-500">Bank:</span> <strong>{bankDetails.bankName}</strong>
                    {bankDetails.branchName && ` (${bankDetails.branchName})`}
                  </p>
                )}
                {bankDetails?.accountName && (
                  <p className="text-slate-800">
                    <span className="text-slate-500">A/C Name:</span> <strong>{bankDetails.accountName}</strong>
                  </p>
                )}
                {bankDetails?.accountNumber && (
                  <p className="text-slate-800">
                    <span className="text-slate-500">A/C No:</span> <strong className="font-mono">{bankDetails.accountNumber}</strong>
                  </p>
                )}
                {bankDetails?.ifscCode && (
                  <p className="text-slate-800">
                    <span className="text-slate-500">IFSC Code:</span> <strong className="font-mono">{bankDetails.ifscCode}</strong>
                  </p>
                )}
                {upiDetails?.upiId && (
                  <p className="text-slate-800 font-mono text-[11px] pt-0.5">
                    <span className="text-slate-500 font-sans">UPI ID:</span> <strong>{upiDetails.upiId}</strong>
                  </p>
                )}
              </div>

              {/* UPI QR Code */}
              {qrDataUrl && (
                <div className="flex flex-col items-center justify-center shrink-0 text-center">
                  <div className="p-1.5 bg-white border border-slate-300 rounded-lg shadow-xs">
                    <img src={qrDataUrl} alt="UPI QR Code" className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight mt-1">
                    Scan & Pay via UPI
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side: Calculations breakdown */}
        <div className="w-full sm:w-5/12 space-y-1.5 text-xs">
          <div className="flex justify-between py-1 text-slate-600 border-b border-slate-100">
            <span>Subtotal:</span>
            <span className="font-mono font-medium">
              {currency} {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {totalDiscount > 0 && (
            <div className="flex justify-between py-1 text-emerald-700 border-b border-slate-100">
              <span>Total Discount:</span>
              <span className="font-mono font-medium">
                - {currency} {totalDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {/* Tax Breakdown */}
          {taxType === 'cgst_sgst' && taxTotal > 0 && (
            <>
              <div className="flex justify-between py-1 text-slate-600 border-b border-slate-100">
                <span>CGST:</span>
                <span className="font-mono font-medium">
                  {currency} {cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between py-1 text-slate-600 border-b border-slate-100">
                <span>SGST:</span>
                <span className="font-mono font-medium">
                  {currency} {sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </>
          )}

          {taxType === 'igst' && taxTotal > 0 && (
            <div className="flex justify-between py-1 text-slate-600 border-b border-slate-100">
              <span>IGST:</span>
              <span className="font-mono font-medium">
                {currency} {igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {taxType === 'single' && taxTotal > 0 && (
            <div className="flex justify-between py-1 text-slate-600 border-b border-slate-100">
              <span>Tax:</span>
              <span className="font-mono font-medium">
                {currency} {taxTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {shippingCharges > 0 && (
            <div className="flex justify-between py-1 text-slate-600 border-b border-slate-100">
              <span>Shipping / Delivery:</span>
              <span className="font-mono font-medium">
                {currency} {shippingCharges.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {roundOff !== 0 && (
            <div className="flex justify-between py-1 text-slate-500 border-b border-slate-100">
              <span>Round Off:</span>
              <span className="font-mono">
                {roundOff > 0 ? `+${roundOff}` : roundOff}
              </span>
            </div>
          )}

          {/* Grand Total */}
          <div className="flex justify-between items-center py-2.5 px-3.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white rounded-xl font-bold text-sm sm:text-base print:bg-blue-800 print:text-white shadow-xs mt-2">
            <span>Grand Total:</span>
            <span className="font-mono text-base sm:text-lg">
              {currency} {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Terms & Conditions + Authorized Signatory */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 mt-6 border-t border-slate-200">
        <div className="space-y-2">
          {terms && (
            <div>
              <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                Terms & Conditions
              </h4>
              <p className="text-[11px] text-slate-600 whitespace-pre-line leading-relaxed">
                {terms}
              </p>
            </div>
          )}
          {notes && (
            <div className="pt-1">
              <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-0.5">
                Notes
              </h4>
              <p className="text-[11px] text-slate-600 italic">
                {notes}
              </p>
            </div>
          )}
        </div>

        {/* Signature Box */}
        <div className="flex flex-col items-center sm:items-end justify-end text-center sm:text-right pt-4 sm:pt-0">
          <div className="flex flex-col items-center sm:items-end">
            {signatureData ? (
              <img
                src={signatureData}
                alt="Signature"
                className="h-14 sm:h-16 object-contain mb-1"
              />
            ) : (
              <div className="h-12 flex items-end">
                <span className="font-serif italic text-lg text-slate-800">
                  {signatureText || sender.businessName}
                </span>
              </div>
            )}
            <div className="w-48 border-b-2 border-slate-900 print:border-black mt-1" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 mt-1">
              Authorized Signatory
            </span>
            <span className="text-[9px] text-slate-400">
              For {sender.businessName || 'Business'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Branding Note */}
      <div className="pt-6 mt-6 border-t border-slate-200 print:border-slate-300 flex items-center justify-center text-center">
        <p className="text-[11px] font-semibold text-slate-700 print:text-slate-900">
          Generated By Daily Khata pro • <span className="text-blue-600 print:text-blue-800 font-mono font-bold">www.rozfiber.com</span>
        </p>
      </div>
    </div>
  );
};
