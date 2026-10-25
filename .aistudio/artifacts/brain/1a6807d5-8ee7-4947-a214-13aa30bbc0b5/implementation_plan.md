# Implementation Plan - Mobile Layout, Attendance Details, Print Formatting & Header Refinements

## Problem Overview & Scope
Based on the user's report and clarifying answers, 7 critical items will be resolved:
1. **MultiBackupModal Mobile Layout**: The modal is crowded on narrow mobile viewports. Tabs, module checkboxes, and date filters need touch-friendly padding, responsive wrapping, and sticky action buttons.
2. **Attendance Print & PDF Format**: When printing or exporting attendance, information must follow a professional, complete register layout with Worker Name, Date, 12-Hour Duty Hours, Site/Location, Rate/Wage, Advances (with itemized reasons), and Net Due balances.
3. **Language Icon & Option in Main Menu**: User chose to have the Language option in **both** the top quick bar (next to theme switcher) and within the **Settings & Support** section.
4. **Header Download Icon Theme Color**: The download icon in `Header.tsx` currently has hardcoded `border-emerald-500/40 bg-emerald-500/15 text-emerald-400` which conflicts with non-emerald themes (Electric Blue, Deep Obsidian, Day/White). It must dynamically bind to theme variables (`var(--theme-primary)` / `var(--theme-card)` / `var(--theme-border)`).
5. **Attendance "View Details" Bug**: In `AttendancePage.tsx` and `DailyAttendanceDetailsModal.tsx`, pre-existing attendance entries were not rendering under View Details due to rigid string equality (`l.date === selectedDate`) without timestamp/whitespace normalization, and lack of an explicit "View Details" button on each card.
6. **Header Translated Text Overlap**: In translated languages (Hindi, Urdu, Bengali, Tamil, etc.), expanded text length in the brand section causes text to wrap and collide with adjacent buttons. We will enforce flex isolation, `min-w-0`, and single-line `truncate` styling.
7. **Residual Polish**: Full TypeScript verification (`tsc --noEmit`), build check, and zero console errors.

---

## Proposed Changes

### 1. `src/components/MultiBackupModal.tsx`
- **Mobile Viewport Optimization**:
  - Convert modal dialog to a responsive sheet on mobile: `p-3 sm:p-4 max-h-[92dvh]`.
  - Header: Compact icon and title padding (`px-4 py-3 sm:px-5 sm:py-4`), preventing title wrap.
  - Tab Bar: Horizontally scrollable tab strip with `no-scrollbar` so that "डाउनलोड व PDF विकल्प", "लोकल चेकपॉइंट्स", and "बैकअप रिस्टोर" fit without crushing.
  - Module Checkboxes (Section 1): Change grid to `grid-cols-1 sm:grid-cols-2 gap-2`. Stack "Select All / एक बार में सब" smoothly on small screens.
  - Date Range Pills (Section 2): Compact pills (`text-[11px] px-2.5 py-1`) with clean active borders.
  - Export Format Cards (Section 3): Responsive layout (`grid-cols-1 sm:grid-cols-3 gap-2.5`) with concise sublabels so all 3 formats (PDF, JSON, CSV) fit on mobile screens without excessive scrolling.
  - Sticky Footer: Keep "Close" and quick status bar anchored so mobile users don't need to scroll all the way down.

### 2. `src/components/attendance/AttendancePrintModal.tsx` & `DailyAttendanceDetailsModal.tsx`
- **Full Register Layout**:
  - Upgrade the print HTML and PDF export format to include:
    - **Worker / Staff / Employer Name**
    - **Date & Day Name**
    - **Duty Status** (Present, Half Day, Overtime, Absent, Leave) with clean high-contrast badges (black on white for printing).
    - **Duty Hours (12-Hour AM/PM)** + Overtime (+2h OT).
    - **Location / Site** (e.g., Shop, Site-B, Factory).
    - **Daily Wage / Rate** (formatted cleanly).
    - **Advance (पेशगी)** itemized with reason (e.g. ₹500 Medicine, ₹200 Fare).
    - **Net Pending Due**.
  - Remove raw emojis (replace `📍` with clean text or print-safe bullet).
  - Ensure A4 Landscape formatting with page-break protection on rows (`page-break-inside: avoid`).

