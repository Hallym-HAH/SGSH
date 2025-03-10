import 'package:app/pages/mainpage.dart';
import 'package:app/pages/storelist.dart';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart'; // ✅ dotenv 불러오기

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // ✅ dotenv가 null이 아닌지 확인한 후 load() 실행
  try {
    await dotenv.load(fileName: ".env");
    print("✅ .env 파일 로드 완료!");
  } catch (e) {
    print("❌ .env 파일 로드 실패: $e");
  }

  // ✅ Supabase 초기화 (환경변수에서 가져오기)
  await Supabase.initialize(
    url: dotenv.env["PROJECT_URL"] ?? "", // 프로젝트 URL
    anonKey: dotenv.env["PROJECT_API_KEY"] ?? "", // API 키
  );

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: '/',
      routes: {
        '/': (context) => Mainpage(),
        '/storelist': (context) => StoreListPage(), // 추가 페이지
      },
    );
  }
}

