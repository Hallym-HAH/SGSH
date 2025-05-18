import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'models/menu.dart';
import 'widgets/menu_card.dart';
import 'widgets/order_card.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  try {
    await dotenv.load(fileName: ".env");
  } catch (e) {
    print("failed");
  }

  await Supabase.initialize(
    url: dotenv.env["PROJECT_URL"] ?? "",
    anonKey: dotenv.env["PROJECT_API_KEY"] ?? "",
  );

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Kiosk App',
      theme: ThemeData(
        primarySwatch: Colors.lightBlue, // 보라색에서 밝은 파란색으로 변경
        fontFamily: 'Pretendard',
        useMaterial3: true,
      ),
      debugShowCheckedModeBanner: false,
      home: const MyHomePage(title: '키오스크'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  State createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final supabase = Supabase.instance.client;
  int selectedIndex = 0;
  List<menu_data> menuList = [];
  List<Map<String, dynamic>> orderList = [];
  List<Map<String, dynamic>> orderedList = []; // 완료된 주문 목록 저장
  String lastOrderTime = ""; // 마지막 주문 시간 저장

  // selectedIndex 0: 전체(1), 1: 요리(2), 2: 음료(3), 3: 주문(4)
  final List<int?> categoryValues = [null, 1, 2, 3];
  double totalAmount = 0;

  // 메뉴 아이템 삭제될 때 플래그
  bool isRemoving = false;

  void fetchStores() async {
    try {
      var response = await supabase
          .from("menu_data")
          .select()
          .order("category", ascending: true)
          .order("id", ascending: true);

      setState(() {
        menuList = response.map((data) => menu_data.fromMap(data)).toList();
      });
    } catch (e) {
      print("$e");
    }
  }

  List<menu_data> getFilteredMenuList() {
    if (selectedIndex == 0) {
      return menuList; // 전체 카테고리 모두 표시
    } else {
      return menuList
          .where((menu) => menu.category == categoryValues[selectedIndex])
          .toList();
    }
  }

  void addOrder(String name, int price, int count) {
    if (orderList.any((order) => order['name'] == name)) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('이미 추가하셨습니다.'),
          behavior: SnackBarBehavior.floating,
          backgroundColor: Colors.lightBlue,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      );
    } else {
      setState(() {
        orderList.add({
          'name': name,
          'price': price,
          'count': count,
          'id': DateTime.now().millisecondsSinceEpoch, // 고유 ID 추가
        });
      });
    }
  }

  void calculateTotalAmount() {
    setState(() {
      totalAmount = orderList.fold(0, (sum, item) {
        return sum + (item['price'] * item['count']);
      });
    });
  }

  // 직원 호출 다이얼로그 표시 메서드
  void _showStaffCallDialog() {
    showDialog(
      context: context,
      barrierDismissible: false, // 외부 탭으로 닫기 방지
      builder: (BuildContext context) {
        // 2초 후 자동으로 닫히도록 설정
        Future.delayed(const Duration(seconds: 2), () {
          Navigator.of(context).pop();
        });

        // 알림 다이얼로그 표시
        return Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          elevation: 0,
          backgroundColor: Colors.transparent,
          child: Container(
            padding: EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black26,
                  blurRadius: 10.0,
                  offset: Offset(0.0, 10.0),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 70,
                  height: 70,
                  decoration: BoxDecoration(
                    color: Colors.lightBlue.withOpacity(0.2),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.notifications_active,
                    color: Colors.lightBlue[600],
                    size: 40,
                  ),
                ),
                SizedBox(height: 20),
                Text(
                  "직원이 호출되었습니다.",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 10),
                Text(
                  "곧 직원이 찾아갑니다.",
                  style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // 영수증 다이얼로그 표시 메서드
  void _showReceiptDialog() {
    if (orderedList.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('주문 내역이 없습니다.'),
          behavior: SnackBarBehavior.floating,
          backgroundColor: Colors.red[400],
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      );
      return;
    }

    // 주문 총액 계산 (수정됨)
    num receiptTotal = orderedList.fold(0, (sum, item) {
      // 정수와 실수 변환을 안전하게 처리
      int price = item['price'] ?? 0;
      int count = item['count'] ?? 0;
      return sum + (price * count);
    });

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          elevation: 0,
          backgroundColor: Colors.transparent,
          child: Container(
            width: 400,
            constraints: BoxConstraints(maxHeight: 600),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black26,
                  blurRadius: 10.0,
                  offset: Offset(0.0, 10.0),
                ),
              ],
            ),
            child: Stack(
              children: [
                // 영수증 내용
                SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // 영수증 상단
                      Container(
                        width: double.infinity,
                        padding: EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.lightBlue,
                          borderRadius: BorderRadius.only(
                            topLeft: Radius.circular(16),
                            topRight: Radius.circular(16),
                          ),
                        ),
                        child: Column(
                          children: [
                            Text(
                              '가치가게',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              '영수증',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                      ),

                      // 영수증 내용
                      Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // 주문 정보
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  '테이블:',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                                Text('8번', style: TextStyle(fontSize: 16)),
                              ],
                            ),
                            SizedBox(height: 8),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  '주문 시간:',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                                Text(
                                  lastOrderTime,
                                  style: TextStyle(fontSize: 16),
                                ),
                              ],
                            ),

                            SizedBox(height: 20),
                            // 구분선
                            Container(
                              height: 1,
                              color: Colors.grey.withOpacity(0.5),
                            ),
                            SizedBox(height: 8),

                            // 주문 항목 헤더
                            Padding(
                              padding: const EdgeInsets.symmetric(
                                vertical: 8.0,
                              ),
                              child: Row(
                                children: [
                                  Expanded(
                                    flex: 5,
                                    child: Text(
                                      '메뉴',
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                  Expanded(
                                    flex: 2,
                                    child: Align(
                                      alignment: Alignment.center,
                                      child: Text(
                                        '수량',
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  ),
                                  Expanded(
                                    flex: 3,
                                    child: Align(
                                      alignment: Alignment.centerRight,
                                      child: Text(
                                        '가격',
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),

                            // 구분선
                            Container(
                              height: 1,
                              color: Colors.grey.withOpacity(0.5),
                            ),
                            SizedBox(height: 8),

                            // 주문 항목 리스트
                            ...orderedList.map((item) {
                              final itemTotal = item['price'] * item['count'];

                              return Padding(
                                padding: const EdgeInsets.symmetric(
                                  vertical: 8.0,
                                ),
                                child: Row(
                                  children: [
                                    Expanded(
                                      flex: 5,
                                      child: Text(
                                        item['name'],
                                        style: TextStyle(fontSize: 14),
                                      ),
                                    ),
                                    Expanded(
                                      flex: 2,
                                      child: Align(
                                        alignment: Alignment.center,
                                        child: Text(
                                          'x${item['count']}',
                                          style: TextStyle(fontSize: 14),
                                        ),
                                      ),
                                    ),
                                    Expanded(
                                      flex: 3,
                                      child: Align(
                                        alignment: Alignment.centerRight,
                                        child: Text(
                                          '${_formatNumber(itemTotal)}원',
                                          style: TextStyle(fontSize: 14),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            }).toList(),

                            SizedBox(height: 16),
                            // 총합 구분선 (점선)
                            Container(
                              width: double.infinity,
                              height: 1,
                              decoration: BoxDecoration(
                                border: Border(
                                  bottom: BorderSide(
                                    color: Colors.grey,
                                    width: 1,
                                    style: BorderStyle.solid,
                                  ),
                                ),
                              ),
                            ),

                            // 합계
                            Padding(
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              child: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    '합계',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 18,
                                    ),
                                  ),
                                  Text(
                                    '${_formatNumber(receiptTotal)}원',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 18,
                                      color: Colors.lightBlue,
                                    ),
                                  ),
                                ],
                              ),
                            ),

                            SizedBox(height: 20),
                            // 감사 메시지
                            Center(
                              child: Text(
                                '이용해 주셔서 감사합니다.',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                            SizedBox(height: 8),
                            Center(
                              child: Text(
                                '오늘 ${DateTime.now().toString().substring(0, 10)}',
                                style: TextStyle(
                                  color: Colors.grey[700],
                                  fontSize: 14,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                // 닫기 버튼
                Positioned(
                  top: 8,
                  right: 8,
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      borderRadius: BorderRadius.circular(30),
                      onTap: () {
                        Navigator.pop(context);
                      },
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Icon(Icons.close, color: Colors.white, size: 24),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  String _formatNumber(dynamic number) {
    // 타입 안전하게 처리
    num safeNumber;
    if (number is int) {
      safeNumber = number;
    } else if (number is double) {
      safeNumber = number;
    } else {
      safeNumber = 0; // 기본값
    }

    RegExp reg = RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))');
    String mathFunc(Match match) => '${match[1]},';
    return safeNumber.toInt().toString().replaceAllMapped(reg, mathFunc);
  }

  @override
  void initState() {
    super.initState();
    fetchStores();
    calculateTotalAmount();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: Column(
        children: [
          // 모던 헤더 디자인
          Container(
            decoration: BoxDecoration(
              color: Colors.lightBlue,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 10,
                  offset: Offset(0, 2),
                ),
              ],
            ),
            height: MediaQuery.of(context).size.height * 0.12,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(24, 25, 24, 0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(Icons.restaurant, color: Colors.white, size: 32),
                      SizedBox(width: 12),
                      Text(
                        "가치가게",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.lightBlue[700],
                      borderRadius: BorderRadius.circular(50),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          Icons.table_restaurant,
                          color: Colors.white,
                          size: 24,
                        ),
                        SizedBox(width: 8),
                        Text(
                          "테이블 8",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // 메인 컨텐츠 영역
          Container(
            height: MediaQuery.of(context).size.height * 0.88,
            child: Row(
              children: [
                // 메뉴 섹션 (왼쪽 75%)
                Container(
                  width: MediaQuery.of(context).size.width * 0.75,
                  child:
                      menuList.isEmpty
                          ? Center(
                            child: CircularProgressIndicator(
                              color: Colors.lightBlue,
                            ),
                          )
                          : Container(
                            color: Colors.grey[100],
                            width: MediaQuery.of(context).size.width * 0.75,
                            child: Column(
                              children: [
                                // 카테고리 탭 디자인
                                Container(
                                  height: 80,
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withOpacity(0.05),
                                        blurRadius: 5,
                                        offset: Offset(0, 2),
                                      ),
                                    ],
                                  ),
                                  child: Padding(
                                    padding: EdgeInsets.symmetric(
                                      horizontal: 16,
                                    ),
                                    child: Row(
                                      children: List.generate(4, (index) {
                                        bool isSelected =
                                            selectedIndex == index;
                                        return GestureDetector(
                                          onTap: () {
                                            setState(() {
                                              selectedIndex = index;
                                            });
                                          },
                                          child: Container(
                                            margin: EdgeInsets.symmetric(
                                              horizontal: 8,
                                              vertical: 16,
                                            ),
                                            padding: EdgeInsets.symmetric(
                                              horizontal: 24,
                                            ),
                                            decoration: BoxDecoration(
                                              color:
                                                  isSelected
                                                      ? Colors.lightBlue
                                                      : Colors.white,
                                              borderRadius:
                                                  BorderRadius.circular(50),
                                              boxShadow:
                                                  isSelected
                                                      ? [
                                                        BoxShadow(
                                                          color: Colors
                                                              .lightBlue
                                                              .withOpacity(0.3),
                                                          blurRadius: 8,
                                                          offset: Offset(0, 3),
                                                        ),
                                                      ]
                                                      : null,
                                              border:
                                                  isSelected
                                                      ? null
                                                      : Border.all(
                                                        color:
                                                            Colors.grey[300]!,
                                                      ),
                                            ),
                                            child: Center(
                                              child: Text(
                                                ['전체', '요리', '음료', '주문'][index],
                                                style: TextStyle(
                                                  color:
                                                      isSelected
                                                          ? Colors.white
                                                          : Colors.grey[800],
                                                  fontWeight: FontWeight.bold,
                                                  fontSize: 18,
                                                ),
                                              ),
                                            ),
                                          ),
                                        );
                                      }),
                                    ),
                                  ),
                                ),

                                // 메뉴 그리드
                                Expanded(
                                  child: GridView.builder(
                                    padding: const EdgeInsets.all(16.0),
                                    itemCount: getFilteredMenuList().length,
                                    gridDelegate:
                                        const SliverGridDelegateWithFixedCrossAxisCount(
                                          crossAxisCount: 4,
                                          crossAxisSpacing: 12.0,
                                          mainAxisSpacing: 16.0,
                                          childAspectRatio: 0.7,
                                        ),
                                    itemBuilder: (context, index) {
                                      final filteredMenu =
                                          getFilteredMenuList();
                                      return MenuCard(
                                        menu: filteredMenu[index],
                                        onTap: () async {
                                          addOrder(
                                            filteredMenu[index].name,
                                            filteredMenu[index].price,
                                            1,
                                          );
                                          calculateTotalAmount();
                                        },
                                      );
                                    },
                                  ),
                                ),
                              ],
                            ),
                          ),
                ),

                // 주문 섹션 (오른쪽 25%)
                Container(
                  width: MediaQuery.of(context).size.width * 0.25,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 5,
                        offset: Offset(-2, 0),
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // 직원 호출 및 주문내역 버튼
                      Container(
                        height: 80,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            // 직원 호출 버튼
                            Expanded(
                              child: GestureDetector(
                                onTap: () {
                                  _showStaffCallDialog(); // 직원 호출 다이얼로그 표시
                                },
                                child: Container(
                                  margin: EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                    color: Colors.lightBlue[600],
                                    borderRadius: BorderRadius.circular(12),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.lightBlue.withOpacity(
                                          0.3,
                                        ),
                                        blurRadius: 8,
                                        offset: Offset(0, 3),
                                      ),
                                    ],
                                  ),
                                  alignment: Alignment.center,
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(
                                        Icons.support_agent,
                                        color: Colors.white,
                                        size: 28,
                                      ),
                                      SizedBox(height: 4),
                                      Text(
                                        "직원 호출",
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),

                            // 주문내역 버튼
                            Expanded(
                              child: GestureDetector(
                                onTap: _showReceiptDialog, // 영수증 다이얼로그 표시
                                child: Container(
                                  margin: EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                    color: Colors.lightBlue[300],
                                    borderRadius: BorderRadius.circular(12),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.lightBlue.withOpacity(
                                          0.3,
                                        ),
                                        blurRadius: 8,
                                        offset: Offset(0, 3),
                                      ),
                                    ],
                                  ),
                                  alignment: Alignment.center,
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(
                                        Icons.receipt_long,
                                        color: Colors.white,
                                        size: 28,
                                      ),
                                      SizedBox(height: 4),
                                      Text(
                                        "주문내역",
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),

                      // 주문 목록
                      orderList.isEmpty
                          ? Expanded(
                            child: Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.shopping_cart_outlined,
                                    size: 80,
                                    color: Colors.grey[400],
                                  ),
                                  SizedBox(height: 16),
                                  Text(
                                    '메뉴를 선택해주세요',
                                    style: TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.grey[600],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          )
                          : Expanded(
                            child: ListView.builder(
                              padding: EdgeInsets.all(16),
                              itemCount: orderList.length,
                              itemBuilder: (context, index) {
                                return OrderCard(
                                  key: ValueKey(orderList[index]['name']),
                                  name: orderList[index]['name'],
                                  price: orderList[index]['price'],
                                  count: orderList[index]['count'],
                                  plusCount: () {
                                    setState(() {
                                      orderList[index]['count']++;
                                    });
                                    calculateTotalAmount();
                                  },
                                  minusCount: () {
                                    setState(() {
                                      orderList[index]['count']--;
                                    });
                                    calculateTotalAmount();
                                  },
                                  onZeroCount: () {
                                    setState(() {
                                      orderList.removeAt(index);
                                    });
                                    calculateTotalAmount();
                                  },
                                );
                              },
                            ),
                          ),

                      // 주문하기 버튼
                      GestureDetector(
                        onTap: () async {
                          final time = DateTime.now().toString().substring(
                            0,
                            19,
                          );
                          var tmpName = "";
                          var tmpPrice = "";
                          var tmpCount = "";

                          if (totalAmount > 0) {
                            for (var order in orderList) {
                              tmpName += "${order['name']},";
                              tmpPrice += "${order['price']},";
                              tmpCount += "${order['count']},";

                              // 수정된 부분: 같은 메뉴가 있는지 확인하고 있으면 수량만 증가
                              bool found = false;
                              for (int i = 0; i < orderedList.length; i++) {
                                if (orderedList[i]['name'] == order['name']) {
                                  // 동일 메뉴가 있으면 수량 증가
                                  orderedList[i]['count'] =
                                      orderedList[i]['count'] + order['count'];
                                  found = true;
                                  break;
                                }
                              }

                              // 동일 메뉴가 없으면 새로 추가
                              if (!found) {
                                orderedList.add(
                                  Map<String, dynamic>.from(order),
                                );
                              }
                            }

                            await supabase.from('order_data').insert({
                              'b_id': 1,
                              'table_no': 8,
                              'name': tmpName,
                              'price': tmpPrice,
                              'count': tmpCount,
                              'time': time,
                              'status': 'order', // order, check, cancel
                            });

                            // 주문 시간 저장
                            setState(() {
                              lastOrderTime = time;
                              orderList = [];
                              totalAmount = 0;
                            });

                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(
                                  '주문 완료되었습니다',
                                  style: TextStyle(fontWeight: FontWeight.bold),
                                ),
                                behavior: SnackBarBehavior.floating,
                                backgroundColor: Colors.green,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                              ),
                            );
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(
                                  '주문이 없습니다',
                                  style: TextStyle(fontWeight: FontWeight.bold),
                                ),
                                behavior: SnackBarBehavior.floating,
                                backgroundColor: Colors.red[400],
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                              ),
                            );
                          }
                        },
                        child: Container(
                          margin: EdgeInsets.all(16),
                          height: 70,
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                Colors.lightBlue[700]!,
                                Colors.lightBlue[400]!,
                              ],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(16),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.lightBlue.withOpacity(0.5),
                                blurRadius: 10,
                                offset: Offset(0, 5),
                              ),
                            ],
                          ),
                          child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  "${_formatNumber(totalAmount)}원",
                                  style: TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                                Text(
                                  "주문하기",
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
