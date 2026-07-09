import {
  Building,
  Calendar,
  Tag,
  AlertCircle,
  Loader2,
  Images,
  Award,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { GeneralSettings } from "./settingsPageFolder/generalSettingsFolder/GeneralSettings";
import { HolidaySettings } from "./settingsPageFolder/HolidaySettings";
import { DiscountSettings } from "./settingsPageFolder/discountSettingsFolder/DiscountSettings";
import { GallerySettings } from "./settingsPageFolder/generalSettingsFolder/GallerySettings";
import { PointsAndTiersSettings } from "./settingsPageFolder/pointsAndTiersSettingsFolder/PointsAndTiersSettings";
import { useSettings } from "./settingsPageFolder/useSettings";

type Props = {
  onSessionExpired: () => void;
};

export function SettingsPage({ onSessionExpired }: Props) {
  const {
    activeTab,
    setActiveTab,
    hasChanges,
    loading,
    orgData,
    setOrgData,
    holidays,
    discounts,
    newHoliday,
    setNewHoliday,
    newDiscount,
    setNewDiscount,
    banners,
    bannerLoading,
    handleUpdateOrg,
    handleUpdateExchangeRate,
    handleAddSchedule,
    handleDeleteSchedule,
    handleAddDiscount,
    handleDeleteDiscount,
    handleToggleDiscountStatus,
    handleLogoUpload,
    handleBannerUpload,
    handleDeleteBanner,
    gallery,
    galleryLoading,
    handleGalleryUpload,
    handleDeleteGalleryItem,
    setHasChanges,
    tiers,
    tiersLoading,
    handleCreateTier,
    handleUpdateTier,
    handleDeleteTier,
  } = useSettings(onSessionExpired);

  // Track state of mobile dropdown drawer menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );

  const tabs = [
    { id: "general", label: "General", icon: Building },
    { id: "holidays", label: "Holidays", icon: Calendar },
    { id: "discounts", label: "Discounts", icon: Tag },
    { id: "tiers", label: "Points & Tiers", icon: Award },
    { id: "gallery", label: "Gallery", icon: Images },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Dynamic Responsive Header Row */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pb-2">
        <div>
          <h1 className="text-gray-900 mb-1 text-xl sm:text-2xl font-black tracking-tight">Settings</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Manage your business configuration and rules
          </p>
        </div>
        {hasChanges && (
          <div className="self-start sm:self-center flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full text-xs font-medium border border-amber-200 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" /> Unsaved Changes
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* MOBILE VIEW: Dropdown Switcher Button */}
        <div className="block md:hidden border-b border-gray-100 p-3 bg-gray-50/50">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl shadow-sm font-semibold text-sm text-blue-600"
          >
            <div className="flex items-center gap-2.5">
              <currentTab.icon className="w-4 h-4 text-blue-500" />
              <span>{currentTab.label} Settings</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Expandable Menu Overlay Drawer */}
          {isMobileMenuOpen && (
            <div className="mt-1.5 overflow-hidden border border-gray-100 rounded-xl bg-white shadow-xl animate-in fade-in-50 slide-in-from-top-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors border-b last:border-0 border-gray-50 ${
                    activeTab === tab.id
                      ? "bg-blue-50/50 text-blue-600 font-bold"
                      : "text-gray-600 active:bg-gray-50"
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'}`} />
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DESKTOP VIEW: Sidebar/Horizontal Style Segment Controls */}
        <div className="hidden md:block border-b border-gray-100 bg-gray-50/30">
          <div className="flex px-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 font-semibold text-sm transition-all border-b-2 ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 bg-white shadow-[0_1px_0_rgba(255,255,255,1)]"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sub-Panel Layout Body Container */}
        <div className="p-4 sm:p-6 overflow-x-hidden">
          {activeTab === "general" && orgData && (
            <GeneralSettings
              orgData={orgData}
              setOrgData={setOrgData}
              loading={loading}
              setHasChanges={setHasChanges}
              handleLogoUpload={handleLogoUpload}
              handleUpdateOrg={handleUpdateOrg}
              banners={banners}
              bannerLoading={bannerLoading}
              handleBannerUpload={handleBannerUpload}
              handleDeleteBanner={handleDeleteBanner}
            />
          )}

          {activeTab === "holidays" && (
            <HolidaySettings
              holidays={holidays}
              newHoliday={newHoliday}
              setNewHoliday={setNewHoliday}
              handleAddSchedule={handleAddSchedule}
              handleDeleteSchedule={handleDeleteSchedule}
            />
          )}

          {activeTab === "discounts" && (
            <DiscountSettings
              discounts={discounts}
              newDiscount={newDiscount}
              setNewDiscount={setNewDiscount}
              handleAddDiscount={handleAddDiscount}
              handleDeleteDiscount={handleDeleteDiscount}
              handleToggleDiscountStatus={handleToggleDiscountStatus}
            />
          )}

          {activeTab === "tiers" && (
            <PointsAndTiersSettings
              tiers={tiers}
              loading={tiersLoading}
              onCreateTier={handleCreateTier}
              onUpdateTier={handleUpdateTier}
              onDeleteTier={handleDeleteTier}
              pointExchangeRate={orgData?.points_exchange_rate ?? 0}
              onUpdateExchangeRate={handleUpdateExchangeRate} 
            />
          )}

          {activeTab === "gallery" && (
            <GallerySettings
              gallery={gallery}
              loading={galleryLoading}
              onUpload={handleGalleryUpload}
              onDelete={handleDeleteGalleryItem}
            />
          )}
        </div>
      </div>
    </div>
  );
}