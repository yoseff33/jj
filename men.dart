import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text('تسجيل الدخول'),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              TextField(
                decoration: InputDecoration(labelText: 'اسم المستخدم'),
              ),
              TextField(
                decoration: InputDecoration(labelText: 'كلمة المرور'),
                obscureText: true,
              ),
              ElevatedButton(
                onPressed: () {},
                child: Text('تسجيل الدخول'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
