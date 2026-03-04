import api from "@/lib/http";
import type {
  StudentItem,
  CreateStudentPayload,
} from "@/app/(admin)/admin/students/helper";

export async function fetchStudents() {
  const res = await api.get("/admin/students");
  const body = res.data;

  const list =
    Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];

  return list as StudentItem[];
}

export async function createStudent(payload: CreateStudentPayload) {
  const res = await api.post("/admin/students", payload);
  return res.data;
}
