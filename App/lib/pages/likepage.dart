// 📂 lib/pages/likes.dart
import 'package:app/data/like_dummy.dart';
import 'package:flutter/material.dart';

class LikesPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('좋아요한 게시물'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
      ),
      body: ListView.builder(
        itemCount: dummyLikes.length,
        itemBuilder: (context, index) {
          final like = dummyLikes[index];
          return ListTile(
            leading: Icon(like.type ? Icons.favorite : Icons.comment, color: like.type ? Colors.red : Colors.blue),
            title: Text('User: ${like.user}'),
            subtitle: Text('시간: ${like.time}'),
            trailing: Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
          );
        },
      ),
    );
  }
}
