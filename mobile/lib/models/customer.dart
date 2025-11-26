class Customer {
  final String id;
  final String name;
  final String phone;
  final String? email;
  final String? address;
  final String? kycId;
  final String kycType;
  final DateTime joinedDate;
  final bool isActive;
  final String? notes;

  Customer({
    required this.id,
    required this.name,
    required this.phone,
    this.email,
    this.address,
    this.kycId,
    required this.kycType,
    required this.joinedDate,
    required this.isActive,
    this.notes,
  });

  factory Customer.fromJson(Map<String, dynamic> json) {
    return Customer(
      id: json['_id'],
      name: json['name'],
      phone: json['phone'],
      email: json['email'],
      address: json['address'],
      kycId: json['kyc_id'],
      kycType: json['kyc_type'] ?? 'aadhaar',
      joinedDate: DateTime.parse(json['joined_date']),
      isActive: json['isActive'] ?? true,
      notes: json['notes'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'phone': phone,
      'email': email,
      'address': address,
      'kyc_id': kycId,
      'kyc_type': kycType,
      'notes': notes,
      'isActive': isActive,
    };
  }
}
