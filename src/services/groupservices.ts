const API_BASE_URL = process.env.API_BASE_URL || "https://api.gilanghuda.my.id";

export async function createStudyGroup(
  data: {
    name: string;
    description: string;
    max_member: number;
    is_private: boolean;
  },
  token?: string
) {
  const res = await fetch(`${API_BASE_URL}/study-group/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    cache: "no-store",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create group");
  }
  return res.json();
}

export async function getAllGroups() {
  const res = await fetch(`${API_BASE_URL}/study-groups`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) {
    return { study_groups: [] };
  }
  return res.json();
}

export async function joinGroup(
  groupId: string,
  invitation_code: string,
  token?: string
) {
  const res = await fetch(`${API_BASE_URL}/study-group/join/${groupId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    cache: "no-store",
    body: JSON.stringify({ invitation_code }),
  });
  if (!res.ok) {
    throw new Error("Failed to join group");
  }
  return res.json();
}

export async function getGroupById(groupId: string, token?: string) {
  const res = await fetch(`${API_BASE_URL}/study-group/${groupId}`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  if (!res.ok) {
    console.error("Failed to fetch group by id:", groupId, res.status, await res.text());
    return null;
  }
  return res.json();
}
