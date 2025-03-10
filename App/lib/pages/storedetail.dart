// Store 모델 클래스가 필요
import 'package:app/models/store.dart';
import 'package:flutter/material.dart';

class StoreDetailPage extends StatelessWidget {
  final Store store;

  StoreDetailPage({required this.store});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(store.name),
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: Colors.black,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Image.network(store.image, fit: BoxFit.cover), // 이미지
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: Text(
                store.description,
                style: TextStyle(fontSize: 16),
              ), // 설명
            ),
          ],
        ),
      ),
    );
  }
}
