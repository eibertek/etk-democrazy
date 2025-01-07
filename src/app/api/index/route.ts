import { NextResponse } from "next/server";

export const createApiMessage = (statusCode: number, message: string) => {
    return NextResponse.json({
      statusCode: statusCode,
      message: message,
    }, {
      status: statusCode,
    });
  };
  
export async function POST(request: Request) {
  try {
    const SERVER_URL = "https://magical-recently-flamingo.ngrok-free.app/";
    const serverOption = { 
        method: "POST",
        body: JSON.stringify(request.body),
      };
  
      fetch(SERVER_URL, serverOption);
  
    return createApiMessage(200, "Post indexed successfully");
  } catch (error) {
    return createApiMessage(500, JSON.stringify(error));
  }
}
