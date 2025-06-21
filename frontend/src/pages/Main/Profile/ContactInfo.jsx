import { Mail, Phone, Headset } from "lucide-react";

export default function ContactInfo({ email, phone, tele }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-700 rounded-xl flex items-center justify-center">
            <Mail className="w-5 h-5 text-gray-50" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-900">{email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-700 rounded-xl flex items-center justify-center">
            <Phone className="w-5 h-5 text-gray-50" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium text-gray-900">{phone || "Not given"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-700 rounded-xl flex items-center justify-center">
            <Headset className="w-5 h-5 text-gray-50" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Telegraph Availability</p>
            <p className="font-medium text-gray-900">{tele}</p>
          </div>
        </div>
      </div>
    </div>
  );
}