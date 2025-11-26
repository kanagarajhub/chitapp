class ChitPlan {
  final String id;
  final String title;
  final double amount;
  final int duration;
  final int membersLimit;
  final double monthlyInstallment;
  final String? description;
  final bool isActive;

  ChitPlan({
    required this.id,
    required this.title,
    required this.amount,
    required this.duration,
    required this.membersLimit,
    required this.monthlyInstallment,
    this.description,
    required this.isActive,
  });

  factory ChitPlan.fromJson(Map<String, dynamic> json) {
    return ChitPlan(
      id: json['_id'],
      title: json['title'],
      amount: json['amount'].toDouble(),
      duration: json['duration'],
      membersLimit: json['members_limit'],
      monthlyInstallment: json['monthly_installment'].toDouble(),
      description: json['description'],
      isActive: json['isActive'] ?? true,
    );
  }
}
