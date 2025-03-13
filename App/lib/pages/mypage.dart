import 'package:flutter/material.dart';
import 'package:app/models/user.dart'; // 유저 모델 임포트

class MyPage extends StatelessWidget {
  final UserData user = UserData(
    name: "홍길동",
    email: "hong@example.com",
    joinDate: "2024-01-15",
  );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100], // 🔥 전체 배경 무채색
      appBar: AppBar(
        title: Text("나의 페이지", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0.5,
        iconTheme: IconThemeData(color: Colors.black),
      ),
      body: Padding(
        padding: EdgeInsets.symmetric(horizontal: 20, vertical: 30),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 🔥 프로필 아이콘
            Center(
              child: Icon(Icons.account_circle, size: 100, color: Colors.black45),
            ),
            SizedBox(height: 10),

            // 🔥 이름
            Center(
              child: Text(
                user.name,
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.black87),
              ),
            ),
            SizedBox(height: 5),

            // 🔥 이메일
            Center(
              child: Text(
                user.email,
                style: TextStyle(fontSize: 16, color: Colors.black54, fontStyle: FontStyle.italic),
              ),
            ),
            Divider(height: 40, thickness: 1, color: Colors.black26),

            // 🔥 가입 날짜
            Row(
              children: [
                Icon(Icons.calendar_today, size: 20, color: Colors.black54),
                SizedBox(width: 10),
                Text(
                  "가입 날짜: ${user.joinDate}",
                  style: TextStyle(fontSize: 16, color: Colors.black87),
                ),
              ],
            ),
            SizedBox(height: 20),

            // 🔥 로그아웃 버튼 (심플한 디자인)
            Center(
              child: TextButton.icon(
                onPressed: () {},
                icon: Icon(Icons.logout, color: Colors.black54),
                label: Text(
                  "로그아웃",
                  style: TextStyle(fontSize: 16, color: Colors.black54),
                ),
                style: TextButton.styleFrom(
                  padding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
