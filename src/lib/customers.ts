import fs from "fs";
import path from "path";
import { Customer } from "./customers-types";

const DATA_PATH = path.join(process.cwd(), "data", "customers.json");

export function getCustomers(): Customer[] {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw) as Customer[];
  } catch {
    return [];
  }
}

function saveCustomers(customers: Customer[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(customers, null, 2), "utf-8");
}

export function findCustomerById(id: string): Customer | undefined {
  return getCustomers().find((c) => c.id === id);
}

export function findCustomerByEmail(email: string): Customer | undefined {
  return getCustomers().find((c) => c.email.toLowerCase() === email.toLowerCase());
}

export function findCustomerByCredentials(email: string, password: string): Customer | undefined {
  return getCustomers().find((c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password);
}

export function emailTaken(email: string): boolean {
  return !!findCustomerByEmail(email);
}

export function createCustomer(data: { name: string; email: string; phone: string; password: string }): Customer {
  const customers = getCustomers();
  const customer: Customer = {
    id: `customer-${Date.now()}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: data.password,
    createdAt: new Date().toISOString(),
  };
  customers.push(customer);
  saveCustomers(customers);
  return customer;
}

export * from "./customers-types";
