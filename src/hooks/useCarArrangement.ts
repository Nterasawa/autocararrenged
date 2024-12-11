import { useState } from "react";
import { arrangeCarsByAI } from "../services/openaiApi"; // claudeApi から openaiApi に変更
import { AttendanceData } from "../types/attendance";

export const useCarArrangement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const arrangeCards = async (
    attendances: AttendanceData[],
    specialInstructions: string,
    forceNew: boolean = false,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await arrangeCarsByAI(attendances, specialInstructions);
      return result;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "配車の計算に失敗しました",
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    arrangeCards,
    isLoading,
    error,
  };
};
