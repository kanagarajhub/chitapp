import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  final _storage = const FlutterSecureStorage();
  
  bool _isAuthenticated = false;
  bool _isLoading = true;
  Map<String, dynamic>? _user;

  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;
  Map<String, dynamic>? get user => _user;

  AuthProvider() {
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    final token = await _storage.read(key: 'token');
    _isAuthenticated = token != null;
    _isLoading = false;
    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    try {
      final data = await _apiService.login(email, password);
      _user = data;
      _isAuthenticated = true;
      notifyListeners();
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<void> logout() async {
    await _apiService.logout();
    _isAuthenticated = false;
    _user = null;
    notifyListeners();
  }
}
