import React from "react";
import { AttendanceFormData } from "../../types/attendance";

type Props = {
  formData: AttendanceFormData;
  setFormData: (data: AttendanceFormData) => void;
};

export const CoachSection: React.FC<Props> = ({ formData, setFormData }) => {
  return (
    <>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          おにぎり <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label
            className={`flex items-center justify-center p-3 rounded cursor-pointer ${
              formData.needsOnigiri === "必要"
                ? "bg-green-500 text-white"
                : "bg-white border border-gray-300 text-gray-700"
            }`}
          >
            <input
              type="radio"
              name="needsOnigiri"
              value="必要"
              checked={formData.needsOnigiri === "必要"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  needsOnigiri: e.target.value as "必要" | "不要",
                })
              }
              className="sr-only"
            />
            必要
          </label>
          <label
            className={`flex items-center justify-center p-3 rounded cursor-pointer ${
              formData.needsOnigiri === "不要"
                ? "bg-red-500 text-white"
                : "bg-white border border-gray-300 text-gray-700"
            }`}
          >
            <input
              type="radio"
              name="needsOnigiri"
              value="不要"
              checked={formData.needsOnigiri === "不要"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  needsOnigiri: e.target.value as "必要" | "不要",
                })
              }
              className="sr-only"
            />
            不要
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          配車調整依頼 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label
            className={`flex items-center justify-center p-3 rounded cursor-pointer ${
              formData.needsCarArrangement === "○"
                ? "bg-green-500 text-white"
                : "bg-white border border-gray-300 text-gray-700"
            }`}
          >
            <input
              type="radio"
              name="needsCarArrangement"
              value="○"
              checked={formData.needsCarArrangement === "○"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  needsCarArrangement: e.target.value as "○" | "×",
                })
              }
              className="sr-only"
            />
            ○
          </label>
          <label
            className={`flex items-center justify-center p-3 rounded cursor-pointer ${
              formData.needsCarArrangement === "×"
                ? "bg-red-500 text-white"
                : "bg-white border border-gray-300 text-gray-700"
            }`}
          >
            <input
              type="radio"
              name="needsCarArrangement"
              value="×"
              checked={formData.needsCarArrangement === "×"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  needsCarArrangement: e.target.value as "○" | "×",
                })
              }
              className="sr-only"
            />
            ×
          </label>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          ※配車調整を希望する場合は○を選択してください
        </p>
      </div>
    </>
  );
};