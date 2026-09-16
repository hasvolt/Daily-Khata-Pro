with open('src/components/SanityBlogPage.tsx', 'r') as f:
    content = f.read()

old_class = 'className="prose prose-invert prose-sm sm:prose-base max-w-none text-slate-200 prose-headings:text-white prose-a:text-[var(--theme-primary,#38BDF8)] prose-strong:text-white"'
new_class = 'className="max-w-none text-slate-200 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-4 [&_h2]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-white [&_h3]:mb-3 [&_h3]:mt-5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_li]:mb-1 [&_a]:text-[var(--theme-primary,#38BDF8)] [&_a]:underline [&_strong]:text-white"'

content = content.replace(old_class, new_class)

with open('src/components/SanityBlogPage.tsx', 'w') as f:
    f.write(content)
