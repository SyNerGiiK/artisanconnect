'use client'

import { useRef, useState } from 'react'
import { uploadProjectPhoto, deleteProjectPhoto } from '@/app/particulier/projet/[id]/uploadPhotoAction'
import Image from 'next/image'

type Props = {
  projetId: string
  existingPhotos: string[]
}

export default function PhotoUploader({ projetId, existingPhotos }: Props) {
  const [photos, setPhotos] = useState<string[]>(existingPhotos)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('projet_id', projetId)
    formData.append('photo', file)

    const result = await uploadProjectPhoto(formData)
    if (result?.error) {
      setError(result.error)
    } else if (result?.url) {
      setPhotos((prev) => [...prev, result.url!])
    }
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleDelete = async (url: string) => {
    if (!confirm('Supprimer cette photo ?')) return
    const result = await deleteProjectPhoto(projetId, url)
    if (result?.error) {
      setError(result.error)
    } else {
      setPhotos((prev) => prev.filter((p) => p !== url))
    }
  }

  return (
    <div className="mt-5 pt-5 border-t border-ac-border">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-bold text-ac-text">
          Photos du projet ({photos.length}/5)
        </h4>
        {photos.length < 5 && (
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-ac-sm bg-ac-text px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:opacity-90">
            + {uploading ? 'Upload…' : 'Ajouter'}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {error && <p className="mb-2 text-xs text-ac-red">{error}</p>}

      {photos.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {photos.map((url) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-ac-sm bg-ac-surface-hover"
            >
              <Image src={url} alt="Photo projet" fill className="object-cover" sizes="120px" />
              <button
                type="button"
                onClick={() => handleDelete(url)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-ac-text-muted">
          Aucune photo ajoutée. Cliquez sur «&nbsp;Ajouter&nbsp;» pour illustrer vos travaux.
        </p>
      )}
    </div>
  )
}
