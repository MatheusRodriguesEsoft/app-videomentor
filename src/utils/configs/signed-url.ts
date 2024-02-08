import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const defaultImageURL = '/images/user/avatar/user-avatar.png'

export const signedUrl = (url: string, imageName: string) => {
  if (url.slice(0, 5) === 'https') {
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
      Key: imageName,
    }

    const command = new GetObjectCommand(params)

    return getSignedUrl(s3Client, command).then((url) => url)
  }
}
