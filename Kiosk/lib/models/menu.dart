class menu_data {
  final int id;
  final int price;
  final String name;
  final String description;
  final String image;
  final int category;

  menu_data({
    required this.id,
    required this.price,
    required this.name,
    required this.description,
    required this.image,
    required this.category,
  });

  // 🔥 Supabase에서 가져온 `Map<String, dynamic>` 데이터를 `business_data` 객체로 변환
  factory menu_data.fromMap(Map<String, dynamic> data) {
    return menu_data(
      id: data["id"] ?? 0,
      price: data["price"] ?? 0,
      name: data["name"] ?? "이름 없음",
      description: data["description"] ?? "설명 없음",
      image: data["image"] ?? "이미지 없음",
      category: data["category"] ?? 0,
    );
  }
}
