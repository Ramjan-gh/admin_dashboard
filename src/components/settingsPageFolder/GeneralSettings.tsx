import React from "react";
import {
  Building,
  Globe,
  Instagram,
  Facebook,
  MessageCircle,
  MapPin,
  Save,
  Plus,
} from "lucide-react";
import { BannerSettings } from "./BannerSettings"; // Import your banner component

// Types
import { GeneralSettingsProps } from "../types";


export function GeneralSettings({
  orgData,
  setOrgData,
  loading,
  setHasChanges,
  handleLogoUpload,
  handleUpdateOrg,
  banners,
  bannerLoading,
  handleBannerUpload,
  handleDeleteBanner,
}: GeneralSettingsProps) {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* 1. Hero Banners Section (Using your BannerSettings component) */}
      <section className="bg-white rounded-xl shadow-sm border p-6">
        <BannerSettings
          banners={banners}
          loading={bannerLoading}
          onUpload={handleBannerUpload}
          onDelete={handleDeleteBanner}
        />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 2. Identity & Branding */}
        <section className="space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
            <Building className="w-4 h-4 text-purple-600" /> Identity & Branding
          </h3>

          <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <div className="relative group">
              <img
                src={orgData.logo_url}
                alt="Logo"
                className="w-24 h-24 rounded-lg object-cover border-2 border-white shadow-md"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-lg cursor-pointer transition-opacity">
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Plus className="w-6 h-6" />
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={loading}
                />
              </label>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-wider">
              Click image to change logo
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Business Name
            </label>
            <input
              type="text"
              value={orgData.name || ""}
              onChange={(e) => {
                setOrgData({ ...orgData, name: e.target.value });
                setHasChanges(true);
              }}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Description
            </label>
            <textarea
              rows={3}
              value={orgData.description || ""}
              onChange={(e) => {
                setOrgData({ ...orgData, description: e.target.value });
                setHasChanges(true);
              }}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
        </section>

        {/* 3. Contact Information */}
        <section className="space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
            <Globe className="w-4 h-4 text-purple-600" /> Contact Info
          </h3>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Emails (comma separated)
            </label>
            <input
              type="text"
              value={
                Array.isArray(orgData.emails)
                  ? orgData.emails.join(", ")
                  : orgData.emails || ""
              }
              onChange={(e) => {
                setOrgData({ ...orgData, emails: e.target.value });
                setHasChanges(true);
              }}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Phone Numbers
            </label>
            <input
              type="text"
              value={
                Array.isArray(orgData.phone_numbers)
                  ? orgData.phone_numbers.join(", ")
                  : orgData.phone_numbers || ""
              }
              onChange={(e) => {
                setOrgData({ ...orgData, phone_numbers: e.target.value });
                setHasChanges(true);
              }}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Physical Address
            </label>
            <input
              type="text"
              value={orgData.address_text || ""}
              onChange={(e) => {
                setOrgData({ ...orgData, address_text: e.target.value });
                setHasChanges(true);
              }}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
        </section>

        {/* 4. Social Media Links */}
        <section className="space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
            <Instagram className="w-4 h-4 text-purple-600" /> Social Presence
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-2">
              <Facebook className="w-5 h-5 text-blue-600" />
              <input
                placeholder="Facebook URL"
                value={orgData.facebook_url || ""}
                onChange={(e) => {
                  setOrgData({ ...orgData, facebook_url: e.target.value });
                  setHasChanges(true);
                }}
                className="flex-1 px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Instagram className="w-5 h-5 text-pink-600" />
              <input
                placeholder="Instagram URL"
                value={orgData.instagram_url || ""}
                onChange={(e) => {
                  setOrgData({ ...orgData, instagram_url: e.target.value });
                  setHasChanges(true);
                }}
                className="flex-1 px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <input
                placeholder="WhatsApp URL"
                value={orgData.whatsapp_url || ""}
                onChange={(e) => {
                  setOrgData({ ...orgData, whatsapp_url: e.target.value });
                  setHasChanges(true);
                }}
                className="flex-1 px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>
        </section>

        {/* 5. Location Details */}
        <section className="space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
            <MapPin className="w-4 h-4 text-purple-600" /> Map Integration
          </h3>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Google Maps URL
            </label>
            <input
              type="url"
              value={orgData.address_google_maps_url || ""}
              onChange={(e) => {
                setOrgData({
                  ...orgData,
                  address_google_maps_url: e.target.value,
                });
                setHasChanges(true);
              }}
              className="w-full mt-1 px-4 py-2 border rounded-lg text-blue-600 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
        </section>
      </div>

      {/* Footer Save Button */}
      <div className="pt-6 border-t flex justify-end">
        <button
          onClick={handleUpdateOrg}
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-md transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Save All Settings
        </button>
      </div>
    </div>
  );
}
