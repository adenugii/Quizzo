const IS_SERVER = typeof window === 'undefined';
const SERVER_URL = process.env.APP_URL || 'http://localhost:3000';
const CLIENT_PATH = ''; 
const API_BASE_URL = `${IS_SERVER ? SERVER_URL : CLIENT_PATH}/api`;

async function fetchAuthenticated(url: string, options: RequestInit = {}, token?: string) {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Cookie", `token=${token}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: token ? undefined : "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    try {
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.message || "An error occurred");
    } catch (e) {
      throw new Error(errorText || "An unknown error occurred");
    }
  }
  
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

export async function createStudyGroup(
  data: { name: string; description: string; max_member: number; is_private: boolean; },
  token?: string
) {
  return fetchAuthenticated(`${API_BASE_URL}/study-group/create`, {
    method: "POST",
    body: JSON.stringify(data),
  }, token);
}

export async function joinGroup(groupId: string, inviteCode: string, token?: string) {
  return fetchAuthenticated(
    `${API_BASE_URL}/study-group/join/${groupId}`, 
    {
      method: "POST",
      body: JSON.stringify({ invitation_code: inviteCode }),
    }, 
    token
  );
}

export async function getGroupById(groupId: string, token?: string) {
  return fetchAuthenticated(`${API_BASE_URL}/study-group/${groupId}/detail`, {
    method: "GET",
  }, token);
}

export async function getAllGroups(token?: string) {
    if (!token) return { study_groups: [] };
    return fetchAuthenticated(`${API_BASE_URL}/study-group/mines`, {
        method: "GET",
    }, token);
}

// ## FUNGSI BARU YANG DITAMBAHKAN ##
// Fungsi untuk menambahkan kuis yang sudah ada ke dalam grup.
export async function addQuizToGroup(groupId: string, quizId: string, token?: string) {
    return fetchAuthenticated(`${API_BASE_URL}/study-group/${groupId}/add-quiz`, {
        method: "POST",
        body: JSON.stringify({ quiz_id: quizId }),
    }, token);
}