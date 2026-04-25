import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../../convex/_generated/api'

export const Route = createFileRoute('/teams/$teamId')({
  component: TeamDetailComponent,
})

function TeamDetailComponent() {
  const { teamId } = Route.useParams()
  const { data: team } = useSuspenseQuery(convexQuery(api.teams.getDetails, { teamId: teamId as any }))

  if (!team) return <div className="py-20 text-center text-white">Team not found</div>

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md md:p-12">
        <div className="flex flex-col items-center gap-8 md:flex-row">
          <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-slate-800 border-2 border-white/20 text-5xl font-black text-white shadow-2xl">
            {team.shortName}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black text-white sm:text-6xl">{team.name}</h1>
            <p className="mt-2 text-xl font-medium text-slate-400">SPD ISL Participant</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-8">
        <TeamStatCard label="Matches Played" value={team.stats.played} />
        <TeamStatCard label="Wins" value={team.stats.won} />
        <TeamStatCard label="Goals Scored" value={team.stats.goalsScored} />
      </div>

      {/* Player List */}
      <div>
        <h2 className="mb-8 text-3xl font-bold text-white">Squad</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.players.map((player: any) => (
            <div 
              key={player._id}
              className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-slate-400 group-hover:bg-white group-hover:text-slate-950 transition-colors">
                  #{player.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-white">{player.name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Forward</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-white">{player.goals}</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Goals</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TeamStatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-500">{label}</p>
      <p className="text-4xl font-black text-white">{value}</p>
    </div>
  )
}
