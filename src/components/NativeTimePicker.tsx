import React from 'react';

interface NativeTimePickerProps {
  value: string; // "HH:mm" 24hr format
  onChange: (value: string) => void;
  className?: string;
}

export const NativeTimePicker: React.FC<NativeTimePickerProps> = ({ value, onChange, className }) => {
  const getParsed = () => {
    if (!value) return { h: '10', m: '00', ampm: 'AM' };
    const [hh, mm] = value.split(':');
    let h = parseInt(hh, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return { h: h.toString().padStart(2, '0'), m: mm || '00', ampm };
  };

  const parsed = getParsed();

  const handleChange = (field: 'h' | 'm' | 'ampm', val: string) => {
    let newH = field === 'h' ? val : parsed.h;
    let newM = field === 'm' ? val : parsed.m;
    let newAmpm = field === 'ampm' ? val : parsed.ampm;
    
    let hours24 = parseInt(newH, 10);
    if (newAmpm === 'PM' && hours24 < 12) hours24 += 12;
    if (newAmpm === 'AM' && hours24 === 12) hours24 = 0;
    
    onChange(`${hours24.toString().padStart(2, '0')}:${newM}`);
  };

  return (
    <div className={`flex items-center justify-between ${className || ''}`}>
      <select 
        value={parsed.h} 
        onChange={(e) => handleChange('h', e.target.value)}
        className="bg-transparent border-none outline-none appearance-none cursor-pointer font-bold text-center px-1"
      >
        {Array.from({length: 12}, (_, i) => {
          const v = (i + 1).toString().padStart(2, '0');
          return <option key={v} value={v} className="bg-[var(--theme-bg,#070E18)]">{v}</option>;
        })}
      </select>
      <span className="font-bold opacity-50 px-0.5">:</span>
      <select 
        value={parsed.m} 
        onChange={(e) => handleChange('m', e.target.value)}
        className="bg-transparent border-none outline-none appearance-none cursor-pointer font-bold text-center px-1"
      >
        {Array.from({length: 60}, (_, i) => {
          const v = i.toString().padStart(2, '0');
          return <option key={v} value={v} className="bg-[var(--theme-bg,#070E18)]">{v}</option>;
        })}
      </select>
      <select 
        value={parsed.ampm} 
        onChange={(e) => handleChange('ampm', e.target.value)}
        className="bg-transparent border-none outline-none appearance-none cursor-pointer font-bold text-center px-1 text-[var(--theme-primary,#38BDF8)]"
      >
        <option value="AM" className="bg-[var(--theme-bg,#070E18)]">AM</option>
        <option value="PM" className="bg-[var(--theme-bg,#070E18)]">PM</option>
      </select>
    </div>
  );
};
