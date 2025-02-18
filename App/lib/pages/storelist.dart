import 'package:app/widgets/store_card.dart';
import 'package:app/models/store.dart'; // 📌 Store 모델 가져오기
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

// 📍 가게 리스트 페이지
class StoreListPage extends StatefulWidget {
  @override
  _StoreListPageState createState() => _StoreListPageState();
}

class _StoreListPageState extends State<StoreListPage> {
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
        storeList = response.map<Store>((data) => Store.fromMap(data)).toList(); // 🔥 변환 적용
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
      body: storeList.isEmpty
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

// import 'package:app/data/dummy_stores.dart';
// import 'package:app/widgets/store_card.dart';
// import 'package:flutter/material.dart';
// import 'package:supabase_flutter/supabase_flutter.dart';

// //📲 todo 테이블의 값을 넣기위한 dataList 선언
//   List<dynamic> dataList = [];
  
//   //📲 이 코드로 supabase의 함수들을 사용할 수 있다
//   final supabase = Supabase.instance.client;


// // 📍 가게 리스트 페이지
// class StoreListPage extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: const Color.fromARGB(255, 255, 255, 255), // 🔥 배경색 변경

//       appBar: AppBar(
//         title: Text('맛집 추천'),
//         backgroundColor: Colors.white,
//         elevation: 0,
//         foregroundColor: Colors.black,
//       ),
//       body: ListView.builder(
//         padding: const EdgeInsets.all(12.0),
//         itemCount: dataList.length,
//         itemBuilder: (BuildContext context, int index) {
//           //📲 삼항연산자로 error라는 key가 존재하면 없다고 판단
//           //📲 error 이란 key가 없다면 데이터가 존재한다고 판단
//           return dataList[index].containsKey('error')
//               ? Center(child: Text(dataList[index]['error']))
//               //📲 값들을 보기 좋게 정렬하는 부분
//               : Padding(
//                 padding: const EdgeInsets.only(bottom: 12.0),
//                 child: StoreCard(store: dummyStores[index]),
//               );
//         },
//       ),
//     );
//   }
// }
