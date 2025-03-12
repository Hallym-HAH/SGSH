import 'package:app/models/article.dart';
import 'package:app/pages/articlepage.dart';
import 'package:app/pages/storelist.dart';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

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

  List<article_data> article = []; // 📌 Store 객체 리스트
  final supabase = Supabase.instance.client;

  @override
  void initState() {
    super.initState();
    fetchStores();
  }

  // 📌 Supabase에서 가게 데이터 가져오기
  void fetchStores() async {
    try {
      var response = await supabase.from("article_data").select();
      setState(() {
        article =
            response
                .map<article_data>((data) => article_data.fromMap(data))
                .toList(); // 🔥 변환 적용
      });
    } catch (e) {
      print("❌ 오류 발생: $e");
    }
  }

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
      body: SingleChildScrollView(
        child: Column(
          children: <Widget>[
            Article(article: article),
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

//===============Article===============
class Article extends StatelessWidget {
  const Article({super.key, required this.article});

  final List<article_data> article;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 200,
      width: double.infinity,
      margin: const EdgeInsets.all(12.0),
      decoration: BoxDecoration(
        color: const Color.fromARGB(255, 160, 160, 160),
        borderRadius: BorderRadius.circular(10),
      ),
      child: PageView(
        children:
            article
                .map(
                  (article) => InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => Articlepage(article: article),
                        ),
                      );
                    },
                    child: Center(
                      child: Text(
                        article.title, // 제목을 표시
                        style: TextStyle(color: Colors.white, fontSize: 16),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
                )
                .toList(),
      ),
    );
  }
}
