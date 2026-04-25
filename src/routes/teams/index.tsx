import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../../convex/_generated/api'
import { useState } from 'react'
import { FloatingPaths } from '~/components/ui/background-paths'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { BorderRotate } from '~/components/ui/animated-gradient-border'

export const Route = createFileRoute('/teams/')({
  component: TeamsPage,
})

function TeamsPage() {
  const { data: allTeams } = useSuspenseQuery(convexQuery(api.teams.list, {}))
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)

  // Filter out playoff placeholders
  const teams = allTeams.filter(t => !["L1", "L2", "L3", "L4", "3PP", "LSF12", "GF", "WSF12"].includes(t.shortName))

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-white sm:text-5xl uppercase italic tracking-tight">The Teams</h1>
          <p className="text-lg text-slate-400 font-medium tracking-wide">Meet the contenders of the SPD ISL Kids Tournament.</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team, index) => (
            <motion.div
              key={team._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BorderRotate 
                className="cursor-pointer overflow-hidden p-1 shadow-2xl transition-all duration-500 hover:scale-[1.03]"
                borderRadius={32}
                borderWidth={2}
                animationSpeed={4}
                backgroundColor="#0f172a"
                onClick={() => setSelectedTeamId(team._id)}
              >
                <div className="flex flex-col items-center gap-6 rounded-[2rem] bg-slate-900/40 p-10 backdrop-blur-xl transition-all hover:bg-white/[0.02]">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-950 border-4 border-white/5 text-3xl font-black text-white shadow-2xl group-hover:scale-110 transition-transform">
                    {team.shortName}
                  </div>
                  <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">{team.name}</h2>
                    <div className="inline-flex rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1 text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">
                      View Roster
                    </div>
                  </div>
                </div>
              </BorderRotate>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedTeamId && (
          <TeamModal 
            teamId={selectedTeamId as any} 
            onClose={() => setSelectedTeamId(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function TeamModal({ teamId, onClose }: { teamId: any, onClose: () => void }) {
  const { data: teamDetails } = useSuspenseQuery(convexQuery(api.teams.getDetails, { teamId }))

  if (!teamDetails) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-white/20 bg-slate-900 shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="relative p-8 sm:p-12">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white text-slate-950 text-2xl font-black shadow-xl">
              {teamDetails.shortName}
            </div>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter sm:text-4xl md:text-5xl">
              {teamDetails.name}
            </h2>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Roster</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {teamDetails.players.map((player: any) => (
                <div 
                  key={player._id}
                  className={`flex items-center justify-between rounded-2xl border p-4 transition-colors ${
                    player.isCaptain 
                      ? 'border-emerald-500/50 bg-emerald-500/10' 
                      : 'border-white/5 bg-white/5'
                  }`}
                >
                  <span className={`font-bold ${player.isCaptain ? 'text-emerald-400' : 'text-white'}`}>
                    {player.name}
                  </span>
                  {player.isCaptain && (
                    <span className="rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-black text-white uppercase tracking-wider">
                      Captain
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <button
              onClick={onClose}
              className="rounded-full bg-white px-8 py-3 font-bold text-slate-950 transition-transform hover:scale-105 active:scale-95"
            >
              Exit
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
