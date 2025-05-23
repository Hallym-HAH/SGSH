from dotenv import load_dotenv
import os

load_dotenv()


import requests
import json
import time
import logging

# 로깅 설정
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class InstagramPublisher:
    def __init__(self, access_token, instagram_account_id):
        """
        Instagram API 게시 클래스 초기화

        Args:
            access_token (str): Instagram Graph API 액세스 토큰
            instagram_account_id (str): Instagram 비즈니스 계정 ID
        """
        self.access_token = access_token
        self.instagram_account_id = instagram_account_id
        # 엔드포인트를 graph.facebook.com으로 변경 (중요!)
        self.base_url = "https://graph.facebook.com/v20.0"

    def check_permissions(self):
        """
        현재 액세스 토큰의 권한 확인

        Returns:
            list: 현재 부여된 권한 목록
        """
        url = f"{self.base_url}/me/permissions"
        params = {
            "access_token": self.access_token
        }

        try:
            response = requests.get(url, params=params)
            if response.status_code == 200:
                result = response.json()
                logger.info(f"현재 부여된 권한: {result}")
                return result
            else:
                logger.error(f"권한 확인 실패: {response.text}")
                return None
        except Exception as e:
            logger.error(f"권한 확인 중 오류 발생: {str(e)}")
            return None

    # def verify_account_type(self):
    #     """
    #     Instagram 계정이 비즈니스 계정인지 확인
    #
    #     Returns:
    #         bool: 비즈니스 계정 여부
    #     """
    #     url = f"{self.base_url}/{self.instagram_account_id}"
    #     params = {
    #         "fields": "id,username,account_type",
    #         "access_token": self.access_token
    #     }
    #
    #     try:
    #         response = requests.get(url, params=params)
    #         if response.status_code == 200:
    #             result = response.json()
    #             account_type = result.get("account_type", "")
    #             is_business = account_type == "BUSINESS"
    #             logger.info(f"Instagram 계정 유형: {account_type}, 비즈니스 계정 여부: {is_business}")
    #             return is_business
    #         else:
    #             logger.error(f"계정 유형 확인 실패: {response.text}")
    #             return False
    #     except Exception as e:
    #         logger.error(f"계정 유형 확인 중 오류 발생: {str(e)}")
    #         return False

    def verify_account_type(self):
        """
        Instagram 계정이 비즈니스 계정인지 확인

        Returns:
            bool: 비즈니스 계정 여부
        """
        # 방법 1: 올바른 필드 요청 (business_discovery 등 비즈니스 전용 필드로 확인)
        url = f"{self.base_url}/{self.instagram_account_id}"
        params = {
            "fields": "id,username,ig_id,profile_picture_url",
            "access_token": self.access_token
        }

        try:
            response = requests.get(url, params=params)
            if response.status_code != 200:
                logger.error(f"계정 정보 조회 실패: {response.text}")
                return False

            # 방법 2: business_discovery 엔드포인트 접근 시도
            # (비즈니스 계정만 이 엔드포인트에 접근 가능)
            username = response.json().get("username")
            if not username:
                return False

            business_url = f"{self.base_url}/{self.instagram_account_id}"
            business_params = {
                "fields": f"business_discovery.username({username})",
                "access_token": self.access_token
            }

            business_response = requests.get(business_url, params=business_params)

            # 비즈니스 엔드포인트에 접근 가능하면 비즈니스 계정으로 간주
            is_business = business_response.status_code == 200
            logger.info(f"비즈니스 계정 확인 결과: {is_business}")
            return is_business

        except Exception as e:
            logger.error(f"계정 타입 확인 중 오류 발생: {str(e)}")
            return False

    # def verify_facebook_connection(self):
    #     """
    #     Instagram 계정과 Facebook 페이지의 연결 확인
    #
    #     Returns:
    #         bool: 연결 상태
    #     """
    #     url = f"{self.base_url}/{self.instagram_account_id}"
    #     params = {
    #         "fields": "connected_facebook_page",
    #         "access_token": self.access_token
    #     }
    #
    #     try:
    #         response = requests.get(url, params=params)
    #         if response.status_code == 200:
    #             result = response.json()
    #             connected_page = result.get("connected_facebook_page", {})
    #             logger.info(f"연결된 Facebook 페이지: {connected_page}")
    #             return bool(connected_page)
    #         else:
    #             logger.error(f"Facebook 페이지 연결 확인 실패: {response.text}")
    #             return False
    #     except Exception as e:
    #         logger.error(f"Facebook 페이지 연결 확인 중 오류 발생: {str(e)}")
    #         return False

    def verify_facebook_connection(self):
        """
        Instagram 계정과 Facebook 페이지의 연결 확인 (수정된 버전)

        Returns:
            bool: 연결 상태
        """
        try:
            # 방법 1: Facebook 페이지 목록 조회
            url = f"{self.base_url}/me/accounts"
            params = {
                "fields": "id,name,instagram_business_account",
                "access_token": self.access_token
            }

            response = requests.get(url, params=params)
            if response.status_code != 200:
                logger.error(f"Facebook 페이지 목록 조회 실패: {response.text}")
                return False

            # 페이지 목록에서 Instagram 비즈니스 계정이 연결된 페이지 확인
            pages = response.json().get('data', [])
            if not pages:
                logger.error("Facebook 페이지를 찾을 수 없습니다.")
                return False

            # 현재 Instagram 계정 ID와 연결된 페이지 찾기
            for page in pages:
                instagram_account = page.get('instagram_business_account', {})
                if instagram_account and instagram_account.get('id') == self.instagram_account_id:
                    logger.info(f"Instagram 계정이 Facebook 페이지 '{page.get('name')}' (ID: {page.get('id')})와 연결되어 있습니다.")
                    return True

            logger.warning("현재 Instagram 계정과 연결된 Facebook 페이지를 찾을 수 없습니다.")
            return False

        except Exception as e:
            logger.error(f"Facebook 페이지 연결 확인 중 오류 발생: {str(e)}")
            return False

    def create_image_container(self, image_url, caption=None):
        """
        Instagram 이미지 미디어 컨테이너 생성

        Args:
            image_url (str): 업로드할 이미지의 공개 액세스 가능한 URL
            caption (str, optional): 게시물 캡션

        Returns:
            str: 생성된 컨테이너 ID
        """
        # 페이지 액세스 토큰으로 이미지 컨테이너 생성
        url = f"{self.base_url}/{self.instagram_account_id}/media"

        # 필요한 파라미터 설정 (media_type 명시적 지정)
        data = {
            "media_type": "IMAGE",
            "image_url": image_url,
            "access_token": self.access_token
        }

        if caption:
            data["caption"] = caption

        logger.info("이미지 미디어 컨테이너 생성 시작")

        try:
            response = requests.post(url, data=data)

            if response.status_code == 200:
                result = json.loads(response.text)
                if 'id' in result:
                    container_id = result['id']
                    logger.info(f"이미지 미디어 컨테이너 생성 성공: {container_id}")
                    return container_id
                else:
                    logger.error(f"컨테이너 ID를 찾을 수 없음: {response.text}")
                    return None
            else:
                logger.error(f"이미지 미디어 컨테이너 생성 실패: {response.text}")
                return None
        except Exception as e:
            logger.error(f"이미지 미디어 컨테이너 생성 중 예외 발생: {str(e)}")
            return None

    def publish_media(self, container_id):
        """
        미디어 컨테이너 게시

        Args:
            container_id (str): 게시할 컨테이너 ID

        Returns:
            dict: 응답 데이터
        """
        url = f"{self.base_url}/{self.instagram_account_id}/media_publish"
        data = {
            "creation_id": container_id,
            "access_token": self.access_token
        }

        logger.info(f"미디어 게시 시작: {container_id}")

        try:
            response = requests.post(url, data=data)

            if response.status_code == 200:
                result = json.loads(response.text)
                logger.info(f"미디어 게시 성공: {result}")
                return result
            else:
                logger.error(f"미디어 게시 실패: {response.text}")
                return None
        except Exception as e:
            logger.error(f"미디어 게시 중 예외 발생: {str(e)}")
            return None

    def upload_image_to_feed(self, image_url, caption=None):
        """
        Instagram 피드에 이미지 업로드

        Args:
            image_url (str): 업로드할 이미지의 공개 액세스 가능한 URL
            caption (str, optional): 게시물 캡션

        Returns:
            dict: 게시된 미디어 정보
        """
        try:
            # 0. 계정 및 권한 확인
            if not self.verify_account_type():
                logger.error("Instagram 계정이 비즈니스 계정이 아닙니다. 비즈니스 계정으로 전환해주세요.")
                return None

            if not self.verify_facebook_connection():
                logger.error("Instagram 계정과 Facebook 페이지가 연결되어 있지 않습니다. 연결을 확인해주세요.")
                return None

            # 1. 미디어 컨테이너 생성
            container_id = self.create_image_container(image_url, caption)
            if not container_id:
                logger.error("컨테이너 ID를 가져오지 못했습니다")
                return None

            # 2. 처리 완료될 때까지 대기 (필수!)
            logger.info("Instagram 서버에서 이미지 처리 중... 10초 대기")
            time.sleep(10)

            # 3. 미디어 게시
            result = self.publish_media(container_id)
            if result and 'id' in result:
                logger.info(f"이미지 게시 완료: {result}")
                return result
            else:
                logger.error("게시 결과에 ID가 없습니다")
                return None

        except Exception as e:
            logger.error(f"이미지 업로드 중 오류 발생: {str(e)}")
            raise


