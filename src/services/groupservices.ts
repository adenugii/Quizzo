const API_BASE_URL = process.env.API_BASE_URL || "https://api.gilanghuda.my.id";

export async function createStudyGroup(
  data: { name: string; description: string; max_member: number; is_private: boolean; },
  token?: string
) {
  const res = await fetch(`${API_BASE_URL}/study-group/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal membuat grup");
  return await res.json();
}

export async function joinGroup(inviteCode: string, token?: string) {
  const res = await fetch(`${API_BASE_URL}/study-group/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ invitation_code: inviteCode }),
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal join grup");
  return await res.json();
}

export async function getGroupDetail(groupId: string, token?: string) {
  const res = await fetch(`${API_BASE_URL}/study-group/${groupId}/detail`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal mengambil detail grup");
  return await res.json();
}

export async function getMyGroup(token?: string) {
  if (!token) return { study_groups: [] };
  const res = await fetch(`${API_BASE_URL}/study-group/mines`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal mengambil grup");
  return await res.json();
}

export async function addQuizToGroup(groupId: string, quizId: string, token?: string) {
  const res = await fetch(`${API_BASE_URL}/study-group/${groupId}/add-quiz`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ quiz_id: quizId }),
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal menambahkan quiz ke grup");
  return await res.json();
}

export async function getGroupQuizzes(groupId: string, token: string) {
  const res = await fetch(`${API_BASE_URL}/study-groups/${groupId}/quizzes`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal mengambil quiz grup");
  const data = await res.json();
  return data.quizzes || [];
}

export async function assignQuizToStudyGroup(quizId: string, studyGroupId: string, token: string) {
  const res = await fetch(`${API_BASE_URL}/quiz/assign-to-study-group`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quiz_id: quizId, study_group_id: studyGroupId }),
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal menambahkan quiz ke grup");
  return await res.json();
}