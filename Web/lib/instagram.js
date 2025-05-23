export class InstagramPublisher {
    constructor() {
        this.access_token = process.env.ACCESS_TOKEN
        this.instagram_account_id = process.env.INSTAGRAM_ACCOUNT_ID
        this.base_url = "https://graph.facebook.com/v20.0"
    }

    async createImageContainer(imageUrl, caption = null) {
        const url = `${this.base_url}/${this.instagram_account_id}/media`

        const formData = new FormData()
        formData.append('media_type', 'IMAGE')
        formData.append('image_url', imageUrl)
        formData.append('access_token', this.access_token)

        if (caption) {
            formData.append('caption', caption)
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            })

            if (response.ok) {
                const result = await response.json()
                if (result.id) {
                    console.log('이미지 미디어 컨테이너 생성 성공:', result.id)
                    return result.id
                }
            } else {
                console.error('이미지 미디어 컨테이너 생성 실패:', await response.text())
            }
            return null
        } catch (error) {
            console.error('이미지 미디어 컨테이너 생성 중 예외 발생:', error)
            return null
        }
    }

    async publishMedia(containerId) {
        const url = `${this.base_url}/${this.instagram_account_id}/media_publish`

        const formData = new FormData()
        formData.append('creation_id', containerId)
        formData.append('access_token', this.access_token)

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            })

            if (response.ok) {
                const result = await response.json()
                console.log('미디어 게시 성공:', result)
                return result
            } else {
                console.error('미디어 게시 실패:', await response.text())
            }
            return null
        } catch (error) {
            console.error('미디어 게시 중 예외 발생:', error)
            return null
        }
    }

    async uploadImageToFeed(imageUrl, caption = null) {
        try {
            const containerId = await this.createImageContainer(imageUrl, caption)
            if (!containerId) {
                throw new Error('컨테이너 ID를 가져오지 못했습니다')
            }

            // 처리 대기
            await new Promise(resolve => setTimeout(resolve, 10000))

            const result = await this.publishMedia(containerId)
            if (result && result.id) {
                console.log('이미지 게시 완료:', result)
                return result
            } else {
                throw new Error('게시 결과에 ID가 없습니다')
            }

        } catch (error) {
            console.error('이미지 업로드 중 오류 발생:', error)
            throw error
        }
    }
}
