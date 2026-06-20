import { useEffect, useRef, useState } from 'react'
import { useAchievements } from '@/components/achievement-context'

type HistoryEntry = {
  type: 'input' | 'output' | 'error' | 'success'
  content: string
}

const PROMPT_USER = 'visitor@ahmad-portfolio'
const PROMPT_PATH = ':~$'

const FILES: Record<string, string[]> = {
  'about.txt': [
    'Name:       Ahmad Kanaan',
    'Role:       Full-Stack Developer',
    'Experience: 4 years',
    'Location:   Available worldwide 🌍',
    'Status:     Open to opportunities ✅',
  ],
  'skills.txt': [
    'Frontend:  React, Next.js, TypeScript, TailwindCSS',
    'Backend:   Node.js, Express, Supabase',
    'Tools:     Git, Figma, Vite',
    'Currently: Building cool things 🚀',
  ],
  'projects.txt': [
    '1. Nebula        — AI-powered platform',
    '2. Facilify      — Productivity app',
    '3. NotionCraft   — AI note-taking app',
    '4. Portagen      — Portfolio generator',
    '5. AwqadRashaya  — Cultural heritage project',
    '',
    'Open the Projects window for full details!',
  ],
  'contact.txt': [
    'Email:    assaad.r.kenaan@gmail.com',
    'GitHub:   github.com/AhmadKanaan0',
    'LinkedIn: linkedin.com/in/ahmadkanaan',
    '',
    "Or just open the Contact window — it's right there! 👀",
  ],
  'secret.txt': [
    'You found it! 👀',
    '',
    "There's nothing here...",
    '...or is there?',
    '',
    'Hint: try running → sudo hire-ahmad',
  ],
}

const WELCOME: HistoryEntry[] = [
  { type: 'output', content: 'Portfolio OS [Version 1.0.0]' },
  { type: 'output', content: 'Ahmad Kanaan — Full Stack Developer' },
  { type: 'output', content: '─────────────────────────────────────' },
  { type: 'output', content: 'Type "help" for available commands.' },
  { type: 'output', content: '' },
]

