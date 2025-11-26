import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';
import '../models/payment.dart';

class PaymentsScreen extends StatefulWidget {
  const PaymentsScreen({super.key});

  @override
  State<PaymentsScreen> createState() => _PaymentsScreenState();
}

class _PaymentsScreenState extends State<PaymentsScreen> {
  final ApiService _apiService = ApiService();
  List<dynamic> _payments = [];
  bool _isLoading = true;
  String? _filterStatus;

  @override
  void initState() {
    super.initState();
    _loadPayments();
  }

  Future<void> _loadPayments() async {
    setState(() => _isLoading = true);
    try {
      final data = await _apiService.getPayments(status: _filterStatus);
      setState(() {
        _payments = data;
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
      case 'paid':
        return Colors.green;
      case 'pending':
        return Colors.orange;
      case 'overdue':
        return Colors.red;
      case 'partial':
        return Colors.blue;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          // Filter
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: DropdownButtonFormField<String>(
              value: _filterStatus,
              decoration: const InputDecoration(
                labelText: 'Filter by Status',
                border: OutlineInputBorder(),
                contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              ),
              items: [
                const DropdownMenuItem(value: null, child: Text('All')),
                const DropdownMenuItem(value: 'paid', child: Text('Paid')),
                const DropdownMenuItem(value: 'pending', child: Text('Pending')),
                const DropdownMenuItem(value: 'overdue', child: Text('Overdue')),
                const DropdownMenuItem(value: 'partial', child: Text('Partial')),
              ],
              onChanged: (value) {
                setState(() => _filterStatus = value);
                _loadPayments();
              },
            ),
          ),

          // Payments List
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : RefreshIndicator(
                    onRefresh: _loadPayments,
                    child: _payments.isEmpty
                        ? const Center(child: Text('No payments found'))
                        : ListView.builder(
                            padding: const EdgeInsets.all(8),
                            itemCount: _payments.length,
                            itemBuilder: (context, index) {
                              final payment = _payments[index];
                              return Card(
                                margin: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 4,
                                ),
                                child: ListTile(
                                  leading: CircleAvatar(
                                    backgroundColor: _getStatusColor(
                                      payment['status'] ?? 'pending',
                                    ).withOpacity(0.2),
                                    child: Icon(
                                      Icons.payment,
                                      color: _getStatusColor(
                                        payment['status'] ?? 'pending',
                                      ),
                                    ),
                                  ),
                                  title: Text(
                                    payment['customer_id']?['name'] ?? 'Unknown',
                                    style: const TextStyle(fontWeight: FontWeight.bold),
                                  ),
                                  subtitle: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        payment['chit_id']?['chit_name'] ?? '',
                                        style: const TextStyle(fontSize: 12),
                                      ),
                                      Text(
                                        'Month ${payment['month']} • ${DateFormat('dd MMM yyyy').format(DateTime.parse(payment['payment_date']))}',
                                        style: const TextStyle(fontSize: 11),
                                      ),
                                    ],
                                  ),
                                  trailing: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: [
                                      Text(
                                        '₹${NumberFormat('#,##,###').format(payment['amount'])}',
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16,
                                        ),
                                      ),
                                      Chip(
                                        label: Text(
                                          payment['status'] ?? 'pending',
                                          style: const TextStyle(fontSize: 10),
                                        ),
                                        backgroundColor: _getStatusColor(
                                          payment['status'] ?? 'pending',
                                        ).withOpacity(0.2),
                                        padding: EdgeInsets.zero,
                                        materialTapTargetSize:
                                            MaterialTapTargetSize.shrinkWrap,
                                      ),
                                    ],
                                  ),
                                  isThreeLine: true,
                                ),
                              );
                            },
                          ),
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Record payment feature - Coming soon')),
          );
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}
