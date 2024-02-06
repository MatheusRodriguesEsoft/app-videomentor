/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import User from '@/models/user'
import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { CgClose } from 'react-icons/cg'
import { FaPlus } from 'react-icons/fa'
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

  const deleteImage = () => {}

  return (
    <div className={styles.container}>
      <div style={{ display: loading }}>
        <LinearIndeterminate />
      </div>

      <span className={styles.titleImgs}>Imagem</span>
      {values.imageUrl && (
        <div className={styles.imageContainer}>
          <div className={styles.btnRemove} onClick={deleteImage}>
            <CgClose size={24} />
          </div>
          <img
            className={styles.img}
            src={values.imageUrl}
            alt={`User avatar`}
          />
        </div>
      )}

      <div className={styles.btnContainer}>
        <label className={styles.labelInputFile} htmlFor={'inputFile'}>
          <FaPlus />
          <span style={{ marginLeft: '.5rem' }}>Imagem</span>
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
    </div>
  )
}

export default InputUploadImage
