import { Building, Calendar, Tag, AlertCircle, Loader2 } from "lucide-react";
import { GeneralSettings } from "./settingsPageFolder/GeneralSettings";
import { HolidaySettings } from "./settingsPageFolder/HolidaySettings";
import { DiscountSettings } from "./settingsPageFolder/DiscountSettings";
import { useSettings } from "./settingsPageFolder/useSettings"; 

export function SettingsPage() {
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
    handleAddSchedule,
    handleDeleteSchedule,
    handleAddDiscount,
    handleDeleteDiscount,
    handleToggleDiscountStatus,
    handleLogoUpload,
    handleBannerUpload,
    handleDeleteBanner,
    setHasChanges,
  } = useSettings();

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );

  const tabs = [
    { id: "general", label: "General", icon: Building },
    { id: "holidays", label: "Holidays", icon: Calendar },
    { id: "discounts", label: "Discounts", icon: Tag },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-gray-900 mb-1 text-2xl font-bold">Settings</h1>
          <p className="text-gray-500">
            Manage your business configuration and rules
          </p>
        </div>
        {hasChanges && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm border border-amber-200">
            <AlertCircle className="w-4 h-4" /> Unsaved Changes
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 overflow-x-auto bg-gray-50/50">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 whitespace-nowrap font-medium transition-all ${
                  activeTab === tab.id
                    ? "border-b-2 border-purple-500 text-purple-600 bg-white"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
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
        </div>
      </div>
    </div>
  );
}
