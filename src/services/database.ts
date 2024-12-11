import { Event } from "../types/event";
import { AttendanceData } from "../types/attendance";

export const DatabaseService = {
  EVENTS_KEY: "events",
  ATTENDANCE_KEY: (eventId: string) => `attendance_${eventId}`,
  CAR_ARRANGEMENT_KEY: (eventId: string) => `car_arrangement_${eventId}`,

  async initializeDatabase(): Promise<void> {
    try {
      const events = await this.getEvents();
      if (events.length === 0) {
        const event: Event = {
          id: "event-" + Date.now(),
          title: "2024年 練習試合",
          date: new Date("2024-12-15").toISOString().split("T")[0],
          attendees: 0,
          cars: 0,
        };

        await this.saveEvent(event);

        const attendances: AttendanceData[] = [
          {
            id: "attendance-1",
            eventId: event.id,
            memberName: "中村コーチ",
            role: "コーチ",
            status: "○",
            canDrive: "○",
            availableSeats: 4,
            familyPassengers: 0,
            needsOnigiri: "必要",
            needsCarArrangement: "×",
            notes: "17時まで参加",
          },
          {
            id: "attendance-2",
            eventId: event.id,
            memberName: "田中一郎",
            role: "団員",
            status: "○",
            canDrive: "○",
            availableSeats: 4,
            familyPassengers: 1,
            notes: "母当番",
          },
          {
            id: "attendance-3",
            eventId: event.id,
            memberName: "山本次郎",
            role: "団員",
            status: "○",
            canDrive: "×",
            availableSeats: 0,
            familyPassengers: 0,
            notes: "",
          },
          {
            id: "attendance-4",
            eventId: event.id,
            memberName: "佐藤コーチ",
            role: "コーチ",
            status: "○",
            canDrive: "○",
            availableSeats: 3,
            familyPassengers: 0,
            needsOnigiri: "必要",
            needsCarArrangement: "×",
            notes: "",
          },
        ];

        for (const attendance of attendances) {
          await this.saveAttendance(event.id, attendance);
        }

        console.log("初期データを作成しました");
      }
    } catch (error) {
      console.error("データベース初期化エラー:", error);
    }
  },

  async getEvents(): Promise<Event[]> {
    try {
      const eventsJson = localStorage.getItem(this.EVENTS_KEY);
      return eventsJson ? JSON.parse(eventsJson) : [];
    } catch (error) {
      console.error("イベント取得エラー:", error);
      return [];
    }
  },

  async saveEvent(event: Event): Promise<void> {
    try {
      const events = await this.getEvents();
      events.push(event);
      localStorage.setItem(this.EVENTS_KEY, JSON.stringify(events));
    } catch (error) {
      console.error("イベント保存エラー:", error);
      throw new Error("イベントの保存に失敗しました");
    }
  },

  async deleteEvent(eventId: string): Promise<void> {
    try {
      const events = await this.getEvents();
      const filteredEvents = events.filter((event) => event.id !== eventId);
      localStorage.setItem(this.EVENTS_KEY, JSON.stringify(filteredEvents));
      localStorage.removeItem(this.ATTENDANCE_KEY(eventId));
      localStorage.removeItem(this.CAR_ARRANGEMENT_KEY(eventId));
    } catch (error) {
      console.error("イベント削除エラー:", error);
      throw new Error("イベントの削除に失敗しました");
    }
  },

  async saveAttendance(eventId: string, attendance: AttendanceData): Promise<void> {
    try {
      const key = this.ATTENDANCE_KEY(eventId);
      const attendances = await this.getAttendances(eventId);
      attendances.push(attendance);
      localStorage.setItem(key, JSON.stringify(attendances));

      // イベント情報の更新
      const events = await this.getEvents();
      const eventIndex = events.findIndex(e => e.id === eventId);
      if (eventIndex !== -1) {
        events[eventIndex].attendees = attendances.length;
        events[eventIndex].cars = attendances.filter(a => a.canDrive === "○").length;
        localStorage.setItem(this.EVENTS_KEY, JSON.stringify(events));
      }
    } catch (error) {
      console.error("出欠保存エラー:", error);
      throw new Error("出欠情報の保存に失敗しました");
    }
  },

  async getAttendances(eventId: string): Promise<AttendanceData[]> {
    try {
      const key = this.ATTENDANCE_KEY(eventId);
      const attendancesJson = localStorage.getItem(key);
      return attendancesJson ? JSON.parse(attendancesJson) : [];
    } catch (error) {
      console.error("出欠取得エラー:", error);
      return [];
    }
  },

  async updateAttendance(
    eventId: string,
    attendanceId: string,
    updatedData: AttendanceData
  ): Promise<void> {
    try {
      const key = this.ATTENDANCE_KEY(eventId);
      const attendances = await this.getAttendances(eventId);
      const index = attendances.findIndex(a => a.id === attendanceId);
      
      if (index === -1) {
        throw new Error('出欠情報が見つかりません');
      }

      // 既存のデータを更新
      attendances[index] = {
        ...attendances[index],
        ...updatedData,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem(key, JSON.stringify(attendances));

      // イベント情報も更新
      const events = await this.getEvents();
      const eventIndex = events.findIndex(e => e.id === eventId);
      if (eventIndex !== -1) {
        events[eventIndex].attendees = attendances.length;
        events[eventIndex].cars = attendances.filter(a => a.canDrive === "○").length;
        localStorage.setItem(this.EVENTS_KEY, JSON.stringify(events));
      }
    } catch (error) {
      console.error("出欠更新エラー:", error);
      throw new Error("出欠情報の更新に失敗しました");
    }
  },

  async deleteAttendance(eventId: string, attendanceId: string): Promise<void> {
    try {
      const key = this.ATTENDANCE_KEY(eventId);
      const attendances = await this.getAttendances(eventId);
      const filteredAttendances = attendances.filter((a) => a.id !== attendanceId);
      localStorage.setItem(key, JSON.stringify(filteredAttendances));

      // イベント情報も更新
      const events = await this.getEvents();
      const eventIndex = events.findIndex(e => e.id === eventId);
      if (eventIndex !== -1) {
        events[eventIndex].attendees = filteredAttendances.length;
        events[eventIndex].cars = filteredAttendances.filter(a => a.canDrive === "○").length;
        localStorage.setItem(this.EVENTS_KEY, JSON.stringify(events));
      }
    } catch (error) {
      console.error("出欠削除エラー:", error);
      throw new Error("出欠情報の削除に失敗しました");
    }
  },

  async saveCarArrangement(eventId: string, arrangement: any): Promise<void> {
    try {
      const key = this.CAR_ARRANGEMENT_KEY(eventId);
      localStorage.setItem(
        key,
        JSON.stringify({
          arrangement,
          timestamp: new Date().toISOString(),
        }),
      );
    } catch (error) {
      console.error("配車結果保存エラー:", error);
      throw new Error("配車結果の保存に失敗しました");
    }
  },

  async getCarArrangement(eventId: string): Promise<any | null> {
    try {
      const key = this.CAR_ARRANGEMENT_KEY(eventId);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("配車結果取得エラー:", error);
      return null;
    }
  },
};