import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DecryptText from './DecryptText'

export interface ResourceItem {
  id: string
  title: string
  category: 'Roadmap' | 'Writeup' | 'Tutorial' | 'Research'
  tags: string[]
  readTime: string
  author: string
  authorRole: string
  date: string
  summary: string
  content: string
}

const RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'Linux Kernel Exploitation: From Ring 3 to Ring 0 Privesc',
    category: 'Research',
    tags: ['Kernel', 'C', 'Exploit Dev', 'Linux'],
    readTime: '12 min read',
    author: 'Kira Osei (r00t_k1ng)',
    authorRole: 'Club Lead / Red Team',
    date: 'Sep 24, 2026',
    summary: 'A deep dive into slab heap spraying, use-after-free in kernel space, and bypassing KASLR/SMEP in modern 6.x kernels.',
    content: `### Abstract
Kernel exploitation represents the pinnacle of privilege escalation on UNIX systems. This paper dissects how memory corruption vulnerabilities in Linux kernel modules can be transformed into reliable local privilege escalation (LPE).

### Target Vulnerabilities Covered
1. **Heap Spraying & SLUB Allocator**: Manipulating \`kmalloc-512\` caches to place attacker-controlled struct pointers adjacent to vulnerable buffers.
2. **Bypassing Modern Mitigations**:
   - **KASLR (Kernel Address Space Layout Randomization)**: Leaking valid kernel text addresses through uninitialized kernel stack reads.
   - **SMEP / SMAP**: Building a Return-Oriented-Programming (ROP) chain to pivot stack into kernel address space and toggle CR4 register bits.
3. **Achieving Root Credentials**:
   \`\`\`c
   commit_creds(prepare_kernel_cred(NULL));
   \`\`\`

### Laboratory Setup
We provide a vulnerable kernel module playground on the OpenCode GitHub repo with automated QEMU launch scripts:
\`\`\`bash
git clone https://github.com/OpencodeNIT-R/kernel-pwn-lab
cd kernel-pwn-lab && ./launch_qemu.sh
\`\`\`
`,
  },
  {
    id: 'res-2',
    title: 'Offensive Security Roadmap: From Zero to CTF Top 1%',
    category: 'Roadmap',
    tags: ['Roadmap', 'CTF', 'Beginner to Advanced'],
    readTime: '15 min read',
    author: 'Alice Marchetti (0xAl1ce)',
    authorRole: 'CTF Lead',
    date: 'Sep 18, 2026',
    summary: 'The curated NIT Rourkela semester-by-semester guide for mastering Web, Pwn, Crypto, Forensics, and Reverse Engineering.',
    content: `### Phase 1: Core Fundamentals (Weeks 1–4)
- **Linux Command Line & Networking**: Bash scripting, TCP/IP handshake, Wireshark packet capture analysis.
- **Assembly & C Essentials**: x86-64 calling conventions, stack layout, registers (\`%rax\`, \`%rbx\`, \`%rsp\`, \`%rbp\`).
- **Web Protocols**: HTTP headers, cookies, session fixation, SQL injection, Cross-Site Scripting (XSS).

### Phase 2: Tooling Mastery (Weeks 5–8)
- **Binary Analysis**: Ghidra, GDB + Pwndbg, radare2, Binary Ninja.
- **Web Auditing**: Burp Suite Professional, Caido, sqlmap, ffuf.
- **Cryptographic Tools**: SageMath, CyberChef, hashcat, john the ripper.

### Phase 3: Competitive CTF Tactics (Weeks 9–12)
- Fast-paced team triage during 48-hour competitions.
- Developing reusable solve scripts with \`pwntools\` in Python.
- Writing high-impact post-competition writeups.
`,
  },
  {
    id: 'res-3',
    title: 'Demystifying Zero-Knowledge Proofs & Elliptic Curve Cryptography',
    category: 'Tutorial',
    tags: ['Cryptography', 'ZKP', 'Math', 'Rust'],
    readTime: '10 min read',
    author: 'Dara Okonkwo (cr4ckm3)',
    authorRole: 'Crypto & Privacy Lead',
    date: 'Aug 29, 2026',
    summary: 'Understanding zk-SNARKs, Groth16, and polynomial commitments without getting lost in algebraic geometry jargon.',
    content: `### Why Cryptography Matters in Modern Security
Traditional authentication relies on proving possession of a secret by transmitting it (or a hash thereof). Zero-Knowledge Proofs (ZKPs) allow a prover to mathematically convince a verifier that a statement is true without revealing *any* underlying information.

### Mathematical Foundations
1. **Discrete Logarithm Problem on Elliptic Curves**:
   Given points $P$ and $Q = dP$, finding scalar $d$ is computationally intractable over large finite fields.
2. **Polynomial Commitments (KZG)**:
   Committing to a secret polynomial $P(x)$ using a structured reference string, allowing evaluation proofs at any point $z$.

### Code Implementation with Arkworks (Rust)
\`\`\`rust
use ark_bn254::Bn254;
use ark_groth16::Groth16;
use ark_snark::SNARK;

// Verify a zero-knowledge relation on-chain or locally
let is_valid = Groth16::<Bn254>::verify(&vk, &public_inputs, &proof)?;
assert!(is_valid);
\`\`\`
`,
  },
  {
    id: 'res-4',
    title: 'Upstream Open Source: How We Shipped PRs to the Linux Kernel & Rust',
    category: 'Writeup',
    tags: ['Open Source', 'Git', 'Rust', 'Linux'],
    readTime: '8 min read',
    author: 'Ben Nakamura (n3tw0rk_b)',
    authorRole: 'Open Source Lead',
    date: 'Aug 14, 2026',
    summary: 'A step-by-step account of our club members navigating mailing lists, review etiquette, and landing upstream commits.',
    content: `### Contributing to Giant Open Source Projects
Many students hesitate to contribute to foundational software like the Linux kernel, LLVM, or the Rust compiler because the process seems daunting.

### Key Takeaways from Our Upstream Journey
1. **Start with Subsystem Maintainers**: Check \`MAINTAINERS\` files and subscribe to subsystem mailing lists (e.g. \`netdev\`, \`rust-for-linux\`).
2. **Git Send-Email Workflow**:
   \`\`\`bash
   git format-patch -1 HEAD
   git send-email --to=maintainer@kernel.org --cc=linux-kernel@vger.kernel.org 0001-fix.patch
   \`\`\`
3. **Etiquette**: Respond in-line to code reviews, keep patches strictly atomic, and write descriptive commit logs explaining the *why* rather than just the *what*.
`,
  },
]

