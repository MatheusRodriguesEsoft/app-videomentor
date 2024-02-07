/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import User from '@/models/user'
import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { FaPlus, FaRegTrashAlt } from 'react-icons/fa'
import LinearIndeterminate from '../LinearIndeterminate/LinearIndeterminate'
import styles from './styles/InputUploadImage.module.css'

interface InputUploadImageProps {
  values: User
  setValues: Dispatch<SetStateAction<User>>
  loading: string
  setLoading: Dispatch<SetStateAction<string>>
  selectedImage: File | null
  setSelectedImage: Dispatch<SetStateAction<File | null>>
}

const InputUploadImage: React.FC<InputUploadImageProps> = ({
  values,
  setValues,
  loading,
  setLoading,
  selectedImage,
  setSelectedImage,
}) => {
  const defaultImageURL = '/images/user/avatar/user-avatar.png'

  const renameFile = (file: File, newName: string): File => {
    const renamedFile = new File([file], newName, { type: file.type })
    return renamedFile
  }

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newImage: File = event.target.files[0]
      const renamedImage = renameFile(newImage, `${values.idUser}.jpg`)
      setSelectedImage(renamedImage)
    }
  }

  useEffect(() => {
    if (selectedImage) {
      const imageUrl = URL.createObjectURL(selectedImage)
      setValues({ ...values, imageUrl: imageUrl })
      return () => {
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl)
        }
      }
    }
  }, [selectedImage])

  const deleteImage = () => {
    const defaultImage: File = renameFile(
      new File([], defaultImageURL),
      `${values.idUser}.jpg`
    )
    setSelectedImage(defaultImage)
    setValues({ ...values, imageUrl: defaultImageURL })
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
            src={values.imageUrl ?? defaultImageURL}
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
