import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/api_config.dart';

class ApiService {
  final _storage = const FlutterSecureStorage();

  Future<String?> _getToken() async {
    return await _storage.read(key: 'token');
  }

  Future<Map<String, String>> _getHeaders() async {
    final token = await _getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  // Auth
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      await _storage.write(key: 'token', value: data['data']['token']);
      return data['data'];
    } else {
      throw Exception(jsonDecode(response.body)['message'] ?? 'Login failed');
    }
  }

  Future<void> logout() async {
    await _storage.delete(key: 'token');
  }

  // Dashboard
  Future<Map<String, dynamic>> getDashboardStats() async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/reports/dashboard'),
      headers: await _getHeaders(),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body)['data'];
    } else {
      throw Exception('Failed to load dashboard stats');
    }
  }

  // Customers
  Future<List<dynamic>> getCustomers() async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/customers'),
      headers: await _getHeaders(),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body)['data'];
    } else {
      throw Exception('Failed to load customers');
    }
  }

  Future<Map<String, dynamic>> createCustomer(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/customers'),
      headers: await _getHeaders(),
      body: jsonEncode(data),
    );

    if (response.statusCode == 201) {
      return jsonDecode(response.body)['data'];
    } else {
      throw Exception(jsonDecode(response.body)['message'] ?? 'Failed to create customer');
    }
  }

  // Chit Plans
  Future<List<dynamic>> getChitPlans() async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/chitplans'),
      headers: await _getHeaders(),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body)['data'];
    } else {
      throw Exception('Failed to load chit plans');
    }
  }

  // Chits
  Future<List<dynamic>> getChits() async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/chits'),
      headers: await _getHeaders(),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body)['data'];
    } else {
      throw Exception('Failed to load chits');
    }
  }

  // Payments
  Future<List<dynamic>> getPayments({String? status}) async {
    var uri = Uri.parse('${ApiConfig.baseUrl}/payments');
    if (status != null) {
      uri = uri.replace(queryParameters: {'status': status});
    }

    final response = await http.get(uri, headers: await _getHeaders());

    if (response.statusCode == 200) {
      return jsonDecode(response.body)['data'];
    } else {
      throw Exception('Failed to load payments');
    }
  }

  Future<Map<String, dynamic>> createPayment(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/payments'),
      headers: await _getHeaders(),
      body: jsonEncode(data),
    );

    if (response.statusCode == 201) {
      return jsonDecode(response.body)['data'];
    } else {
      throw Exception(jsonDecode(response.body)['message'] ?? 'Failed to create payment');
    }
  }

  // Bids
  Future<List<dynamic>> getBids() async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/bids'),
      headers: await _getHeaders(),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body)['data'];
    } else {
      throw Exception('Failed to load bids');
    }
  }
}
