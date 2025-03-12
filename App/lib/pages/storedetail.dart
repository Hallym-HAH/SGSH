import 'package:flutter/material.dart';
import 'package:app/models/business.dart'; // 모델 경로는 실제 구조에 따라 조정하세요.

class StoreDetailPage extends StatelessWidget {
  final business_data store; // 모델 타입을 적절하게 변경하세요.

  StoreDetailPage({required this.store});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(
          store.name,
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: IconThemeData(color: Colors.black),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AspectRatio(
              aspectRatio: 16 / 9, // 이미지 비율을 16:9로 설정
              child: Image.network(
                store.image,
                fit: BoxFit.cover,
                width: double.infinity,
              ),
            ),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    store.description,
                    style: TextStyle(
                      fontSize: 16,
                      height: 1.5,
                      color: Colors.black87,
                    ),
                  ),
                  Divider(height: 30, thickness: 2, color: Colors.grey[300]),
                  Text(
                    'Address:',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                  Text(
                    store.address,
                    style: TextStyle(fontSize: 14, color: Colors.grey[800]),
                  ),
                  SizedBox(height: 10),
                  Text(
                    'Phone:',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                  Text(
                    store.number,
                    style: TextStyle(fontSize: 14, color: Colors.grey[800]),
                  ),
                  Divider(height: 30, thickness: 2, color: Colors.grey[300]),
                  Text(
                    'Business Hours:',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                  Text(
                    store.time,
                    style: TextStyle(fontSize: 14, color: Colors.grey[800]),
                  ),
                  SizedBox(height: 10),
                  Text(
                    'URL:',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                  InkWell(
                    onTap: () => launchUrl(store.url),
                    child: Text(
                      store.url,
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.blue,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void launchUrl(String url) {
    // 여기서 URL을 브라우저에서 열기 위한 로직을 구현합니다.
    // 예: url_launcher 패키지를 사용할 수 있습니다.
  }
}
