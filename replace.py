with open('src/components/SanityBlogPage.tsx', 'r') as f:
    lines = f.readlines()

new_block = """                  {selectedArticle.sanityBody ? (
                    <div className="prose prose-invert prose-sm sm:prose-base max-w-none text-slate-200 prose-headings:text-white prose-a:text-[var(--theme-primary,#38BDF8)] prose-strong:text-white">
                      <PortableText value={selectedArticle.sanityBody} />
                    </div>
                  ) : (
                    selectedArticle.contentSections.map((section, idx) => (
                      <div key={idx} className="space-y-3">
                        <h3 className="text-lg sm:text-xl font-bold text-white border-l-3 border-[var(--theme-primary,#38BDF8)] pl-3">
                          {isHindi ? section.hindiHeading : section.heading}
                        </h3>
                        {section.paragraphs.map((p, pIdx) => (
                          <p key={pIdx} className="leading-relaxed">
                            {isHindi ? p.hi : p.en}
                          </p>
                        ))}
                        {section.quote && (
                          <div className="p-4 rounded-xl bg-slate-900/80 border-l-4 border-amber-400 my-4 space-y-2">
                            <Quote className="w-5 h-5 text-amber-400/60" />
                            <p className="italic text-slate-200 font-serif text-sm sm:text-base">
                              "{isHindi ? section.quote.hindiText : section.quote.text}"
                            </p>
                            <div className="text-xs font-bold text-amber-400">
                              — {section.quote.speaker}, <span className="text-slate-400 font-normal">{section.quote.speakerRole}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
"""

lines[798:827] = [new_block]

with open('src/components/SanityBlogPage.tsx', 'w') as f:
    f.writelines(lines)
