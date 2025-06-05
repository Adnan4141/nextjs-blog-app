import { NextResponse } from "next/server";

export function errorHandler(status, message = "Something went wrong") {
  console.error(`[API Error ${status}] ${message}`);

  return NextResponse.json(
    {
      success: false,
      message,
    },
    {
      status,
    }
  );
}