### 3. `src/components/MainMenuDrawer.tsx`
- **Top Quick Bar**:
  - Add a dedicated Language strip right next to the Theme Palette strip featuring a `Languages` / `Globe` icon and quick language chips (EN, हिन्दी, Hinglish, etc.).
- **Settings & Support Section**:
  - Add an explicit menu item:
    - Label: `भाषा चयन (Language Selection)`
    - Sublabel: `16 भारतीय एवं वैश्विक भाषाएँ (16 Regional & Global Languages)`
    - Icon: `Languages`
    - Badge: Current language code (`HI`, `EN`, etc.).
    - Action: Triggers `onOpenGoogleTranslate` or language selection modal.

### 4. `src/components/Header.tsx`
- **Download Icon Color Fix**:
  - Replace hardcoded `border-emerald-500/40 bg-emerald-500/15 text-emerald-400` with:
    `border-[var(--theme-border,#213E61)] bg-[var(--theme-card,#132438)] text-[var(--theme-primary,#38BDF8)] hover:bg-[var(--theme-card-hover,#19304A)]`
  - In Day/White mode and Daylight Light mode, it will cleanly inherit the primary blue/cyan tone with readable contrast.
- **Header Text Overlap Fix**:
  - Wrap brand text in `min-w-0 flex flex-col justify-center`.
  - Fix subtitle container with `block truncate max-w-[130px] sm:max-w-[220px] md:max-w-xs text-ellipsis whitespace-nowrap overflow-hidden`.
  - Add `shrink min-w-0` to the brand flex container so it never overlaps with the action buttons on the right.

### 5. `src/components/AttendancePage.tsx` & `src/components/attendance/DailyAttendanceDetailsModal.tsx`
- **View Details Button & Date Normalization**:
  - On every attendance record card in `AttendancePage.tsx`, add an explicit "View Details (विवरण)" button with `<Eye className="w-3.5 h-3.5" />`.
  - In `DailyAttendanceDetailsModal.tsx`, normalize dates:
    `const normalizeDate = (d?: string) => d ? d.split('T')[0].split(' ')[0].trim() : '';`
    Match `normalizeDate(l.date) === normalizeDate(selectedDate)`.
  - Synchronize `selectedDate` whenever `isOpen` or `initialDate` changes:
    `React.useEffect(() => { if (isOpen && initialDate) setSelectedDate(normalizeDate(initialDate)); }, [isOpen, initialDate]);`
  - Add a quick dropdown of all available recorded dates from `attendanceLogs` inside the modal so the user can easily switch to any date with existing entries.

---

## Verification Plan
1. **Type & Syntax Check**:
   - Run `npm run lint` (`tsc --noEmit`).
2. **Mobile Layout Verification**:
   - Inspect `MultiBackupModal.tsx` on narrow viewports (360px - 414px) to ensure no horizontal overflow, readable text, and reachable buttons.
3. **Attendance Print & Details Testing**:
   - Open Attendance page, click "View Details" on an existing attendance entry, verify that pre-existing entries appear immediately.
   - Click "Print Slip" / "प्रिंट रिपोर्ट", verify that the printable table has all columns: Worker Name, Date, Status, 12h Duty Hours, Rate, Advance, Net Due.
4. **Header & Theme Verification**:
   - Toggle through Day/White mode, Electric Blue, Emerald Black, and Daylight Light. Verify the download icon matches the active theme.
   - Switch language to Hindi and verify Header text does not overlap or clip.
5. **Main Menu Language Verification**:
   - Open Main Menu drawer, verify Language option in both top quick bar and Settings list.
