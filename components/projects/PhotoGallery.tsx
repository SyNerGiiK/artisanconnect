'use client'

import { useState } from 'react'
import Image from 'next/image'

interface PhotoGalleryProps {
  photos: string[]
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  if (!photos || photos.length === 0) return null

  return (
    <div className="mt-4 mb-4">
      <h3 className="text-sm font-bold text-ac-text mb-2 border-b border-ac-border pb-1">Photos du projet ({photos.length})</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 min-h-24">
        {photos.map((photo, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedPhoto(photo)}
            className="relative h-20 w-32 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border border-ac-border transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ac-primary"
          >
            <Image
              src={photo}
              alt={`Photo ${idx + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative h-full max-h-[85vh] w-full max-w-4xl">
            <Image
              src={selectedPhoto}
              alt="Photo agrandie"
              fill
              className="object-contain"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-2 right-2 rounded-full bg-black/50 p-2 text-white hover:bg-black"
            >
              Fermer ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
