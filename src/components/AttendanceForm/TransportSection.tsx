import React from "react";
import { AttendanceFormData } from "../../types/attendance";

type Props = {
  formData: AttendanceFormData;
  setFormData: (data: AttendanceFormData) => void;
};

export const TransportSection: React.FC<Props> = ({
  formData,
  setFormData,
}) => {
  return (
    <>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          配車可否 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label
            className={`flex items-center justify-center p-3 rounded cursor-pointer ${
              formData.canDrive === "○"
                ? "bg-green-500 text-white"
                : "bg-white border border-gray-300 text-gray-700"
            }`}
          >
            <input
              type="radio"
              name="canDrive"
              value="○"
              checked={formData.canDrive === "○"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  canDrive: e.target.value as "○" | "×",
                })
              }
              className="sr-only"
            />
            ○
          </label>
          <label
            className={`flex items-center justify-center p-3 rounded cursor-pointer ${
              formData.canDrive === "×"
                ? "bg-red-500 text-white"
                : "bg-white border border-gray-300 text-gray-700"
            }`}
          >
            <input
              type="radio"
              name="canDrive"
              value="×"
              checked={formData.canDrive === "×"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  canDrive: e.target.value as "○" | "×",
                })
              }
              className="sr-only"
            />
            ×
          </label>
        </div>
      </div>

      {formData.canDrive === "○" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            乗車可能人数 <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-md"
            value={formData.availableSeats}
            onChange={(e) =>
              setFormData({
                ...formData,
                availableSeats: parseInt(e.target.value),
              })
            }
          >
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}名
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
};