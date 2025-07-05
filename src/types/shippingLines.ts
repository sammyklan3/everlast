export type ContactInfo = {
  email: string;
  phone: string;
  address: string;
};

export type ShippingCompany = {
  id: string;
  name: string;
  contactInfo: ContactInfo;
  createdAt: string;
  updatedAt: string;
};
