import React, { useState, useEffect } from 'react';
import { DailyLifeLog, MoodType, AppLanguage } from '../types';
import { DEFAULT_LIFE_TAGS } from '../data/defaults';
import { getMoodVisual } from '../utils/iconMap';
import { triggerHapticSound } from '../utils/khataCalculations';
import {
  X,
  BookOpen,
  Calendar,
  Sun,
  Sunset,
  Moon,
  Clock,
  Sparkles,
  Tag,
  CheckCircle2,
  Plus,
  HeartHandshake,
  Lightbulb
} from 'lucide-react';

interface DailyLifeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (log: Omit<DailyLifeLog, 'id' | 'createdAt'>, id?: string) => void;
  initialLog?: DailyLifeLog | null;
  lifeTags?: string[];
  onAddLifeTag?: (tag: string) => void;
  language?: AppLanguage;
}

export const DailyLifeModal: React.FC<DailyLifeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialLog,
  lifeTags = DEFAULT_LIFE_TAGS,
  onAddLifeTag,
  language = 'en'
}) => {
  const isHindi = language === 'hi';

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState('');
  const [highlights, setHighlights] = useState('');
  const [mood, setMood] = useState<MoodType>('productive');
  const [wakeTime, setWakeTime] = useState('');
  const [sleepTime, setSleepTime] = useState('');
  const [morningRoutine, setMorningRoutine] = useState('');
  const [afternoonRoutine, setAfternoonRoutine] = useState('');
  const [eveningRoutine, setEveningRoutine] = useState('');
  const [keyLearnings, setKeyLearnings] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialLog) {
      setDate(initialLog.date || new Date().toISOString().slice(0, 10));
      setTitle(initialLog.title || '');
      setHighlights(initialLog.highlights || '');
      setMood(initialLog.mood || 'productive');
      setWakeTime(initialLog.wakeTime || '');
      setSleepTime(initialLog.sleepTime || '');
      setMorningRoutine(initialLog.morningRoutine || '');
      setAfternoonRoutine(initialLog.afternoonRoutine || '');
      setEveningRoutine(initialLog.eveningRoutine || '');
      setKeyLearnings(initialLog.keyLearnings || '');
      setGratitude(initialLog.gratitude || '');
      setSelectedTags(initialLog.tags || []);
    } else {
      setDate(new Date().toISOString().slice(0, 10));
      setTitle('');
      setHighlights('');
      setMood('productive');
      setWakeTime('');
      setSleepTime('');
      setMorningRoutine('');
      setAfternoonRoutine('');
      setEveningRoutine('');
      setKeyLearnings('');
      setGratitude('');
      setSelectedTags(['Work', 'Productivity']);
    }
    setError('');
  }, [initialLog, isOpen]);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
    triggerHapticSound('click');
  };

  const handleAddCustomTag = () => {
    const trimmed = newTagInput.trim();
    if (trimmed) {
      if (!selectedTags.includes(trimmed)) {
        setSelectedTags([...selectedTags, trimmed]);
      }
      if (onAddLifeTag) {
        onAddLifeTag(trimmed);
      }
      setNewTagInput('');
      triggerHapticSound('click');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!highlights.trim()) {
      setError(isHindi ? 'आज के मुख्य विवरण/हाइलाइट्स दर्ज करना आवश्यक है' : "Today's highlights are required");
      triggerHapticSound('error');
      return;
    }

    const logData: Omit<DailyLifeLog, 'id' | 'createdAt'> = {
      date,
      title: title.trim() || undefined,
      highlights: highlights.trim(),
      mood,
      wakeTime: wakeTime.trim() || undefined,
      sleepTime: sleepTime.trim() || undefined,
      morningRoutine: morningRoutine.trim() || undefined,
      afternoonRoutine: afternoonRoutine.trim() || undefined,
      eveningRoutine: eveningRoutine.trim() || undefined,
      keyLearnings: keyLearnings.trim() || undefined,
      gratitude: gratitude.trim() || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined
    };

    triggerHapticSound('save');
    onSave(logData, initialLog?.id);
    onClose();
  };

  const moodOptions: MoodType[] = ['productive', 'happy', 'blessed', 'normal', 'tired', 'stressed'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#030712]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between bg-[var(--theme-surface,#0E1A29)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--theme-secondary,#FFC700)]/15 text-[var(--theme-secondary,#FFC700)]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-[#F8FAFC]">
                {initialLog
                  ? isHindi
                    ? 'दैनिक डायरी प्रविष्टि संपादित करें'
                    : 'Edit Daily Story'
                  : isHindi
                  ? 'आज क्या-क्या हुआ? (दैनिक डायरी)'
                  : "Daily Life Journal & Story"}
              </h3>
              <p className="text-[11.5px] text-[#94A3B8]">
                {isHindi
                  ? 'दिन भर की मुख्य घटनाएं, दिनचर्या, सीख और मानसिक स्थिति दर्ज करें'
                  : 'Capture what happened today, daily timeline, mood and key reflections'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[var(--theme-bg,#070E18)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-[13px] flex-1">
          {/* Date & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold uppercase tracking-wider text-[11.5px] text-[#94A3B8] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
                <span>{isHindi ? 'तारीख' : 'Date'}</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3.5 py-2 text-[13px] text-[#F8FAFC] font-mono focus:outline-none focus:border-[var(--theme-secondary,#FFC700)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold uppercase tracking-wider text-[11.5px] text-[#94A3B8]">
                {isHindi ? 'शीर्षक / मुख्य थीम (वैकल्पिक)' : 'Story Title / Theme (Optional)'}
              </label>
              <input
                type="text"
                placeholder={isHindi ? 'उदा. व्यस्त कार्य दिवस, परिवार के साथ समय...' : 'e.g. High productivity sprint, Family day...'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3.5 py-2 text-[13px] text-[#F8FAFC] focus:outline-none focus:border-[var(--theme-secondary,#FFC700)]"
              />
            </div>
          </div>

          {/* Professional State & Mood Selector */}
          <div className="space-y-2">
            <label className="font-bold uppercase tracking-wider text-[11.5px] text-[#94A3B8]">
              {isHindi ? 'आज का मूड और मानसिक स्थिति' : "Today's Mood & State"}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {moodOptions.map((m) => {
                const visual = getMoodVisual(m);
                const MoodIcon = visual.icon;
                const isSelected = mood === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMood(m);
                      triggerHapticSound('click');
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-[12px] font-bold flex items-center gap-2 transition-all cursor-pointer truncate ${
                      isSelected
                        ? 'shadow-xs scale-[1.02]'
                        : 'bg-[var(--theme-bg,#070E18)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                    style={{
                      backgroundColor: isSelected ? visual.bg : undefined,
                      color: isSelected ? visual.color : undefined,
                      borderColor: isSelected ? visual.color : undefined
                    }}
                  >
                    <MoodIcon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{isHindi ? visual.labelHi : visual.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Highlights / Story Content */}
          <div className="space-y-1.5">
            <label className="font-bold uppercase tracking-wider text-[11.5px] text-[#94A3B8] flex items-center justify-between">
              <span>
                {isHindi ? 'आज क्या-क्या हुआ? (मुख्य विवरण)' : "What Happened Today? (Highlights)"}{' '}
                <span className="text-[#EF4444]">*</span>
              </span>
            </label>
            <textarea
              rows={3}
              placeholder={
                isHindi
                  ? 'आज की मुख्य घटनाएं, बातचीत, उपलब्धियां और यादगार पल यहाँ लिखें...'
                  : 'Write what you accomplished, key events, important conversations and reflections...'
              }
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3.5 py-2.5 text-[13.5px] text-[#F8FAFC] leading-relaxed focus:outline-none focus:border-[var(--theme-secondary,#FFC700)]"
              autoFocus
            />
          </div>

          {/* Sleep / Wake Timings */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold uppercase tracking-wider text-[11px] text-[#94A3B8] flex items-center gap-1">
                <Sun className="w-3 h-3 text-[#FFC700]" />
                <span>{isHindi ? 'जागने का समय' : 'Wake Time'}</span>
              </label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3 py-1.5 text-[12.5px] text-[#F8FAFC] font-mono focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold uppercase tracking-wider text-[11px] text-[#94A3B8] flex items-center gap-1">
                <Moon className="w-3 h-3 text-[#A855F7]" />
                <span>{isHindi ? 'सोने का समय' : 'Sleep Time'}</span>
              </label>
              <input
                type="time"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3 py-1.5 text-[12.5px] text-[#F8FAFC] font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Timeline Breakdown (Morning / Afternoon / Evening) */}
          <div className="space-y-2">
            <label className="font-bold uppercase tracking-wider text-[11.5px] text-[#94A3B8]">
              {isHindi ? 'दिनचर्या टाइमलाइन (वैकल्पिक)' : 'Daily Routine Timeline (Optional)'}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#FFC700] flex items-center gap-1">
                  <Sun className="w-3 h-3" />
                  <span>{isHindi ? 'सुबह' : 'Morning'}</span>
                </span>
                <input
                  type="text"
                  placeholder={isHindi ? 'व्यायाम, नाश्ता, योजना...' : 'Workout, breakfast, plan...'}
                  value={morningRoutine}
                  onChange={(e) => setMorningRoutine(e.target.value)}
                  className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3 py-1.5 text-[12px] text-[#F8FAFC] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[var(--theme-primary,#38BDF8)] flex items-center gap-1">
                  <Sunset className="w-3 h-3" />
                  <span>{isHindi ? 'दोपहर' : 'Afternoon'}</span>
                </span>
                <input
                  type="text"
                  placeholder={isHindi ? 'मुख्य कार्य, लंच, मीटिंग...' : 'Deep work, lunch, calls...'}
                  value={afternoonRoutine}
                  onChange={(e) => setAfternoonRoutine(e.target.value)}
                  className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3 py-1.5 text-[12px] text-[#F8FAFC] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#A855F7] flex items-center gap-1">
                  <Moon className="w-3 h-3" />
                  <span>{isHindi ? 'शाम / रात' : 'Evening'}</span>
                </span>
                <input
                  type="text"
                  placeholder={isHindi ? 'डिनर, आराम, पढ़ाई...' : 'Dinner, reading, family...'}
                  value={eveningRoutine}
                  onChange={(e) => setEveningRoutine(e.target.value)}
                  className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3 py-1.5 text-[12px] text-[#F8FAFC] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Learnings & Gratitude */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[11px] text-[var(--theme-primary,#38BDF8)] flex items-center gap-1">
                <Lightbulb className="w-3 h-3" />
                <span>{isHindi ? 'आज की सीख (Key Learning)' : 'Key Learning of the Day'}</span>
              </label>
              <input
                type="text"
                placeholder={isHindi ? 'आज क्या नया सीखा या समझा?' : 'What did you learn today?'}
                value={keyLearnings}
                onChange={(e) => setKeyLearnings(e.target.value)}
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3 py-1.5 text-[12.5px] text-[#F8FAFC] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[11px] text-[var(--theme-secondary,#FFC700)] flex items-center gap-1">
                <HeartHandshake className="w-3 h-3" />
                <span>{isHindi ? 'शुक्रगुजार (Gratitude)' : 'Daily Gratitude'}</span>
              </label>
              <input
                type="text"
                placeholder={isHindi ? 'आज किस बात के लिए आभारी हैं?' : 'What are you thankful for today?'}
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3 py-1.5 text-[12.5px] text-[#F8FAFC] focus:outline-none"
              />
            </div>
          </div>

          {/* Custom Tags Section */}
          <div className="space-y-2">
            <label className="font-bold uppercase tracking-wider text-[11.5px] text-[#94A3B8] flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-[#64748B]" />
              <span>{isHindi ? 'टैग्स व विषय (Tags)' : 'Tags & Topics'}</span>
            </label>

            <div className="flex flex-wrap gap-1.5">
              {Array.from(new Set([...lifeTags, ...selectedTags])).map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg border text-[11.5px] font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--theme-secondary,#FFC700)] text-[#040D17] border-[var(--theme-secondary,#FFC700)] shadow-xs'
                        : 'bg-[var(--theme-bg,#070E18)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>

            {/* Custom Tag Input */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder={isHindi ? 'नया कस्टम टैग लिखें...' : 'Add custom tag...'}
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
                className="flex-1 bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl px-3 py-1.5 text-[12px] text-[#F8FAFC] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-secondary,#FFC700)] border border-[var(--theme-border,#213E61)] font-bold text-[12px] cursor-pointer hover:bg-[var(--theme-border,#213E61)]"
              >
                + Tag
              </button>
            </div>
          </div>

          {error && <p className="text-[12.5px] font-bold text-[#EF4444]">{error}</p>}
        </form>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[var(--theme-bg,#070E18)] text-[#94A3B8] hover:text-[#F8FAFC] font-bold text-[13px] border border-[var(--theme-border,#213E61)] transition-colors cursor-pointer"
          >
            {isHindi ? 'रद्द करें' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-[var(--theme-secondary,#FFC700)] text-[#040D17] hover:brightness-110 font-extrabold text-[13.5px] shadow-md transition-all active:scale-98 cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>{initialLog ? (isHindi ? 'अपडेट करें' : 'Update Story') : isHindi ? 'सहेजें' : 'Save Story'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
