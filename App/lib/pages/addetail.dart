import 'package:flutter/material.dart';

class AdDetailPage extends StatelessWidget {
  final String adText;

  AdDetailPage({required this.adText});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Ad Detail'),
        backgroundColor: Colors.purple,
        foregroundColor: Colors.white,
      ),
      body: Center(
        child: Text(
          adText,
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
