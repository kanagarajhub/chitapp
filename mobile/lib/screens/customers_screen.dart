import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/customer.dart';
import 'add_customer_screen.dart';

class CustomersScreen extends StatefulWidget {
  const CustomersScreen({super.key});

  @override
  State<CustomersScreen> createState() => _CustomersScreenState();
}

class _CustomersScreenState extends State<CustomersScreen> {
  final ApiService _apiService = ApiService();
  List<Customer> _customers = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadCustomers();
  }

  Future<void> _loadCustomers() async {
    setState(() => _isLoading = true);
    try {
      final data = await _apiService.getCustomers();
      setState(() {
        _customers = data.map((json) => Customer.fromJson(json)).toList();
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadCustomers,
              child: _customers.isEmpty
                  ? const Center(child: Text('No customers found'))
                  : ListView.builder(
                      padding: const EdgeInsets.all(8),
                      itemCount: _customers.length,
                      itemBuilder: (context, index) {
                        final customer = _customers[index];
                        return Card(
                          margin: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          child: ListTile(
                            leading: CircleAvatar(
                              child: Text(customer.name[0].toUpperCase()),
                            ),
                            title: Text(
                              customer.name,
                              style: const TextStyle(fontWeight: FontWeight.bold),
                            ),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(customer.phone),
                                if (customer.email != null)
                                  Text(customer.email!),
                              ],
                            ),
                            trailing: Chip(
                              label: Text(
                                customer.isActive ? 'Active' : 'Inactive',
                                style: const TextStyle(fontSize: 12),
                              ),
                              backgroundColor: customer.isActive
                                  ? Colors.green.shade100
                                  : Colors.red.shade100,
                            ),
                            isThreeLine: customer.email != null,
                          ),
                        );
                      },
                    ),
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          final result = await Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const AddCustomerScreen(),
            ),
          );
          if (result == true) {
            _loadCustomers();
          }
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}
