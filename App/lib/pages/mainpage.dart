import 'package:app/pages/addetail.dart';
import 'package:app/pages/storelist.dart';
import 'package:flutter/material.dart';
import 'package:app/shared/menubottom.dart';

class Mainpage extends StatefulWidget {
  @override
  _MainpageState createState() => _MainpageState();
}

class _MainpageState extends State<Mainpage> {
  final List<Map<String, dynamic>> items = [
    {'icon': Icons.cake, 'label': "케이크"},
    {'icon': Icons.local_pizza, 'label': "피자"},
    {'icon': Icons.coffee, 'label': "커피"},
    {'icon': Icons.restaurant, 'label': "저녁식사"},
    {'icon': Icons.local_bar, 'label': "바"},
    {'icon': Icons.fastfood, 'label': "패스트푸드"},
    {'icon': Icons.local_florist, 'label': "플로리스트"},
    {'icon': Icons.store_mall_directory, 'label': "쇼핑"},
    {'icon': Icons.local_movies, 'label': "영화"},
    {'icon': Icons.local_drink, 'label': "음료"},
    {'icon': Icons.local_offer, 'label': "특가"},
    {'icon': Icons.local_grocery_store, 'label': "마켓"},
  ];

  final List<String> ads = [
    "오늘의 득템! 국내여행 운트릴 최대 86% 할인!",
    "특별 이벤트! 전자제품 최대 70% 할인 중!",
    "주말 특가! 모든 의류 브랜드 최대 50% 할인!",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[200],
      appBar: AppBar(
        title: Text('메인페이지'),
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: Colors.black,
      ),
      bottomNavigationBar: MenuBottom(),
      body: SingleChildScrollView(
        child: Column(
          children: <Widget>[
            Container(
              height: 200,
              width: double.infinity,
              margin: const EdgeInsets.all(12.0),
              decoration: BoxDecoration(
                color: Colors.purple,
                borderRadius: BorderRadius.circular(10),
              ),
              child: PageView(
                children:
                    ads
                        .map(
                          (ad) => InkWell(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder:
                                      (context) => AdDetailPage(adText: ad),
                                ),
                              );
                            },
                            child: Center(
                              child: Text(
                                ad,
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ),
                          ),
                        )
                        .toList(),
              ),
            ),
            GridView.builder(
              shrinkWrap: true,
              physics: NeverScrollableScrollPhysics(), // 스크롤 안 되게 설정
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 4, // 한 줄에 4개씩
                childAspectRatio: 2, // 아이템의 비율
                crossAxisSpacing: 3, // 가로 간격
                mainAxisSpacing: 3, // 세로 간격
              ),
              itemCount: items.length,
              itemBuilder: (context, index) {
                return _buildIconText(
                  items[index]['icon'],
                  items[index]['label'],
                  context, // context 추가
                );
              },
            ),

            Container(
              padding: EdgeInsets.all(20),
              margin: EdgeInsets.symmetric(vertical: 12.0),
              color: Colors.blue[300],
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: <Widget>[
                  Text("최근 본 상품", style: TextStyle(color: Colors.white)),
                  Text("더 보기", style: TextStyle(color: Colors.white)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildIconText(IconData icon, String label, BuildContext context) {
    return InkWell(
      onTap: () {
        // Navigator를 사용하여 새 페이지로 이동
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => StoreListPage()),
        ); // NewPage는 이동할 페이지의 위젯
      },
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Icon(icon, size: 24),
          SizedBox(height: 4),
          Text(label),
        ],
      ),
    );
  }
}
