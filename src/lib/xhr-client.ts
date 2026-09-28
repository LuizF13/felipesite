"use client";

function parseJson<T>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Resposta inválida do servidor.");
  }
}

export function postFormData<T>(url: string, body: FormData): Promise<T> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("POST", url);
    request.responseType = "text";

    request.onload = () => {
      const data = parseJson<T & { error?: string }>(request.responseText);

      if (request.status >= 200 && request.status < 300) {
        resolve(data);
        return;
      }

      reject(
        new Error(
          (data as { error?: string }).error ||
            `Erro ${request.status} ao comunicar com o servidor.`
        )
      );
    };

    request.onerror = () => {
      reject(new Error("Falha de rede ao comunicar com o servidor."));
    };

    request.send(body);
  });
}

export function postJson<T>(url: string, body: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("POST", url);
    request.setRequestHeader("Content-Type", "application/json");
    request.responseType = "text";

    request.onload = () => {
      const data = parseJson<T & { error?: string }>(request.responseText);

      if (request.status >= 200 && request.status < 300) {
        resolve(data);
        return;
      }

      reject(
        new Error(
          (data as { error?: string }).error ||
            `Erro ${request.status} ao comunicar com o servidor.`
        )
      );
    };

    request.onerror = () => {
      reject(new Error("Falha de rede ao comunicar com o servidor."));
    };

    request.send(JSON.stringify(body));
  });
}
