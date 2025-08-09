export interface QARequest {
  documents: string;
  questions: string[];
}

export interface QAResponse {
  answers: string[];
}

export const fetchAnswers = async (request: QARequest): Promise<QAResponse> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiToken = process.env.NEXT_PUBLIC_API_TOKEN;

  if (!apiUrl || !apiToken) {
    throw new Error('API URL or Token is not configured.');
  }

  const response = await fetch(`${apiUrl}/hackrx/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiToken}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'An API error occurred.');
  }

  return response.json();
};