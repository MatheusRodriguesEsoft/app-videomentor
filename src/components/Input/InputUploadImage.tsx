/* eslint-disable @next/next/no-img-element */
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import styles from './styles/InputUploadImage.module.css'
import { FaPlus, FaCheck } from 'react-icons/fa'
import { CgClose } from 'react-icons/cg'
import UploadAPI from '@/resources/upload-api'
import LinearIndeterminate from '../LinearIndeterminate/LinearIndeterminate'
import User from '@/models/user'

interface InputUploadImageProps {
  values: User
  setValues: Dispatch<SetStateAction<User>>
  imageDel: string
  setImageDel: Dispatch<SetStateAction<string>>
  loading: string
  setLoading: Dispatch<SetStateAction<string>>
  selectedImage: File | null
  setSelectedImage: Dispatch<SetStateAction<File | null>>
}

const InputUploadImage: React.FC<InputUploadImageProps> = ({
  values,
  setValues,
  imageDel,
  setImageDel,
  loading,
  setLoading,
  selectedImage,
  setSelectedImage,
}) => {
  const [image, setImage] = useState<string | null>(null)
  const uploadApi = new UploadAPI()

  useEffect(() => {
    if (values.image) {
      setImage(values.image)
    }
  }, [values])

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newImage: File = event.target.files[0]
      setSelectedImage(newImage as File)
    }
  }

  useEffect(() => {
    // Converte a imagem em URL para exibição
    if (selectedImage) {
      const imageUrl = URL.createObjectURL(selectedImage)
      setImage(imageUrl)

      // Limpando a URL da imagem quando o componente é desmontado
      return () => {
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl)
        }
      }
    }
  }, [selectedImage])

  const deleteImage = () => {
    setImageDel(image as string)
    setValues({ ...values, image: '' })
    setImage(null)
    setSelectedImage(null)
  }

  return (
    <div className={styles.container}>
      <div style={{ display: loading }}>
        <LinearIndeterminate />
      </div>

      <span className={styles.titleImgs}>Imagem</span>
      {image && (
        <div className={styles.imageContainer}>
          <div className={styles.btnRemove} onClick={deleteImage}>
            <CgClose size={24} />
          </div>
          <img className={styles.img} src={image} alt={`Imagem`} />
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
