import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'
import { Link } from '@tanstack/react-router'
import { BackgroundPaths } from '~/components/ui/background-paths'
import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { GlowCard } from '~/components/ui/spotlight-card'
import { SparklesText } from '~/components/ui/sparkles-text'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function RotatingText() {
  const [index, setIndex] = useState(0);
  const words = useMemo(() => ["Electrifying", "Competitive", "Energetic", "Passionate"], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <div className="relative flex h-24 w-full items-center justify-center overflow-visible sm:w-[400px]">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl sm:text-4xl md:text-5xl font-black uppercase italic tracking-[0.1em] text-emerald-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.5)] whitespace-nowrap text-center"
          initial={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          animate={
            index === i
              ? {
                  y: 0,
                  opacity: 1,
                }
              : {
                  y: index > i ? -150 : 150,
                  opacity: 0,
                }
          }
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

function HomeComponent() {
  const { data: stats } = useSuspenseQuery(convexQuery(api.stats.getStats, {}))
  const { data: recentMatches } = useSuspenseQuery(convexQuery(api.stats.getRecentMatches, { limit: 3 }))
  const [selectedTeam, setSelectedTeam] = useState<any>(null)

  return (
    <div className="relative min-h-screen">
      {/* Hero Section with Background Paths */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute top-12 left-0 w-full z-30 flex justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
            className="px-6 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            <SparklesText 
              text="ISL Kids Edition 2026"
              className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-emerald-400"
              sparklesCount={8}
              colors={{ first: "#34d399", second: "#10b981" }}
            />
          </motion.div>
        </div>
        <BackgroundPaths 
          title="SPD ISL KIDS TOURNAMENT" 
          subtitle="Celebrating young talent at Sai Purvi Symphony. 10 Matchdays of thrilling football."
        >
          <div className="flex flex-col items-center justify-center gap-8 sm:gap-16 sm:flex-row relative z-20 mt-12 px-4">
            <Link
              to="/fixtures"
              className="group relative flex h-16 w-full items-center justify-center overflow-hidden rounded-2xl bg-white px-12 font-black uppercase italic text-slate-950 transition-all hover:bg-slate-200 sm:w-auto shadow-2xl"
            >
              View Fixtures
            </Link>

            <RotatingText />

            <Link
              to="/points-table"
              className="flex h-16 w-full items-center justify-center rounded-2xl border-2 border-white/20 bg-white/5 px-12 font-black uppercase italic text-white backdrop-blur-md transition-all hover:bg-white/10 sm:w-auto shadow-2xl"
            >
              Points Table
            </Link>
          </div>
        </BackgroundPaths>
      </section>

      <div className="relative z-10 space-y-20 pb-20">
        {/* Stats Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
            <StatCard label="Teams" value={stats.teamsCount} />
            <StatCard label="Matches" value={stats.matchesCount} />
            <StatCard label="Players" value={stats.playersCount} />
            <StatCard label="Tournament Days" value="10" />
          </div>
        </section>

        {/* Teams Grid - Popup System */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">The Teams</h2>
            <Link to="/points-table" className="text-slate-400 hover:text-white font-medium">View Table</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-6">
            {stats.teams?.map((team: any) => (
              <button 
                key={team._id}
                onClick={() => setSelectedTeam(team)}
                className="group transition-transform hover:scale-105"
              >
                <GlowCard 
                  customSize 
                  className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30"
                  glowColor="blue"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 border border-white/5 text-2xl font-black text-white shadow-inner group-hover:scale-110 transition-transform relative z-10">
                    {team.shortName}
                  </div>
                  <span className="text-center text-sm font-bold text-white relative z-10">{team.name}</span>
                </GlowCard>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Matches */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Recent Matches</h2>
            <Link to="/fixtures" className="text-slate-400 hover:text-white font-medium">View All</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {recentMatches.map((match: any) => (
              <MatchCard key={match._id} match={match} />
            ))}
          </div>
        </section>
      </div>

      {/* Team Modal */}
      <AnimatePresence>
        {selectedTeam && (
          <TeamModal 
            teamId={selectedTeam._id} 
            onClose={() => setSelectedTeam(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function TeamModal({ teamId, onClose }: { teamId: any, onClose: () => void }) {
  const { data: team } = useSuspenseQuery(convexQuery(api.teams.getDetails, { teamId }))

  if (!team) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-950 text-2xl font-black">
                {team.shortName}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{team.name}</h2>
                <p className="text-sm text-slate-400">Team Squad</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            {team.players.map((player: any) => (
              <div key={player._id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <span className={`font-bold ${player.isCaptain ? 'text-white' : 'text-slate-300'}`}>
                  {player.name}
                  {player.isCaptain && <span className="ml-2 text-[10px] bg-white text-slate-950 px-1.5 py-0.5 rounded uppercase tracking-tighter">Captain</span>}
                </span>
                <span className="text-xs text-slate-500 font-bold uppercase">Player</span>
              </div>
            ))}
          </div>

          <button 
            onClick={onClose}
            className="mt-8 w-full rounded-xl bg-white py-3 font-bold text-slate-950 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function StatCard({ label, value, delay = 0 }: { label: string; value: string | number; delay?: number }) {
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
        className="h-full flex flex-col items-center justify-center border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/20 shadow-xl"
        glowColor="green"
      >
        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
        <p className="text-4xl font-black text-white md:text-5xl tracking-tighter">{value}</p>
      </GlowCard>
    </motion.div>
  )
}

function MatchCard({ match, delay = 0 }: { match: any; delay?: number }) {
  const isCompleted = match.status === 'completed'
  const isLive = match.status === 'live'
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
        className={`h-full rounded-[2.5rem] border p-8 backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] shadow-2xl ${
          isLive ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 bg-white/5 hover:border-white/20'
        }`}
      >
        <div className="mb-8 flex items-center justify-between relative z-10">
          <span className={`rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${
            isLive ? 'bg-emerald-500 text-white animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 
            isCompleted ? 'bg-slate-800 text-slate-400' : 'bg-white/10 text-slate-400 border border-white/10'
          }`}>
            {match.status}
          </span>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Matchday {match.matchday}</span>
            <span className="text-[10px] font-bold text-slate-400">{match.startTime}</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-6 relative z-10">
          <div className="flex flex-1 flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-slate-900 border border-white/5 text-2xl font-black text-white shadow-inner">{match.homeShort}</div>
            <span className="text-xs font-black text-white uppercase tracking-wider line-clamp-1">{match.homeTeam}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center min-w-[70px]">
            {isUpcoming ? (
              <span className="text-xs font-black text-slate-700 tracking-[0.3em]">VS</span>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-white tracking-tighter">{match.homeScore}</span>
                <span className="text-sm font-bold text-slate-700">:</span>
                <span className="text-3xl font-black text-white tracking-tighter">{match.awayScore}</span>
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-slate-900 border border-white/5 text-2xl font-black text-white shadow-inner">{match.awayShort}</div>
            <span className="text-xs font-black text-white uppercase tracking-wider line-clamp-1">{match.awayTeam}</span>
          </div>
        </div>
      </GlowCard>
    </motion.div>
  )
}
