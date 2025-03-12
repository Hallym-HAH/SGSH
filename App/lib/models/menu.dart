// menu_data

// id: 정렬용 인덱스
// b_id: business_data 정보의 id
// name: 메뉴 이름
// price: 가격
// description: 메뉴 설명
// image: 메뉴 이미지

class menu_data {
  final int id;
  final String b_id;
  final String name;
  final String price;
  final String description;
  final String image;

  menu_data({
    required this.id,
    required this.b_id,
    required this.name,
    required this.price,
    required this.description,
    required this.image,
  });

  factory menu_data.fromMap(Map<String, dynamic> data) {
    return menu_data(
      id: data["id"] ?? 0,
      b_id: data["b_id"] ?? "b_id 없음",
      name: data["name"] ?? "name 없음",
      price: data["price"] ?? "price 없음",
      description: data["description"] ?? "description 없음",
      image: data["image"] ?? "image 없음",
    );
  }
}
