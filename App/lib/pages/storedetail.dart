import 'package:app/shared/menubottom.dart';
import 'package:app/widgets/store_card.dart';
import 'package:app/models/store.dart'; // 📌 Store 모델 가져오기
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

// 📍 가게 리스트 페이지
class StoreDetailPage extends StatefulWidget {
  @override
  _StoreDetailPageState createState() => _StoreDetailPageState();
}

class _StoreDetailPageState extends State<StoreDetailPage> {
  List<Store> storeList = []; // 📌 Store 객체 리스트
  final supabase = Supabase.instance.client;

  @override
  void initState() {
    super.initState();
    fetchStores();
  }

  // 📌 Supabase에서 가게 데이터 가져오기
  void fetchStores() async {
    try {
      var response = await supabase.from("business_data").select();
      setState(() {
        storeList =
            response
                .map<Store>((data) => Store.fromMap(data))
                .toList(); // 🔥 변환 적용
      });
    } catch (e) {
      print("❌ 오류 발생: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white, // 🔥 배경색 설정
      appBar: AppBar(
        title: Text('맛집 추천'),
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: Colors.black,
      ),
      bottomNavigationBar: MenuBottom(),

      body:
          storeList.isEmpty
              ? Center(child: CircularProgressIndicator()) // 🔥 로딩 표시
              : ListView.builder(
                padding: const EdgeInsets.all(12.0),
                itemCount: storeList.length,
                itemBuilder: (context, index) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12.0),
                    child: StoreCard(store: storeList[index]), // ✅ Store 객체 전달
                  );
                },
              ),
    );
  }
}