export default function Terminal() {
  const { unlock } = useAchievements()
  const [history, setHistory] = useState<HistoryEntry[]>(WELCOME)
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [focused, setFocused] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { unlock('terminal_open') }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [history, input])

  const processCommand = (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) {
      setHistory(prev => [...prev, { type: 'input', content: '' }])
      return
    }

    const parts = trimmed.split(' ')
    const cmd = parts[0].toLowerCase()
    const args = parts.slice(1)
    const newEntries: HistoryEntry[] = [{ type: 'input', content: trimmed }]

    if (cmd === 'clear') {
      setHistory([])
      setCmdHistory(prev => [trimmed, ...prev])
      setHistoryIdx(-1)
      return
    }

    if (cmd === 'help') {
      ;[
        '┌──────────────────────────────────────────┐',
        '│            Available Commands            │',
        '├──────────────────────────────────────────┤',
        '│  help               show this message    │',
        '│  ls / dir           list files           │',
        '│  cat <file>         read a file          │',
        '│  whoami             about you            │',
        '│  neofetch           system info          │',
        '│  sudo hire-ahmad    make an offer 👀     │',
        '│  ping               test connection      │',
        '│  date               current date & time  │',
        '│  echo <text>        print text           │',
        '│  clear              clear terminal       │',
        '└──────────────────────────────────────────┘',
      ].forEach(l => newEntries.push({ type: 'output', content: l }))
    } else if (cmd === 'ls' || cmd === 'dir') {
      newEntries.push({ type: 'output', content: 'about.txt    skills.txt    projects.txt' })
      newEntries.push({ type: 'output', content: 'contact.txt  secret.txt' })
    } else if (cmd === 'cat') {
      const file = args[0]
      if (!file) {
        newEntries.push({ type: 'error', content: 'Usage: cat <filename>' })
      } else if (FILES[file]) {
        FILES[file].forEach(l => newEntries.push({ type: 'output', content: l }))
      } else {
        newEntries.push({ type: 'error', content: `cat: ${file}: No such file or directory` })
      }
    } else if (cmd === 'whoami') {
      newEntries.push({ type: 'output', content: "visitor — a curious explorer browsing Ahmad's portfolio ✨" })
    } else if (cmd === 'echo') {
      newEntries.push({ type: 'output', content: args.join(' ') })
    } else if (cmd === 'date') {
      newEntries.push({ type: 'output', content: new Date().toString() })
    } else if (cmd === 'ping') {
      ;[
        'PING ahmad-portfolio.vercel.app',
        '64 bytes: time=1ms  ttl=64  ✅',
        '64 bytes: time=1ms  ttl=64  ✅',
        '64 bytes: time=1ms  ttl=64  ✅',
        '--- ahmad-portfolio ping statistics ---',
        '3 packets transmitted, 3 received, 0% packet loss',
        'Connection is perfect! ⚡',
      ].forEach(l => newEntries.push({ type: 'output', content: l }))
    } else if (cmd === 'neofetch') {
      ;[
        '  ██████╗  visitor@ahmad-portfolio',
        '  ██╔══██╗ ─────────────────────────',
        '  ███████║ OS:       Portfolio OS 1.0',
        '  ██╔══██║ Host:     Ahmad Kanaan',
        '  ██║  ██║ Kernel:   React 18 + Vite',
        '  ╚═╝  ╚═╝ Shell:    PortfolioSH 1.0',
        '           Theme:    Liquid Glass ✨',
        '           Terminal: This one :)',
        '           Memory:   Unlimited creativity',
      ].forEach(l => newEntries.push({ type: 'output', content: l }))
    } else if (trimmed.toLowerCase() === 'sudo hire-ahmad') {
      ;[
        '[sudo] password for ahmad: ••••••••',
        'Authenticating...',
        '✅ Access granted.',
        '',
        'Initiating hire sequence...',
        '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%',
        '',
        'Ahmad has been successfully hired! 🎉',
        'Please check the Contact page to make it official.',
      ].forEach(l => newEntries.push({ type: 'success', content: l }))
      unlock('hire_me')
    } else if (cmd === 'sudo') {
      newEntries.push({ type: 'error', content: `sudo: ${args.join(' ')}: command not found` })
      newEntries.push({ type: 'output', content: 'Hint: try → sudo hire-ahmad' })
    } else {
      newEntries.push({ type: 'error', content: `command not found: ${cmd}` })
      newEntries.push({ type: 'output', content: 'Type "help" for available commands.' })
    }

    newEntries.push({ type: 'output', content: '' })
    setHistory(prev => [...prev, ...newEntries])
    setCmdHistory(prev => [trimmed, ...prev])
    setHistoryIdx(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      processCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(historyIdx + 1, cmdHistory.length - 1)
      setHistoryIdx(next)
      setInput(cmdHistory[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(historyIdx - 1, -1)
      setHistoryIdx(next)
      setInput(next === -1 ? '' : cmdHistory[next])
    }
  }

  const entryColor = (type: HistoryEntry['type']) => {
    if (type === 'error') return 'text-red-400'
    if (type === 'success') return 'text-yellow-300'
    return 'text-[#74defc]'
  }

  return (
    <>
      <style>{`
        @keyframes tb { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .t-cursor { animation: tb 1s step-end infinite; }
      `}</style>

      {/* hidden off-screen input captures all keystrokes */}
      <input
        ref={inputRef}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ position: 'fixed', left: '-9999px', top: 0, opacity: 0, width: 1, height: 1 }}
        autoFocus
        autoComplete="off"
        spellCheck={false}
      />

      <div
        ref={scrollRef}
        className="flex flex-col bg-[#0d1117] font-mono text-sm overflow-y-auto -m-5 select-text"
        style={{ height: 'calc(100% + 40px)', padding: '1rem' }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Rendered history */}
        {history.map((entry, i) => (
          <div key={i} className="leading-relaxed whitespace-pre-wrap break-all min-h-[1.5em]">
            {entry.type === 'input' ? (
              <>
                <span className="text-green-400">{PROMPT_USER}</span>
                <span className="text-white/70">{PROMPT_PATH}</span>
                <span className="text-white"> {entry.content}</span>
              </>
            ) : (
              <span className={entryColor(entry.type)}>{entry.content || ' '}</span>
            )}
          </div>
        ))}

        {/* Current live input line */}
        <div className="leading-relaxed whitespace-pre-wrap break-all flex items-center min-h-[1.5em]">
          <span className="text-green-400">{PROMPT_USER}</span>
          <span className="text-white/70">{PROMPT_PATH}</span>
          <span className="text-white"> {input}</span>
          <span
            className="t-cursor inline-block w-[0.55em] h-[1.1em] bg-[#74defc] ml-px align-text-bottom flex-shrink-0"
            style={{ opacity: focused ? undefined : 0.3 }}
          />
        </div>
      </div>
    </>
  )
}
