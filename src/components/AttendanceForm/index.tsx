
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoleSection } from "./RoleSection";
import { MemberInfoSection } from "./MemberInfoSection";
import { AttendanceSection } from "./AttendanceSection";
import { TransportSection } from "./TransportSection";
import { CoachSection } from "./CoachSection";
import { NotesSection } from "./NotesSection";
import { DatabaseService } from "../../services/database";
import { useAttendanceForm } from "../../hooks/useAttendanceForm";

export const AttendanceForm: React.FC = () => {
  const navigate = useNavigate();
  const [charCount, setCharCount] = useState(0);
  const {
    event,
    isEditMode,
    eventId,
    attendanceId,
    role,
    name,
    status,
    canDrive,
    availableSeats,
    familyPassengers,
    needsOnigiri,
    wantsCar,
    notes,
    setRole,
    setName,
    setStatus,
    setCanDrive,
    setAvailableSeats,
    setFamilyPassengers,
    setNeedsOnigiri,
    setWantsCar,
    setNotes,
  } = useAttendanceForm();

  const setFormData = (newData: any) => {
    if ("role" in newData) setRole(newData.role);
    if ("memberName" in newData) setName(newData.memberName);
    if ("status" in newData) setStatus(newData.status);
    if ("canDrive" in newData) setCanDrive(newData.canDrive);
    if ("availableSeats" in newData) setAvailableSeats(newData.availableSeats);
    if ("familyPassengers" in newData)
      setFamilyPassengers(newData.familyPassengers);
    if ("needsOnigiri" in newData) setNeedsOnigiri(newData.needsOnigiri);
    if ("needsCarArrangement" in newData)
      setWantsCar(newData.needsCarArrangement);
    if ("notes" in newData) setNotes(newData.notes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!eventId) return;

      const attendanceData = {
        id: attendanceId || crypto.randomUUID(),
        eventId,
        role,
        memberName: name,
        status,
        canDrive,
        availableSeats,
        familyPassengers,
        needsOnigiri,
        needsCarArrangement: wantsCar,
        notes,
        timestamp: new Date().toISOString(),
      };

      if (isEditMode && attendanceId) {
        await DatabaseService.deleteAttendance(eventId, attendanceId);
      }
      await DatabaseService.saveAttendance(eventId, attendanceData);
      navigate("/completion?mode=update");
    } catch (error) {
      console.error("出欠登録エラー:", error);
      alert("保存に失敗しました。もう一度お試しください。");
    }
  };

  if (!event) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <header className="bg-blue-500 text-white p-4">
          <h1 className="text-lg font-bold">イーグルス自動出欠配車システム</h1>
        </header>
        <div className="p-4 text-center">イベントが見つかりません</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-blue-500 text-white p-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-bold">
            {event.title} - {isEditMode ? "編集" : "参加登録"}
          </h1>
          <p className="text-sm">
            開催日: {new Date(event.date).toLocaleDateString("ja-JP")}
          </p>
        </div>
      </header>
      <div className="max-w-2xl mx-auto w-full p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <RoleSection formData={{ role }} setFormData={setFormData} />
            <MemberInfoSection formData={{ memberName: name }} setFormData={setFormData} />
            <AttendanceSection formData={{ status }} setFormData={setFormData} />
            {status === "○" && (
              <TransportSection formData={{ canDrive, availableSeats, familyPassengers, needsCarArrangement: wantsCar }} setFormData={setFormData} />
            )}
            {role === "コーチ" && (
              <CoachSection formData={{ needsOnigiri }} setFormData={setFormData} />
            )}
            <NotesSection
              formData={{ notes }}
              setFormData={setFormData}
              charCount={charCount}
            />
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                {isEditMode ? "更新する" : "送信する"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full py-3 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
