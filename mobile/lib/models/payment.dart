class Payment {
  final String id;
  final String chitId;
  final String customerId;
  final int month;
  final double amount;
  final DateTime paymentDate;
  final DateTime dueDate;
  final String status;
  final String paymentMode;
  final String? transactionId;
  final String receiptNumber;
  final String? notes;

  Payment({
    required this.id,
    required this.chitId,
    required this.customerId,
    required this.month,
    required this.amount,
    required this.paymentDate,
    required this.dueDate,
    required this.status,
    required this.paymentMode,
    this.transactionId,
    required this.receiptNumber,
    this.notes,
  });

  factory Payment.fromJson(Map<String, dynamic> json) {
    return Payment(
      id: json['_id'],
      chitId: json['chit_id'] is String ? json['chit_id'] : json['chit_id']['_id'],
      customerId: json['customer_id'] is String ? json['customer_id'] : json['customer_id']['_id'],
      month: json['month'],
      amount: json['amount'].toDouble(),
      paymentDate: DateTime.parse(json['payment_date']),
      dueDate: DateTime.parse(json['due_date']),
      status: json['status'],
      paymentMode: json['payment_mode'],
      transactionId: json['transaction_id'],
      receiptNumber: json['receipt_number'],
      notes: json['notes'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'chit_id': chitId,
      'customer_id': customerId,
      'month': month,
      'amount': amount,
      'payment_date': paymentDate.toIso8601String(),
      'due_date': dueDate.toIso8601String(),
      'status': status,
      'payment_mode': paymentMode,
      'transaction_id': transactionId,
      'notes': notes,
    };
  }
}
