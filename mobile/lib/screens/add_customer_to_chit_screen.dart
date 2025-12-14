import 'package:flutter/material.dart';
import '../services/api_service.dart';

class AddCustomerToChitScreen extends StatefulWidget {
  const AddCustomerToChitScreen({super.key});

  @override
  State<AddCustomerToChitScreen> createState() => _AddCustomerToChitScreenState();
}

class _AddCustomerToChitScreenState extends State<AddCustomerToChitScreen> {
  final _formKey = GlobalKey<FormState>();
  final ApiService _apiService = ApiService();
  
  List<dynamic> _customers = [];
  List<dynamic> _chits = [];
  String? _selectedCustomerId;
  String? _selectedChitId;
  bool _isLoading = true;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final customers = await _apiService.getCustomers();
      final chits = await _apiService.getChits();
      
      setState(() {
        _customers = customers;
        _chits = chits.where((chit) => chit['status'] == 'active').toList();
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error loading data: ${e.toString()}')),
        );
      }
    }
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    try {
      await _apiService.addMemberToChit(_selectedChitId!, {
        'customer_id': _selectedCustomerId,
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Customer added to chit successfully!'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context, true);
      }
    } catch (e) {
      setState(() => _isSubmitting = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Customer to Chit'),
        backgroundColor: Colors.blue,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Form(
              key: _formKey,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // Info Card
                  Card(
                    color: Colors.blue.shade50,
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Row(
                        children: [
                          Icon(Icons.info_outline, color: Colors.blue.shade700),
                          const SizedBox(width: 12),
                          const Expanded(
                            child: Text(
                              'Add a customer to an active chit group',
                              style: TextStyle(fontSize: 14),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Select Customer
                  DropdownButtonFormField<String>(
                    value: _selectedCustomerId,
                    decoration: const InputDecoration(
                      labelText: 'Select Customer *',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.person),
                    ),
                    items: _customers.map((customer) {
                      return DropdownMenuItem<String>(
                        value: customer['_id'],
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              customer['name'],
                              style: const TextStyle(fontWeight: FontWeight.bold),
                            ),
                            Text(
                              customer['phone'],
                              style: const TextStyle(fontSize: 12, color: Colors.grey),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                    onChanged: (value) {
                      setState(() => _selectedCustomerId = value);
                    },
                    validator: (value) {
                      if (value == null) {
                        return 'Please select a customer';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),

                  // Select Chit
                  DropdownButtonFormField<String>(
                    value: _selectedChitId,
                    decoration: const InputDecoration(
                      labelText: 'Select Chit (Active Only) *',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.group),
                    ),
                    items: _chits.map((chit) {
                      final plan = chit['chit_plan'];
                      return DropdownMenuItem<String>(
                        value: chit['_id'],
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              chit['name'],
                              style: const TextStyle(fontWeight: FontWeight.bold),
                            ),
                            Text(
                              '${plan['amount']} | ${plan['duration']} months',
                              style: const TextStyle(fontSize: 12, color: Colors.grey),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                    onChanged: (value) {
                      setState(() => _selectedChitId = value);
                    },
                    validator: (value) {
                      if (value == null) {
                        return 'Please select a chit';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),

                  // Chit Details (if selected)
                  if (_selectedChitId != null) ...[
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Chit Details',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const Divider(),
                            ...() {
                              final chit = _chits.firstWhere(
                                (c) => c['_id'] == _selectedChitId,
                              );
                              final plan = chit['chit_plan'];
                              return [
                                _buildDetailRow('Plan Amount', '₹${plan['amount']}'),
                                _buildDetailRow('Duration', '${plan['duration']} months'),
                                _buildDetailRow('Current Members', '${chit['members'].length}'),
                                _buildDetailRow('Monthly Due', '₹${plan['monthly_installment']}'),
                              ];
                            }(),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Submit Button
                  ElevatedButton(
                    onPressed: _isSubmitting ? null : _submitForm,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: _isSubmitting
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          )
                        : const Text(
                            'Add to Chit',
                            style: TextStyle(fontSize: 16, color: Colors.white),
                          ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
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
