import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'
import React, { useState } from 'react'
import { FloatingPaths } from '~/components/ui/background-paths'
import { BorderRotate } from '~/components/ui/animated-gradient-border'

export const Route = createFileRoute('/leaderboard')({
  component: LeaderboardComponent,
})

type StatType = 'ga' | 'yellow' | 'red'

const goldColors = { primary: '#584827', secondary: '#c7a03c', accent: '#f9de90' };
const silverColors = { primary: '#334155', secondary: '#94a3b8', accent: '#f1f5f9' };
const bronzeColors = { primary: '#451a03', secondary: '#b45309', accent: '#f59e0b' };

function LeaderboardComponent() {
  const { data: players } = useSuspenseQuery(convexQuery(api.players.listAllPlayers, {}))
  const [activeStat, setActiveStat] = useState<StatType>('ga')

  const sortedPlayers = [...players].sort((a, b) => {
    if (activeStat === 'ga') return (b.goals + b.assists) - (a.goals + a.assists)
    if (activeStat === 'yellow') return b.yellowCards - a.yellowCards
    return b.redCards - a.redCards
  })

  const getStatValue = (player: any) => {
    if (activeStat === 'ga') return player.goals + player.assists
    if (activeStat === 'yellow') return player.yellowCards
    return player.redCards
  }

  const getStatLabel = () => {
    if (activeStat === 'ga') return 'Goals + Assists'
    if (activeStat === 'yellow') return 'Yellow Cards'
    return 'Red Cards'
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-white sm:text-5xl uppercase italic tracking-tight">Player Leaderboard</h1>
          <p className="text-lg text-slate-400 font-medium tracking-wide">Individual performance across the tournament.</p>
        </div>

        <div className="mb-12 flex items-center justify-center gap-3">
          <StatButton active={activeStat === 'ga'} onClick={() => setActiveStat('ga')}>Goals / Assists</StatButton>
          <StatButton active={activeStat === 'yellow'} onClick={() => setActiveStat('yellow')}>Yellow Cards</StatButton>
          <StatButton active={activeStat === 'red'} onClick={() => setActiveStat('red')}>Red Cards</StatButton>
        </div>

        <div className="space-y-6 pb-20">
          {sortedPlayers.map((player, index) => {
            const value = getStatValue(player);
            if (index > 25) return null; 

            const isTopThree = index < 3;
            const colors = index === 0 ? goldColors : index === 1 ? silverColors : index === 2 ? bronzeColors : undefined;

            return (
              <BorderRotate
                key={player._id}
                className={`group relative overflow-hidden p-1 transition-all duration-500 hover:scale-[1.02] shadow-2xl ${
                  !isTopThree ? 'border-white/10 bg-white/5 opacity-80 hover:opacity-100' : ''
                }`}
                borderRadius={32}
                borderWidth={isTopThree ? 3 : 1}
                animationSpeed={index === 0 ? 3 : index === 1 ? 5 : index === 2 ? 7 : 10}
                gradientColors={colors}
                backgroundColor="#0f172a"
              >
                <div className="flex flex-col sm:flex-row items-center justify-between rounded-[2rem] bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl gap-4 sm:gap-0">
                  <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                    <span className={`text-xl sm:text-2xl font-black min-w-[2rem] ${
                      index === 0 ? 'text-amber-400' :
                      index === 1 ? 'text-slate-300' :
                      index === 2 ? 'text-amber-700' : 'text-slate-600'
                    }`}>
                      #{index + 1}
                    </span>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">{player.name}</h3>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                        <span className="font-medium">{player.teamName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t border-white/5 pt-4 sm:border-0 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="block text-2xl sm:text-3xl font-black text-white">{value}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{getStatLabel()}</span>
                    </div>
                    {isTopThree && value > 0 && (
                      <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 text-xl sm:text-2xl ${
                        index === 0 ? 'animate-bounce' : ''
                      }`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                    )}
                  </div>
                </div>
              </BorderRotate>
            );
          })}
        </div>
      </div>
    </div>
  )
}

function StatButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
        active 
          ? 'bg-white text-slate-950 shadow-lg' 
          : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}
