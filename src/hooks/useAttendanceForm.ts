import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { DatabaseService } from "../services/database";

type AttendanceFormState = {
  role: "団員" | "コーチ" | undefined;
  memberName: string;
  status: "○" | "×" | undefined;
  canDrive: "○" | "×" | undefined;
  availableSeats: number;
  familyPassengers: number;
  needsOnigiri: "必要" | "不要" | undefined;
  needsCarArrangement: "○" | "×" | undefined;
  notes: string;
};

export const useAttendanceForm = () => {
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const attendanceId = searchParams.get("attendanceId");
  const isEditMode = searchParams.get("mode") === "edit";

  const [event, setEvent] = useState<any>(null);
  const [role, setRole] = useState<"団員" | "コーチ" | undefined>(undefined);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"○" | "×" | undefined>(undefined);
  const [canDrive, setCanDrive] = useState<"○" | "×" | undefined>(undefined);
  const [availableSeats, setAvailableSeats] = useState(0);
  const [familyPassengers, setFamilyPassengers] = useState(0);
  const [needsOnigiri, setNeedsOnigiri] = useState<"必要" | "不要" | undefined>(undefined);
  const [wantsCar, setWantsCar] = useState<"○" | "×" | undefined>(undefined);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!eventId) return;

      try {
        const events = await DatabaseService.getEvents();
        const event = events.find((e) => e.id === eventId);
        if (event) {
          setEvent(event);
        }

        if (isEditMode && attendanceId) {
          const attendances = await DatabaseService.getAttendances(eventId);
          const attendance = attendances.find((a) => a.id === attendanceId);
          if (attendance) {
            setRole(attendance.role as "団員" | "コーチ");
            setName(attendance.memberName);
            setStatus(attendance.status as "○" | "×");
            setCanDrive(attendance.canDrive as "○" | "×");
            setAvailableSeats(attendance.availableSeats);
            setFamilyPassengers(attendance.familyPassengers);
            setNeedsOnigiri(attendance.needsOnigiri as "必要" | "不要" | undefined);
            setWantsCar(attendance.needsCarArrangement as "○" | "×" | undefined);
            setNotes(attendance.notes);
          }
        }
      } catch (error) {
        console.error("データ取得エラー:", error);
      }
    };

    fetchData();
  }, [eventId, attendanceId, isEditMode]);

  return {
    event,
    isEditMode,
    eventId,
    attendanceId,
    role,
    setRole,
    name,
    setName,
    status,
    setStatus,
    canDrive,
    setCanDrive,
    availableSeats,
    setAvailableSeats,
    familyPassengers,
    setFamilyPassengers,
    needsOnigiri,
    setNeedsOnigiri,
    wantsCar,
    setWantsCar,
    notes,
    setNotes,
  };
};