import React, { useState } from "react";
import {
  XMarkIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { AttendanceData } from "../../types/attendance";
import { useCarArrangement } from "../../hooks/useCarArrangement";
import { DatabaseService } from "../../services/database";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  attendances: AttendanceData[];
  eventId: string;
  onComplete?: (result: any) => void;
};

const CarArrangementModal: React.FC<Props> = ({
  isOpen,
  onClose,
  attendances,
  eventId,
  onComplete,
}) => {
  const [specialInstructions, setSpecialInstructions] = useState("");
  const { arrangeCards, isLoading, error } = useCarArrangement();
  const [arrangementResult, setArrangementResult] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleArrange = async () => {
    try {
      const result = await arrangeCards(attendances, specialInstructions);
      setArrangementResult(result);
      console.log("配車結果:", result);
    } catch (e) {
      // エラーはuseCarArrangementで処理されます
    }
  };

  const copyToClipboard = async () => {
    if (!arrangementResult) return;

    const text = arrangementResult
      .map((car: any) => {
        const allPassengers = [
          ...car.passengers.map((p: any) =>
            p.type === "coach" ? `${p.name}コーチ` : p.name,
          ),
          car.driver,
        ];
        const passengerList = allPassengers.join("\n");
        return `【${car.driver}の車】\n${passengerList}`;
      })
      .join("\n\n");

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("クリップボードへのコピーに失敗:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">配車組み</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg text-sm">
            <h3 className="font-bold text-yellow-900 mb-2">配車ルール</h3>
            <ul className="list-disc pl-5 space-y-1 text-yellow-800">
              <li>配車を出す団員は基本的に自分の車に乗ります</li>
              <li>配車の優先順位: 団員 → コーチ → 団員家族</li>
              <li>団員家族は必ず団員と同じ車に乗車させます</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">特別指示</label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="台数制限、コーチ車優先などの特別な指示があればこちらに入力してください"
              rows={3}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm p-4 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          {arrangementResult && (
            <div className="mt-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">配車結果</h3>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  {isCopied ? (
                    <>
                      <ClipboardDocumentCheckIcon className="w-5 h-5 text-green-600" />
                      <span className="text-green-600">コピー完了!</span>
                    </>
                  ) : (
                    <>
                      <ClipboardDocumentIcon className="w-5 h-5" />
                      <span>結果をコピー</span>
                    </>
                  )}
                </button>
              </div>
              {arrangementResult.map((car: any, index: number) => (
                <div key={index} className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-900 mb-2">
                    {car.driver}の車
                  </h4>
                  <ul className="mt-2 space-y-1">
                    {car.passengers.map((passenger: any, pIndex: number) => (
                      <li key={pIndex} className="text-gray-700">
                        {passenger.type === "coach"
                          ? `${passenger.name}コーチ`
                          : passenger.name}
                      </li>
                    ))}
                    <li className="text-gray-700">{car.driver}</li>
                  </ul>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            {!arrangementResult ? (
              <button
                onClick={handleArrange}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white p-4 rounded-lg disabled:bg-blue-300"
              >
                {isLoading ? "計算中..." : "配車を組む"}
              </button>
            ) : (
              <div className="w-full flex gap-2">
                <button
                  onClick={() => {
                    setArrangementResult(null);
                    setSpecialInstructions("");
                  }}
                  className="flex-1 bg-gray-600 text-white p-4 rounded-lg"
                >
                  再計算
                </button>
                <button
                  onClick={async () => {
                    try {
                      await DatabaseService.saveCarArrangement(
                        eventId,
                        arrangementResult,
                      );
                      onComplete?.(arrangementResult);
                      onClose();
                    } catch (error) {
                      console.error("配車結果の保存に失敗:", error);
                      alert("配車結果の保存に失敗しました");
                    }
                  }}
                  className="flex-1 bg-green-600 text-white p-4 rounded-lg"
                >
                  確定
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarArrangementModal;
