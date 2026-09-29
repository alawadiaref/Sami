export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  address?: string; // street/building/apartment details, used for delivery
  password: string; // plaintext for now — see README security note (same as admins.json)
  createdAt: string;
}

export type SafeCustomer = Omit<Customer, "password">;

export function toSafeCustomer(c: Customer): SafeCustomer {
  const { password: _password, ...safe } = c;
  return safe;
}
