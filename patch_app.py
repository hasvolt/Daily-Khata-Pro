with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """            <button onClick={() => setCurrentTab('blog')} className="hover:text-[var(--theme-text,#F8FAFC)] hover:underline cursor-pointer transition-colors text-indigo-400 font-semibold">{language === 'hi' ? 'लाइव ब्लॉग' : 'Live Blog'}</button>
            <span className="opacity-40">•</span>
            <button onClick={() => setCurrentTab('privacy')} className="hover:text-[var(--theme-text,#F8FAFC)] hover:underline cursor-pointer transition-colors">Privacy Policy</button>"""

replacement = """            <button onClick={() => setCurrentTab('blog')} className="hover:text-[var(--theme-text,#F8FAFC)] hover:underline cursor-pointer transition-colors text-indigo-400 font-semibold">{language === 'hi' ? 'लाइव ब्लॉग' : 'Live Blog'}</button>
            <span className="opacity-40">•</span>
            <button onClick={() => setCurrentTab('academy')} className="hover:text-[var(--theme-text,#F8FAFC)] hover:underline cursor-pointer transition-colors text-emerald-400 font-semibold">{language === 'hi' ? 'अकादमी' : 'Wealth Academy'}</button>
            <span className="opacity-40">•</span>
            <button onClick={() => setCurrentTab('guide')} className="hover:text-[var(--theme-text,#F8FAFC)] hover:underline cursor-pointer transition-colors text-amber-400 font-semibold">{language === 'hi' ? 'यूज़र मैन्युअल' : 'User Manual'}</button>
            <span className="opacity-40">•</span>
            <button onClick={() => setCurrentTab('privacy')} className="hover:text-[var(--theme-text,#F8FAFC)] hover:underline cursor-pointer transition-colors">Privacy Policy</button>"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("Patch successful!")
else:
    print("Target not found!")
