import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'
import { useState } from 'react'
import { FloatingPaths } from '~/components/ui/background-paths'
import { motion } from 'framer-motion'
import { GlowCard } from '~/components/ui/spotlight-card'

export const Route = createFileRoute('/fixtures')({
  component: FixturesComponent,
})

function FixturesComponent() {
  const { data: matches = [] } = useSuspenseQuery(convexQuery(api.matches.listAll, {}))
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all')

  const filteredMatches = (matches || []).filter(m => filter === 'all' || m.status === filter)

  // Group by matchday
  const allMatchdays = Array.from(new Set((matches || []).map(m => m.matchday))).sort((a, b) => a - b)
  
  // Only show matchdays that have at least one match matching the filter
  const visibleMatchdays = allMatchdays.filter(md => 
    filteredMatches.some(m => m.matchday === md)
  )

  return (
    <div className="relative min-h-screen bg-slate-900">
      {/* Fixed Background Paths that follow the user */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-white sm:text-6xl tracking-tight uppercase italic">Fixtures & Results</h1>
          <p className="text-lg text-slate-400 font-medium tracking-wide">Sai Purvi Symphony • 10 Matchdays • 20 Games</p>
        </div>

        <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
          {(['all', 'upcoming', 'live', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-8 py-2.5 text-sm font-black uppercase tracking-widest transition-all duration-300 ${
                filter === f 
                  ? 'bg-white text-slate-950 shadow-[0_0_30px_rgba(255,255,255,0.2)] scale-105' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-20 pb-20">
          {visibleMatchdays.map(md => (
            <div key={md} className="space-y-8">
              <div className="relative">
                <div className="flex items-end justify-between mb-4">
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                    <span className="text-slate-500 not-italic font-medium text-lg">#</span>
                    Matchday {md < 10 ? `0${md}` : md}
                    {md === 9 && <span className="text-sm font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-lg ml-2">Semi Finals</span>}
                    {md === 10 && <span className="text-sm font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-lg ml-2">Finals</span>}
                  </h2>
                </div>
                <div className="h-[2px] w-full bg-gradient-to-r from-white/20 via-white/5 to-transparent rounded-full" />
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {filteredMatches
                  .filter(m => m.matchday === md)
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((match) => (
                  <MatchRow key={match._id} match={match} />
                ))}
              </div>
            </div>
          ))}

          {visibleMatchdays.length === 0 && (
            <div className="py-20 text-center rounded-3xl border border-white/5 bg-white/5 backdrop-blur-md">
              <p className="text-xl text-slate-500 font-bold uppercase tracking-widest">No matches found</p>
              <p className="text-sm text-slate-600 mt-2">Try changing the filter status</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MatchRow({ match, delay = 0 }: { match: any; delay?: number }) {
  const isLive = match.status === 'live'
  const isCompleted = match.status === 'completed'
  const isUpcoming = match.status === 'upcoming'

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay }}
      className="h-full"
    >
      <GlowCard
        customSize
        glowColor={isLive ? 'green' : 'blue'}
        className={`group relative overflow-hidden rounded-[2.5rem] border transition-all duration-500 hover:scale-[1.02] shadow-2xl ${
          isLive 
            ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_50px_rgba(16,185,129,0.15)]' 
            : 'border-white/10 bg-white/5 backdrop-blur-xl hover:border-white/30 hover:bg-white/[0.08]'
        }`}
      >
        {/* Time and Status Header */}
        <div className="flex items-center justify-between px-10 py-6 border-b border-white/5 bg-white/5 relative z-10">
          <div className="flex items-center gap-4">
            <div className={`h-2.5 w-2.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]' : 'bg-slate-600'}`} />
            <span className="text-xs font-black tracking-[0.3em] text-slate-400 uppercase">
              {match.startTime}
            </span>
          </div>
          <span className={`rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] ${
            isLive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' :
            isCompleted ? 'bg-slate-800 text-slate-400 border border-white/5' :
            'bg-white/10 text-slate-500 border border-white/5'
          }`}>
            {match.status}
          </span>
        </div>

        <div className="p-12 relative z-10">
          <div className="flex flex-col items-center justify-center gap-10">
            <div className="flex items-center justify-between w-full gap-6">
              {/* Home Team */}
              <div className="flex flex-1 flex-col items-center gap-5 text-center group/team">
                <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-slate-900 border border-white/5 text-4xl font-black text-white shadow-2xl group-hover/team:scale-110 transition-transform duration-500 group-hover/team:border-white/20">
                  {match.homeShort}
                </div>
                <span className="text-xl font-black text-white uppercase italic tracking-tighter leading-tight">{match.homeTeam}</span>
              </div>

              {/* VS / Score */}
              <div className="flex flex-col items-center justify-center min-w-[120px]">
                {isUpcoming ? (
                  <div className="flex flex-col items-center gap-2">
                     <span className="text-sm font-black text-slate-700 uppercase tracking-[0.4em]">VS</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-6">
                    <span className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{match.homeScore}</span>
                    <span className="text-2xl font-bold text-slate-700">:</span>
                    <span className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{match.awayScore}</span>
                  </div>
                )}
              </div>

              {/* Away Team */}
              <div className="flex flex-1 flex-col items-center gap-5 text-center group/team">
                <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-slate-900 border border-white/5 text-4xl font-black text-white shadow-2xl group-hover/team:scale-110 transition-transform duration-500 group-hover/team:border-white/20">
                  {match.awayShort}
                </div>
                <span className="text-xl font-black text-white uppercase italic tracking-tighter leading-tight">{match.awayTeam}</span>
              </div>
            </div>
            
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 bg-white/5 px-6 py-2 rounded-full border border-white/5">
              {match.type === 'league' ? 'League Phase' : match.type}
            </div>
          </div>
        </div>
      </GlowCard>
    </motion.div>
  )
}
