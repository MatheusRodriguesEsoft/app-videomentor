/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import User from '@/models/user'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FaPlus, FaRegTrashAlt } from 'react-icons/fa'
import LinearIndeterminate from '../LinearIndeterminate/LinearIndeterminate'
import styles from './styles/InputUploadImage.module.css'

interface InputUploadImageProps {
  values: User
  setValues: Dispatch<SetStateAction<User>>
  loading: string
  setLoading: Dispatch<SetStateAction<string>>
  setDeleteFile: Dispatch<SetStateAction<string | undefined>>
  selectedImage: File | null
  setSelectedImage: Dispatch<SetStateAction<File | null>>
}

const InputUploadImage: React.FC<InputUploadImageProps> = ({
  values,
  setValues,
  loading,
  setLoading,
  setDeleteFile,
  selectedImage,
  setSelectedImage,
}) => {
  const defaultImageURL = '/images/user/avatar/user-avatar.png'
  const [signedImageUrl, setSignedImageUrl] = useState<string | null>(null)

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeleteFile(values.imageName)
    if (event.target.files && event.target.files.length > 0) {
      const newImage: File = event.target.files[0]
      setSelectedImage(newImage)
    }
  }

  useEffect(() => {
    if (selectedImage) {
      const imageUrl = URL.createObjectURL(selectedImage)
      setValues({ ...values, imageUrl: imageUrl })
      setSignedImageUrl(imageUrl)
      return () => {
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl)
        }
      }
    }
  }, [selectedImage])

  useEffect(() => {
    if (values.imageUrl?.slice(0, 5) === 'https') {
      const s3Client = new S3Client({
        region: process.env.NEXT_PUBLIC_AWS_DEFAULT_REGION as string,
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
          secretAccessKey: process.env
            .NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
        },
      })

      const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
        Key: values.imageName,
      }

      const command = new GetObjectCommand(params)

      getSignedUrl(s3Client, command, { expiresIn: 15 * 60 })
        .then((url) => setSignedImageUrl(url))
        .catch(() => setSignedImageUrl(null))
    }
  }, [values.imageUrl])

  const deleteImage = () => {
    setValues({ ...values, imageUrl: defaultImageURL })
    setSignedImageUrl(defaultImageURL)
    setSelectedImage(null)
  }

  return (
    <div className={styles.container}>
      <div style={{ display: loading }}>
        <LinearIndeterminate />
      </div>
      <div className={styles.imageContainer}>
        <span className={styles.titleImgs}>Imagem</span>
        <div className={styles.image}>
          <img
            src={signedImageUrl ?? defaultImageURL}
            className={styles.img}
            alt={`User avatar`}
          />
        </div>

        <div className={styles.btnContainer}>
          <div>
            <label className={styles.labelInputFile} htmlFor={'inputFile'}>
              <FaPlus />
              <span style={{ marginLeft: '.5rem' }}>Carregar Imagem</span>
              <input
                type={'file'}
                accept={'image/*'}
                id={'inputFile'}
                name={'inputFile'}
                onChange={handleChangeImage}
                className={styles.customInput}
              />
            </label>
          </div>
          <div>
            <button
              type={'button'}
              className={styles.btnTrash}
              onClick={deleteImage}
            >
              <FaRegTrashAlt />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InputUploadImage
