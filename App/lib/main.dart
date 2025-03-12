import 'package:flutter/material.dart';
import 'package:app/pages/mainpage.dart';
import 'package:app/pages/storelist.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  try {
    await dotenv.load(fileName: ".env");
    print("✅ .env 파일 로드 완료!");
  } catch (e) {
    print("❌ .env 파일 로드 실패: $e");
  }

  await Supabase.initialize(
    url: dotenv.env["PROJECT_URL"] ?? "",
    anonKey: dotenv.env["PROJECT_API_KEY"] ?? "",
  );

  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  int _selectedIndex = 0; // 현재 선택된 인덱스

  final List<Widget> _pages = [Mainpage(), StoreListPage()];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        body: IndexedStack(index: _selectedIndex, children: _pages),
        bottomNavigationBar: BottomNavigationBar(
          currentIndex: _selectedIndex,
          onTap: _onItemTapped,
          items: [
            BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
            BottomNavigationBarItem(icon: Icon(Icons.store), label: 'Store'),
          ],
        ),
      ),
    );
  }
}
