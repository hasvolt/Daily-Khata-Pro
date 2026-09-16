import re

with open('src/components/SanityBlogPage.tsx', 'r') as f:
    content = f.read()

start_marker = "                  {selectedArticle.contentSections.map((section, idx) => ("
end_marker = "                {/* Tags & Regulatory Disclaimer */}"

idx_start = content.find(start_marker)
idx_end = content.find(end_marker, idx_start)

if idx_start != -1 and idx_end != -1:
    extracted = content[idx_start:idx_end]
    
    replacement = """                  {selectedArticle.sanityBody ? (
                    <div className="prose prose-invert prose-sm sm:prose-base max-w-none text-slate-200 prose-headings:text-white prose-a:text-[var(--theme-primary,#38BDF8)] prose-strong:text-white">
                      <PortableText value={selectedArticle.sanityBody} />
                    </div>
                  ) : (
""" + extracted + """                  )}
"""
    new_content = content[:idx_start] + replacement + content[idx_end:]
    
    # We need to strip the extra `                  )}` that was already at the end of `extracted`.
    # Actually wait, `extracted` contains the `                  ))} \n                </div>\n` 
    # Let me be precise.
