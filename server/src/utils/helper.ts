interface MessageData {
  id: number;
  question: string;
  answer: string;
  model: string;
  provider: string;
  created_at: number;
  updated_at: number;
}

interface ConvertedMessage {
  role: "user" | "assistant";
  content: string;
}

interface Session {
    id: string;
    title: string;
    created_at: number;
    updated_at: number;
  }
  
  function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

function convertMessages(data: MessageData[]): ConvertedMessage[] {
  const messages: ConvertedMessage[] = [];
  data.forEach((item) => {
    messages.push({
      role: "user",
      content: item.question,
    });

    messages.push({
      role: "assistant",
      content: item.answer,
    });
  });

  return messages;
}

async function generateSessionId(TOKEN: string): Promise<string> {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN,
      },
    };
  
    const response = await fetch(`https://api.mem0.ai/api/v1/conversations/`, options);
    const data: Session[] = await response.json();
  
    const existingIds = data.map(session => session.id);
  
    const idExists = (id: string): boolean => existingIds.includes(id);
  
    let sessionId: string;
  
    do {
      sessionId = generateUUID();
    } while (idExists(sessionId));
  
    return sessionId;
  }

export { convertMessages, generateSessionId };
