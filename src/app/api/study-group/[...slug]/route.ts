// src/app/api/study-group/[...slug]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL || "https://api.gilanghuda.my.id";

async function handler(req: NextRequest) {
  const path = req.nextUrl.pathname.replace("/api", "");
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Authentication token not found" }, { status: 401 });
  }

  try {
    // ## PERBAIKAN DI SINI ##
    // Cek apakah metode request boleh memiliki body atau tidak.
    const hasBody = req.method !== 'GET' && req.method !== 'HEAD';

    const apiResponse = await fetch(`${API_BASE_URL}${path}`, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      // Hanya teruskan body jika metodenya mengizinkan (bukan GET/HEAD)
      body: hasBody ? req.body : undefined,
      // Tambahkan opsi 'duplex: "half"' yang diwajibkan untuk meneruskan stream body
      ...(hasBody && { duplex: "half" }),
    });

    const data = await apiResponse.text();
    return new NextResponse(data, {
      status: apiResponse.status,
      headers: {
        "Content-Type": apiResponse.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown proxy error";
    return NextResponse.json({ message: "Proxy error", error: message }, { status: 500 });
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };