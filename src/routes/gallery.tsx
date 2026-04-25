import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'

export const Route = createFileRoute('/gallery')({
  component: GalleryComponent,
})

function GalleryComponent() {
  const { data: items } = useSuspenseQuery(convexQuery(api.gallery.list, {}))

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-extrabold text-white sm:text-5xl">Gallery</h1>
        <p className="text-lg text-slate-400">Capturing the best moments of the tournament.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div 
            key={item._id}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
          >
            {item.type === 'image' ? (
              <img 
                src={item.url} 
                alt={item.description}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-900">
                <span className="text-4xl">📹</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-sm font-medium text-white">{item.description || 'Tournament Moment'}</p>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-4xl">📸</div>
            </div>
            <p className="text-slate-500">The tournament hasn't started yet. Check back soon for photos!</p>
          </div>
        )}
      </div>
    </div>
  )
}
