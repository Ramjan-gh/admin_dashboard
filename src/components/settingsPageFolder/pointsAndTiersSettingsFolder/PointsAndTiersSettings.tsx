import { useState } from "react";
import { Plus, Trash2, Edit2, Loader2, Award, Info, Coins, Save } from "lucide-react";

export type MembershipTier = {
  id: string;
  name: string;
  min_points: number;
  discount_percentage: number;
  points_multiplier: number;
  badge_color: string;
  description: string;
  reward_interval: number | null;
};

type PointsAndTiersSettingsProps = {
  tiers: MembershipTier[];
  loading: boolean;
  onCreateTier: (tier: Omit<MembershipTier, "id">) => Promise<void>;
  onUpdateTier: (id: string, updates: Partial<MembershipTier>) => Promise<void>;
  onDeleteTier: (id: string) => Promise<void>;
  
  // ➕ Added Organization State Parameters for global exchange rate mapping
  pointExchangeRate: number;
  onUpdateExchangeRate: (rate: number) => Promise<void>;
};

export function PointsAndTiersSettings({
  tiers = [],
  loading,
  onCreateTier,
  onUpdateTier,
  onDeleteTier,
  pointExchangeRate = 0,
  onUpdateExchangeRate,
}: PointsAndTiersSettingsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<MembershipTier | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [exchangeRateLoading, setExchangeRateLoading] = useState(false);

  // Exchange rate local component state
  const [localExchangeRate, setLocalExchangeRate] = useState<string>(pointExchangeRate.toString());

  // Form states
  const [name, setName] = useState("");
  const [minPoints, setMinPoints] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [badgeColor, setBadgeColor] = useState("#6B46C1");
  const [description, setDescription] = useState("");
  const [rewardInterval, setRewardInterval] = useState(30);

  const openCreateModal = () => {
    setEditingTier(null);
    setName("");
    setMinPoints(0);
    setDiscount(0);
    setMultiplier(1);
    setBadgeColor("#6B46C1");
    setDescription("");
    setRewardInterval(30);
    setIsModalOpen(true);
  };

  const openEditModal = (tier: any) => {
    if (!tier) return;
    setEditingTier(tier);
    setName(tier.name || "");
    setMinPoints(Number(tier.min_points ?? 0));
    setDiscount(Number(tier.discount_percentage ?? 0));
    setMultiplier(Number(tier.points_multiplier ?? 1));
    setBadgeColor(tier.badge_color || "#6B46C1");
    setDescription(tier.description || "");
    setRewardInterval(tier.reward_interval ?? 30);
    setIsModalOpen(true);
  };

  const handleExchangeRateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setExchangeRateLoading(true);
    try {
      await onUpdateExchangeRate(Number(localExchangeRate || 0));
    } catch (error) {
      console.error(error);
    } finally {
      setExchangeRateLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingTier) {
        await onUpdateTier(editingTier.id, {
          discount_percentage: discount,
          points_multiplier: multiplier,
        });
      } else {
        await onCreateTier({
          name,
          min_points: minPoints,
          discount_percentage: discount,
          points_multiplier: multiplier,
          badge_color: badgeColor,
          description,
          reward_interval: rewardInterval,
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    if (confirm("Are you sure you want to delete this membership tier?")) {
      setActionLoading(true);
      try {
        await onDeleteTier(id);
      } catch (error) {
        console.error(error);
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ➕ POINT EXCHANGE RATE CONFIGURATION CARD */}
      <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Point Conversion Setup</h3>
            <p className="text-xs text-gray-500">
              Define monetary value calculations when customers redeem accumulated reward tokens at point of checkout.
            </p>
          </div>
        </div>

        <form onSubmit={handleExchangeRateSubmit} className="flex flex-col sm:flex-row gap-3 items-end max-w-xl">
          <div className="w-full sm:w-auto flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              1 Loyalty Point Value = 
            </label>
            <div className="relative rounded-lg shadow-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-400 text-sm">৳</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={localExchangeRate}
                onChange={(e) => setLocalExchangeRate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none"
                placeholder="e.g. 0.10"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={exchangeRateLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:bg-gray-400 h-[38px]"
          >
            {exchangeRateLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Configuration
          </button>
        </form>
        <p className="text-[11px] text-gray-400 mt-2">
          💡 Current Rule: {(Number(localExchangeRate))} points will deduct <span className="font-semibold text-gray-600">৳1</span> total from fields booking summary bills.
        </p>
      </div>

      <hr className="border-gray-100" />

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Membership Tiers
          </h2>
          <p className="text-sm text-gray-500">
            Configure loyalty ranks, reward rates, and entry points.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
        >
          <Plus className="w-4 h-4" /> Add Tier
        </button>
      </div>

      {/* Grid List View */}
      {!Array.isArray(tiers) || tiers.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No tiers configured yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tiers.map((rawTier, index) => {
            if (!rawTier) {
              console.warn(`Tier at index ${index} is null or undefined.`);
              return null;
            }

            const tierId = rawTier.id || `fallback-id-${index}`;
            const tierName = rawTier.name || "Unnamed Tier";
            const badgeColorTheme = rawTier.badge_color || "#6B46C1";
            const tierDescription = rawTier.description || "No description provided.";
            
            const pointsNeeded = typeof rawTier.min_points === "number" 
              ? rawTier.min_points 
              : Number(rawTier.min_points || 0);

            const discountRate = typeof rawTier.discount_percentage === "number"
              ? rawTier.discount_percentage
              : Number(rawTier.discount_percentage || 0);

            const pointsMultiplier = typeof rawTier.points_multiplier === "number"
              ? rawTier.points_multiplier
              : Number(rawTier.points_multiplier || 1);

            if (rawTier.min_points === undefined) {
              console.error("CRITICAL: Received a tier object missing 'min_points':", rawTier);
            }

            return (
              <div
                key={tierId}
                className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 w-full h-1.5"
                  style={{ backgroundColor: badgeColorTheme }}
                />
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full inline-block"
                        style={{ backgroundColor: badgeColorTheme }}
                      />
                      {tierName}
                    </h3>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditModal(rawTier)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-gray-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tierId)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {tierDescription}
                  </p>

                  <div className="space-y-2 border-t border-gray-100 pt-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Min. Points Needed:</span>
                      <span className="font-semibold text-gray-900">
                        {pointsNeeded.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Discount Rate:</span>
                      <span className="font-semibold text-green-600">
                        {discountRate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Points Multiplier:</span>
                      <span className="font-semibold text-purple-600">
                        {pointsMultiplier}x
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal View Layout */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingTier
                ? `Edit Tier: ${editingTier.name || "Selected Tier"}`
                : "Create New Membership Tier"}
            </h3>

            {editingTier && (
              <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg flex items-start gap-2 text-xs">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  Note: The API only permits updating the discount percentage
                  and points multiplier fields.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tier Name
                </label>
                <input
                  type="text"
                  required
                  disabled={!!editingTier}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm disabled:bg-gray-100"
                  placeholder="e.g. Gold Tier"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Min Points
                  </label>
                  <input
                    type="number"
                    required
                    disabled={!!editingTier}
                    value={minPoints}
                    onChange={(e) => setMinPoints(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Reward Interval (Days)
                  </label>
                  <input
                    type="number"
                    required
                    disabled={!!editingTier}
                    value={rewardInterval}
                    onChange={(e) => setRewardInterval(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Points Multiplier
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="1"
                    value={multiplier}
                    onChange={(e) => setMultiplier(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Badge Theme Color
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    disabled={!!editingTier}
                    value={badgeColor}
                    onChange={(e) => setBadgeColor(e.target.value)}
                    className="w-10 h-9 p-0 border border-gray-300 rounded-lg cursor-pointer disabled:opacity-50"
                  />
                  <input
                    type="text"
                    disabled={!!editingTier}
                    value={badgeColor}
                    onChange={(e) => setBadgeColor(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm uppercase disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  disabled={!!editingTier}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm disabled:bg-gray-100"
                  rows={2}
                  placeholder="Describe tier privileges..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                >
                  {actionLoading && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {editingTier ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}