const CATEGORIES = ['All', 'Roadmap', 'Research', 'Writeup', 'Tutorial']

export default function ResourcesHub() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeArticle, setActiveArticle] = useState<ResourceItem | null>(null)

  const filtered = RESOURCES.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory
    const q = searchQuery.toLowerCase().trim()
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q)) ||
      item.author.toLowerCase().includes(q)

    return matchesCat && matchesQuery
  })

  return (
    <section id="resources" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="font-mono text-xs text-accent uppercase tracking-[0.2em] mb-4">
              // knowledge repository
            </p>
            <DecryptText
              text="Guides, Roadmaps & Writeups."
              tag="h2"
              className="font-mono text-4xl md:text-5xl font-black text-fg"
              delay={120}
            />
          </div>

          {/* Search bar */}
          <div className="w-full md:w-72">
            <div className="flex items-center px-3 py-2 bg-card border border-borderc rounded-sm text-xs font-mono">
              <span className="text-primary mr-2">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search writeups, roadmaps..."
                className="bg-transparent text-fg placeholder:text-muted-fg outline-none w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-muted-fg hover:text-fg text-xs ml-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`font-mono text-xs px-3.5 py-1.5 border rounded-sm transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'border-accent/60 bg-accent/15 text-accent'
                  : 'border-borderc text-muted-fg hover:border-fg/30 hover:text-fg'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(item => (
            <motion.div
              key={item.id}
              whileHover={{ y: -3 }}
              className="bg-card border border-borderc hover:border-accent/40 rounded-sm p-6 flex flex-col justify-between transition-colors group cursor-pointer"
              onClick={() => setActiveArticle(item)}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs px-2 py-0.5 border border-accent/30 bg-accent/10 text-accent rounded-sm">
                    {item.category}
                  </span>
                  <span className="font-mono text-xs text-muted-fg">{item.readTime}</span>
                </div>

                <h3 className="font-mono text-lg font-bold text-fg group-hover:text-accent transition-colors mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-fg leading-relaxed mb-6">{item.summary}</p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {item.tags.map(tag => (
                    <span
                      key={tag}
                      className="font-mono text-[11px] px-2 py-0.5 bg-muted/60 text-muted-fg rounded-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-borderc/60 flex items-center justify-between text-xs font-mono text-muted-fg">
                  <div>
                    <span className="text-fg font-medium">{item.author}</span>
                    <span className="block text-[11px] text-muted-fg">{item.date}</span>
                  </div>
                  <span className="text-accent group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read article →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-card border border-borderc rounded-sm p-6 md:p-8 relative shadow-2xl font-mono"
            >
              {/* Top bar */}
              <div className="flex items-center justify-between border-b border-borderc pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 bg-accent/15 text-accent border border-accent/40 rounded">
                    {activeArticle.category}
                  </span>
                  <span className="text-xs text-muted-fg">{activeArticle.readTime}</span>
                </div>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="text-muted-fg hover:text-fg text-sm px-2 py-1 border border-borderc rounded"
                >
                  [ESC / Close]
                </button>
              </div>

              {/* Title & Author Info */}
              <h2 className="text-2xl md:text-3xl font-bold text-fg mb-3 font-mono leading-snug">
                {activeArticle.title}
              </h2>
              <div className="text-xs text-muted-fg mb-6 flex items-center gap-4">
                <span>By <strong className="text-primary">{activeArticle.author}</strong> ({activeArticle.authorRole})</span>
                <span>•</span>
                <span>{activeArticle.date}</span>
              </div>

              {/* Article Content */}
              <div className="prose prose-invert max-w-none text-xs md:text-sm text-fg/90 leading-relaxed space-y-4 whitespace-pre-line border-t border-borderc pt-6">
                {activeArticle.content}
              </div>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-borderc flex items-center justify-between text-xs text-muted-fg">
                <span>OpenCode Knowledge Collective</span>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-2 bg-primary text-bg font-bold rounded-sm hover:bg-primary/90 transition-colors"
                >
                  Done Reading
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
