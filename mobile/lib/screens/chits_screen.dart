import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ChitsScreen extends StatefulWidget {
  const ChitsScreen({super.key});

  @override
  State<ChitsScreen> createState() => _ChitsScreenState();
}

class _ChitsScreenState extends State<ChitsScreen> {
  final ApiService _apiService = ApiService();
  List<dynamic> _chits = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadChits();
  }

  Future<void> _loadChits() async {
    setState(() => _isLoading = true);
    try {
      final data = await _apiService.getChits();
      setState(() {
        _chits = data;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: ${e.toString()}')),
        );
      }
    }
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'active':
        return Colors.green;
      case 'pending':
        return Colors.orange;
      case 'completed':
        return Colors.blue;
      case 'cancelled':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadChits,
              child: _chits.isEmpty
                  ? const Center(child: Text('No chits found'))
                  : ListView.builder(
                      padding: const EdgeInsets.all(8),
                      itemCount: _chits.length,
                      itemBuilder: (context, index) {
                        final chit = _chits[index];
                        return Card(
                          margin: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          child: ExpansionTile(
                            leading: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: Colors.blue.shade100,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Icon(
                                Icons.account_balance_wallet,
                                color: Colors.blue.shade700,
                              ),
                            ),
                            title: Text(
                              chit['chit_name'] ?? 'Unnamed Chit',
                              style: const TextStyle(fontWeight: FontWeight.bold),
                            ),
                            subtitle: Text(
                              chit['chit_plan_id']?['title'] ?? '',
                              style: const TextStyle(fontSize: 12),
                            ),
                            trailing: Chip(
                              label: Text(
                                chit['status'] ?? 'pending',
                                style: const TextStyle(fontSize: 10),
                              ),
                              backgroundColor: _getStatusColor(chit['status'] ?? 'pending')
                                  .withOpacity(0.2),
                            ),
                            children: [
                              Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Column(
                                  children: [
                                    _buildInfoRow('Amount', '₹${chit['total_amount']}'),
                                    _buildInfoRow('Members', '${chit['members']?.length ?? 0}'),
                                    _buildInfoRow('Current Month', '${chit['current_month']}'),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
            ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
