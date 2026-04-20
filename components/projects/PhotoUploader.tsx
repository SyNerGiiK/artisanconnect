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
    <div className="mt-5 pt-5 border-t border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-800">Photos du projet ({photos.length}/5)</h4>
        {photos.length < 5 && (
          <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-900 transition-colors">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {uploading ? 'Upload...' : 'Ajouter'}
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

      {error && <p className="text-xs text-red-600 mb-2">{error}</p>}

      {photos.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {photos.map((url) => (
            <div key={url} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image src={url} alt="Photo projet" fill className="object-cover" sizes="120px" />
              <button
                onClick={() => handleDelete(url)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400">Aucune photo ajoutée. Cliquez sur &quot;Ajouter&quot; pour illustrer vos travaux.</p>
      )}
    </div>
  )
}
