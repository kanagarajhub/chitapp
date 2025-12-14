import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';

class CollectPaymentScreen extends StatefulWidget {
  const CollectPaymentScreen({super.key});

  @override
  State<CollectPaymentScreen> createState() => _CollectPaymentScreenState();
}

class _CollectPaymentScreenState extends State<CollectPaymentScreen> {
  final _formKey = GlobalKey<FormState>();
  final ApiService _apiService = ApiService();
  
  final _amountController = TextEditingController();
  final _notesController = TextEditingController();
  
  List<dynamic> _chits = [];
  List<dynamic> _customers = [];
  String? _selectedChitId;
  String? _selectedCustomerId;
  String _paymentMethod = 'cash';
  String _paymentType = 'installment';
  bool _isLoading = true;
  bool _isSubmitting = false;
  double? _dueAmount;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _amountController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final chits = await _apiService.getChits();
      final customers = await _apiService.getCustomers();
      
      setState(() {
        _chits = chits.where((chit) => chit['status'] == 'active').toList();
        _customers = customers;
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

  void _calculateDueAmount() {
    if (_selectedChitId != null && _paymentType == 'installment') {
      try {
        final chit = _chits.firstWhere((c) => c['_id'] == _selectedChitId);
        final chitPlan = chit['chit_plan'];
        if (chitPlan != null && chitPlan['monthly_installment'] != null) {
          final monthlyAmount = chitPlan['monthly_installment'];
          setState(() {
            _dueAmount = double.parse(monthlyAmount.toString());
            _amountController.text = _dueAmount!.toStringAsFixed(0);
          });
        }
      } catch (e) {
        print('Error calculating due amount: $e');
      }
    }
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    try {
      final paymentData = {
        'chit_id': _selectedChitId,
        'customer_id': _selectedCustomerId,
        'amount': double.parse(_amountController.text),
        'payment_method': _paymentMethod,
        'payment_type': _paymentType,
        'notes': _notesController.text.trim().isEmpty ? null : _notesController.text.trim(),
      };

      await _apiService.createPayment(paymentData);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Payment collected successfully!'),
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
        title: const Text('Collect Payment'),
        backgroundColor: Colors.green,
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
                    color: Colors.green.shade50,
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Row(
                        children: [
                          Icon(Icons.payment, color: Colors.green.shade700),
                          const SizedBox(width: 12),
                          const Expanded(
                            child: Text(
                              'Collect payment for chit installments',
                              style: TextStyle(fontSize: 14),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Select Chit
                  DropdownButtonFormField<String>(
                    value: _selectedChitId,
                    decoration: const InputDecoration(
                      labelText: 'Select Chit *',
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
                              'Due: ₹${plan['monthly_installment']}',
                              style: const TextStyle(fontSize: 12, color: Colors.grey),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                    onChanged: (value) {
                      setState(() {
                        _selectedChitId = value;
                        _calculateDueAmount();
                      });
                    },
                    validator: (value) {
                      if (value == null) return 'Please select a chit';
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),

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
                      if (value == null) return 'Please select a customer';
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),

                  // Payment Type
                  DropdownButtonFormField<String>(
                    value: _paymentType,
                    decoration: const InputDecoration(
                      labelText: 'Payment Type *',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.category),
                    ),
                    items: const [
                      DropdownMenuItem(value: 'installment', child: Text('Installment')),
                      DropdownMenuItem(value: 'auction_amount', child: Text('Auction Amount')),
                      DropdownMenuItem(value: 'penalty', child: Text('Penalty')),
                      DropdownMenuItem(value: 'other', child: Text('Other')),
                    ],
                    onChanged: (value) {
                      setState(() {
                        _paymentType = value!;
                        _calculateDueAmount();
                      });
                    },
                  ),
                  const SizedBox(height: 16),

                  // Amount
                  TextFormField(
                    controller: _amountController,
                    decoration: InputDecoration(
                      labelText: 'Amount *',
                      border: const OutlineInputBorder(),
                      prefixIcon: const Icon(Icons.currency_rupee),
                      suffixText: _dueAmount != null ? 'Due: ₹$_dueAmount' : null,
                    ),
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return 'Please enter amount';
                      }
                      if (double.tryParse(value) == null) {
                        return 'Please enter valid amount';
                      }
                      if (double.parse(value) <= 0) {
                        return 'Amount must be greater than 0';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),

                  // Payment Method
                  DropdownButtonFormField<String>(
                    value: _paymentMethod,
                    decoration: const InputDecoration(
                      labelText: 'Payment Method *',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.payment),
                    ),
                    items: const [
                      DropdownMenuItem(value: 'cash', child: Text('Cash')),
                      DropdownMenuItem(value: 'upi', child: Text('UPI')),
                      DropdownMenuItem(value: 'bank_transfer', child: Text('Bank Transfer')),
                      DropdownMenuItem(value: 'cheque', child: Text('Cheque')),
                    ],
                    onChanged: (value) {
                      setState(() => _paymentMethod = value!);
                    },
                  ),
                  const SizedBox(height: 16),

                  // Notes
                  TextFormField(
                    controller: _notesController,
                    decoration: const InputDecoration(
                      labelText: 'Notes (Optional)',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.note),
                    ),
                    maxLines: 2,
                    textCapitalization: TextCapitalization.sentences,
                  ),
                  const SizedBox(height: 24),

                  // Payment Summary
                  if (_selectedChitId != null && _selectedCustomerId != null) ...[
                    Card(
                      color: Colors.grey.shade100,
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Payment Summary',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const Divider(),
                            _buildSummaryRow('Date', DateFormat('dd MMM yyyy').format(DateTime.now())),
                            _buildSummaryRow('Time', DateFormat('hh:mm a').format(DateTime.now())),
                            _buildSummaryRow('Chit', _chits.firstWhere((c) => c['_id'] == _selectedChitId)['name']),
                            _buildSummaryRow('Customer', _customers.firstWhere((c) => c['_id'] == _selectedCustomerId)['name']),
                            _buildSummaryRow('Amount', '₹${_amountController.text.isEmpty ? '0' : _amountController.text}'),
                            _buildSummaryRow('Method', _paymentMethod.toUpperCase()),
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
                      backgroundColor: Colors.green,
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
                            'Collect Payment',
                            style: TextStyle(fontSize: 16, color: Colors.white),
                          ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildSummaryRow(String label, String value) {
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
