import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:app/models/business.dart';
import 'package:app/pages/storedetail.dart';

class SearchPage extends StatefulWidget {
  @override
  _SearchPageState createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  final TextEditingController _searchController = TextEditingController();
  final supabase = Supabase.instance.client;
  List<business_data> storeList = []; // 전체 가게 데이터
  List<business_data> filteredList = []; // 검색된 가게 데이터

  @override
  void initState() {
    super.initState();
    fetchStores();
  }

  // 📌 Supabase에서 가게 데이터 가져오기
  void fetchStores() async {
    try {
      var response = await supabase.from("business_data").select().order("id", ascending: true);
      setState(() {
        storeList = response.map<business_data>((data) => business_data.fromMap(data)).toList();
        filteredList = List.from(storeList); // 초기값 설정
      });
    } catch (e) {
      print("❌ 오류 발생: $e");
    }
  }

  // 🔎 검색 기능
  void filterStores(String query) {
    setState(() {
      if (query.isEmpty) {
        filteredList = List.from(storeList);
      } else {
        filteredList = storeList.where((store) {
          return store.name.toLowerCase().contains(query.toLowerCase()) ||
                 store.address.toLowerCase().contains(query.toLowerCase());
        }).toList();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text('가게 검색', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: IconThemeData(color: Colors.black),
      ),
      body: Column(
        children: [
          // 검색창
          Padding(
            padding: EdgeInsets.all(12.0),
            child: TextField(
              controller: _searchController,
              onChanged: filterStores, // 검색어 입력 시 필터링 실행
              decoration: InputDecoration(
                prefixIcon: Icon(Icons.search, color: Colors.black54),
                hintText: '검색어를 입력하세요...',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                filled: true,
                fillColor: Colors.grey[200],
              ),
            ),
          ),

          // 검색 결과 리스트
          Expanded(
            child: filteredList.isEmpty
                ? Center(child: Text("검색 결과가 없습니다.", style: TextStyle(color: Colors.black54)))
                : ListView.builder(
                    itemCount: filteredList.length,
                    itemBuilder: (context, index) {
                      final store = filteredList[index];
                      return ListTile(
                        leading: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.network(
                            store.image,
                            width: 50,
                            height: 50,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Icon(Icons.store, size: 50, color: Colors.grey[400]);
                            },
                          ),
                        ),
                        title: Text(store.name, style: TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text(store.address, style: TextStyle(color: Colors.grey[600])),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => StoreDetailPage(store: store)),
                          );
                        },
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
