import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'
import { BeamsBackground } from '~/components/ui/beams-background'
import { motion } from 'framer-motion'
import { GlowCard } from '~/components/ui/spotlight-card'

export const Route = createFileRoute('/rules')({
  component: RulesComponent,
})

function RulesComponent() {
  const { data: rules } = useSuspenseQuery(convexQuery(api.rules.list, {}))

  return (
    <BeamsBackground intensity="strong" className="bg-transparent">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-white sm:text-5xl uppercase italic tracking-tight">Tournament Rules</h1>
          <p className="text-lg text-slate-400 font-medium tracking-wide">Fair play and official guidelines for SPD ISL Kids.</p>
        </div>

        <div className="grid gap-6">
          {rules.map((rule, index) => (
            <motion.div 
              key={rule._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: index * 0.1 }}
            >
              <GlowCard 
                customSize
                className="group flex gap-8 rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:bg-white/[0.08] hover:border-white/30 shadow-2xl"
                glowColor="orange"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-950 text-2xl font-black shadow-xl relative z-10">
                  {index + 1}
                </div>
                <p className="text-xl leading-[1.6] text-slate-300 font-bold tracking-tight relative z-10">
                  {rule.content}
                </p>
              </GlowCard>
            </motion.div>
          ))}

          {rules.length === 0 && (
            <div className="py-20 text-center text-slate-500">
              No rules published yet.
            </div>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <GlowCard 
            customSize
            glowColor="red"
            className="mt-16 rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur-md text-center"
          >
            <h3 className="mb-4 text-xl font-black text-white uppercase tracking-[0.3em] relative z-10">Important Note</h3>
            <p className="text-slate-400 font-bold leading-relaxed max-w-2xl mx-auto relative z-10">
              The decision of the referees and the organizing committee will be final and binding. Any unsportsmanlike behavior may lead to disqualification.
            </p>
          </GlowCard>
        </motion.div>
      </div>
    </BeamsBackground>
  )
}
