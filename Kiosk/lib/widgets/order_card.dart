import 'package:flutter/material.dart';

class OrderCard extends StatefulWidget {
  final String name;
  final int price;
  final int count;
  final VoidCallback plusCount;
  final VoidCallback minusCount;
  final VoidCallback onZeroCount;

  const OrderCard({
    required this.name,
    required this.price,
    required this.count,
    required this.plusCount,
    required this.minusCount,
    required this.onZeroCount,
    required Key key,
  }) : super(key: key);

  @override
  State<OrderCard> createState() => _OrderCardState();
}

class _OrderCardState extends State<OrderCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;
  bool isHovered = false;
  bool _isFirstBuild = true;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(milliseconds: 300),
      vsync: this,
    );
    _animation = CurvedAnimation(parent: _controller, curve: Curves.easeInOut);
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    RegExp reg = RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))');
    String Function(Match) mathFunc = (Match match) => '${match[1]},';

    return FadeTransition(
      opacity: _animation,
      child: SizeTransition(
        sizeFactor: _animation,
        child: MouseRegion(
          onEnter: (_) => setState(() => isHovered = true),
          onExit: (_) => setState(() => isHovered = false),
          child: AnimatedContainer(
            duration: Duration(milliseconds: 200),
            margin: EdgeInsets.only(bottom: 12),
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color:
                      isHovered
                          ? Colors.lightBlue.withOpacity(0.2)
                          : Colors.black.withOpacity(0.05),
                  blurRadius: isHovered ? 8 : 4,
                  offset: Offset(0, isHovered ? 4 : 2),
                ),
              ],
              border: Border.all(
                color:
                    isHovered
                        ? Colors.lightBlue.withOpacity(0.3)
                        : Colors.grey.withOpacity(0.1),
                width: isHovered ? 1.5 : 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 상단 영역: 메뉴명과 삭제 버튼
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        widget.name,
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Material(
                      color: Colors.transparent,
                      child: InkWell(
                        borderRadius: BorderRadius.circular(50),
                        onTap: widget.onZeroCount,
                        child: Container(
                          padding: EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(50),
                            color:
                                isHovered
                                    ? Colors.red.withOpacity(0.1)
                                    : Colors.transparent,
                          ),
                          child: Icon(
                            Icons.close_rounded,
                            size: 20,
                            color: Colors.red[400],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),

                SizedBox(height: 12),
                Divider(height: 1, color: Colors.grey.withOpacity(0.2)),
                SizedBox(height: 12),

                // 하단 영역: 수량 조절 및 가격
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // 수량 조절 버튼 그룹
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.grey.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(50),
                      ),
                      child: Row(
                        children: [
                          Material(
                            color: Colors.transparent,
                            borderRadius: BorderRadius.circular(50),
                            child: InkWell(
                              borderRadius: BorderRadius.circular(50),
                              onTap: () {
                                if (widget.count - 1 <= 0) {
                                  widget.onZeroCount();
                                } else {
                                  widget.minusCount();
                                }
                              },
                              child: Container(
                                width: 36,
                                height: 36,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: Colors.white,
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.05),
                                      blurRadius: 2,
                                      offset: Offset(0, 1),
                                    ),
                                  ],
                                ),
                                child: Center(
                                  child: Icon(
                                    Icons.remove_rounded,
                                    size: 18,
                                    color: Colors.lightBlue,
                                  ),
                                ),
                              ),
                            ),
                          ),
                          Container(
                            width: 36,
                            alignment: Alignment.center,
                            child: Text(
                              "${widget.count}",
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.black87,
                              ),
                            ),
                          ),
                          Material(
                            color: Colors.transparent,
                            borderRadius: BorderRadius.circular(50),
                            child: InkWell(
                              borderRadius: BorderRadius.circular(50),
                              onTap: widget.plusCount,
                              child: Container(
                                width: 36,
                                height: 36,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: Colors.lightBlue,
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.lightBlue.withOpacity(0.3),
                                      blurRadius: 4,
                                      offset: Offset(0, 2),
                                    ),
                                  ],
                                ),
                                child: Center(
                                  child: Icon(
                                    Icons.add_rounded,
                                    size: 18,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                    // 가격 표시
                    Container(
                      padding: EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.lightBlue.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        "${(widget.price * widget.count).toString().replaceAllMapped(reg, mathFunc)}원",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.lightBlue,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
