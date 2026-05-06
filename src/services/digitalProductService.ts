import api from './api';

export interface DigitalProductRequest {
  name: string;
  email: string;
  phone: string;
  productType: string;
  message?: string;
}

export interface DigitalProductResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  productType: string;
  message?: string;
  createdAt: string;
}

export const digitalProductService = {
  async requestProduct(request: DigitalProductRequest): Promise<DigitalProductResponse> {
    const response = await api.post<DigitalProductResponse>('/digital-products/request', request);
    return response.data;
  },
};
