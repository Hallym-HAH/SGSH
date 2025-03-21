import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:app/models/business.dart';
import 'package:app/models/menu.dart';

class StoreDetailPage extends StatefulWidget {
  final business_data store;

  StoreDetailPage({required this.store});

  @override
  _StoreDetailPageState createState() => _StoreDetailPageState();
}

class _StoreDetailPageState extends State<StoreDetailPage> with SingleTickerProviderStateMixin {
  List<menu_data> menuList = [];
  late Future<SharedPreferences> prefsFuture;
  final supabase = Supabase.instance.client;
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    prefsFuture = SharedPreferences.getInstance();
    fetchMenuData();
    saveToRecentStores(widget.store.name);

    _tabController = TabController(length: 5, vsync: this);
  }

  void saveToRecentStores(String storeName) async {
    final prefs = await prefsFuture;
    List<String> recentStores = prefs.getStringList('recentStores') ?? [];
    recentStores.remove(storeName);
    recentStores.insert(0, storeName);
    if (recentStores.length > 5) {
      recentStores = recentStores.sublist(0, 5);
    }
    await prefs.setStringList('recentStores', recentStores);
    print("✅ 최근 본 가게 업데이트 완료: $recentStores");
  }

  void fetchMenuData() async {
    try {
      final response = await supabase
          .from('menu_data')
          .select()
          .eq('b_id', widget.store.id)
          .order("id", ascending: true);

      if (response.isEmpty) return;

      setState(() {
        menuList = response.map((item) => menu_data.fromMap(item)).toList();
      });
    } catch (e) {
      print("❌ [에러] 예외 발생: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(
          widget.store.name,
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: IconThemeData(color: Colors.black),
      ),
      body: Column(
        children: [
          // 고정된 가게 정보 영역
          buildStoreHeader(),

          // 탭 바
          TabBar(
            controller: _tabController,
            labelColor: Colors.black,
            indicatorColor: Colors.black,
            tabs: [
              Tab(text: '홈'),
              Tab(text: '소식'),
              Tab(text: '메뉴'),
              Tab(text: '사진'),
              Tab(text: '리뷰'),
            ],
          ),

          // 탭 내용 (확장되어야 함)
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                buildHomeTab(),
                Center(child: Text('소식 준비 중입니다.')),
                buildMenuTab(),
                Center(child: Text('사진 준비 중입니다.')),
                Center(child: Text('리뷰 준비 중입니다.')),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget buildStoreHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        GestureDetector(
          onTap: () => _showImagePopup(widget.store.image),
          child: AspectRatio(
            aspectRatio: 16 / 9,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.network(
                widget.store.image,
                fit: BoxFit.cover,
                width: double.infinity,
                errorBuilder: (_, __, ___) => Container(
                  color: Colors.grey[300],
                  child: Icon(Icons.image_not_supported, size: 50, color: Colors.grey[600]),
                ),
              ),
            ),
          ),
        ),
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(widget.store.description, style: TextStyle(fontSize: 16, height: 1.5)),
              Divider(height: 20, thickness: 1),
              _buildInfoRow('주소:', widget.store.address),
              _buildInfoRow('전화:', widget.store.number),
              _buildInfoRow('영업시간:', widget.store.time),
              InkWell(
                onTap: () => print(widget.store.url), // URL 열기 기능 추가 가능
                child: Text(widget.store.url,
                    style: TextStyle(fontSize: 14, color: Colors.blue, decoration: TextDecoration.underline)),
              ),
              SizedBox(height: 8),
            ],
          ),
        ),
      ],
    );
  }

  Widget buildHomeTab() {
    return Center(child: Text('홈 화면 추가 내용을 여기에 작성하세요.'));
  }

  Widget buildMenuTab() {
    return ListView.builder(
      padding: EdgeInsets.all(12.0),
      itemCount: menuList.length,
      itemBuilder: (context, index) => _buildMenuCard(menuList[index]),
    );
  }

  Widget _buildMenuCard(menu_data menu) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      margin: EdgeInsets.symmetric(vertical: 8),
      child: ListTile(
        leading: ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: Image.network(
            menu.image,
            width: 50,
            height: 50,
            fit: BoxFit.cover,
            errorBuilder: (_, __, ___) => Container(
              width: 50,
              height: 50,
              color: Colors.grey[300],
              child: Icon(Icons.image_not_supported, color: Colors.grey[600]),
            ),
          ),
        ),
        title: Text(menu.name, style: TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("${menu.price}원"),
            Text(menu.description, overflow: TextOverflow.ellipsis, maxLines: 2),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: EdgeInsets.only(bottom: 6.0),
      child: Row(
        children: [
          Text(label, style: TextStyle(fontWeight: FontWeight.bold)),
          SizedBox(width: 8),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }

  void _showImagePopup(String imageUrl) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        backgroundColor: Colors.transparent,
        child: Stack(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.network(imageUrl, fit: BoxFit.contain),
            ),
            Positioned(
              top: 10,
              right: 10,
              child: IconButton(
                icon: Icon(Icons.close, color: Colors.white, size: 30),
                onPressed: () => Navigator.pop(context),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
