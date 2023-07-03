// Опции запроса
function options(method, urlParam, body) {
  const value = {
    method,
    body: JSON.stringify(body),
    urlParam,
    url: "http://localhost:7070/",
  };

  return value;
}

// Создание запроса
async function createRequest(requestMethod, requestUrlParam, requestBody) {
  const { method, urlParam, url, body } = options(
    requestMethod,
    requestUrlParam,
    requestBody
  );

  const newUrl = `${url}${urlParam}`;

  try {
    const response = await fetch(newUrl, {
      method,
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body,
    });

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
}

// Получение всех тикетов
export default async function getAllTickets() {
  const response = await createRequest("GET", "?method=allTickets");

  const { tickets } = response;

  return tickets;
}

// Создание тикета
export async function createTicket(body) {
  const response = await createRequest("POST", "?method=createTicket", body);
  const { created } = response;
  console.log(created);
  if (created) {
    return response;
  }
  return;
}

// Удаление тикета
export async function removeTicket(ticketID) {
  const response = await createRequest(
    "DELETE",
    `?method=removeTicket&id=${ticketID}`
  );
  const { removed } = response;

  if (removed) {
    return removed;
  }
  return;
}

// Выполнение тикета
export async function ticketComplete(ticketID) {
  const response = await createRequest(
    "PUT",
    `?method=ticketComplete&id=${ticketID}`
  );
  if (response && response.status) {
    return response.status;
  }
  return;
}

// Получение полного описания тикета
export async function ticketById(ticketID) {
  const response = await createRequest(
    "GET",
    `?method=ticketById&id=${ticketID}`
  );
  const { description } = response;
  if (description) {
    return description;
  }
  return;
}

// Редактирование тикета
export async function ticketEdit(ticketID, body) {
  const response = await createRequest(
    "PUT",
    `?method=ticketEdit&id=${ticketID}`,
    body
  );
  const { ticket } = response;
  if (ticket) {
    return ticket;
  }
  return;
}
