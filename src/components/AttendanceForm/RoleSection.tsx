import React from "react";
import { AttendanceFormData } from "../../types/attendance";

type Props = {
  formData: AttendanceFormData;
  setFormData: (data: AttendanceFormData) => void;
};

export const RoleSection: React.FC<Props> = ({ formData, setFormData }) => {
  return (
    <>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          役割 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {/* 団員選択 */}
          <label
            className={`flex items-center justify-center p-3 rounded cursor-pointer ${
              formData.role === "団員"
                ? "bg-blue-500 text-white"
                : "bg-white border border-gray-300 text-gray-700"
            }`}
          >
            <input
              type="radio"
              name="role"
              value="団員"
              checked={formData.role === "団員"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as "団員" | "コーチ",
                })
              }
              className="sr-only"
            />
            団員
          </label>
          {/* コーチ選択 */}
          <label
            className={`flex items-center justify-center p-3 rounded cursor-pointer ${
              formData.role === "コーチ"
                ? "bg-blue-500 text-white"
                : "bg-white border border-gray-300 text-gray-700"
            }`}
          >
            <input
              type="radio"
              name="role"
              value="コーチ"
              checked={formData.role === "コーチ"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as "団員" | "コーチ",
                })
              }
              className="sr-only"
            />
            コーチ
          </label>
        </div>
      </div>

      {/* 役割別の説明 */}
      {formData.role === "団員" && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <h4 className="font-bold">【団員の方へのお願い】</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>午前で帰宅等のイレギュラーな参加は備考に記載してください。</li>
            <li>
              母当番・家族乗車希望人数は「家族の乗車希望人数」に入力してください。
            </li>
          </ul>
        </div>
      )}
      {formData.role === "コーチ" && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <h4 className="font-bold">【コーチの方へのお願い】</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>
              遅刻、早退、自車移動、直行直帰などは備考に記載してください。
            </li>
            <li>父コーチの方は配車を団員の出欠で入力してください。</li>
            <li>
              ボランティアコーチの方はおにぎりの要・不要を選択してください。
            </li>
          </ul>
        </div>
      )}
    </>
  );
};