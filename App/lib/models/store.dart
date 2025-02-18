class Store {
  final int id;
  final String name;
  final String address;
  final String time;
  final String number;
  final String description;
  final String url;

  Store({
    required this.id,
    required this.name,
    required this.address,
    required this.time,
    required this.number,
    required this.description,
    required this.url,
  });

  // 🔥 Supabase에서 가져온 `Map<String, dynamic>` 데이터를 `Store` 객체로 변환
  factory Store.fromMap(Map<String, dynamic> data) {
    return Store(
      id: data["id"] ?? 0,
      name: data["name"] ?? "이름 없음",
      address: data["address"] ?? "주소 없음",
      time: data["time"] ?? "운영 시간 없음",
      number: data["number"] ?? "전화번호 없음",
      description: data["description"] ?? "설명 없음",
      url: data["url"] ?? "https://via.placeholder.com/300", // 기본 이미지
    );
  }
}


// // 📌 가게 모델
// class Store {
//   final String name;
//   final double rating;
//   final int reviews;
//   final String location;
//   final String hours;
//   final String price;
//   final List<String> imagePaths; // 여러 이미지 지원

//   Store({
//     required this.name,
//     required this.rating,
//     required this.reviews,
//     required this.location,
//     required this.hours,
//     required this.price,
//     required this.imagePaths,
//   });
// }