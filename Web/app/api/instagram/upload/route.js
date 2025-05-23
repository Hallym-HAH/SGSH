import { InstagramPublisher } from '../../../../lib/instagram'

export async function POST(request) {
    try {
        const { imageUrl, caption } = await request.json()

        if (!imageUrl) {
            return Response.json({ error: 'Image URL is required' }, { status: 400 })
        }

        const publisher = new InstagramPublisher()
        const result = await publisher.uploadImageToFeed(imageUrl, caption)

        if (result) {
            return Response.json({
                success: true,
                data: result,
                message: '이미지가 성공적으로 업로드되었습니다.'
            })
        } else {
            return Response.json({
                success: false,
                error: '이미지 업로드에 실패했습니다.'
            }, { status: 500 })
        }

    } catch (error) {
        console.error('API 오류:', error)
        return Response.json({
            success: false,
            error: error.message || '서버 오류가 발생했습니다.'
        }, { status: 500 })
    }
}
