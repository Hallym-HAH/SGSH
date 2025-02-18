import 'package:flutter/material.dart';
import '../models/store.dart';

// 🏪 가게 카드 UI
class StoreCard extends StatelessWidget {
  final Store store;

  const StoreCard({required this.store});

  @override
  Widget build(BuildContext context) {
    return Card(
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

          // 대표 이미지 (PageView 사용)
          // Padding(
          //   padding: EdgeInsets.symmetric(horizontal: 12.0), // 🔥 좌우 패딩만 적용
          //   child: ClipRRect(
          //     borderRadius: BorderRadius.all(Radius.circular(12.0)), // 🔥 둥근 모서리 적용
          //     child: SizedBox(
          //       height: 180,
          //       child: store.url.isNotEmpty // 🔥 이미지가 있는 경우만 PageView 사용
          //           ? PageView(
          //               children: store.url.map((image) {
          //                 return ClipRRect(
          //                   borderRadius: BorderRadius.all(Radius.circular(12.0)),
          //                   child: Image.network(
          //                     image,
          //                     width: double.infinity,
          //                     fit: BoxFit.cover,
          //                     loadingBuilder: (context, child, loadingProgress) {
          //                       if (loadingProgress == null) return child;
          //                       return Center(child: CircularProgressIndicator());
          //                     },
          //                     errorBuilder: (context, error, stackTrace) =>
          //                         Image.asset('assets/images/no_image.png', fit: BoxFit.cover),
          //                   ),
          //                 );
          //               }).toList(),
          //             )
          //           : Image.asset('assets/images/no_image.png', fit: BoxFit.cover),
          //     ),
          //   ),
          // ),
          // 🔥 단일 이미지 표시 (PageView 제거)
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
          Container(height: 3, color: const Color.fromARGB(255, 231, 231, 231)),
        ],
      ),
    );
  }
}


// // TODO Implement this library.
// import 'package:flutter/material.dart';
// import '../models/store.dart';

// // 🏪 가게 카드 UI
// class StoreCard extends StatelessWidget {
//   final Store store;

//   const StoreCard({required this.store});

//   @override
//   Widget build(BuildContext context) {
//     return Card(
//       color: const Color.fromARGB(255, 255, 255, 255), // 🔥 카드 배경색 변경

//       shape: RoundedRectangleBorder(
//         borderRadius: BorderRadius.circular(0), // 직사각형 카드 유지
//       ),
//       elevation: 0, // 🔥 그림자 제거
//       margin: EdgeInsets.symmetric(vertical: 0), // 카드 간격 최소화      elevation: 0,
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
          
//           Padding(
//             padding: const EdgeInsets.all(12.0),
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 // ✅ 위쪽 테두리 추가

//                 // 가게 이름
//                 Text(
//                   store.name,
//                   style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
//                 ),

//                 // 평점 & 위치
//                 Row(
//                   children: [
//                     Icon(Icons.star, color: Colors.orange, size: 20),
//                     SizedBox(width: 4),
//                     Text(
//                       "${store.rating} (${store.reviews})",
//                       style: TextStyle(fontSize: 14),
//                     ),
//                     SizedBox(width: 10),
//                     Icon(Icons.location_on, color: Colors.grey, size: 18),
//                     SizedBox(width: 4),
//                     Text(store.location, style: TextStyle(fontSize: 14)),
//                   ],
//                 ),
//               ],
//             ),
//           ),

//           // 대표 이미지 (PageView 사용)
//           Padding(
//   padding: EdgeInsets.symmetric(horizontal: 12.0), // 🔥 좌우 패딩만 적용
//   child: ClipRRect(
//     child: SizedBox(
//       height: 140,
//       child: PageView(
//         children: store.imagePaths.map((image) {
//           return ClipRRect( // 🔥 개별 이미지도 둥글게 잘라주기
//             borderRadius: BorderRadius.all( Radius.circular(12.0)), 
//             child: Image.asset(
//               image,
//               width: double.infinity,
//               fit: BoxFit.cover,
//             ),
//           );
//         }).toList(),
//       ),
//     ),
//   ),
// ),

//           Padding(
//             padding: const EdgeInsets.all(12.0),
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 //SizedBox(height: 2),

//                 // 영업 시간
//                 Row(
//                   children: [
//                     Icon(
//                       Icons.access_time,
//                       color: const Color.fromARGB(255, 63, 63, 63),
//                       size: 16,
//                     ),
//                     SizedBox(width: 2),
//                     Text(store.hours, style: TextStyle(fontSize: 12)),
//                     SizedBox(width: 10),

//                     Icon(
//                       Icons.attach_money,
//                       color: const Color.fromARGB(255, 63, 63, 63),
//                       size: 16,
//                     ),
//                     SizedBox(width: 2),
//                     Text(store.price, style: TextStyle(fontSize: 12)),
//                   ],
//                 ),

//                 //SizedBox(height: 6),

//                 // SizedBox(height: 12),

//                 // 예약 가능한 날짜 리스트 (GridView 사용)
//                 // SingleChildScrollView(
//                 //   scrollDirection: Axis.horizontal, // 가로 스크롤 가능하게 설정
//                 //   child: Row(
//                 //     children: [
//                 //       _reservationButton("오늘 (화)"),
//                 //       _reservationButton("내일 (수)"),
//                 //       _reservationButton("2.20 (목)"),
//                 //       _reservationButton("2.21 (금)"),
//                 //       _reservationButton("2.22 (토)"),
//                 //     ],
//                 //   ),
//                 // ),
//               ],
//             ),
//           ),
//           Container(
//             height: 3, // 선 두께
//             color: const Color.fromARGB(255, 231, 231, 231), // 선 색상
//           ),
//         ],
//       ),
//     );
//   }

//   // 예약 버튼 스타일
//   // Widget _reservationButton(String date) {
//   //   return Container(
//   //         margin: EdgeInsets.only(right: 4), // 버튼 사이 간격 조정

//   //     padding: EdgeInsets.symmetric(vertical: 8, horizontal: 10),
//   //     decoration: BoxDecoration(
//   //       border: Border.all(color: Colors.grey.shade300),
//   //       borderRadius: BorderRadius.circular(8),
//   //     ),
//   //     child: Text(
//   //       date,
//   //       style: TextStyle(
//   //         fontSize: 14,
//   //         fontWeight: FontWeight.bold, // 굵게 설정
//   //                 letterSpacing: -0.5, // 🔥 글자 간격 좁게 설정 (-값으로 설정하면 좁아짐)

//   //       ),
//   //     ),
//   //   );
//   // }
// }
