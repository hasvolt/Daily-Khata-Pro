const fs = require('fs');
let header = fs.readFileSync('src/components/Header.tsx', 'utf8');

const targetStr = `{onOpenDeveloper && (
                        <button
                          type="button"
                          onClick={() => {
                            onOpenDeveloper();
                            closeAllMenus();
                          }}
                          className="flex items-center gap-2 text-[11.5px] font-semibold text-[var(--theme-text,#F8FAFC)] hover:text-[var(--theme-primary,#38BDF8)] cursor-pointer text-left"
                        >
                          <div className="w-6 h-6 rounded-full overflow-hidden border border-[var(--theme-primary,#38BDF8)] shrink-0 bg-[#070E18]">
                            <img
                              src="/md-zafeer-hasan-yazdaan.jpg"
                              alt="Developer Profile"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="leading-tight font-bold">{tr.menu.developerProfile}</span>
                            <span className="text-[9.5px] text-[#94A3B8] font-normal">MD Zafeer Hasan (YAZDAAN)</span>
                          </div>
                        </button>
                      )}`;

header = header.replace(targetStr, "");
fs.writeFileSync('src/components/Header.tsx', header, 'utf8');
console.log("Header dev removed");