def main():
    # 설정값
    ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")
    INSTAGRAM_ACCOUNT_ID = os.getenv("INSTAGRAM_ACCOUNT_ID")
    IMAGE_URL = os.getenv("IMAGE_URL")
    IMAGE_CAPTION = "이것은 Instagram API를 통해 피드에 업로드된 이미지입니다. #instagram #api #feed"

    # 인스턴스 생성
    publisher = InstagramPublisher(ACCESS_TOKEN, INSTAGRAM_ACCOUNT_ID)

    # 문제 해결 단계
    print("===== Instagram API 권한 및 계정 확인 =====")
    # 1. 권한 확인
    permissions = publisher.check_permissions()

    # 2. 계정 유형 확인
    is_business = publisher.verify_account_type()
    if not is_business:
        print("오류: Instagram 계정이 비즈니스 계정이 아닙니다. 비즈니스 계정으로 전환해야 합니다.")

    # 3. Facebook 연결 확인
    is_connected = publisher.verify_facebook_connection()
    if not is_connected:
        print("오류: Instagram 계정이 Facebook 페이지와 연결되어 있지 않습니다.")

    # 모든 확인이 통과된 경우에만 이미지 업로드 시도
    if is_business and is_connected:
        print("\n===== 이미지 업로드 시작 =====")
        try:
            image_result = publisher.upload_image_to_feed(IMAGE_URL, IMAGE_CAPTION)
            if image_result and 'id' in image_result:
                print(f"이미지 업로드 성공! ID: {image_result.get('id')}")
            else:
                print("이미지 업로드 실패")
        except Exception as e:
            print(f"이미지 업로드 중 오류 발생: {str(e)}")


if __name__ == "__main__":
    main()
