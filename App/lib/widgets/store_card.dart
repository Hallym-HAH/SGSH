import 'package:app/pages/storedetail.dart';
import 'package:flutter/material.dart';
import '../models/store.dart';

// 🏪 가게 카드 UI
class StoreCard extends StatelessWidget {
  final Store store;

  const StoreCard({required this.store});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => StoreDetailPage(),
          ),
        );
      },
      child: Card(
        color: const Color.fromARGB(255, 255, 255, 255), // 🔥 카드 배경색 변경
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(0), // 직사각형 카드 유지
        ),
        elevation: 0, // 🔥 그림자 제거
        margin: EdgeInsets.symmetric(vertical: 0), // 카드 간격 최소화
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 가게 이름
                  Text(
                    store.name,
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),

                  // 평점 & 위치
                  Row(
                    children: [
                      Icon(Icons.star, color: Colors.orange, size: 20),
                      SizedBox(width: 4),
                      Text(
                        "STAR (1400)", // 🔥 실제 평점 데이터 필요하면 store.rating 추가 가능
                        style: TextStyle(fontSize: 14),
                      ),
                      SizedBox(width: 10),
                      Icon(Icons.location_on, color: Colors.grey, size: 18),
                      SizedBox(width: 4),
                      Text(store.address, style: TextStyle(fontSize: 14)),
                    ],
                  ),
                ],
              ),
            ),

            Padding(
              padding: EdgeInsets.symmetric(horizontal: 12.0), // 🔥 좌우 패딩만 적용
              child: ClipRRect(
                borderRadius: BorderRadius.all(
                  Radius.circular(12.0),
                ), // 🔥 둥근 모서리 적용
                child: Image.network(
                  store.image, // store.image가 null이면 빈 문자열로 처리
                  width: double.infinity,
                  height: 180,
                  fit: BoxFit.cover,
                  loadingBuilder: (context, child, loadingProgress) {
                    if (loadingProgress == null) return child;
                    return Center(child: CircularProgressIndicator());
                  },
                  errorBuilder: (context, error, stackTrace) {
                    return Center(
                      child: Icon(Icons.error, color: Colors.red),
                    ); // 오류 발생 시 아이콘 표시
                  },
                ),
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 영업 시간 & 가격 정보
                  Row(
                    children: [
                      Icon(Icons.access_time, color: Colors.grey, size: 16),
                      SizedBox(width: 2),
                      Text(store.time, style: TextStyle(fontSize: 12)),
                      SizedBox(width: 10),

                      Icon(Icons.attach_money, color: Colors.grey, size: 16),
                      SizedBox(width: 2),
                      Text(
                        "{store.price}",
                        style: TextStyle(fontSize: 12),
                      ), // 🔥 가격 정보 수정
                    ],
                  ),
                ],
              ),
            ),

            // 🔥 구분선 추가
            Container(
              height: 3,
              color: const Color.fromARGB(255, 231, 231, 231),
            ),
          ],
        ),
      ),
    );
  }
}
