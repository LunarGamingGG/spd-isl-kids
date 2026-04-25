import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'
import { FloatingPaths } from '~/components/ui/background-paths'
import { BorderRotate } from '~/components/ui/animated-gradient-border'

export const Route = createFileRoute('/points-table')({
  component: PointsTableComponent,
})

function PointsTableComponent() {
  const { data: table } = useSuspenseQuery(convexQuery(api.table.getTable, {}))

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-white sm:text-5xl uppercase italic tracking-tight">Standings</h1>
          <p className="text-lg text-slate-400 font-medium tracking-wide">Live standings for the SPD ISL Kids Tournament.</p>
        </div>

        <BorderRotate 
          className="overflow-hidden p-1 shadow-2xl"
          borderRadius={32}
          borderWidth={2}
          animationSpeed={8}
          backgroundColor="#0f172a"
        >
          <div className="overflow-hidden rounded-[2rem] bg-slate-900/60 backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Pos</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Team</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-400">P</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-400">W</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-400">D</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-400">L</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-400">GF</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-400">GA</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-400">GD</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-400">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {table.map((row, index) => {
                  const isTopFour = index < 4;
                  return (
                    <tr 
                      key={row.teamId} 
                      className={`transition-colors hover:bg-white/[0.02] ${
                        isTopFour ? 'bg-emerald-500/5' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black ${
                          isTopFour ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link to="/teams/$teamId" params={{ teamId: row.teamId }} className={`flex items-center gap-3 transition-colors ${
                          isTopFour ? 'hover:text-emerald-400' : 'hover:text-white'
                        }`}>
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 border text-xs font-black shadow-inner ${
                            isTopFour ? 'border-emerald-500/30' : 'border-white/5'
                          }`}>
                            {row.shortName}
                          </div>
                          <span className="font-bold text-white">{row.name}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-slate-300">{row.played}</td>
                      <td className="px-6 py-4 text-center font-medium text-slate-300">{row.won}</td>
                      <td className="px-6 py-4 text-center font-medium text-slate-300">{row.drawn}</td>
                      <td className="px-6 py-4 text-center font-medium text-slate-300">{row.lost}</td>
                      <td className="px-6 py-4 text-center font-medium text-slate-300">{row.gf}</td>
                      <td className="px-6 py-4 text-center font-medium text-slate-300">{row.ga}</td>
                      <td className="px-6 py-4 text-center font-medium text-slate-300">{row.gd}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-black text-white">{row.points}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        </BorderRotate>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">Qualifiers</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>Top 4 Qualify for Semi-Finals</span>
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">Points</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex justify-between"><span>Win</span> <span className="font-bold text-white">3 Pts</span></li>
              <li className="flex justify-between"><span>Draw</span> <span className="font-bold text-white">1 Pt</span></li>
            </ul>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">Tie-breakers</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-400">
              <li>Goal Difference</li>
              <li>Goals For</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
