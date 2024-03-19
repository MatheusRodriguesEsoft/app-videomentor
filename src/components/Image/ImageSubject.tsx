/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { defaultImageSubjectURL, signedUrl } from '@/utils/configs/signed-url'
import React, { useEffect, useState } from 'react'
import styles from './styles/ImageSubject.module.css'

interface ImageSubjetctProps {
  imageUrl: string
  imageName: string
  alt: string
}

const ImageSubjetct = ({ imageUrl, imageName, alt }: ImageSubjetctProps) => {
  const [signedImageUrl, setSignedImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (imageUrl && imageName) {
      signedUrl(imageUrl, imageName)
        ?.then((url) => setSignedImageUrl(url))
        .catch(() => setSignedImageUrl(null))
    }
  }, [imageUrl])

  return (
    <div className={styles.image}>
      <img
        src={signedImageUrl ?? defaultImageSubjectURL}
        className={styles.img}
        alt={alt}
      />
    </div>
  )
}

export default ImageSubjetct
