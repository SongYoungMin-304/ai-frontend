import api from './api';

export interface BookingRequest {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  message?: string;
}

export interface BookingResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  message?: string;
  createdAt: string;
}

export const bookingService = {
  async submitBooking(request: BookingRequest): Promise<BookingResponse> {
    const response = await api.post<BookingResponse>('/bookings', request);
    return response.data;
  },
};
