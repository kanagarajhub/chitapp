import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import 'dashboard_screen.dart';
import 'customers_screen.dart';
import 'payments_screen.dart';
import 'chits_screen.dart';
import 'add_customer_screen.dart';
import 'add_customer_to_chit_screen.dart';
import 'collect_payment_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const DashboardScreen(),
    const CustomersScreen(),
    const ChitsScreen(),
    const PaymentsScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Chit Fund Management'),
        actions: [
          // Quick Actions Menu
          PopupMenuButton<String>(
            icon: const Icon(Icons.add_circle_outline),
            tooltip: 'Quick Actions',
            itemBuilder: (context) => <PopupMenuEntry<String>>[
              const PopupMenuItem<String>(
                value: 'add_customer',
                child: ListTile(
                  leading: Icon(Icons.person_add),
                  title: Text('Add Customer'),
                ),
              ),
              const PopupMenuItem<String>(
                value: 'add_to_chit',
                child: ListTile(
                  leading: Icon(Icons.group_add),
                  title: Text('Add to Chit'),
                ),
              ),
              const PopupMenuItem<String>(
                value: 'collect_payment',
                child: ListTile(
                  leading: Icon(Icons.payment),
                  title: Text('Collect Payment'),
                ),
              ),
            ],
            onSelected: (value) {
              switch (value) {
                case 'add_customer':
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const AddCustomerScreen(),
                    ),
                  );
                  break;
                case 'add_to_chit':
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const AddCustomerToChitScreen(),
                    ),
                  );
                  break;
                case 'collect_payment':
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const CollectPaymentScreen(),
                    ),
                  );
                  break;
              }
            },
          ),
          // User Menu
          PopupMenuButton<String>(
            icon: const Icon(Icons.person),
            itemBuilder: (context) => <PopupMenuEntry<String>>[
              PopupMenuItem<String>(
                enabled: false,
                child: ListTile(
                  leading: const Icon(Icons.person),
                  title: Text(authProvider.user?['name'] ?? 'User'),
                  subtitle: Text(authProvider.user?['role'] ?? ''),
                ),
              ),
              const PopupMenuDivider(),
              PopupMenuItem<String>(
                value: 'logout',
                child: const ListTile(
                  leading: Icon(Icons.logout),
                  title: Text('Logout'),
                ),
              ),
            ],
            onSelected: (value) {
              if (value == 'logout') {
                authProvider.logout();
              }
            },
          ),
        ],
      ),
      body: _screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.people),
            label: 'Customers',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.account_balance_wallet),
            label: 'Chits',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.payment),
            label: 'Payments',
          ),
        ],
      ),
    );
  }
}
