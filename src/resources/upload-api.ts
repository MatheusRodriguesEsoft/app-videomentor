import GenericApi from './generic-api'
import URL from './URL'

/**
 * @author Matheus Rodrigues
 */
export default class UploadAPI<E> extends GenericApi<E> {
  public constructor(value?: string) {
    super({
      baseURL: `${URL.API_UPLOAD_IMAGES + (value ?? '')}`,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  public async uploadImages(formData: FormData) {
    return this.api.post('/upload', formData)
  }

  public async deleteImage(imageId: string) {
    return this.api.delete(`/delete/${imageId}`)
  }
}
