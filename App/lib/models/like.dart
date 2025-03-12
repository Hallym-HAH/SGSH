// like_data
// id: 정렬용 인덱스
// title: 게시물 제목
// content: 게시물 내용
// author: 작성자
// time: 작성 시간

class like_data {
  final int id;
  final bool type;
  final String user;
  final String time;

  like_data({
    required this.id,
    required this.type,
    required this.user,
    required this.time,
  });

  factory like_data.fromMap(Map<String, dynamic> data) {
    return like_data(
      id: data["id"] ?? 0,
      type: data["type"] ?? "type 없음",
      user: data["user"] ?? "user 없음",
      time: data["time"] ?? "time 없음",
    );
  }
}
